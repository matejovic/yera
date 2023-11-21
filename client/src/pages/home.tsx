import { useEffect, useState } from "preact/hooks";
import "./style.css";

export function Homepage() {
	return (
		<div class="reader">
			<h2>Welcome</h2>
			<br />
			
			<ul>
				<li>We work with enthusiasm towards alpha stage. </li>
				<li>Product of Comenius Institute. </li>
				<li>Everything is <a href="https://github.com/matejovic/reader">Open Sourced.</a></li>
			</ul>
			<p></p>

			{/* TODO: add gif with current flow */}


		</div>
	);
}
