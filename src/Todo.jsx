import { useState, useEffect } from "react";

export default function TodoList() {

  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [priority, setPriority] = useState("Low");

  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [darkMode, setDarkMode] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  const updateTodos = (newTodos) => {
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const addTask = () => {
    if (!task.trim()) return;

    const newTask = {
      text: task,
      description,
      author,
      priority,
      completed: false,
      createdAt: new Date().toLocaleString(),
      lastEdited: null,
      editCount: 0,
      completedAt: null,
    };

    updateTodos([newTask, ...todos]);

    setTask(""); setDescription(""); setAuthor(""); setPriority("Low");
  };

  const deleteTask = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    updateTodos(newTodos);
  };

  const toggleComplete = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    newTodos[index].completedAt = newTodos[index].completed ? new Date().toLocaleString() : null;
    updateTodos(newTodos);
  };

  const handleEdit = (index) => {
    const newTitle = prompt("Edit task title", todos[index].text);
    if (newTitle === null) return;
    const newDescription = prompt("Edit description", todos[index].description);
    const newAuthor = prompt("Edit author", todos[index].author);
    const newPriority = prompt("Edit priority (High / Medium / Low)", todos[index].priority);

    const newTodos = [...todos];
    newTodos[index].text = newTitle;
    newTodos[index].description = newDescription;
    newTodos[index].author = newAuthor;
    newTodos[index].priority = newPriority;
    newTodos[index].lastEdited = new Date().toLocaleString();
    newTodos[index].editCount += 1;

    updateTodos(newTodos);
  };

  const clearAll = () => updateTodos([]);

  const handleDragStart = (index) => setDragIndex(index);
  const handleDrop = (index) => {
    const newTodos = [...todos];
    const dragged = newTodos.splice(dragIndex, 1)[0];
    newTodos.splice(index, 0, dragged);
    updateTodos(newTodos);
  };

  const filteredTodos = todos
    .filter((todo) => todo.text.toLowerCase().includes(search.toLowerCase()))
    .filter((todo) => filter === "completed" ? todo.completed : filter === "pending" ? !todo.completed : true)
    .filter((todo) => priorityFilter === "all" ? true : todo.priority === priorityFilter);

  return (
    <div className={darkMode ? "bg-gray-900 text-white min-h-screen text-sm" : "bg-white text-black min-h-screen text-sm"}>
      <div className="max-w-3xl mx-auto p-3">

        {/* DARK MODE */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mb-2 bg-purple-500 text-white px-2 py-1 rounded text-xs"
        >
          🌓 Toggle Dark
        </button>

        {/* FORM */}
        <div className="sticky top-0 bg-gray-200/50 border-1 rounded-xs dark:bg-gray-900 p-3 shadow z-10 text-xs">

          <h2 className="text-xl font-bold mb-2">📝 Todo List</h2>

          <input
            value={task} onChange={(e) => setTask(e.target.value)}
            placeholder="Task title"
            className="border p-1 w-full mb-1 text-xs"
          />

          <input
            value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="border p-1 w-full mb-1 text-xs"
          />

          <input
            value={author} onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author"
            className="border p-1 w-full mb-1 text-xs"
          />

          <select
            value={priority} onChange={(e) => setPriority(e.target.value)}
            className="border p-1 w-full mb-1 text-xs"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-2 py-1 rounded w-full mb-2 text-xs flex items-center justify-center gap-1"
          >
            ➕ Add Task
          </button>

          {/* SEARCH + CLEAR */}
          <div className="flex justify-between items-center mt-2 gap-2">
            <input
              placeholder="🔍 Search task..."
              className="border p-1 flex-1 text-xs"
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={clearAll}
              className="bg-red-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
            >
              🗑 Clear All
            </button>
          </div>

          {/* FILTERS */}
          <div className="flex justify-between mt-2 flex-wrap gap-2">

            {/* STATUS */}
            <div className="flex gap-1 flex-wrap">
              <button onClick={() => setFilter("all")} className="bg-gray-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">📋 All</button>
              <button onClick={() => setFilter("completed")} className="bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">✅ Completed</button>
              <button onClick={() => setFilter("pending")} className="bg-yellow-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">⏳ Pending</button>
            </div>

            {/* PRIORITY */}
            <div className="flex gap-1 flex-wrap">
              <button onClick={() => setPriorityFilter("all")} className="bg-gray-400 px-2 py-1 rounded text-xs flex items-center gap-1">🎯 All Priority</button>
              <button onClick={() => setPriorityFilter("High")} className="bg-red-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">🔥 High</button>
              <button onClick={() => setPriorityFilter("Medium")} className="bg-yellow-500 px-2 py-1 rounded text-xs flex items-center gap-1">⚡ Medium</button>
              <button onClick={() => setPriorityFilter("Low")} className="bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">💚 Low</button>
            </div>

          </div>

        </div>

        {/* TASK LIST */}
        <ul className="mt-3">

          {filteredTodos.map((todo, index) => (

            <li
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(index)}
              className="border p-2 mb-1 rounded shadow text-xs"
            >

              <div className="flex justify-between items-center">

                <span
                  className={
                    todo.completed
                      ? "line-through text-gray-400"
                      : todo.priority === "High"
                      ? "text-red-500 font-bold"
                      : todo.priority === "Medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }
                >
                  {todo.text}
                </span>

                <div className="flex gap-1">

  {/* COMPLETE */}
  <button
    onClick={() => toggleComplete(index)}
    className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors
      ${todo.completed ? 'bg-green-300 text-green-900 hover:bg-green-400' : 'bg-green-500 text-white hover:bg-green-600'}`}
  >
    ✔ {todo.completed ? 'Completed' : 'Complete'}
  </button>

  {/* EDIT */}
  <button
    onClick={() => handleEdit(index)}
    className="px-2 py-1 bg-yellow-400 text-yellow-900 rounded text-xs flex items-center gap-1 hover:bg-yellow-500 transition-colors"
  >
    ✏ Edit
  </button>

  {/* DELETE */}
  <button
    onClick={() => deleteTask(index)}
    className="px-2 py-1 bg-red-500 text-white rounded text-xs flex items-center gap-1 hover:bg-red-600 transition-colors"
  >
    🗑 Delete
  </button>

  {/* DETAILS */}
  <button
    onClick={() => setExpanded(expanded === index ? null : index)}
    className="px-2 py-1 bg-gray-400 text-gray-900 rounded text-xs flex items-center gap-1 hover:bg-gray-500 transition-colors"
  >
    ⬇ Details
  </button>

</div>

              </div>

              {expanded === index && (
                <div className="mt-1 text-xs">
                  <p><b>Description:</b> {todo.description}</p>
                  <p><b>Author:</b> {todo.author}</p>
                  <p><b>Priority:</b> {todo.priority}</p>
                  <p><b>Created:</b> {todo.createdAt}</p>
                  {todo.lastEdited && <p><b>Last Edited:</b> {todo.lastEdited}</p>}
                  <p><b>Edit Count:</b> {todo.editCount}</p>
                  {todo.completedAt && <p><b>Completed At:</b> {todo.completedAt}</p>}
                </div>
              )}

            </li>

          ))}

        </ul>

      </div>
    </div>
  );
}