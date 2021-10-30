import React from 'react'
import * as R from 'ramda'
import {Link, Route} from "wouter"
import './App.css'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"
import { ref, getDatabase, set, update } from "firebase/database"
import { useObject } from 'react-firebase-hooks/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyCzXHWVaw4G5it9MI3ewQsHXH3dHh1hIRo",
	authDomain: "score-plank.firebaseapp.com",
	databaseURL: "https://score-plank-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "score-plank",
	storageBucket: "score-plank.appspot.com",
	messagingSenderId: "930950530831",
	appId: "1:930950530831:web:0202cc0c458f2407ba207a",
	measurementId: "G-M4GR7R41BF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Get a reference to the database service
const db = getDatabase(app);

console.log(db)

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
	);
}

const StartPage = () => {
	return (
		<div className="start-page">
			<Link href="/score">
				<a  className="link fs8 fw4">Score view</a>
			</Link>
			<div className="fs5">Open this on your TV</div>
			<div className="h15"></div>
			<Link href="/judge">
				<a  className="link fs8 fw4">Judge view</a>
			</Link>
			<div className="fs5">Let the judge open this on their smartphone</div>
		</div>
	)
}

const ScorePage = () => {
	const [snapshot, loading, error] = useObject(ref(db))

	if (loading) return ('Loading...')
	console.log(snapshot.val())

	const data = snapshot.val()

	return (
		<div className="score-page">
			<div className="player-score">
				<div className="score blue">{data.player1.score}</div>
				<div className="player blue">{data.player1.name}</div>
			</div>
			<div className="player-score">
				<div className="score red">{data.player2.score}</div>
				<div className="player red">{data.player2.name}</div>
			</div>
		</div>
	)
}

const JudgePage = () => {
	const [settingNames, setSettingNames] = React.useState(false)

	const [snapshot, loading, error] = useObject(ref(db))

	if (loading) return ('Loading...')
	console.log(snapshot.val())

	const data = snapshot.val()

	const onChangeScore = async (player, diff) => {
		const playerKey = `player${player}`

		await set(ref(db, `${playerKey}/score`), data[playerKey].score + diff)
	}

	const resetScores = async () => {
		const updates = {};
		updates['/player1/score'] = 0
		updates['/player2/score'] = 0
		await update(ref(db), updates)
	}

	if (settingNames) {
		return (
			<div className="judge-page">
				<div className="ju-name-row ju-name-row-blue">
					<input className="ju-input" type="text" value="yosef" />
				</div>
				<div className="ju-name-row ju-name-row-red">
					<input className="ju-input" type="text" value="mara" />
				</div>
				<div className="settings-row">
					<div className="ju-set" onClick={() => setSettingNames(false)}>Cancel</div>
					<div className="ju-set">Save</div>
				</div>
			</div>
		)
	}

	return (
		<div className="judge-page">
			<div className="ju-player-row ju-blue">
				<div className="ju-minus" onClick={() => onChangeScore(1, -1)}>-</div>
				<div className="ju-player">
					<div className="ju-points">{data.player1.score}</div>
					<div className="ju-name">{data.player1.name}</div>
				</div>
				<div className="ju-plus" onClick={() => onChangeScore(1, 1)}>+</div>
			</div>
			<div className="ju-player-row ju-red">
				<div className="ju-minus" onClick={() => onChangeScore(2, -1)}>-</div>
				<div className="ju-player">
					<div className="ju-points">{data.player2.score}</div>
					<div className="ju-name">{data.player2.name}</div>
				</div>
				<div className="ju-plus" onClick={() => onChangeScore(2, 1)}>+</div>
			</div>
			<div className="settings-row">
				<div className="ju-set" onClick={() => setSettingNames(true)}>Set player names</div>
				<div className="ju-set" onClick={resetScores}>Reset score</div>
				<div className="ju-set">Switch sides</div>
			</div>
		</div>
	)
}


export default App;







