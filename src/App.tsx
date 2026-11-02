import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  // load name from local storage
  const [name, setName] = useState(() => {
    let saved = localStorage.getItem("name")
    return saved ? JSON.parse(saved) : "Default"
  })

  // save name to local storage
  useEffect(() => {
    localStorage.setItem("name", JSON.stringify(name))
    console.log("Name changed to " + name)
  }, [name])

  // text box = change saved name
  function nameChange(e: { target: { value: any; }; }) {
    setName(e.target.value)
  }

  // load timestamps
  const [times, setTimes] = useState<Map<string, string>>(() => {
    let saved = localStorage.getItem("times")
    return new Map<string, string>(Object.entries(saved ? JSON.parse(saved) : {}))
  })

  // save timestamps
  useEffect(() => {
    localStorage.setItem("times", JSON.stringify(Object.fromEntries(times)))
  }, [times])

  const [timeInput, setTimeInput] = useState("")

  function saveTime() {
    const timestamp = Date.now().toString()
    setTimes(previousTimes => new Map(previousTimes).set(timestamp, timeInput))
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p> {name} </p>
        <input type="text" onChange={nameChange}/>
        <p> Enter text to save here: </p>
        <input
          type="text"
          id="timeInput"
          value={timeInput}
          onChange={e => setTimeInput(e.target.value)}
        />
        <button type="button" onClick={saveTime}>Save time</button>
        
        <p> Saved times: </p>
          <ul>
            {Array.from(times, ([timestamp, text]) => (
              <li key={timestamp}>{timestamp}: {text}</li>
            ))}
          </ul>
          
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
