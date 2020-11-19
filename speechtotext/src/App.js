import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'fr-FR'

function App() {
  const [isListening, setIsListening] = useState(false)
  const [note, setNote] = useState(null)
  const [saveNotes, setSaveNotes] = useState([])

  useEffect(() => {
    handleListen()
  }, [isListening])

  const handleListen = () => {
    if (isListening) {
      mic.start()
      mic.onend = () => {
        console.log('continue..')
        mic.start()
      }
    } else {
      mic.stop()
      mic.onend = () => {
        console.log('Stopped Mic on Click')
      }
    }
    mic.onstart = () => {
      console.log('Mics on')
    }
    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      console.log(transcript)
      setNote(transcript)
      mic.onerror = event => {
        console.log(event.error)
      }
    }
  }

  const handleSaveNote = () => {
    setSaveNotes([...saveNotes, note])
    setNote('')
  } 

  return (
    <>
      <div className="flex-container">
        <div className="box">
          <h6>Enregistez votre voix ici</h6>
          {isListening ? <span>🎙️</span> : <span>🛑🎙️</span>}
          <div className="buttonOk">
          <button className="save" onClick={handleSaveNote} disabled={!note}>Save Note</button>
          <button className="startStop" onClick={() => setIsListening(prevstate => !prevstate)}>Start/Stop</button>
          </div>
          <p>{note}</p>
        </div>
        <div className="boxNote">
          <h4>Notes</h4>
          {saveNotes.map(n => (
            <p key={n}>{n}</p>
          ))}

        </div>
      </div>
    </>
  );
}

export default App;