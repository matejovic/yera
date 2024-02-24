import { useEffect, useState } from "preact/hooks";
import { createRef } from "preact";
import TextEditor  from "./components/text-editor.tsx";
import { showHelp } from "./globals.tsx";


interface TextBlock {
	id: number;
	text: string;
	raw: string; 
	t_created: string;
	t_updated: string;
}

export function Block () {
  const blockRef = createRef(null); 

    return (
        <div class="block">
          <h2>textarea</h2>
	<div>
          <TextEditor ref={blockRef} />	
	</div>
        </div>
    );
}


