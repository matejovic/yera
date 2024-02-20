// import { useEffect, useState } from "preact/hooks";

export function About() {
  return (
    <div class="page">
      <div class="block">
        <h2>About</h2>
        <p>
          We are an early-stage experimental software engineering project on a
          mission to increase global literacy, including various forms of
          digital media, but primarly working with a text and data.
        </p>
        <ol>
          <li>
            <a href="/block">Block</a> writer...
          </li>
          <li>
            <a href="/stack">Archive</a> and read.
          </li>
          <li>
            <a href="/track">Track</a>, measure, plan and review.
          </li>
          <li>
            <a href="/in">auth</a> tbd (recovery, token, profile)
          </li>
          <li>
            stream
          </li>
        </ol>
      </div>
    </div>
  );
}
