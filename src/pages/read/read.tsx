// TODO: save reading progress `window.scrollY`
import { useEffect, useState } from "preact/hooks";
import "./style.css";
import ReaderConfig from "./config.tsx";
import Modal from "../../components/modal.tsx";
import TextEditor from "../../components/text-editor.tsx";

const API_URL =
  import.meta.env.MODE === "development" ? "http://localhost:8000" : "/api";
  
  // const save = async (event) => {
  //   event.preventDefault();
  //   // Your submit logic here...
  //   console.log(`Tags: ${tags}`);
  //   console.log(`Note: ${note}`);
  //   // send put request to update the resource
  //   const response = await fetch(API_URL + `/entry/${props.id}`, {
  //     method: "PUT",
  //     credentials: "include",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       tags: tags.split(",").map((tag) => tag.trim()),
  //       note,
  //     }),
  //   });
  //   console.log(response.json());
  // };
  

export function Read(props) {
  const [resource, setResource] = useState(null);
  const [tags, setTags] = useState("");
  const [note, setNote] = useState("");
  const [annotations, setAnnotations] = useState([]);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    (async () => {
      await loadResource(props.id);
      await updateHighlights();
    })();
  }, []);

  // Save and restore reading progress (scroll position)
  useEffect(() => {
    if (!resource || !props.id) return;

    const savedScroll = localStorage.getItem(`scroll-progress-${props.id}`);
    if (savedScroll) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScroll, 10));
      }, 150);
    }

    const handleScroll = () => {
      localStorage.setItem(
        `scroll-progress-${props.id}`,
        String(window.scrollY),
      );
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [resource, props.id]);

  const loadResource = async (id) => {
    const response = await fetch(API_URL + `/entry/${id}`);
    const data = await response.json();
    setResource(data);
    setNote(data.annotations || "");
    setTags(data.tags ? data.tags.map((t) => t.name).join(",") : "");
  };

  const onMouseUp = (event) => {
    const selection = window.getSelection();

    if (selection.isCollapsed) {
      hideToolbar();
    } else {
      // span is not properly cleaned and might cause issues....
      displayToolbar(selection.getRangeAt(0).getBoundingClientRect());
    }
  };

  function displayToolbar(rect: DOMRect) {
    const toolbar = document.querySelector(".highlighter-actions");
    toolbar.style.left = `${rect.left + window.scrollX}px`; // Adjust for scroll position
    toolbar.style.top = `${rect.top + window.scrollY - Math.max(toolbar.offsetHeight, 22)}px`; // Adjust for scroll and toolbar height
    toolbar.style.display = "block";
  }

  function hideToolbar() {
    const toolbar = document.querySelector(".highlighter-actions");
    toolbar.style.display = "none";
    window.getSelection().removeAllRanges();
  }

  async function updateHighlights() {
    const entries = await fetch(API_URL + `/entries`, {
      method: "GET",
      credentials: "include",
    });

    const data = await entries.json();
    if (!Array.isArray(data)) return;

    const newHighlights = data
      .filter(
        (entry: any) =>
          entry.type === "HIGHLIGHT" &&
          (entry.url.includes(`://${props.id}/`) ||
            entry.url.startsWith(`highlight://${props.id}/`)),
      )
      .map((e: any) => ({
        id: e.id,
        text: e.extra,
        comment: e.content,
      }));

    setAnnotations(newHighlights);
  }

  async function highlight() {
    const selectedText = window.getSelection().toString().trim();
    if (!selectedText) return;

    const result = await (
      await fetch(API_URL + "/highlight", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          parent_id: parseInt(props.id),
          text: selectedText,
        }),
      })
    ).json();

    await updateHighlights();

    const el: HTMLElement = document.createElement("mark");
    el.setAttribute("data-id", result.id);
    el.onclick = () => removeAnnotation(el);

    wrap(el);
    hideToolbar();
  }

  async function addComment() {
    const selectedText = window.getSelection().toString().trim();
    if (!selectedText) return;

    const comment = prompt("Add a comment for the selected text:");
    if (comment === null) return;

    const result = await (
      await fetch(API_URL + "/highlight", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          parent_id: parseInt(props.id),
          text: selectedText,
          comment: comment,
        }),
      })
    ).json();

    await updateHighlights();

    const el: HTMLElement = document.createElement("mark");
    el.setAttribute("data-id", result.id);
    el.setAttribute("title", comment);
    el.onclick = () => removeAnnotation(el);

    wrap(el);
    hideToolbar();
  }

  function wrap(elem: JSX.Element): JSX.Element | void {
    const selection: Selection = window.getSelection();
    if (!selection.rangeCount) return;

    const selectedText: string = selection.toString();
    if (selectedText === "") return;
    elem.textContent = selectedText;

    const range: Range = selection.getRangeAt(0);

    range.deleteContents();
    range.insertNode(elem);

    return elem;
  }

  async function removeAnnotation(el) {
    const id = el.getAttribute("data-id");

    await fetch(`${API_URL}/entry/${id}/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: "{}",
    });

    await updateHighlights();

    // unwrap mark
    el.replaceWith(...el.childNodes);
  }

  async function deleteHighlightById(id: number) {
    await fetch(`${API_URL}/entry/${id}/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: "{}",
    });
    await updateHighlights();
  }

  async function deleteResource() {
    await fetch(`${API_URL}/entry/${props.id}/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: "{}",
    });

    window.location.href = "/stack";
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (event.key === "Escape") {
        setShowConfig(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div class="">
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
          Archived: {resource.created_at} (reload and compare) <br />
          Show Images: <input type="checkbox" /> <br />
          Show Links: <br />
          Remove Ads <br />
        </Modal>
      )}

      <div class="highlighter-actions">
        <button type="button" onClick={highlight}>
          Highlight
        </button>
        <button type="button" onClick={addComment}>
          Comment
        </button>
        <button onClick={hideToolbar}>Close</button>
      </div>

      {resource ? (
        <div class="page">
          <div class="block metadata">
            {annotations.length ? (
              <section>
                <h3>Highlights & Notes</h3>
                <ul style={{ paddingLeft: "16px" }}>
                  {annotations.map((a: any) => {
                    return (
                      <li key={a.id} style={{ marginBottom: "12px" }}>
                        <blockquote
                          style={{
                            margin: "0 0 4px 0",
                            paddingLeft: "8px",
                            borderLeft: "3px solid var(--accent, #f0b400)",
                            fontStyle: "italic",
                          }}
                        >
                          "{a.text}"
                        </blockquote>
                        {a.comment && (
                          <div
                            style={{
                              fontSize: "0.9rem",
                              marginBottom: "4px",
                              color: "var(--text-muted, #666)",
                            }}
                          >
                            💬 <strong>Comment:</strong> {a.comment}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteHighlightById(a.id)}
                          style={{
                            fontSize: "0.75rem",
                            padding: "2px 6px",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : (
              ""
            )}

           
             <div>
              <input
                type="text"
                placeholder="add comma separated tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <br />
              <textarea
                name=""
                id=""
                placeholder="Add a note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <br />
              <button type="button">Save</button>
            </div>
              
          </div>

          <div class="block">
            <h1>{resource.title}</h1>
            <p>Source: {resource.url}</p>
            <hr />
            <div
              class="reader"
              onMouseUp={onMouseUp}
              dangerouslySetInnerHTML={{ __html: resource.extra }}
            />
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
