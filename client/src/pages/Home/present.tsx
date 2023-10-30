import { useState, useEffect } from 'preact/hooks';
import './style.css';
import Modal from '../../components/Modal';



export function Homepage() {


	return (
		<div class="page">
      <h2>Read the web.</h2>
      <p>We help you to remember and forget. </p>

      <b>Currently working on: </b>
      <ul>
        <li>Private bookmarks</li>
        <li>proof: 2 users see only their bookmarks</li>
      </ul>
		</div>
	);
}
