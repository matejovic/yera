// TODO: save reading progress `window.scrollY`
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
  const [annotations, setAnnotations] = useState([]);
  // const [showMeta, setShowMeta] = useState(false);

  useEffect(() => {
    loadResource(props.id);
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
        // .addEventListener("select", () => {
        //   alert('select')
        // })
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

  // const handleSubmit = async (event) => {
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



  function removeAnnotation(el) {
    const id = el.getAttribute("data-id");
    setAnnotations(annotations.filter((_, i) => i.id !== id));

    // unwrap mark
    el.replaceWith(...el.childNodes);
  }

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

  function highlight() {
    const selectedText = window.getSelection().toString();

    if (annotations.includes(selectedText)) {
      return;
    }

    let data = {
      id: annotations.length ? annotations[annotations.length - 1].id + 1 : 1,
      text: selectedText,
      // tags: ['red', 'memorize'],
      // time: new Date()
    };

    // maybe just write your own storage function which will handle server & browser sync with app state
    // localStorage.setItem("resource-1-annotations", _list); // tbd ...
    // http.fetch // tbd ...
    setAnnotations((_prev) => {
      const _list = [..._prev, data]; // consider efficiency...
      return _list;
    });

    const el: HTMLElement = document.createElement("mark");
    el.setAttribute("data-id", data.id);
    // task: reopen toolbar with more actions instead...
    el.onclick = () => removeAnnotation(el);

    hideToolbar();
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
        {/**
			<button type="button">Underline</button>
			<button type="button">Strike</button>
			<button type="button">Comment</button>
		**/}

        <button onClick={hideToolbar}>Close</button>
      </div>

      {resource ? (
        <div class="page">
          <div class="block metadata">
            <p>
              <button onClick={() => setShowConfig(true)} type="button">
                config
              </button>
            </p>

            {annotations.length ? (
              <section>
                <h3>Highlights</h3>
                <ul>
                  {annotations.map((a) => {
                    return <li key={a.id}>{a.text} </li>;
                  })}
                </ul>
              </section>
            ) : (
              ""
            )}

            {/**
             <form onSubmit={handleSubmit} style="display: contents">
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
            </form>
             **/}
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
