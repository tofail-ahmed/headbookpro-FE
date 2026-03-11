import { useState } from "react";

function TodoList() {

  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  const updateTodos = (newTodos) => {
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const handleAdd = () => {
    if (!task.trim()) return;

    const newTodo = {
      text: task,
      description: description || "No description",
      author: author || "Anonymous",
      completed: false,
      createdAt: new Date().toLocaleString(),
      lastEdited: null,
      editCount: 0,
      completedAt: null
    };

    updateTodos([newTodo, ...todos]);

    setTask("");
    setDescription("");
    setAuthor("");
  };

  const handleDelete = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    updateTodos(newTodos);
  };

  const toggleComplete = (index) => {
    const newTodos = [...todos];

    newTodos[index].completed = !newTodos[index].completed;

    newTodos[index].completedAt = newTodos[index].completed
      ? new Date().toLocaleString()
      : null;

    updateTodos(newTodos);
  };

  const handleEdit = (index) => {

    const newText = prompt("Edit task title", todos[index].text);
    const newDesc = prompt("Edit description", todos[index].description);
    const newAuthor = prompt("Edit author", todos[index].author);

    if (newText !== null && newText.trim() !== "") {

      const newTodos = [...todos];

      newTodos[index].text = newText;
      newTodos[index].description = newDesc || newTodos[index].description;
      newTodos[index].author = newAuthor || newTodos[index].author;

      newTodos[index].lastEdited = new Date().toLocaleString();
      newTodos[index].editCount = (newTodos[index].editCount || 0) + 1;

      updateTodos(newTodos);
    }
  };

  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear all tasks?")) {
      updateTodos([]);
    }
  };

  const toggleDetails = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (

    <div className="flex justify-center h-screen bg-gray-100 p-4">

      <div className="w-96 bg-white rounded shadow flex flex-col h-full">

        {/* FORM */}
        <div className="p-4 border-b sticky top-0 bg-white z-10">

          <h1 className="text-2xl font-bold text-center mb-2">
            Todo List
          </h1>

          <input
            type="text"
            placeholder="Task title"
            className="border px-2 py-1 w-full rounded mb-1"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />

          <input
            type="text"
            placeholder="Task description"
            className="border px-2 py-1 w-full rounded mb-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="text"
            placeholder="Author"
            className="border px-2 py-1 w-full rounded mb-1"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <button
            onClick={handleAdd}
            className="bg-green-500 text-white px-3 py-1 rounded w-full mt-1"
          >
            Add Task
          </button>

        </div>


        {/* STATS */}
        {todos.length > 0 && (

          <div className="px-4 py-2 text-sm text-gray-600 border-b">

            Total: {todos.length} |
            Completed: {todos.filter(t => t.completed).length}

          </div>

        )}


        {/* TASK LIST */}
        <ul className="flex-1 overflow-y-auto p-4 space-y-3">

          {todos.map((todo, index) => (

            <li key={index} className="border-b pb-2">

              <div className="flex justify-between items-center">

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
                    onClick={() => toggleDetails(index)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    {openIndex === index ? "Hide ▲" : "Details ▼"}
                  </button>

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

              </div>


              {/* DETAILS DROPDOWN */}
              {openIndex === index && (

                <div className="ml-6 mt-2 text-xs text-gray-500 flex flex-col gap-1">

                  <span>Description: {todo.description}</span>

                  <span>Author: {todo.author}</span>

                  <span>Created: {todo.createdAt}</span>

                  {todo.lastEdited && (
                    <span>Last Edited: {todo.lastEdited}</span>
                  )}

                  {todo.completed && todo.completedAt && (
                    <span>Completed: {todo.completedAt}</span>
                  )}

                  <span>Edit Count: {todo.editCount || 0}</span>

                </div>

              )}

            </li>

          ))}

        </ul>


        {/* CLEAR ALL */}
        {todos.length > 0 && (

          <button
            onClick={clearAll}
            className="w-full bg-gray-700 text-white px-3 py-1 rounded mt-2 mb-4"
          >
            Clear All
          </button>

        )}

      </div>

    </div>

  );
}

export default TodoList;