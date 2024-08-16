import { useState } from 'react'
import './App.css'
import Alert from './Components/Alert'
function App() {
  const [count, setCount] = useState(0)
  const [alert, SetAlert] = useState(false)
  
  const handleClick = () => {
    setCount(count => count + 1)
    SetAlert(true)
  }
  return (
    <>
      <h1>Hello World!!</h1>
      { alert&&<Alert></Alert>}
      <div className="card">
        <button onClick={handleClick}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
