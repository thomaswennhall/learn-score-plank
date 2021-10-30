import React from 'react'
import * as R from 'ramda'
import {Link, Route} from "wouter"
import './App.css'


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
	return (
		<div className="score-page">
			<div className="player-score">
				<div className="score blue">12</div>
				<div className="player blue">Malin</div>
			</div>
			<div className="player-score">
				<div className="score red">5</div>
				<div className="player red">Nova</div>
			</div>
		</div>
	)
}

const JudgePage = () => {
	const [settingNames, setSettingNames] = React.useState(false)

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
					<div className="ju-set">Cancel</div>
					<div className="ju-set">Save</div>
				</div>
			</div>
		)
	}

	return (
		<div className="judge-page">
			<div className="ju-player-row ju-blue">
				<div className="ju-minus">-</div>
				<div className="ju-player">
					<div className="ju-points">12</div>
					<div className="ju-name">Malin</div>
				</div>
				<div className="ju-plus">+</div>
			</div>
			<div className="ju-player-row ju-red">
				<div className="ju-minus">-</div>
				<div className="ju-player">
					<div className="ju-points">5</div>
					<div className="ju-name">Nova</div>
				</div>
				<div className="ju-plus">+</div>
			</div>
			<div className="settings-row">
				<div className="ju-set">Set player names</div>
				<div className="ju-set">Reset score</div>
				<div className="ju-set">Switch sides</div>
			</div>
		</div>
	)
}


export default App;







