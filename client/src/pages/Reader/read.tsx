import { useEffect, useState } from "preact/hooks";
import "./style.css";
import ReaderConfig from "./config.tsx";
import Modal from "../../components/Modal";

const API_URL =
  import.meta.env.MODE === "development" ? "http://localhost:8000" : "/api";

export function Read(props) {
  const [resource, setResource] = useState(null);
  const [tags, setTags] = useState("");
  const [note, setNote] = useState("");
  const [showConfig, setShowConfig] = useState(false);
  const [showMeta, setShowMeta] = useState(false);

  useEffect(() => {
    loadResource(props.id);
  }, []);

  const loadResource = async (id) => {
    const response = await fetch(API_URL + `/entry/${id}`);
    const data = await response.json();
    setResource(data);
    setNote(data.annotations);
    setTags(data.tags.map((t) => t.name).join(","));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Your submit logic here...
    console.log(`Tags: ${tags}`);
    console.log(`Note: ${note}`);
    // send put request to update the resource
    const response = await fetch(API_URL + `/entry/${props.id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tags: tags.split(",").map((tag) => tag.trim()),
        note,
      }),
    });
    console.log(response.json());
  };

  const saveProgress = async () => {
    // TODO: save reading progress `window.scrollY`
  };

  function highlightSelection() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();

    const mark = document.createElement("mark");
    mark.textContent = selectedText;

    range.deleteContents();
    range.insertNode(mark);

    const rect = mark.getBoundingClientRect();
    // toolbar.style.left = `${rect.left}px`;
    // toolbar.style.top = `${rect.top - toolbar.offsetHeight}px`;
    // toolbar.style.display = 'block';
  }

  // Usage
  // document.addEventListener("mouseup", highlightSelection);

  // toggle images and links, remove ads
  // change fonts; font-size; letter and line spacing; colour themes

  // on keypress open modal window
  // TODO: needs to be scoped and removed before problems arise.
  window.addEventListener("keydown", (event) => {
    console.log(`Key pressed: ${event.key}`);
    if (event.key === "Escape") {
      setShowConfig(false);
      setShowMeta(false);
    }
    if (event.key === "a") {
      setShowConfig(!showConfig);
    }
    if (event.key === "s") {
      setShowMeta(!showMeta);
    }
  });

  return (
    <div class="home">
      {showConfig && (
        <Modal onClose={() => setShowConfig(false)}>
          <ReaderConfig
            data={{
              font_size: 12,
              font_type: "sans",
              letter_spacing: 4,
              line_height: 16,
            }}
          />
        </Modal>
      )}

      {showMeta && <Modal onClose={() => setShowMeta(false)}>Metadata</Modal>}

      <button
        className="floater"
        onClick={() => setShowConfig(true)}
        type="button"
      >
        Magic (a)
      </button>

      <button onClick={() => setShowMeta(true)} type="button">
        Meta (s)
      </button>

      <button onClick={() => alert("annotations")}>Magic(d)</button>
      {/**
				
				<button className="floater" onClick={saveProgress} type="button">
					Save Progress
				</button>
				
				
				<div class="highlighter-actions">
					<button type="button">Highlight</button>
					<button type="button">Underline</button>
					<button type="button">Strike</button>
					<button type="button">Comment</button>
				</div>
				  **/}

      {resource ? (
        <div class="reader">
          <h2>{resource.title}</h2>

          <div class="metadata"></div>

          <div dangerouslySetInnerHTML={{ __html: resource.extra }} />

          <form onSubmit={handleSubmit} style="display: contents">
            <input
              type="text"
              placeholder="add comma separated tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <textarea
              name=""
              id=""
              placeholder="Add a note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button type="button">Save</button>
          </form>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
