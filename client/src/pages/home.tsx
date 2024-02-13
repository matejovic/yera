import { useEffect, useState } from "preact/hooks";

export function Homepage() {
  const [theme, setTheme] = useState("");
  const [showHelp, setShowHelp] = useState(true);

  const ls = localStorage.getItem("theme");
  setTheme(ls ? ls : "bright");

  // const _sh = localStorage.getItem('show-help');
  // if (_sh) { setShowHelp(_sh === ''); }

  function setColourScheme(theme: string): void {
    document.documentElement.className = "theme-" + theme; // root element
    localStorage.setItem("theme", theme);
  }

  function toggleShowHelp() {
    // localStorage.setItem("show-help", String(showHelp));
    setShowHelp((prev) => {
      const show = !prev;
      if (show) {
        // .help show
      } else {
        // .help hide
      }
      return show;
    });
  }

  return (
    <div class="page">
      <div class="block">
	the simplest login ever...	
      </div>
      <div class="block">
        <h2>About</h2>
        <p>
	  We are an early-stage experimental software engineering project on a mission to increase global literacy, including various forms of digital media, but primarly working with a text and data. 
        </p>
        <ol>
          <li>
            <a href="/research">Thesis</a> writer...
          </li>
          <li>
            Gather html <a href="/resources">resources</a> and read.
          </li>
          <li>
            Engage with <a href="/time">time</a> - measure and track.
          </li>
          <li>
            <a href="/in">auth</a> tbd (recovery, token, profile)
          </li>
        </ol>
      </div>

      <div class="block">
        <h2>Config</h2>
        <p class="help">
          Following settings will be stored in your browser memory and persist
          across reloads.
        </p>
        <label>Color Scheme: </label>
        <select
          value={theme}
          onChange={(e) => setColourScheme(e.currentTarget.value)}
        >
          <option value="">None</option>
          <option value="orange">Light</option>
          <option value="dark">Dark</option>
          <option value="purple">Purple</option>
        </select>
        {/* <br />
        <label>Show Help: </label>
        <input type="checkbox" checked={showHelp} onClick={toggleShowHelp} /> */}
      </div>
    </div>
  );
}
