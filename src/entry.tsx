import { render } from "preact";
import { useState } from "preact/hooks";
import { LocationProvider, Router, Route } from "preact-iso";
import "./style/main.css";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { NotFound } from "./_404";
import { Yera } from "./yera";
import { Stack } from "./pages/stack.tsx";
import { Time } from "./pages/time.tsx";
import { Stream } from "./pages/stream.tsx";
import { Data } from "./pages/data.tsx";
import { Auth } from "./pages/authentication/auth.tsx";
import Logout from "./pages/authentication/logout.tsx";
import { Profile } from "./pages/authentication/profile.tsx";
import { Read } from "./pages/read/read.tsx";

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
