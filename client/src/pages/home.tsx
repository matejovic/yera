import { useEffect, useState } from "preact/hooks";

export function Homepage() {
  const [theme, setTheme] = useState("");
  setTheme(localStorage.getItem('theme'));

  function setColourScheme(theme: string) : void {
    document.documentElement.className = 'theme-' + theme; 
    localStorage.setItem('theme', theme);
  }

  return (
    <div class="page">
      <div class="block">
      <h2 class="centered">Your Evolving Research Atlas</h2>
        <ol>
          <li>Develop <a href="/thesis">Thesis</a></li>
 	      <li>Gather and Process <a href="/resources">Resources</a></li>
          <li>Play with <a href="/time">Time</a></li>
          <li><a href="/in">auth</a> (recovery, token, profile)</li>
        </ol>
      </div>

      <div class="block">
	<h2 class="centered">Config</h2>

	<label>Color Scheme: </label>
	<select value={ theme  } onChange={e => setColourScheme(e.currentTarget.value)}>
		<option value="bright-orange">Bright Orange</option>
		<option value="bright-purple">Bright Purple</option>
		<option value="dark">Dark</option>
	</select>
      </div>

    </div>
  );
}