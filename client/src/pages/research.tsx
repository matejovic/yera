import { useEffect, useState } from "preact/hooks";
import { createRef, Component } from "preact";
import "./style.css";
import TextEditor from "../components/TextEditor.tsx";

class Research extends Component {
  constructor() {
    super();
    this.state = {
      hash: null, // used for CRUD operations...
      question: "",
      editor: createRef(),
      archive: [] // n-problem storage
    };
  }

  componentDidMount() {
    const arch: string = window.localStorage.getItem("archive"); // todo: can be null...
    const archive: [] = JSON.parse(arch ? arch : []);
    if (archive.length) {
      this.setState({ 
	question: archive[0].question, // pre-select first (until better idea)
	archive: archive 
      });
      // in func component useEffect() instead (we might want to migrate for consistency)
      this.state.editor.current.quill.setContents(archive[0].raw);
    }
  }

  render() {
    let save = () => {
	// data
      const entry = { 
	question: this.state.question, 
	body: this.state.editor.current.quill.getText(), 
	raw: this.state.editor.current.quill.getContents()
      };
      // set entry into archive
      localStorage.setItem("archive", JSON.stringify([entry])); // single entry only...
      alert("saved. you can now refresh the page.")
    };

    return (
      <div class="page">
	<div class="block">
          <h2 class="centered">History</h2>
        <p>
		need to a) store multiple essays b) display them up here c) open detail on button click. 
	</p>  
	<ul>
	    <li>ng-repeat='' this.state. </li>
	    <li>c) server memory</li>
	    <li><a href="#">Start a new research</a></li>
          </ul>
        </div>

        <div class="block">
          <h2 class="centered">Research</h2>
          <p class="help">
            Each thesis starts with a question. Think carefully about your
            research question before making a decision of working on your
            thesis. It will take time to develop your thinking and we recommend
            you to start by gathering <a href="/resources">Resources</a> and
            improving your <a href="/time">Time Management</a>.{" "}
          </p>
          <div class="flex-between mb16">
            {" "}
            <input
              type="text"
              placeholder="research question"
              value={this.state.question}
              onInput={(e) => (this.state.question = e.target.value)}
            />
            <button onClick={save} class="save">
              Save
            </button>
          </div>

          <TextEditor ref={this.state.editor} />
        </div>
        
      </div>
    );
  }
}

export default Research;
