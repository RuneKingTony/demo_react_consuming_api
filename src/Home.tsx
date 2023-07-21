import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Todo } from './Todo';

const apiUrl = 'https://jsonplaceholder.typicode.com/todos';
const itemsPerPage = 10; 
const maxItems = 200; 

const Home: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoText, setTodoText] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchTodos();
  }, [page]);

  

  const fetchTodos = async () => {
    try {
      const response = await axios.get<Todo[]>(apiUrl, {
        params: {
          _limit: itemsPerPage,
          _page: page,
        },
      });
      setTodos(response.data);
     
      const totalItems = Math.min(response.headers['x-total-count'], maxItems);
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoText) return;

    const newTodo: Todo = {
      id: todos.length + 1,
      title: todoText,
      completed: false,
    };
    try {
      const response = await axios.post<Todo>(apiUrl, newTodo);
      setTodos([...todos, response.data]);
      setTodoText('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const updateTodo = async (id: number, completed: boolean) => {
    const updatedTodo: Todo = {
      id,
      title: '',
      completed: !completed,
    };

    try {
      await axios.put<Todo>(`${apiUrl}/${id}`, updatedTodo);
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={page === i}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div>
      <h1>Todo Demo</h1>
      <form onSubmit={addTodo}>
        <input
          type="text"
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
          placeholder="Add new todo..."
          required
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => updateTodo(todo.id, todo.completed)}
            />
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
              }}
            >
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous Page
        </button>
        {renderPageNumbers()}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next Page
        </button>
      </div>
    </div>
  );
};

export default Home;
