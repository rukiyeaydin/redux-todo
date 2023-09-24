import {React, useState, useEffect } from 'react'
import "../components/pagestyle.css"
import { useSelector, useDispatch } from 'react-redux'
import { addTodo, toggle, destroy, changeActiveFilter, getTodosAsync } from '../redux/todos/todosSlice'
import { nanoid } from '@reduxjs/toolkit'

let filtered = [];

const Page = () => {
    const items = useSelector((state) => state.todos.items);

    const [title,setTitle] = useState('');

    const dispatch = useDispatch();

    const handleSubmit = (e) =>{
        // e.preventdefault demezsek inputa bi şey girdikten sonra enter yapınca sayfa yenilenirdi. bunu istemiyoruz
        e.preventDefault();

        dispatch(addTodo({ id:nanoid(), title, completed:false }));

        setTitle('');
    };

    const handleDestroy = (id) => {
        if(window.confirm('You sure?')){
            dispatch(destroy(id));
        }
    };

    // sol altta items left kısmı için kullanıldı
    const itemsLeft = items.filter((item) => !item.completed).length;

    // active filtresi için
    const activeFilter = useSelector((state) => state.todos.activeFilter);

    filtered = items;
    if(activeFilter !== 'all'){
        filtered = items.filter((todo) => activeFilter === 'active' ? todo.completed === false : todo.completed === true,);
    }

    useEffect(() => {
        dispatch(getTodosAsync());
    }, [dispatch])

  return (
    <div>
    <section className="todoapp">
        <header className="header">
            <h1>todos</h1>
            <form onSubmit={handleSubmit}>
                <input className="new-todo" placeholder="What needs to be done?" autoFocus value={title} onChange={(e) => setTitle(e.target.value)}/>
            </form>
        </header>
        
        <section className="main">
            <input className="toggle-all" type="checkbox" />
            <label htmlFor="toggle-all">Mark all as complete</label>
            <ul className="todo-list">
                {filtered.map((item) => (
                    <li key={item.id}>
                        <div className="view">
                            <input className="toggle" type="checkbox" onChange={() => dispatch(toggle({ id: item.id }))} checked={item.completed}/>
                            <label>{item.title}</label>
                            <button className="destroy" onClick={() => handleDestroy(item.id)}></button>
                        </div>
                    </li>
                ))}
            </ul>
        </section>

        <footer className="footer">
            <span className="todo-count">{itemsLeft} item{itemsLeft > 1 && 's'} left</span>
            <ul className="filters">
                <li>
                    <a href="#/" className={activeFilter === 'all' ? 'selected' : ''} onClick={() => dispatch(changeActiveFilter('all'))}>All</a>
                </li>
                <li>
                    <a href="#/" className={activeFilter === 'active' ? 'selected' : ''} onClick={() => dispatch(changeActiveFilter('active'))}>Active</a>
                </li>
                <li>
                    <a href="#/" className={activeFilter === 'completed' ? 'selected' : ''} onClick={() => dispatch(changeActiveFilter('completed'))}>Completed</a>
                </li>
            </ul>
        </footer>
    </section>

    </div>
  )
}


export default Page
