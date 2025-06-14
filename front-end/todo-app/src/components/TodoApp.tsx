// src/TodoApp.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTodos, addTask, toggleComplete, deleteTask, editTodo, toggleLike } from '../todo-redux/TodoSlice';
import { AppDispatch, RootState } from '../store/index';
import './TodoApp.css';

interface Todo {
  id: number;
  task: string;
  completed: boolean;
  likes: number;
  hasLiked?: boolean;
}

const TodoApp: React.FC = () => {
  const [task, setTask] = useState('');
  const [taskCount, setTaskCount] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const todos = useSelector((state: RootState) => state.todos.todos);
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    dispatch(fetchTodos());
  }, [taskCount]);

  const handleAddTask = () => {
    if (task.trim()) {
      dispatch(addTask(task));
      setTask('');
      setTaskCount(taskCount+1);
    }
  };

  const handleEdit = (id: number, task: string) => {
    setEditingId(id);
    setEditText(task);
  };

  const handleSaveEdit = (id: number) => {
    if (editText.trim()) {
      dispatch(editTodo({ id, task: editText }));
      setEditingId(null);
      setEditText('');
      dispatch(fetchTodos());
    }
  };

  const handleDeleteTodo = (id: number) => {
    dispatch(deleteTask(id));
    dispatch(fetchTodos());
  };

  const handleLike = (id: number) => {
    console.log('Handling like for todo:', id); // Debug log
    dispatch(toggleLike(id));
  };

  return (
    <div className='container'>
      <div className='max-width'>
        <div className='todolist'>
          <div className='todo-input-section'>
            <div className='todo-input-wrapper'>
              <h2 className='todo-header'>Your Todo List</h2>
              <input 
                className='search-bar' 
                type='text' 
                value={task} 
                onChange={e => setTask(e.target.value)} 
                placeholder='New task' 
              />
              <button id='add-button' className='checkout-button' onClick={handleAddTask}>Add Task</button>
            </div>
          </div>

          <div className='todo-list-section'>
            <ul id='todo-list'>
              { todos.map((todo: Todo) => (
                <li 
                  className='todo-item' 
                  key={todo.id} 
                  style={{ listStyleType: todo.completed ? 'none' : 'number' }}
                >
                  {editingId === todo.id ? (
                    <input
                      type='text'
                      className='edit-input'
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                    />
                  ) : (
                    <span className='task-text' style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                      <span className='circle blue'>
                        <i className='material-icons'>{todo.completed ? '\ue876' : '\ue836'}</i>
                      </span>
                      {todo.task}
                    </span>
                  )}
                  
                  <button className='edit-button' onClick={() => editingId === todo.id ? handleSaveEdit(todo.id) : handleEdit(todo.id, todo.task)}>
                    {editingId === todo.id ? 'Save' : 'Edit'}
                  </button>
                  <button
                    className='complete-button'
                    onClick={() => dispatch(toggleComplete({ id: todo.id, completed: todo.completed }))}>
                    {todo.completed ? 'Completed' : 'Not done'}
                  </button>
                  <button className='delete-button' onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                  <button 
                    className={`like-button ${todo.hasLiked ? 'liked' : ''}`}
                    onClick={() => handleLike(todo.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <i className='material-icons' style={{ color: todo.hasLiked ? '#e91e63' : '#666' }}>
                      {todo.hasLiked ? 'favorite' : 'favorite_border'}
                    </i>
                    <span className='like-count' style={{ color: todo.hasLiked ? '#e91e63' : '#666' }}>
                      {todo.likes || 0}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
