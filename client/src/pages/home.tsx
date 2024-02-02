import { useEffect, useState } from "preact/hooks";
import "./style.css";

export function Homepage() {
  return (
    <div class="page a">
      <div class="block">
        <h2 class="centered">Young Educated Research Assistant</h2>
        <ol>
          <li>Develop <a href="/thesis">Thesis</a></li>
 	      <li>Gather and Process <a href="/resources">Resources</a></li>
          <li>Play with <a href="/advent">Time</a></li>
          <li><a href="/in">auth</a> (recovery, token, profile)</li>
        </ol>
      </div>
    </div>
  );
}
