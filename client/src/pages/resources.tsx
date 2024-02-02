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
    <div class="page resources">
      <h2 class="centered">Resources</h2>
      <div class="block add ">
        <input type="text" placeholder="https://" onKeyDown={handleKeyDown} />
      </div>
      <div class="block overview">
        {resources && resources.length ? (
          resources.map((resource) => (
            <ContentRow
              title={resource.title}
              url={resource.url}
              createdAt={resource.created_at}
              tags={resource.tags ? resource.tags.map((t) => t.name) : []}
              clickAction={() => handleClick(resource.id)}
            />
          ))
        ) : (
          <div>
            Add your first resource by pasting a public URL address above and press Enter.
          </div>
        )}
      </div>
    </div>
  );
}

function ContentRow(props) {
  return (
    <a
      href={props.href}
      target="_blank"
      class="read-item"
      onClick={props.clickAction}
    >
      <div className="read-item__left">
        <h3>{props.title}</h3>
        <span>{props.url}</span>
        <div className="small mt16"><span>Added: {props.createdAt}</span> </div>
      </div>
      <div className="read-item__right">
        <img src="https://picsum.photos/200/120?grayscale" />
        <div className="tags">
          {props.tags && props.tags.map((tag) => <span>#{tag}</span>)}
        </div>

      </div>
    </a>
  );
}
