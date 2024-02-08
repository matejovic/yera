import { useEffect, useState } from "preact/hooks";
import { createRef, Component } from "preact";
import "./style.css";
import TextEditor from "../components/TextEditor.tsx";

class Research extends Component {
  constructor() {
    super();
    this.state = {
      hash: "solo",
      question: "",
      editor: createRef(),
      archive: [], // n-problem storage
    };
  }

  componentDidMount() {
    const arch: string | null = window.localStorage.getItem("archive");
    const archive: [] = JSON.parse(arch ? arch : "[]");
    if (archive.length) {
      const entry = archive.find(e => e.hash === 'solo');
      this.setState({
        question: entry.question, 
        archive: archive,
      });
      // in func component useEffect() instead (we might want to migrate for consistency)
      this.state.editor.current.quill.setContents(archive[0].raw);
    }
  }

  render() {
    const updateArchive = () => {
      // can fail on race conditions
      // and too inefficient (good enough for 24...)
      const entry = {
        hash: this.state.hash,
        question: this.state.question,
        body: this.state.editor.current.quill.getText(),
        raw: this.state.editor.current.quill.getContents(),
      };
      var entry_id = this.state.archive.findIndex((e) => e.hash === entry.hash);
      if (entry_id === -1) {
        this.state.archive.push(entry);
      } else {
        this.state.archive[entry_id] = entry;
      }
      localStorage.setItem("archive", JSON.stringify(this.state.archive));
      alert("saved. you can now refresh the page.");
    };

    const newResearchEntry = () => {
      this.setState({ question: "", hash: "solo" });
      this.state.editor.current.quill.setContents();
    };

    const trash = () => {
      alert("tbd");
    };

    return (
      <div class="page">
        <div class="block">
          <h2>Research</h2>
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
            <button onClick={updateArchive} class="save">
              Save
            </button>
            <button class="save">Auto</button>
            <button class="save">Trash</button>
          </div>
          <TextEditor ref={this.state.editor} />
        </div>
        <div class="block">
          <h2>Archive</h2>
          <ul>
            {this.state.archive.map((thesis) => (
              <li>{thesis.question}</li>
            ))}
            <li>
              <a href="#" onClick={newResearchEntry}>
                Start a new research
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Research;
