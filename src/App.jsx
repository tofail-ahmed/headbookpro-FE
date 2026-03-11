// import { useState } from "react";
import "./App.css";
import Counter from "./Counter"; // Counter component
import TodoList from "./Todo"; // Todo list component
import Home from "./Home";
import { Link, Routes, Route } from "react-router-dom";

function App() {
  // const [count, setCount] = useState(0);

  // const handleIncrease = () => setCount(prev => prev + 1);
  // const handleDecrease = () => setCount(prev => prev - 1);
  // const handleReset = () => setCount(0);

  return (
    <div>
      {/* Navigation */}
      <nav className="flex gap-4 p-4 bg-gray-100">
        <Link to="/home" className="text-blue-500 font-medium">
          Home
        </Link>
        <Link to="/counter" className="text-blue-500 font-medium">
          Counter
        </Link>
        <Link to="/todo" className="text-blue-500 font-medium">
          Todo List
        </Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home/>} />

        <Route path="/home" element={<Home />} />
        <Route path="/counter" element={<Counter />} />
        <Route path="/todo" element={<TodoList />} />
      </Routes>
    </div>
  );
}

export default App;
