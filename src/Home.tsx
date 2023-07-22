import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Todo } from './Todo';

const apiUrl = 'https://jsonplaceholder.typicode.com/todos';
const localStorageKey = 'todos';
const itemsPerPage = 5; 
const maxItems = 20; 

const Home: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoText, setTodoText] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchTodos();
  }, [page]);

  useEffect(() => {
  
    localStorage.setItem(localStorageKey, JSON.stringify(todos));
  }, [todos]);

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
          className={`px-3 py-1 mr-3 mt-2 mx-1 ${
            page === i ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
          } rounded`}
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
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-4 text-center">Todo App</h1>
        <form
          className="flex items-center"
          onSubmit={addTodo}
        >
          <input
            className="flex-grow border border-gray-300 rounded-l py-2 px-4 focus:outline-none"
            type="text"
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            placeholder="Add new todo..."
            required
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-r focus:outline-none hover:bg-blue-600"
            type="submit"
          >
            Add
          </button>
        </form>
        <ul className="mt-4">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`flex items-center justify-between py-2 border-b border-gray-300 ${
                todo.completed ? 'text-gray-400' : ''
              }`}
            >
              <div className="flex items-center">
                <input
                  className="mr-3 h-5 w-5 rounded border border-gray-400 focus:outline-none"
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => updateTodo(todo.id, todo.completed)}
                />
                <span
                  className={todo.completed ? 'line-through' : ''}
                >
                  {todo.title}
                </span>
              </div>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded focus:outline-none hover:bg-red-600"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-center flex-wrap ">
          <button
            className={`bg-blue-500 text-white px-2 py-2 rounded mr-2 ${
              page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          {renderPageNumbers()}
          <button
            className={`bg-blue-500 text-white px-4 py-2 rounded ml-2 ${
              page === totalPages
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-600'
            }`}
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;