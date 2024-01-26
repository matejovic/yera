import { h, Component } from "preact";
import Quill from "quill";

class TextEditor extends Component {
  componentDidMount() {
    this.quill = new Quill(this.editor, {
      theme: "snow",
      modules: {
        toolbar: false,
      },
    });
  }
  render() {
    return (
      <div
        ref={(el) => {
          this.editor = el;
        }}
      />
    );
  }
}

export default TextEditor;
