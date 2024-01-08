import {useEffect, useState } from "preact/hooks";
import "./style.css";
import TextEditor from "../components/TextEditor.tsx";

export function Write() {
	return (
		<div class="write">
			<h2>Your Research Area</h2>
			<TextEditor />
		</div>
	)

}
