import { useState } from "preact/hooks"
import { showHelp, isDark } from "./globals.tsx"

export function Config (props: Props) {
  const [darkMode, setDarkMode] = useState(Boolean(isDark));
  const [help, setHelp] = useState(Boolean(showHelp));

  return (
      <div class="block">
        <h2>Config</h2>
	<div>

        <label>Dark Mode: </label>
        <input type="checkbox" checked={darkMode}
          onChange={(prev) => {
		const isDark = !prev;
		document.documentElement.classList.toggle("isDark"); 
		localStorage.setItem("prefersDark", isDark);		
		setDarkMode(isDark);
         }}
        />
	</div>

	<div>
        <label>Need help: </label>
        <input type="checkbox" checked={help} onClick={() => {
          setHelp((prev) => {
              const next = !prev;
              const style = document.documentElement.style;
              if (next) {
                style.setProperty('--show-help-display', 'block')
              } else {
                style.setProperty('--show-help-display', 'none')
              }
              localStorage.setItem("show-help", String(next));
              return next;
            });
        }} />
	</div>
      </div>
 );
}
