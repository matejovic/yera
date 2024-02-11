import { useEffect, useState } from "preact/hooks";

export function Homepage() {
  const [theme, setTheme] = useState("");
  setTheme(localStorage.getItem('theme') ? localStorage.getItem('theme') : 'bright-orange');

  function setColourScheme(theme: string) : void {
    document.documentElement.className = 'theme-' + theme; // root element
    localStorage.setItem('theme', theme);
  }

  return (
    <div class="page">
      <div class="block">
      <h2>About</h2>
        <p>YERA stands for Your Evolving Research Atlas and it's a recovery investment project by Matej Vrzala to support global literacy. So far we are focused on the development of following tools:</p>
        <ol>
          <li><a href="/research">Thesis</a> writer...</li>
 	      <li>Gather html <a href="/resources">resources</a>  and read.</li>
          <li>Engage with <a href="/time">time</a> - measure and track.</li>
          <li><a href="/in">auth</a> tbd (recovery, token, profile)</li>
        </ol>
      </div>

      <div class="block">
	<h2>Config</h2>

	<label>Color Scheme: </label>
	<select value={ theme  } onChange={e => setColourScheme(e.currentTarget.value)}>
		<option value="bright-orange">Bright Orange</option>
		<option value="bright-purple">Bright Purple</option>
		<option value="dark">Dark</option>
	</select>
  <br/>
  <label>Show Help: </label>
  <input type="checkbox" />
      </div>

    </div>
  );
}