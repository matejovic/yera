import { useEffect, useState } from "preact/hooks";


export function Time() {
  // TODO: pseudocode to valid ts
  let t_end = 0; // TODO: Generate timestamp
  function timer(min) {
    t_end = Date.now() + min * 60000;
  }

  return (
    <div class="page">
      <div class="block">
      <h2>Time</h2>
        <ul>
          <li>minutes and hours (5min 15min 30min 45min 1h 90min 2h 4h 8h 12h)</li>
          <li>days (1, 2, 3, 4, 5, 6, 7)</li>
          <li>weeks (1, 2, 3, 4, 52)</li>
          <li>months (1, 2, 3, 12)</li>
          <li>years (1, ..., 100)</li>
        </ul>
      </div>
      <div class="block">
        <span>Timebox</span> <br/>
        <textarea /><br/>
        <button onClick={timer(60)}>Start</button>
      </div>
    </div>
  );
}
