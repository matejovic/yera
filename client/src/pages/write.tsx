import {useEffect, useState } from "preact/hooks";
import "./style.css";
import TextEditor from "../components/TextEditor.tsx";

export function Write() {
	// TODO: browser storage
	// TODO: server storage
	// TODO: crud-many
	// TODO: hide default theme buttons. 
	return (
		<div class="write">
			<div>
<p>Each thesis starts with a question. Think carefully about your research question before making a decision of working on your thesis. It will take time to develop your thinking and we recommend you to start by gathering <a href="/resources">Resources</a> and improving your <a href="/advent">Time Management</a>. </p>
				
				<h2>Active Research</h2>
				<ul>
					<li>your stored entry</li>
					<li>another one</li>
				</ul>
			</div>
			<h2>Your Research Area</h2>
			<input type="text" placeholder="research question" />
			<TextEditor />
			<button>Save</button>
		</div>
	)

}
