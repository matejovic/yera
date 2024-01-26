import { useEffect, useState } from "preact/hooks";
import "./style.css";

export function Homepage() {
	return (
		<div class="page a">
			<div class="block">
				<h2 class="centered">Researcher's Confidant</h2>
				<p>Jan as an <a href="https://docs.google.com/document/d/1NRkgrdSc7QpXe8jdnAh3ECr4-aBgmSVmHPECsp6C3yk/edit?usp=sharing" target="_blank">Adventure</a>. </p>
				<ul>
					<li>app skeleton</li>
					<li>research xp</li>
					<li>research xp</li>
					<li>auth (recovery, token, profile)</li>
				</ul>
			</div>
		</div>
	);
}
