import { useEffect, useState } from "preact/hooks";
import { showHelp } from "../../globals";
interface Props {
  profile: {
    id: number;
  };
}

const API_URL =
  import.meta.env.MODE === "development" ? "http://localhost:8000" : "/api";

export function Profile(props: Props) {
  const [id, setId] = useState(0);

  const [theme, setTheme] = useState("");
  const [email, setEmail] = useState("");
  const [_showHelp, setShowHelp] = useState(Boolean(showHelp));

  // const [bio, setBio] = useState("");

  const ls = localStorage.getItem("theme");
  setTheme(ls ? ls : "light");

  switch (localStorage.getItem("theme")) {
    case "light": 
      break;
    case "dark": 
      break;
    default:
      const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
      if (darkThemeMq.matches) {
        setColourScheme("dark")
      } else {
        setColourScheme("light")
      }
      break;
  }


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

  useEffect(() => {
    fetch(API_URL + "/auth/profile", {
      credentials: "include",
    }).then((response) => response.json())
    .then((data) => { setId(data.id); setEmail(data.email) })
    .catch((error) => console.log(error));
  })

  return (
    <div class="page">
      <div class="block">
          <h2>Metabox</h2>
          <p>id: {id}</p>
          <p>email: {email}</p>

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
          <option value="light">Light</option>
          <option value="dark">Dark</option>
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
