import { useEffect, useState } from "preact/hooks";
import "./style.css";
	
	// constructor() {
	// 	super();
	// 	this.state = { time: Date.now() };
	// }
	
	// componentDidMount() {
	// 	// update time every second
	// 	this.timer = setInterval(() => {
	// 		this.setState({ time: Date.now() });
	// 	}, 1000);
	// }
	
	// componentWillUnmount() {
	// 	clearInterval(this.timer);
	// }

export function Advent() {
	// TODO: pseudocode to valid ts
	let t_end = 0; // TODO: Generate timestamp
	function timer(min) {
		t_end = Date.now() + min * 60000;
	}
	
	return (
		<div class="thesis advent">
			<h2>Adventure of Cycles</h2>
			<p>scheduled for Jan-March cycle</p>
			<div>
				We will help you to think about variety of timeframes and two time arrows. <br/>
				Manage better your daily tasks, track roadmap towards your milestones or achieve your life goals. 
			</div>
			<ul>
				<li>1h</li>
				<li>4h</li>
				<li>8h</li>
				<li>1d</li>
				<li>7d</li>
				<li>1m</li>
				<li>3m</li>
				<li>1y</li>
				<li>4y</li>
				<li>12y</li>
				<li>100y</li>
			</ul>
			<div class="timebox">
				<span>Timebox time</span>
				<span>1h</span>
				<button onClick={timer(60)}>Act</button>
			</div>
		</div>
	);
}

