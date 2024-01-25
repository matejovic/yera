import { useEffect, useState } from "preact/hooks";
import "./style.css";

export function Homepage() {
	return (
		<div class="reader">
			<h2>Research Tools</h2>
			<p>WIP: Read, Write, Organize, Publish</p>
			<ul>
				<li>We do what is needed.. <a href="https://docs.google.com/document/d/1NRkgrdSc7QpXe8jdnAh3ECr4gaBgmSVmHPECsp6C3yk/edit" target="_blank">Roadmap</a>. </li>
				<li>Trivial bookmarking and reader</li>
				<li>text browser storage</li>
				<li>Figure out trivial theming and configuration system.</li>
			</ul>
			<p></p>
		</div>
	);
}
