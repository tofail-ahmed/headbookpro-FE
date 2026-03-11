import { useState, useEffect } from "react";

function TodoList() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  // Load todos from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("todos")) || [];
    setTodos(saved);
  }, []);

  // Save todos to localStorage whenever changed
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAdd = () => {
    if (!task.trim()) return;

    setTodos([...todos, { text: task, completed: false }]);
    setTask("");
  };

  const handleDelete = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  const toggleComplete = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  const handleEdit = (index) => {
    const newTask = prompt("Edit your task", todos[index].text);
    if (newTask !== null && newTask.trim() !== "") {
      const newTodos = [...todos];
      newTodos[index].text = newTask;
      setTodos(newTodos);
    }
  };

  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear all tasks?")) {
      setTodos([]);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96 p-4 bg-gray-50 rounded shadow">

        <h1 className="text-2xl font-bold text-center mb-4">Todo List</h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter task..."
            className="border px-2 py-1 w-full rounded"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button
            onClick={handleAdd}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Add
          </button>
        </div>

        {todos.length > 0 && (
          <div className="mb-2 text-sm text-gray-600">
            Total: {todos.length} | Completed: {todos.filter(t => t.completed).length}
          </div>
        )}

        <ul>
          {todos.map((todo, index) => (
            <li
              key={index}
              className="flex justify-between items-center border-b py-2"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(index)}
                />
                <span className={todo.completed ? "line-through text-gray-400" : ""}>
                  {todo.text}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="bg-yellow-400 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {todos.length > 0 && (
          <button
            onClick={clearAll}
            className="mt-4 w-full bg-gray-700 text-white px-3 py-1 rounded"
          >
            Clear All
          </button>
        )}

      </div>
    </div>
  );
}

export default TodoList;