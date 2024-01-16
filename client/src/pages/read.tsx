import { useEffect, useState } from "preact/hooks";
import "./style.css";

const API_URL =
	import.meta.env.MODE === "development" ? "http://localhost:8000" : "/api";

export function Read(props) {
	const [resource, setResource] = useState(null);
	const [tags, setTags] = useState("");
	const [note, setNote] = useState("");

	useEffect(() => {
		loadResource(props.id);
	}, []);

	const loadResource = async (id) => {
		const response = await fetch(API_URL + `/entry/${id}`);
		const data = await response.json();
		setResource(data);
		setNote(data.annotations);
		setTags(data.tags.map((t) => t.name).join(","));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		// Your submit logic here...
		console.log(`Tags: ${tags}`);
		console.log(`Note: ${note}`);
		// send put request to update the resource
		const response = await fetch(API_URL + `/entry/${props.id}`, {
			method: "PUT",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				tags: tags.split(",").map((tag) => tag.trim()),
				note,
			}),
		});
		console.log(response.json());
	};

	const saveProgress = async () => {
		alert(window.scrollY);
	};

	function highlightSelection() {
		const selection = window.getSelection();
		if (!selection.rangeCount) return;

		const range = selection.getRangeAt(0);
		const selectedText = selection.toString();

		const mark = document.createElement("mark");
		mark.textContent = selectedText;

		range.deleteContents();
		range.insertNode(mark);

		const rect = mark.getBoundingClientRect();
		// toolbar.style.left = `${rect.left}px`;
		// toolbar.style.top = `${rect.top - toolbar.offsetHeight}px`;
		// toolbar.style.display = 'block';
	}

	// Usage
	document.addEventListener("mouseup", highlightSelection);

	return (
		<div class="home">
			<button className="floater" onClick={saveProgress} type="button">
				Save Progress
			</button>

			<div class="highlighter-actions">
				<button type="button">Highlight</button>
				<button type="button">Underline</button>
				<button type="button">Strike</button>
				<button type="button">Comment</button>
			</div>

			{resource? (
				<div class="reader">
					<form onSubmit={handleSubmit} style="display: contents">
						<input
							type="text"
							placeholder="add comma separated tags"
							value={tags}
							onChange={(e) => setTags(e.target.value)}
						/>
						<textarea
							name=""
							id=""
							placeholder="Add a note"
							value={note}
							onChange={(e) => setNote(e.target.value)}
						/>
						<button type="button">Save</button>
					</form>

					<h2>{resource.title}</h2>
					<div
						dangerouslySetInnerHTML={{ __html: resource.extra }}
					/>
				</div>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
}
