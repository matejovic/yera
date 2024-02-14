import { render } from "preact";
import { useState } from "preact/hooks";
import { LocationProvider, Router, Route } from "preact-iso";
import "./style.css";
import { Header } from "./components/Header.jsx";
import { Footer } from "./components/Footer.jsx";
import { Homepage } from "./pages/home.jsx";
import { Resources } from "./pages/resources.js";
import { Read } from "./pages/Reader/read.js";
import { Auth } from "./pages/Authentication/auth.js";
import { Profile } from "./pages/Authentication/profile.js";
import Logout from "./pages/Authentication/logout.js";
import Research from "./pages/research.tsx";
import { NotFound } from "./pages/_404.jsx";
import { Time } from "./pages/time.js";
// import {Data} from './pages/data.js';
// import {Stream} from './pages/stream.js';

const API_URL =
  import.meta.env.MODE === "development" ? "http://localhost:8000" : "/api";

async function isAuthenticated() {
  try {
    const response = await fetch(API_URL + "/auth/profile", {
      credentials: "include",
    });
    const profile = await response.json();
    return profile;
  } catch (error) {
    console.log("AUTH PROFILE", error);
  }
}

// todo: start with client OS/browser prefered colour scheme. #ox (onboarding experience)
const theme: string = localStorage.getItem("theme");
if (theme) document.documentElement.className = "theme-" + theme;

export function App() {
  const [profile, setProfile] = useState(null);

  if (!profile) {
    isAuthenticated().then((profile) => setProfile(profile));
  }

  return (
    <LocationProvider>
      <div class="banner">
        developed for each and every student and archivist.
      </div>
      <Header profile={profile} />
      <main>
        <Router>
          <Route path="/" component={Homepage} />
          <Route path="/time" component={Time} />
          <Route path="/resources" component={Resources} />
          <Route path="/resource/:id" component={Read} />
          <Route path="/research" component={Research} />
          <Route path="/logout" component={Logout} />
          <Route path="/auth" component={Auth} profile={profile} />
          <Route path="/profile" component={Profile} profile={profile} />
          <Route default component={NotFound} />
        </Router>
      </main>
      <Footer />
    </LocationProvider>
  );
}

render(<App />, document.getElementById("app"));
