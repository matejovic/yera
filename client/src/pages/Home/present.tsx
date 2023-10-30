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
        <li>Add minimal registration</li>
        <li>Fix login with real credentials</li>
        <li>Extension authentication</li>
        <li>Extension single tab</li>
        <li>Extension bulk save and close (session)</li>
        <li>Reader: store reading progress</li>
        <li>Processor view: keep/forget/schedule</li>
        <li>Simple tags support</li>
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
