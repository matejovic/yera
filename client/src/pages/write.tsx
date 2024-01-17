import {useEffect, useState } from "preact/hooks";
import "./style.css";
import TextEditor from "../components/TextEditor.tsx";

export function Write() {
	return (
		<div class="write">
			<div>
				<p>Here you can develop your research thesis. Please start with a question. It will take time to develop your thinking, that's why we put so much attention into Resources and <a href="/advent">Time Management</a>. </p>
				<ul>
					<li>your stored entry</li>
					<li>another one</li>
				</ul>
			</div>
			<h2>Your Research Area</h2>
			<TextEditor />
			<button>Save</button>
		</div>
	)

}
