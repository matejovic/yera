import { useState, useEffect } from "preact/hooks";
import { useLocation } from "preact-iso";
import { api_post, api_get } from "./core/globals.tsx";
import TextEditor from "./core/text-editor.tsx";
import { createRef } from "preact";

const tieredFilter = [
  (s: string) => s.replace(/[^a-zA-Z0-9\s]/g, "").toLocaleLowerCase(),
  (s: string) => s.toLocaleLowerCase(),
  (s: string) => s,
]

// Returns match tier, higher is better, 0 means no match.
function matchTier(a: string, b: string) {
  for (let i = 0; i < tieredFilter.length; i++) {
    const f = tieredFilter[i];

    if (f(a).includes(f(b))) {
      return i+1;
    }
  }

  return 0;
}

function filterEntries(entries, query: string) {
  return entries.map((entry) => {
    return [entry, matchTier(entry.title, query)*2 + matchTier(entry.content, query) + matchTier(entry.url, query)];
  }).filter((match) => {
    return match[1] > 0;
  }).sort((a, b) => b[1] - a[1]).map((a) => a[0]);
}

export function Stack() {
  const [stack, setStack] = useState([]);
  const [filteredStack, setFilteredStack] = useState([]); 
  const [addLink, setAddLink] = useState("");
  const [filter, setFilter] = useState("");
  const [showAddLink, setShowAddLink] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const location = useLocation();
  const quillRef = createRef();

  useEffect(() => {
    doSearch();
  })

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    // TODO: filter by tags, type, search, etc. 
    const response = await api_get("/entries");
    const data = await response.json();
    setStack(data);
  };

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

  const doSearch = async () => {
    setFilteredStack(filterEntries(stack, filter));
  }

  return (
    <div class="page">
      <div class="block">
        <h2>Entries</h2>
        <div style={{"margin-bottom": '20px'}}>
          <input type="text" placeholder="Search (s)" 
                  accesskey="s" value={filter} 
                  onInput={e => setFilter(e.target.value)} s
                  tyle={{width: '100%', boxSizing: "border-box", marginBottom: '12px'}} />
    	  
    	  <p>Tags:</p>
    	  <p>Types: 
    	   <button>Reads</button>
    	   <button>Notes</button> 
    	  </p>
    	  <p>
    	    Order: <select>
    	     <option>Newest</option>
    	     <option>Oldest</option>
    	     <option>Timeline</option>
    	    </select>
    	  </p>
    	  <p>View:
    	   <select>
    	     <option>default</option>
    	     <option>minimal</option>
    	     <option>rich</option>
    	   </select> 
    	  </p>
    	  <button onClick={() => setShowAddLink(prev => !prev)}>Add Link</button> {" "}
          <button onClick={() => setShowNote(prev => !prev)}>Add Text</button>  {" "}
        </div>


	<div style={{marginBottom: "16px", display: showNote ? 'block' : 'none'}}>
		<TextEditor ref={quillRef} />
    <button  style={{marginTop: '12px'}}
             onClick={async () => {
      const note = {
        raw: quillRef.current.quill.getContents(),
        text: quillRef.current.quill.getText(),
        type: "resource-note"
      };

      // TODO: save as entry to the server. 
      const response = await api_post("/note", note);
      const data = await response.json();
      if (data.id) {
        location.route(`/resource/${data.id}`);
      } else {
        alert("invalid server response");
      }
      console.log(note.raw);
    }}>Save</button>
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
        {filteredStack && filteredStack.length ? (
          filteredStack.map((resource) => (
            <StackEntry
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

function StackEntry(props) {
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
