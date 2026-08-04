import { useEffect, useState, useRef } from "preact/hooks";
import TextEditor from "../components/text-editor.tsx";
import { createRef } from "preact";

export function Time() {
  const [view, setView] = useState("mins");
  const [input, reInput] = useState("");
  const [tick, setTick] = useState<number>(0);
  const [showNotes, toggleShowNotes] = useState(false);

  const editor = createRef();
  const intervalRef = useRef<any>(null);

  function timeToSeconds(time: string): number {
    const timeUnits: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
    };
    const regex = /(\d+)(?:\s+)?([hms])/gi;
    let seconds = 0;

    for (const match of time.matchAll(regex)) {
      const num = parseInt(match[1], 10);
      const unit = match[2].toLowerCase();
      seconds += num * timeUnits[unit];
    }

    if (seconds === 0 && !isNaN(Number(time)) && Number(time) > 0) {
      // Fallback: plain numbers treated as minutes
      seconds = Number(time) * 60;
    }

    return seconds;
  }

  function secondsToTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (mins > 0 || hours > 0) parts.push(`${mins}m`);
    parts.push(`${secs}s`);
    return parts.join(" ");
  }

  const triggerNotification = () => {
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification("⏰ Yera Timer Finished!", {
        body: "Your countdown timer has completed.",
      });
    }
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTick(0);
    localStorage.removeItem("yera-timer-target");
    document.title = "Yera";
  };

  const startTimer = (seconds: number) => {
    if (seconds <= 0) return;

    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const targetTime = Date.now() + seconds * 1000;
    localStorage.setItem("yera-timer-target", String(targetTime));
    setTick(seconds);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((targetTime - Date.now()) / 1000));
      setTick(remaining);

      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        localStorage.removeItem("yera-timer-target");
        document.title = "⏰ Time's Up! - Yera";
        triggerNotification();
      } else {
        document.title = `⏱️ ${secondsToTime(remaining)} - Yera`;
      }
    }, 1000);
  };

  // Restore active timer on mount
  useEffect(() => {
    const savedTarget = localStorage.getItem("yera-timer-target");
    if (savedTarget) {
      const targetTime = Number(savedTarget);
      const remaining = Math.max(0, Math.ceil((targetTime - Date.now()) / 1000));

      if (remaining > 0) {
        setTick(remaining);
        intervalRef.current = setInterval(() => {
          const rem = Math.max(0, Math.ceil((targetTime - Date.now()) / 1000));
          setTick(rem);

          if (rem <= 0) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            localStorage.removeItem("yera-timer-target");
            document.title = "⏰ Time's Up! - Yera";
            triggerNotification();
          } else {
            document.title = `⏱️ ${secondsToTime(rem)} - Yera`;
          }
        }, 1000);
      } else {
        localStorage.removeItem("yera-timer-target");
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div class="page" id="AdventApp">
      <div class="block">
        <h2>Advent & Timer</h2>
        <div class="Metabox">
          <p>Today is {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <div class="select">
            <select value={view} onChange={(e) => setView(e.currentTarget.value)}>
              <option value="mins">Timer (Mins)</option>
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>
        </div>

        {view === "mins" && (
          <div class="advent-view">
            <br />
            <h3>Countdown Timer</h3>
            {tick > 0 ? (
              <div style={{ marginTop: "12px" }}>
                <span style={{ fontSize: "2rem", fontWeight: "bold", marginRight: "12px" }}>
                  {secondsToTime(tick)}
                </span>
                <button type="button" onClick={stopTimer}>
                  Stop Timer
                </button>
              </div>
            ) : (
              <div style={{ marginTop: "12px" }}>
                <input
                  placeholder="e.g. 25m, 1h 30m, 45s..."
                  value={input}
                  onInput={(e) => reInput(e.currentTarget.value)}
                  style={{ marginRight: "8px", padding: "6px" }}
                />
                <button
                  type="button"
                  onClick={() => startTimer(timeToSeconds(input))}
                >
                  Start Timer
                </button>
              </div>
            )}
            <br />
            <label style={{ cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={showNotes}
                onChange={() => toggleShowNotes(!showNotes)}
              />{" "}
              <span>Show Timer Notes</span>
            </label>
            <br />
            {showNotes && (
              <div style={{ marginTop: "12px" }}>
                <TextEditor ref={editor} />
              </div>
            )}
          </div>
        )}
        {view === "day" && (
          <div class="advent-view">
            <h3>Daily Journal & Planning</h3>
            <TextEditor ref={editor} />
          </div>
        )}
        {view === "week" && (
          <div class="advent-view">
            <h3>Weekly Focus</h3>
            <TextEditor ref={editor} />
          </div>
        )}
        {view === "month" && (
          <div class="advent-view">
            <h3>Monthly Goals</h3>
            <TextEditor ref={editor} />
          </div>
        )}
        {view === "year" && (
          <div class="advent-view">
            <h3>Yearly Roadmap</h3>
            <TextEditor ref={editor} />
          </div>
        )}
      </div>
    </div>
  );
}
