import { useState, useEffect } from 'preact/hooks';
import './style.css';
import Modal from '../../components/Modal';



export function Homepage() {


	return (
		<div class="reader">
      <h2>Welcome to Reader [WIP]</h2>
      <br />

      <b>(tbd) Overview: </b>
      <ul>
        <li>N: registered users</li>
        <li>Z: stored bookmarks</li>
      </ul>
      
      <b>Worlflow</b>
      <ol>
        <li>Register or Login</li>
        <li>Add your links</li>
        <li>Read</li>
      </ol>
      
      <b>Roadmap</b>
      <ul>
        <li>Browser Extension</li>
        <li>Highlighter</li>
        <li>Mobile App</li>
        <li>Offline support</li>
      </ul>

		</div>
	);
}
