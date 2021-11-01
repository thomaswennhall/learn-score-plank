import React, { useEffect, useState } from 'react'
import * as R from 'ramda'
import { Link, Route } from 'wouter'
import './App.css'

import { initializeApp } from 'firebase/app'
import { ref, getDatabase, onValue, set } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyCMivH8O6bJEFNUElemBN9kvo8r1r2L74c',
  authDomain: 'score-plank-bedef.firebaseapp.com',
  databaseURL: 'https://score-plank-bedef-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'score-plank-bedef',
  storageBucket: 'score-plank-bedef.appspot.com',
  messagingSenderId: '964914269886',
  appId: '1:964914269886:web:4bab07a389e771575698ef'
}
const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

function App() {
  return (
    <div className="App">
      <Route path="/">
        <StartPage />
      </Route>
      <Route path="/score">
        <ScorePage />
      </Route>
      <Route path="/judge">
        <JudgePage />
      </Route>
    </div>
  )
}

const StartPage = () => {
  return (
    <div className="start-page">
      <Link href="/score">
        <a className="link fs8 fw4">Score view</a>
      </Link>
      <div className="fs5">Open this on your TV</div>
      <div className="h15"></div>
      <Link href="/judge">
        <a className="link fs8 fw4">Judge view</a>
      </Link>
      <div className="fs5">Let the judge open this on their smartphone</div>
    </div>
  )
}

const dbRef = ref(db)

const ScorePage = () => {
  const [data, setData] = useState()

  useEffect(() => {
    onValue(dbRef, snapshot => {
      const da = snapshot.val()
      setData(da)
    })
  }, [])

  return (
    <div className="score-page">
      {data ? (
        <>
          <div className="player-score">
            <div className="score blue">{data.player1.score}</div>
            <div className="player blue">{data.player1.name}</div>
          </div>
          <div className="player-score">
            <div className="score red">{data.player2.score}</div>
            <div className="player red">{data.player2.name}</div>
          </div>
        </>
      ) : (
        <p>loading...</p>
      )}
    </div>
  )
}

const JudgePage = () => {
  const [settingNames, setSettingNames] = useState(false)
  const [player1Name, setPlayer1Name] = useState('')
  const [player2Name, setPlayer2Name] = useState('')
  const [data, setData] = useState()

  useEffect(() => {
    onValue(dbRef, snapshot => {
      const da = snapshot.val()
      setData(da)
      setPlayer1Name(da.player1.name)
      setPlayer2Name(da.player2.name)
    })
  }, [])

  const updateScore = async (playerNum, plusOrMinus) => {
    await set(ref(db, `player${playerNum}`), {
      name: data[`player${playerNum}`].name,
      score: data[`player${playerNum}`].score + plusOrMinus
    })
  }

  const resetScore = async () => {
    await set(ref(db, 'player1'), {
      name: data.player1.name,
      score: 0
    })
    await set(ref(db, 'player2'), {
      name: data.player2.name,
      score: 0
    })
  }

  const saveNames = async () => {
    await set(ref(db, 'player1'), {
      name: player1Name,
      score: data.player1.score
    })
    await set(ref(db, 'player2'), {
      name: player2Name,
      score: data.player2.score
    })
    setSettingNames(false)
  }

  const switchSides = async () => {
    await set(ref(db, 'player2'), {
      name: player1Name,
      score: data.player1.score
    })
    await set(ref(db, 'player1'), {
      name: player2Name,
      score: data.player2.score
    })
  }

  if (settingNames) {
    return (
      <div className="judge-page">
        {data ? (
          <>
            <div className="ju-name-row ju-name-row-blue">
              <input
                className="ju-input"
                type="text"
                value={player1Name}
                onChange={e => setPlayer1Name(e.target.value)}
              />
            </div>
            <div className="ju-name-row ju-name-row-red">
              <input
                className="ju-input"
                type="text"
                value={player2Name}
                onChange={e => setPlayer2Name(e.target.value)}
              />
            </div>
            <div className="settings-row">
              <button className="ju-set" onClick={() => setSettingNames(false)}>
                Cancel
              </button>
              <button className="ju-set" onClick={saveNames}>
                Save
              </button>
            </div>
          </>
        ) : (
          <p>loading...</p>
        )}
      </div>
    )
  }

  return (
    <div className="judge-page">
      {data ? (
        <>
          <div className="ju-player-row ju-blue">
            <button className="ju-minus" onClick={() => updateScore(1, -1)}>
              -
            </button>
            <div className="ju-player">
              <div className="ju-points">{data.player1.score}</div>
              <div className="ju-name">{data.player1.name}</div>
            </div>
            <button className="ju-plus" onClick={() => updateScore(1, 1)}>
              +
            </button>
          </div>
          <div className="ju-player-row ju-red">
            <button className="ju-minus" onClick={() => updateScore(2, -1)}>
              -
            </button>
            <div className="ju-player">
              <div className="ju-points">{data.player2.score}</div>
              <div className="ju-name">{data.player2.name}</div>
            </div>
            <button className="ju-plus" onClick={() => updateScore(2, 1)}>
              +
            </button>
          </div>
          <div className="settings-row">
            <button className="ju-set" onClick={() => setSettingNames(true)}>
              Set player names
            </button>
            <button className="ju-set" onClick={resetScore}>
              Reset score
            </button>
            <button className="ju-set" onClick={switchSides}>
              Switch sides
            </button>
          </div>
        </>
      ) : (
        <p>loading...</p>
      )}
    </div>
  )
}

export default App
