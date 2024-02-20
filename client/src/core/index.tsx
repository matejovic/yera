import { render } from "preact";
import { useState } from "preact/hooks";
import { LocationProvider, Router, Route } from "preact-iso";
import "./style.css";
import { Header } from "./header.js";
import { Footer } from "./footer.js";
import { About } from "../about.js";
import { Stack } from "../stack.js";
import { Read } from "../read/read.js";
import { Auth } from "../auth/auth.js";
import { Profile } from "../auth/profile.js";
import Logout from "../auth/logout.js";
import Blocks from "../type/blocks.tsx";
import { NotFound } from "./_404.js";
import { Time } from "../_todo/time.js";
// import {Data} from './pages/data.js';
// import {Stream} from './pages/stream.js';

import { showHelp } from "./globals.tsx";

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

if (showHelp) {
  document.documentElement.style.setProperty('--show-help-display', 'block')
}

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
          <Route path="/" component={About} />
          <Route path="/resource/:id" component={Read} />
          <Route path="/blocks" component={Blocks} />
          <Route path="/stack" component={Stack} />
          <Route path="/time" component={Time} />
          <Route path="/auth" component={Auth} profile={profile} />
          <Route path="/profile" component={Profile} profile={profile} />
          <Route path="/logout" component={Logout} />
          <Route default component={NotFound} />
        </Router>
      </main>
      <Footer />
    </LocationProvider>
  );
}

render(<App />, document.getElementById("app"));
