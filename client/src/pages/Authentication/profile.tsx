import { useState } from "preact/hooks";
import { showHelp } from "../../globals";
interface Props {
  profile: {
    id: number;
  };
}

const API_URL =
  import.meta.env.MODE === "development" ? "http://localhost:8000" : "/api";

export function Profile(props: Props) {
  const { id } = props.profile ? props.profile : {};

  const [theme, setTheme] = useState("");
  const [_showHelp, setShowHelp] = useState(Boolean(showHelp));

  // const [bio, setBio] = useState("");

  const ls = localStorage.getItem("theme");
  setTheme(ls ? ls : "bright");

  function setColourScheme(theme: string): void {
    document.documentElement.className = "theme-" + theme; // root element
    localStorage.setItem("theme", theme);
  }



  // update bio at /auth/profile based on the textarea
  // use the id to identify the user
  async function updateBio() {
    const response = await fetch(API_URL + "/auth/profile", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bio: bio }),
    });
  }

  return (
    <div class="page">
      <div class="block">
          <h2>Metabox</h2>
          <p>id: {id}</p>
          <p>username: unknown</p>
          <p>email: unknown</p>

        {/*<p>Whatever you will write in the box will be saved in the database</p>*/}
        {/*<textarea onInput={(e) => setBio(e.target.value)} value={bio} />*/}
        {/*<br />*/}
        {/*<button onClick={updateBio}>Save</button>*/}
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
        <br />
        <label>Show Help: </label>
        <input type="checkbox" checked={_showHelp} onClick={() => {
          setShowHelp((prev) => {
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
