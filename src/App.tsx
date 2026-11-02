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

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p> {name} </p>
        <input type="text" onChange={nameChange}/>
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
