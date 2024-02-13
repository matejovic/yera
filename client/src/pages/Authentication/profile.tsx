import { useState } from "preact/hooks";

interface Props {
  profile: {
    id: number;
    email: string;
  };
}

const API_URL =
  import.meta.env.MODE === "development" ? "http://localhost:8000" : "/api";

export function Profile(props: Props) {
  const { id, email } = props.profile;

  // TODO: set bio on load from database
  // a: use useEffect hook
  // establish pattern for the project
  const [bio, setBio] = useState("");

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
        {id ? <h2>id: {id}</h2> : <h2>You are not logged in</h2>}
        <p>Whatever you will write in the box will be saved in the database</p>
        <textarea onInput={(e) => setBio(e.target.value)} value={bio} />
        <br />
        <button onClick={updateBio}>Save</button>
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
