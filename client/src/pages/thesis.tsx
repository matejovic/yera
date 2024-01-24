import {useEffect, useState } from "preact/hooks";
import { createRef, Component } from "preact";
import "./style.css";
import TextEditor from "../components/TextEditor.tsx";

// DONE: hide default theme buttons. 
// TODO: browser storage
// TODO: server storage
// TODO: crud-many
	
	// fix: change title for page-specific
	// this page is now broken and hidden, please return to at least previous functional state before continue
class Thesis extends Component {
	render () {
		// get access to TextEditor content and store it somewhere
		// cross-refresh persistence within browser
		let editorRef = createRef();
		const [question, setQuestion] = useState('');
		
		// somewhere on load
		let thesis = window.localStorage.getItem("thesis");
		if (thesis) {
			setQuestion(thesis.question);
			// now pass body back to quill. 
			window.thesis = thesis;
			console.log(editorRef) // .current.quill.setContents(thesis.raw)
		}
		
		let time = new Date(); //(this.state.time).toLocaleTimeString();
		
		let save =  () =>  {
			const body = editorRef.current.quill.getText();
			const raw = editorRef.current.quill.getContents();
			console.log('going to save', question, body);
			localStorage.setItem("thesis", { question: question, body: body, raw: raw })
		}
		
		return (
			<div class="thesis">
				<div>
					<p>Each thesis starts with a question. Think carefully about your research question before making a decision of working on your thesis. It will take time to develop your thinking and we recommend you to start by gathering <a href="/resources">Resources</a> and improving your <a href="/advent">Time Management</a>. </p>
					<h2>Active Research</h2>
					<ul>
						<li>your stored entry</li>
						<li>open another one</li>
						<li>another one</li>
					</ul>
					<p>{time}</p>
				</div>
				<h2>Research Zone - Open Document</h2>
				<input type="text" placeholder="research question" value={question} onInput={(e) => setQuestion(e.target.value)}/>
				<TextEditor ref={editorRef} />
				<button onClick={save}>Save</button>
			</div>
		)
	}

}

export default Thesis;