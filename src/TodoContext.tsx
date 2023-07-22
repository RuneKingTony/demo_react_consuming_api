import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Todo } from './components/Todo';

const apiUrl = 'https://jsonplaceholder.typicode.com/todos'
const itemsPerPage = 5;
const maxItems = 20;

interface TodoContextData {
  todos: Todo[];
  addTodo: (title: string) => void;
  updateTodo: (id: number, completed: boolean) => void;
  deleteTodo: (id: number) => void;
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const TodoContext = createContext<TodoContextData>({} as TodoContextData);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetchTodos();
  }, [currentPage]);

  
  const fetchTodos = async () => {
    try {
      const response = await axios.get<Todo[]>(apiUrl, {
        params: {
          _limit: itemsPerPage,
          _page: currentPage,
        },
      });
      setTodos(response.data);

      const totalItems = Math.min(response.headers['x-total-count'], maxItems);
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (title: string) => {
    if (!title) return;

    const newTodo: Todo = {
      id: todos.length + 1,
      title,
      completed: false,
    };
    try {
      const response = await axios.post<Todo>(apiUrl, newTodo);
      setTodos([...todos, response.data]);
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

  return (
    <TodoContext.Provider
      value={{
        todos,
        addTodo,
        updateTodo,
        deleteTodo,
        totalPages,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export function useTodoContext() {
  return useContext(TodoContext);
}
