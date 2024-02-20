// import { useEffect, useState } from "preact/hooks";

export function Homepage() {
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
            <a href="/research">Thesis</a> writer...
          </li>
          <li>
            Gather html <a href="/resources">resources</a> and read.
          </li>
          <li>
            Engage with <a href="/time">time</a> - measure and track.
          </li>
          <li>
            <a href="/in">auth</a> tbd (recovery, token, profile)
          </li>
        </ol>
      </div>
    </div>
  );
}
