import { useState, useEffect } from "preact/hooks";

const API_URL =
  import.meta.env.MODE === "development" ? "http://localhost:8000" : "/api";

export function Stack() {
  const [resources, setResources] = useState([]);
  const [addLink, setAddLink] = useState("");

  const handleEnter = async (url: string) => {
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
  };

  const handleKeyDown = async (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleEnter(event.target.value);
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
        <h2>Archive</h2>
        <p class="help">
          Paste any publicly available URL containing text and press Enter.{" "}
        </p>
        <div 
          style={{marginBottom: "16px"}}
        >
          <input
            type="text"
            class="lib-item-new"
            placeholder="https://"
            value={addLink}
            onChange={e => setAddLink(e.target.value)}
            onKeyDown={handleKeyDown}
            
          />
          <button class="lib-item-new" onClick={() => handleEnter(addLink)}>
            Enter
          </button>
        </div>
        {resources && resources.length ? (
          resources.map((resource) => (
            <ResourceLink
              title={resource.title}
              type={resource.type}
              url={resource.url}
              parent={resource.parent_id}
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
        {" "}
        Type:{" "}
        <i>
          {props.type}
        </i>
        {" "}
        Parent:{" "}
        <i>
          {props.parent ?? "None"}
        </i>
      </div>
      <div>
        {/* <img src="https://picsum.photos/200/120?grayscale" /> */}
        <div>{props.tags && props.tags.map((tag) => <span>#{tag}</span>)}</div>
      </div>
    </div>
  );
}
