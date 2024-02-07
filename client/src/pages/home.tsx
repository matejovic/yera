import { useEffect, useState } from "preact/hooks";
import "./style.css";

export function Homepage() {

  // todo: type in-out
  // todo: start with client OS/browser prefered colour scheme. 
  // todo: keep config in browser memory as well.
  function setColourScheme(theme) {
    document.documentElement.className = 'theme-' + theme; 
  }

  return (
    <div class="page a">
      <div class="block">
        <h2 class="centered">Young Educated Research Assistant</h2>
        <ol>
          <li>Develop <a href="/thesis">Thesis</a></li>
 	      <li>Gather and Process <a href="/resources">Resources</a></li>
          <li>Play with <a href="/advent">Time</a></li>
          <li><a href="/in">auth</a> (recovery, token, profile)</li>
        </ol>
      </div>

      <div class="block">
	<h2 class="centered">Config</h2>

	<label>Color Scheme: </label>
	<select onChange={e => setColourScheme(e.currentTarget.value)}>
		<option value="bright-orange">Bright Orange</option>
		<option value="bright-purple">Bright Purple</option>
		<option value="dark">Dark</option>
	</select>
      </div>

    </div>
  );
}
