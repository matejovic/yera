import { useEffect, useState } from "preact/hooks";
import { createRef, Component } from "preact";
import "./style.css";
import TextEditor from "../components/TextEditor.tsx";
import { showHelp } from "../globals";

function toast () {
  const el = document.querySelector('.toast')
  el.classList.add('show');
  setTimeout(function () {
    el.classList.remove('show')
  }, 1000)
}

class Research extends Component {
  constructor() {
    super();
    this.state = {
      hash: 0,
      question: "",
      editor: createRef(),
      archive: [], 
    };
  }

  componentDidMount() {
    const arch: string | null = window.localStorage.getItem("archive");
    const archive: [] = JSON.parse(arch ? arch : "[]");
    if (archive.length) {
      const entry = archive[0]; // top of the stack...
      this.setState({
        hash: entry.hash,
        question: entry.question,
        archive: archive,
      });

      // in func component useEffect() instead (we might want to migrate for consistency)
      this.state.editor.current.quill.setContents(entry.raw);
    }
  }

  render() {

    const updateArchive = () => {
      const entry = {
        hash: this.state.hash,
        question: this.state.question,
        body: this.state.editor.current.quill.getText(),
        raw: this.state.editor.current.quill.getContents(),
        updated: new Date().toString().substr(0, 24),
      };
      var entry_id = this.state.archive.findIndex((e) => e.hash === entry.hash);
      if (entry_id === -1) {
        this.state.archive.push(entry);
      } else {
        this.state.archive[entry_id] = entry;
      }
      localStorage.setItem("archive", JSON.stringify(this.state.archive));
      this.forceUpdate(); // todo: remove need for this ...
      toast("saved to browser memory"); // todo: add simple toast ...
    };

    const newId = () => {
      const hash = this.state.archive.reduce((a, b) =>
        a.hash > b.hash ? a : b,
      ).hash;
      return hash ? hash + 1 : 1;
    };

    const newResearchEntry = () => {
      this.setState({ question: "", hash: newId() });
      this.state.editor.current.quill.setContents();
    };

    const selectThesis = (hash) => {
      const entry = this.state.archive.find((e) => e.hash === hash);
      this.state.editor.current.quill.setContents(entry.raw);
      this.setState({
        hash: entry.hash,
        question: entry.question,
      });
    };
    
     function trash () {
      const yes_trash = window.confirm("Are you sure?");
      if (yes_trash) {
        newResearchEntry();
        this.setState(prevState => ({
          archive: prevState.archive.filter(
             e => e.hash !== this.state.hash
          )
        }));
        // TODO: update local storage as well...

      }
    };

    function createAutosaver ($ref) {
      let _id: number| null = null;

      function toggle() {
        if (_id) { // assuming `_id` is not 0...
          clearInterval(_id);
          _id = null;
          console.log('stopped', _id);
        } else {
          console.log('tbd');
          _id = setInterval(() => {
            console.log('tbd...')
          }, 1000);
        }
        $ref.current.classList.toggle("active");
      }

      return {
        toggle,
        _id
      };

    };

    const $autosave = createRef();
    const autosaver = createAutosaver($autosave);

    return (
      <div class="page">
        <div class="block">
          <h2>Block Editor</h2>
          {showHelp &&<p class="help">
            Each thesis starts with a question. Think carefully about your
            research question before making a decision of working on your
            thesis. It will take time to develop your thinking and we recommend
            you to start by gathering <a href="/resources">Resources</a> and
            improving your <a href="/time">Time Management</a>.{" "}
          </p>}
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
              
                            {/*<button class="danger" onClick={trash.bind(this)}>Trash</button>*/}
                            {/*<button ref={$autosave} onClick={autosaver.toggle}>Autosave (timestamp)</button>*/}
          </div>
          <TextEditor ref={this.state.editor} />
          <div class="toast">
            Saved
          </div>
        </div>
        <div class="block">
          <h2>More</h2>
          <ul>
            {this.state.archive.map((thesis) => (
              <li>
                <a href="#" onClick={() => selectThesis(thesis.hash)}>
                  {thesis.question}
                </a>{" "}
                ({thesis.updated})
              </li>
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
