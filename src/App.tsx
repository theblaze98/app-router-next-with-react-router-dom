import { useState } from 'react'
import Routes from './Routes'

const App = () => {
  const [counter, setCounter] = useState(0)

  return (
    <div>
      <h1>Counter: {counter}</h1>
      <button onClick={() => setCounter((prev) => prev + 1)}>Increment</button>

      <Routes />
    </div>
  )
}

export default App
