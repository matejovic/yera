import { render } from "preact";
import { useState } from "preact/hooks";
import { LocationProvider, Router, Route } from "preact-iso";
import "./style/main.css";
import { Header } from "./components/header.js";
import { Footer } from "./components/footer.js";
import { NotFound } from "./_404.js";
import { Yera } from "./yera.js";
import { Stack } from "./_todo/stack.tsx";
import { Time } from "./_todo/time.tsx";
import { Stream } from "./_todo/stream.tsx";
import { Data } from "./_todo/data.tsx";
import { Auth } from "./_todo/authentication/auth.tsx";
import Logout from "./_todo/authentication/logout.tsx";
import { Profile } from "./_todo/authentication/profile.tsx";
import { Read } from "./_todo/read/read.tsx";

export function App() {
  return (
    <LocationProvider>
      <Header/>
      <main>
        <Router>
          <Route path="/" component={Yera}/>
          <Route path="/stack" component={Stack}/>
          <Route path="/time" component={Time}/>
          <Route path="/stream" component={Stream}/>
          <Route path="/data" component={Data}/>
          <Route path="/auth" component={Auth}/>
          <Route path="/logout" component={Logout}/>
          <Route path="/profile" component={Profile}/>
          <Route path="/resource/:id" component={Read}/>
          <Route default component={NotFound} />
        </Router>
      </main>
      <Footer />
    </LocationProvider>
  );
}

render(<App />, document.getElementById("app"));
