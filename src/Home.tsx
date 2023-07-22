import React from 'react';

import { useTodoContext } from './TodoContext';

const Home: React.FC = () => {
  const { todos, addTodo, updateTodo, deleteTodo, totalPages, currentPage, setCurrentPage } = useTodoContext();
  const [todoText, setTodoText] = React.useState<string>('');

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    addTodo(todoText);
    setTodoText('');
  };

  const handleUpdateTodo = (id: number, completed: boolean) => {
    updateTodo(id, completed);
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodo(id);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`px-3 py-1 mr-3 mt-2 mx-1 ${
            currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
          } rounded`}
          onClick={() => handlePageChange(i)}
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
        <form className="flex items-center" onSubmit={handleAddTodo}>
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
                  onChange={() => handleUpdateTodo(todo.id, todo.completed)}
                />
                <span className={todo.completed ? 'line-through' : ''}>
                  {todo.title}
                </span>
              </div>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded focus:outline-none hover:bg-red-600"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-center flex-wrap ">
          <button
            className={`bg-blue-500 text-white px-2 py-2 rounded mr-2 ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {renderPageNumbers()}
          <button
            className={`bg-blue-500 text-white px-4 py-2 rounded ml-2 ${
              currentPage === totalPages
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-600'
            }`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
