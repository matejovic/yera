import { render } from "preact";
import { useState } from "preact/hooks";
import { LocationProvider, Router, Route } from "preact-iso";
import "./style/main.css";
import { Header } from "./components/header.js";
import { Footer } from "./components/footer.js";
import { NotFound } from "./_404.js";
import { Yera } from "./yera.js";

export function App() {
  return (
    <LocationProvider>
      <Header/>
      <main>
        <Router>
          <Route path="/" component={Yera}/>
          <Route default component={NotFound} />
        </Router>
      </main>
      <Footer />
    </LocationProvider>
  );
}

render(<App />, document.getElementById("app"));
