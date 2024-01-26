import { useEffect, useState } from "preact/hooks";
import { createRef, Component } from "preact";
import "./style.css";
import TextEditor from "../components/TextEditor.tsx";

class Thesis extends Component {
  constructor() {
    super();
    this.state = {
      question: "",
      editor: createRef(),
    };
  }

  componentDidMount() {
    // Localstorage issues: find proper onLoad lifecycle or useEffect
    const memo = window.localStorage.getItem("thesis");
    let initial_data = memo ? JSON.parse(memo) : null;
    if (initial_data) {
      this.setState({ question: initial_data.question });

      this.state.editor.current.quill.setContents(initial_data.raw);
    }
  }

  render() {
    let save = () => {
      const body = this.state.editor.current.quill.getText();
      const raw = this.state.editor.current.quill.getContents();
      const data = { question: this.state.question, body: body, raw: raw };
      localStorage.setItem("thesis", JSON.stringify(data));
    };

    return (
      <div class="page">
        <div class="block thesis">
          <h2 class="centered">Research</h2>
          <p>
            Each thesis starts with a question. Think carefully about your
            research question before making a decision of working on your
            thesis. It will take time to develop your thinking and we recommend
            you to start by gathering <a href="/resources">Resources</a> and
            improving your <a href="/advent">Time Management</a>.{" "}
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
        <hr class="block-split" />
        <div class="block">
          <h2 class="centered">History</h2>
          <ul>
            <li>a) browser memory b) n problem c) server memory</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Thesis;
