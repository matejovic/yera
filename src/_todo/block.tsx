import { useEffect, useState } from "preact/hooks";
import { createRef } from "preact";
import TextEditor from "./core/text-editor.tsx";
import { showHelp } from "./core/globals.tsx";

export function Block () {
  const [title, setTitle] = useState('');
  const [block, setBlock] = useState(''); 
  
  useEffect(()=>{
    block.current.quill.setContents(entry.raw);
  })
  
  const save = () => {
      const entry = {
        title: title,
        body: block.current.quill.getText(),
        raw: block.current.quill.getContents(),
        updated: new Date(),
      };
      // send request to server ...
      // block vs. section?
    };
  
    return (
      <div class="page">
        <div class="block">
          <h2>Block Editor</h2>
            <div class="flex-between mb16">
            {" "}
            <input
              type="text"
              placeholder="unnamed"
              value={title}
              onInput={(e) => (setTitle(e.target.value))}
            />
            <button onClick={save} class="save">
              Save
              </button> 
          </div>
          <TextEditor ref={block} />
        </div>
      </div>
    );
}


