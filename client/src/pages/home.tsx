import { useEffect, useState } from "preact/hooks";
import "./style.css";

export function Homepage() {
  return (
    <div class="page a">
      <div class="block">
        <h2 class="centered">Young Educated Research Assistant</h2>
        <p>
          Jan as an{" "}
          <a
            href="https://docs.google.com/document/d/1NRkgrdSc7QpXe8jdnAh3ECr4-aBgmSVmHPECsp6C3yk/edit?usp=sharing"
            target="_blank"
          >
            Adventure
          </a>
          .{" "}
        </p>
        <ol>
          <label>features (need to improve the visuals)</label>
          <li>Develop Thesis</li>
          <li>Gather and Process Resources</li>
          <li>Advent Experiment</li>
          <li>auth (recovery, token, profile)</li>
        </ol>
      </div>
    </div>
  );
}
