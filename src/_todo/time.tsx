import { useEffect, useState, useRef } from "preact/hooks";
import TextEditor from "../core/text-editor.tsx";
import { createRef } from "preact";

export function Time() {
  const [view, setView] = useState(null); // period and period note?
  const [input, reInput] = useState(null); // string
  const [tick, setTick] = useState(null); // int of sec left rendered
  const [showNotes, toggleShowNotes] = useState(false);

  let editor = createRef();
  let intervalRef = useRef();

  function timeToSeconds(time: string): number {
    const timeUnits = {
      s: 1,
      m: 60,
      h: 3600,
    };
    // Regular expression with capturing group for optional space before unit
    const regex = /(\d+)(?:\s+)?([hms])/gi;
    let seconds = 0;

    for (const match of time.matchAll(regex)) {
      const num = parseInt(match[1]);
      const unit = match[2].toLowerCase();
      seconds += num * timeUnits[unit];
    }
    return seconds;
  }

  function secondsToTime(seconds: int): string {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours} h ${mins} min ${secs} sec`;
  }

  // helper tbd
  function timeDifferene(timestamp1, timestamp2) {
    const diff = Math.abs(timestamp1 - timestamp2) / 1000; // Convert milliseconds to seconds
    return convertSecondsToHumanReadable(diff);
  }

  function startTimer(seconds: number) {
    setTick(seconds);
    intervalRef.current = setInterval(() => {
      setTick((prev) => {
        if (prev <= 0) {
          stopTimer();
          document.title = "AT"; // revert
          return 0;
        }
        document.title = (prev - 1).toString();
        return prev - 1;
      });
    }, 1000);
  }

  function stopTimer() {
    clearInterval(intervalRef.current);
    setTick(0); // this won't happen in pause-resume
  }

  return (
    <div class="page" id="AdventApp">
     <div class="block" >
        <h2>Advent</h2>
        <div class="Metabox">
          <p>Today is {new Date().toString()}</p>
          <div class="select">
            <select onChange={(e) => setView(e.currentTarget.value)}>
              <option value="mins">Mins</option>
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
              <option value="help">None</option>
            </select>
          </div>  
        </div>

      {view === "mins" && (
        <div class="advent-view">
          <br /> <br />
          <h2>Mins</h2>
          {tick > 0 ? (
            <div>
              <span>{secondsToTime(tick)}</span>
              <button onClick={stopTimer}>Stop</button>
            </div>
          ) : (
            <div>
              <input
                placeholder="e.g. 1h 30 min..."
                value={input}
                onInput={(e) => reInput(e.target.value)}
              />
              <button onClick={() => startTimer(timeToSeconds(input))}>
                Start
              </button>
              <br />
            </div>
          )}
          <br />
          <span>Notes</span>{" "}
          <input
            type="checkbox"
            checked={showNotes}
            onChange={() => toggleShowNotes(!showNotes)}
          />{" "}
          <br />
          {showNotes && <TextEditor ref={editor} />}
        </div>
      )}
      {view === "day" && (
        <div class="advent-view">
          <b>Day 16. February</b>
          <TextEditor ref={editor} /> save
        </div>
      )}
      {view === "week" && (
        <div class="advent-view">
          <b>Week 7</b> save
          <TextEditor ref={editor} />
        </div>
      )}
      {view === "month" && (
        <div class="advent-view">
          <b>February</b>
          <TextEditor ref={editor} /> save
        </div>
      )}
      {view === "year" && (
        <div class="advent-view">
          <b>24</b>
          <TextEditor ref={editor} /> save and autosave
        </div>
      )}
      </div>
      <div class="block" style={{"display": "none"}}>
        <h2>log</h2>
      </div>
 
    </div>
  );
}
