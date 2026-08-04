import { useState } from "preact/hooks";
import { apiUrl } from "../globals.tsx";

export function Stream() {
  const [prompt, setPrompt] = useState("");
  const [streamText, setStreamText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const startStream = async () => {
    if (isStreaming) return;
    setStreamText("");
    setIsStreaming(true);

    try {
      const response = await fetch(`${apiUrl}/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.body) {
        setStreamText("Error: ReadableStream not supported");
        setIsStreaming(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setStreamText((prev) => prev + chunk);
      }
    } catch (err: any) {
      setStreamText(`Streaming error: ${err?.message || err}`);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div class="page">
      <div class="block">
        <h2>Stream Entry & AI Synthesis</h2>
        <p>Type a topic or question to stream real-time analysis:</p>
        <textarea
          rows={3}
          placeholder="e.g. Synthesize reading list notes..."
          value={prompt}
          onInput={(e) => setPrompt(e.currentTarget.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            marginBottom: "12px",
            padding: "8px",
          }}
        />
        <br />
        <button type="button" onClick={startStream} disabled={isStreaming}>
          {isStreaming ? "Streaming..." : "Start Stream"}
        </button>

        <div style={{ marginTop: "20px" }}>
          <h3>Output Stream:</h3>
          <div
            style={{
              padding: "12px",
              background: "var(--bg-secondary, #f5f5f5)",
              borderRadius: "6px",
              whiteSpace: "pre-wrap",
              minHeight: "100px",
              border: "1px solid var(--border, #ccc)",
              fontFamily: "monospace",
            }}
          >
            {streamText ||
              (isStreaming
                ? "Waiting for first chunk..."
                : "Stream output will appear here...")}
          </div>
        </div>
      </div>
    </div>
  );
}
