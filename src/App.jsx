import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const handleIncrease=()=>{
    setCount(count+1)
  }
  const handleDecrease=()=>{
    setCount(count-1)
  }
  const handleReset=()=>{
    setCount(0)
  }

  return (
    <div flex justify-center items-center>
      <div className=' '>
      <h1  className= ' text-center text-amber-700'>Current value: <span className='font-extrabold '>{count}</span></h1>
      <div className='text-center flex justify-center items-center gap-6'>
        <button className='text-md font-medium  bg-green-500 text-blue-200 px-2 border-2 border-blue-500 rounded-md' onClick={handleIncrease}>Increase</button>
        <button className='text-md font-medium bg-red-500 text-blue-200 px-2 border-2 border-blue-500 rounded-md' onClick={handleDecrease}>Decrease</button>
        <button className='text-md font-medium bg-blue-500 text-blue-200 px-2 border-2 border-blue-500 rounded-md' onClick={handleReset}>Reset</button>
      </div>
    </div>
    </div>
  )
}

export default App
