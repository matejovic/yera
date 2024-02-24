import { Config } from "./config.js"

function Y () {

  	const currentTime = new Date().toString();
	function parseWidget() {}
	function log(){}
	function ask(){}
	return (
      <div class="banner">
	<div class="widget">
		current time is: $currentTime
	</div>
	<div class="log">
      		<ul>
			<li>today is friday</li>
			<li>calendar as an exciting shared adventure!!!</li>
			<li>
				<input type="text" />
			</li>
		</ul>
	</div>
	<div id="heyg" class="stream">
		<textarea>can you write a new app for me?</textarea>
	</div>
      </div>	
	
	)

}



export function Yera() {

  return (
    <div class="page">
	<Config />
    </div>
  )

}
