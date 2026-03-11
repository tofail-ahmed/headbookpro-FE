import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        <h1 className="text-2xl font-bold mb-4">Count: {count}</h1>
        <div className="flex gap-2">
          <button onClick={() => setCount(prev => prev + 1)} className="bg-green-500 px-3 py-1 rounded text-white">+</button>
          <button onClick={() => setCount(prev => prev - 1)} className="bg-red-500 px-3 py-1 rounded text-white">-</button>
          <button onClick={() => setCount(0)} className="bg-blue-500 px-3 py-1 rounded text-white">Reset</button>
        </div>
      </div>
    </div>
  );
}

export default Counter;