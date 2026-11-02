import { ChangeEvent, useEffect, useRef, useState } from 'react';
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

  // use sets to handle duplicate timestamps
  const [timeSet, setTimeSet] = useState<Set<string>>(() => {
    let saved = localStorage.getItem("timeSet")
    return new Set<string>(saved ? JSON.parse(saved) : [])
  })

  useEffect(() => {
    localStorage.setItem("timeSet", JSON.stringify(Array.from(timeSet)))
  }, [timeSet])

  const [timeInput, setTimeInput] = useState("")
  const importFileRef = useRef<HTMLInputElement>(null)

  function saveTime() {
    const timestamp = Date.now().toString()
    saveTimeWithValue(timestamp, timeInput)
    // clear time input after saving
    setTimeInput("")
  }

  function fixedTimes() {
    const timeValues = new Map<string, string>([
      ["123456", "Meeting notes"],
      ["789012", "Project deadline"]
    ])
    
    timeValues.forEach((value, timestamp) => {
      saveTimeWithValue(timestamp, value)
    })
  }

  function saveTimeWithValue(timestamp: string, value: string) {
    // only save if the timestamp is not already in the set
    if (!timeSet.has(timestamp))
    {
      // create a temp map to sort the entries by timestamp
      const tempTimes = new Map(times).set(timestamp, value)
      const sortedArr = Array.from(tempTimes.entries()).sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      // update the state with the sorted map
      setTimes(new Map(sortedArr))
      // add the timestamp to the set
      setTimeSet(previousSet => previousSet.add(timestamp))
    }
  }

  function exportTimes() {
    const jsonData = JSON.stringify(Object.fromEntries(times), null, 2)
    const fileUrl = URL.createObjectURL(new Blob([jsonData], { type: 'application/json' }))
    const downloadLink = document.createElement('a')
    downloadLink.href = fileUrl
    downloadLink.download = 'times.json'
    downloadLink.click()
    URL.revokeObjectURL(fileUrl)
  }

  function importTimes() {
    importFileRef.current?.click()
  }

  // for testing
  function clearLocalStorage() {
    localStorage.clear()
    setTimes(new Map())
    setTimeSet(new Set())
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const importedData = JSON.parse(await file.text()) as Record<string, string>
      const sortedTimes = Object.entries(importedData).sort(([first], [second]) => Number(first) - Number(second))
      const importedTimes = new Map(sortedTimes)
      setTimes(importedTimes)
      setTimeSet(new Set(importedTimes.keys()))
    } catch (error) {
      console.error('Error importing times', error)
    }

    event.target.value = ''
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
        <button type="button" onClick={fixedTimes}>Save fixed times</button>
        
        <button type="button" onClick={exportTimes}>Export times</button>
        <button type="button" onClick={importTimes}>Import times</button>
        <input
          ref={importFileRef}
          type="file"
          accept="application/json,.json"
          onChange={handleImport}
          hidden
        />
        <button type="button" onClick={clearLocalStorage}>Clear local storage</button>
        
        <p> Saved times: </p>
        <ul className="timestamp-list">
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
