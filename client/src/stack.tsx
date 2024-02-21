import { useState, useEffect } from "preact/hooks";
import { useLocation } from "preact-iso";
import { api_post, api_get } from "./core/globals";
import TextEditor from "./core/text-editor.tsx";
import { createRef } from "preact";

export function Stack() {
  const [stack, setStack] = useState([]);
  const [addLink, setAddLink] = useState("");
  const [showAddLink, setShowAddLink] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [showFinder, setShowFinder] = useState(false);
  const location = useLocation();
  const note = createRef();

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
	  <button onClick={() => setShowFinder(prev => !prev)}>Search (s)</button> {" "}
	  <button onClick={() => setShowAddLink(prev => !prev)}>Add Link (k)</button> {" "}
          <button onClick={() => setShowNote(prev => !prev)}>Add Note (w)</button>  {" "}
        </div>
        {/* TODO: add following filters */}
        <div style={{display: showFinder ? 'block' : 'none'}} class="nested-block">
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

	<div style={{marginBottom: "16px", display: showNote ? 'block' : 'none'}}>
		<TextEditor ref={note} />
	</div>

        <div 
          style={{marginBottom: "16px", display: showAddLink ? 'block' : "none"}}
        >
        <p class="help">
          Paste any publicly available URL containing text and press Enter.{" "}
        </p>
	<div style={{display: 'flex'}}>
	  <input
            type="text"
            placeholder="https://"
            value={addLink}
            onChange={e => setAddLink(e.target.value)}
            onKeyDown={keyDown}
	    style={{flexGrow: 1, marginRight: '12px'}}
            
          />
          <button onClick={() => addEntry(addLink)}>
            Enter
          </button>
	</div>
        
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
        {props.title}
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
