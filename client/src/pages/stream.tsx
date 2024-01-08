import { useEffect, useState } from "preact/hooks";
import "./style.css";

export function Stream() {
	return (
		<div class="reader stream">
			<h2>Stream Entry</h2>
			<br />
			<textarea /> <br />
			<button>Submit</button>

			<div class="stream-response">
				.... streaming response is to be implemented. <a href="https://elysiajs.com/plugins/stream">ElysiaJS docs</a> makes it easy.
			</div>	
		</div>
	);
}
