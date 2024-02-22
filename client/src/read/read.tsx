// TODO: save reading progress `window.scrollY`
import { useEffect, useState } from "preact/hooks";
import "./style.css";
import ReaderConfig from "./config.tsx";
import Modal from "../core/modal.tsx";
import TextEditor from "../core/text-editor.tsx";

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

  const loadResource = async (id) => {
    const response = await fetch(API_URL + `/entry/${id}`);
    const data = await response.json();
    setResource(data);
    setNote(data.annotations);
    setTags(data.tags.map((t) => t.name).join(","));

    setTimeout(() => {
      document
        .querySelector(".reader")
        .addEventListener("mouseup", onMouseUp);
    }, 500); // heh...
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

    const newHighlights = data.filter((entry) => entry.type == "HIGHLIGHT" && entry.parent_id == parseInt(props.id)).map(e => ({id: e.id, text: e.extra}));

    // maybe just write your own storage function which will handle server & browser sync with app state
    // http.fetch // tbd ...
    setAnnotations((_prev) => {
      const _list = newHighlights; // consider efficiency...
      return _list;
    });
  }

  async function highlight() {
    const selectedText = window.getSelection().toString();

    if (annotations.includes(selectedText)) {
      return;
    }

    const result = await (await fetch(API_URL+"/highlight", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        parent_id: parseInt(props.id),
        text: selectedText,
      }),
    })).json();


    await updateHighlights();

    const el: HTMLElement = document.createElement("mark");
    el.setAttribute("data-id", result.id);
    // task: reopen toolbar with more actions instead...
    el.onclick = () => removeAnnotation(el);
    
    // UI side effects
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
    // consider validation... (if empty wraps)

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
      body: "{}"
    });


    await updateHighlights();

    // unwrap mark
    el.replaceWith(...el.childNodes);
  }

  async function deleteResource() {
    await fetch(`${API_URL}/entry/${props.id}/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: "{}"
    });

    window.location.href = "/stack";
  }

  // on keypress open modal window
  // TODO: needs to be scoped and removed before problems arise.
  window.addEventListener("keydown", (event) => {
    console.log(`Key pressed: ${event.key}`);
    if (event.key === "Escape") {
      setShowConfig(false);
      // setShowMeta(false);
    }
    if (event.key === "a") {
      setShowConfig(!showConfig);
    }
    if (event.key === "s") {
      // setShowMeta(!showMeta);
    }
  });

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
		<button type="button" onClick={() => alert('implement me pls')}>Comment</button>
        <button onClick={hideToolbar}>Close</button>
      </div>

      {resource ? (
        <div class="page">
          <div class="block metadata">
            <p>
            {/* <button onClick={() => setShowConfig(true)} type="button">
                config
              </button> */} 
             {/** <button onClick={() => deleteResource()} type="button">
                delete
              </button> **/}
              </p> 

            {annotations.length ? (
              <section>
                <h3>Highlights</h3>
                <ul>
                  {annotations.map((a) => {
                    return <li key={a.id}>{a.text} <button><a href={`/resource/${a.id}`}>Go to entry</a></button></li>;
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
