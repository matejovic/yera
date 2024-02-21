import { useState, useEffect } from "preact/hooks";
import { useLocation } from "preact-iso";
import { api_post, api_get } from "./core/globals";


export function Stack() {
  const [stack, setStack] = useState([]);
  const [addLink, setAddLink] = useState("");
  const [showAddLink, setShowAddLink] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const loadEntries = async () => {
      // TODO: filter by tags, type, search, etc. 
      const response = await api_get("/entries");
      const data = await response.json();
      setStack(data);
    };
    loadEntries();
  }, []);

  const keyDown = async (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      addEntry(addLink);
    }
  };

  const addEntry = async (url: string) => {
    const response = await api_post("/entry", { url, type: "resource-html" });
    const data = await response.json();
    if (data.id) {
      location.route(`/resource/${data.id}`);
    } else {
      alert("invalid server response");
    }
  };

  const redirect = async (id) => {
    location.route(`/resource/${id}`);
  };

  return (
    <div class="page">
      <div class="block">
        <h2>Stack</h2>
        <div style={{"margin-bottom": '20px'}}>
          <a href="/blocks">Add Note (w)</a> | <button onClick={() => setShowAddLink(prev => !prev)}>Add Link (k)</button> 
        </div>
        {/* TODO: add following filters */}
        <div style={{display: 'none'}}>
          <div>
            Tags: #dev #science #travel 
          </div>
          <div>
            Type: html, md; tbd: pdf, video, audio, image
          </div>
          <div>
            Order: Newest, Oldest, Random, Custom
          </div>
          <div>
            Search: fulltext, tags, type, source...
          </div>

        </div>

        <div 
          style={{marginBottom: "16px", display: showAddLink ? 'block' : "none"}}
        >
        <p class="help">
          Paste any publicly available URL containing text and press Enter.{" "}
        </p>
          <input
            type="text"
            class="lib-item-new"
            placeholder="https://"
            value={addLink}
            onChange={e => setAddLink(e.target.value)}
            onKeyDown={keyDown}
            
          />
          <button class="lib-item-new" onClick={() => addEntry(addLink)}>
            Enter
          </button>
        </div>
        {stack && stack.length ? (
          stack.map((resource) => (
            <ResourceLink
              title={resource.title}
              type={resource.type}
              url={resource.url}
              parent={resource.parent_id}
              createdAt={resource.created_at}
              tags={resource.tags ? resource.tags.map((t) => t.name) : []}
              clickAction={() => redirect(resource.id)}
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
