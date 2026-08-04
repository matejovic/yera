import { useState, useEffect } from "preact/hooks";
import { useLocation } from "preact-iso";
import { api_post, api_get } from "../globals.tsx";
import TextEditor from "../components/text-editor.tsx";
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

function processEntries(
  entries: any[],
  query: string,
  selectedType: string,
  selectedTag: string,
  sortOrder: string,
) {
  if (!Array.isArray(entries)) return [];
  let result = [...entries];

  // Filter by Type
  if (selectedType !== "all") {
    result = result.filter((e) => e.type === selectedType);
  }

  // Filter by Tag
  if (selectedTag !== "all") {
    result = result.filter(
      (e) => e.tags && e.tags.some((t: any) => t.name === selectedTag),
    );
  }

  // Filter by Search Query
  if (query.trim() !== "") {
    result = result
      .map((entry) => [
        entry,
        matchTier(entry.title || "", query) * 2 +
          matchTier(entry.content || "", query) +
          matchTier(entry.url || "", query),
      ])
      .filter((match: any) => match[1] > 0)
      .map((match: any) => match[0]);
  }

  // Sort Order
  return result.sort((a: any, b: any) => {
    if (sortOrder === "newest") {
      return (
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime()
      );
    } else if (sortOrder === "oldest") {
      return (
        new Date(a.created_at || 0).getTime() -
        new Date(b.created_at || 0).getTime()
      );
    } else if (sortOrder === "title") {
      return (a.title || "").localeCompare(b.title || "");
    }
    return 0;
  });
}

export function Stack() {
  const [stack, setStack] = useState([]);
  const [filteredStack, setFilteredStack] = useState([]);
  const [addLink, setAddLink] = useState("");
  const [filter, setFilter] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showAddLink, setShowAddLink] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const location = useLocation();
  const quillRef = createRef();

  useEffect(() => {
    doSearch();
  }, [filter, stack, selectedType, selectedTag, sortOrder]);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const response = await api_get("/entries");
    const data = await response.json();
    if (Array.isArray(data)) {
      setStack(data);
    }
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

  const doSearch = () => {
    setFilteredStack(
      processEntries(stack, filter, selectedType, selectedTag, sortOrder),
    );
  };

  const availableTags: string[] = Array.from(
    new Set(
      stack.flatMap((e: any) =>
        e.tags ? e.tags.map((t: any) => t.name) : [],
      ),
    ),
  );

  return (
    <div class="page">
      <div class="block">
        <h2>Entries</h2>
        <div style={{ "margin-bottom": "20px" }}>
          <input
            type="text"
            placeholder="Search (s)"
            accessKey="s"
            value={filter}
            onInput={(e) => setFilter(e.currentTarget.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              marginBottom: "12px",
            }}
          />

          <div style={{ marginBottom: "8px" }}>
            <strong>Types: </strong>
            <button
              onClick={() => setSelectedType("all")}
              style={{
                fontWeight: selectedType === "all" ? "bold" : "normal",
                marginRight: "4px",
              }}
            >
              All
            </button>
            <button
              onClick={() => setSelectedType("resource-html")}
              style={{
                fontWeight:
                  selectedType === "resource-html" ? "bold" : "normal",
                marginRight: "4px",
              }}
            >
              Reads
            </button>
            <button
              onClick={() => setSelectedType("resource-note")}
              style={{
                fontWeight:
                  selectedType === "resource-note" ? "bold" : "normal",
                marginRight: "4px",
              }}
            >
              Notes
            </button>
            <button
              onClick={() => setSelectedType("HIGHLIGHT")}
              style={{
                fontWeight: selectedType === "HIGHLIGHT" ? "bold" : "normal",
              }}
            >
              Highlights
            </button>
          </div>

          {availableTags.length > 0 && (
            <div style={{ marginBottom: "8px" }}>
              <strong>Tags: </strong>
              <button
                onClick={() => setSelectedTag("all")}
                style={{
                  fontWeight: selectedTag === "all" ? "bold" : "normal",
                  marginRight: "4px",
                }}
              >
                All
              </button>
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  style={{
                    fontWeight: selectedTag === tag ? "bold" : "normal",
                    marginRight: "4px",
                  }}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          <div style={{ marginBottom: "8px" }}>
            <strong>Order: </strong>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.currentTarget.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>

          <button onClick={() => setShowAddLink((prev) => !prev)}>
            Add Link
          </button>{" "}
          <button onClick={() => setShowNote((prev) => !prev)}>
            Add Text
          </button>{" "}
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
          <div style={{ display: 'flex' }}>
            <input
              type="text"
              placeholder="https://"
              value={addLink}
              onInput={e => setAddLink(e.currentTarget.value)}
              onKeyDown={keyDown}
              style={{ flexGrow: 1, marginRight: '12px' }}
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
