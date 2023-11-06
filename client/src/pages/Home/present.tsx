import { useState, useEffect } from 'preact/hooks';
import './style.css';
import Modal from '../../components/Modal';



export function Homepage() {


	return (
		<div class="page">
      <h2>Read the web.</h2>
      <p>We help you to remember and forget. </p>
      <br />

      <b>Current priorities:</b>
      <ul>
        <li>separate production db - 1h</li>
        <li>Add minimal registration - 2h</li>
        <li>Fix login with real credentials - 2h</li>
        <li>refactoring - 3h</li>
        <li>4h Extension authentication</li>
        <li>2h Extension single tab</li>
        <li>2h Extension bulk save and close (session)</li>
        <li>4h Simple tags support</li>
        <li>4h Reader: store reading progress</li>
        <li>8h Processor view: keep/forget/schedule</li>
      </ul>

      <b>Overview: </b>
      <ul>
        <li>N: registered users</li>
        <li>Z: stored bookmarks</li>
      </ul>

      <b>Workflow</b>
      <ul>
        <li>Store open tabs</li>
        <li>Process and organize them</li>
        <li>Schedule and read</li>
      </ul>
		</div>
	);
}
