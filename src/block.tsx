import { useEffect, useState } from "preact/hooks";
import { createRef } from "preact";
import TextEditor from "./components/text-editor.tsx";
import { showHelp } from "./globals.tsx";


// so far everything is a block of text...
interface TextBlock {
	id: number;
	text: string;
	raw: string; // actually a quill perchments?
	t_created: string;
	t_updated: string;
}

export function Block () {
  //const [title, setTitle] = useState('');
  const [block, setBlock] = useState(''); 
  

    return (
        <div class="block">
          <h2>Text</h2>
            {/*<div style={{
		"display": "flex",
	     	"marginBottom": "8px",
		"justifyContent": "space-between"
 	     }}>
            <input
              type="text"
              placeholder="unnamed"
              value={title}
              onInput={(e) => (setTitle(e.target.value))}
            />
            <button onClick={save} class="save">
              Save
              </button> 
          </div> */}
          <TextEditor ref={block} />
        </div>
    );
}


