import { useState, useEffect } from "preact/hooks";
import "./style.css";
import Modal from "../components/Modal";
const API_URL =
  import.meta.env.MODE === "development" ? "http://localhost:8000" : "/api";

export function Resources() {
  const [resources, setResources] = useState([]);

  const handleKeyDown = async (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      const url = event.target.value;
      const response = await fetch(API_URL + "/entry", {
        method: "POST",
        credentials: "include", // consider no credentials local storage.
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, type: "resource-html" }),
      });
      const data = await response.json();
      if (data.id) {
        window.location = `/resource/${data.id}`;
      } else {
        alert("invalid server response");
      }
    }
  };

  useEffect(() => {
    const fetchResources = async () => {
      // TODO: filter by type for resources only
      const response = await fetch(API_URL + "/entries", {
        credentials: "include",
      });
      const data = await response.json();
      setResources(data);
      console.log("resources were set", data);
    };
    fetchResources();
  }, []);

  const handleClick = async (id) => {
    // navigate to url
    window.location = `/resource/${id}`;
  };

  return (
    <div class="page">
      <div class="block">
        <h2>Resources</h2>
        <p class="help">
          You are allowed to store up to 100mb right now. All your data can be
          exported at anytime. Expand your data storage with out affordable
          plans and tester options.{" "}
        </p>
        <p class="help">
          You can paste any publicly available URL containing text you want to
          read or remember into the input field below and press Enter. We will
          extract the text and store it in html and markdown formats. You can
          read it distraction-free in our reader app.{" "}
        </p>
        <div>
          <input
            type="text"
            class="lib-item-new"
            placeholder="https://"
            onKeyDown={handleKeyDown}
          />
          <button class="lib-item-new" onClick={() => alert("press enter...")}>
            Enter
          </button>
          <br />
          <br />
        </div>
        {resources && resources.length ? (
          resources.map((resource) => (
            <ResourceLink
              title={resource.title}
              url={resource.url}
              createdAt={resource.created_at}
              tags={resource.tags ? resource.tags.map((t) => t.name) : []}
              clickAction={() => handleClick(resource.id)}
            />
          ))
        ) : (
          <div>
            Add your first resource by pasting a public URL address above and
            press Enter.
          </div>
        )}
      </div>
    </div>
  );
}

function ResourceLink(props) {
  return (
    <div
      href={props.href}
      target="_blank"
      class="lib-item"
      onClick={props.clickAction}
    >
      <div>
        <b>{props.title}</b>
      </div>
      <div class="small">
        Added: <i>{props.createdAt}</i>
      </div>
      <div class="small">
        Source:{" "}
        <i>
          <a target="_blank" href={props.url}>
            {props.url}
          </a>
        </i>
      </div>
      <div>
        {/* <img src="https://picsum.photos/200/120?grayscale" /> */}
        <div>{props.tags && props.tags.map((tag) => <span>#{tag}</span>)}</div>
      </div>
    </div>
  );
}
