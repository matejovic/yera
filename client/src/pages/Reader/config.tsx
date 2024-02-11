import { h } from "preact";

function ReaderConfig() {
  function setReaderFont(font: string) {
    document.querySelector(".reader").style.fontFamily = font;
  }

  return (
    <div>
      Adjust your reading experience. <br />
      <br />
      <div class="form-input">
        <label>Font Type: </label>
        <select onChange={(e) => setReaderFont(e.currentTarget.value)}>
          <option value="georgia">Georgia</option>
          <option value="monospace">Monospace</option>
          <option value="helvetica">Helvetica</option>
        </select>
      </div>
      {/*
        // problem with these is that it requires relative slider 
        // single input value to correctly adjust various font elements
        // such as paragraph and headers
        
        <div class="form-input">
        <label>Font Size: </label>
        <input type="number" />
      </div>
      <div class="form-input">
        <label>Letter Spacing: </label>
        <input type="number" />
      </div>
      <div class="form-input">
        <label>Line Height: </label>
        <input type="number" />
      </div>
        */}
    </div>
  );
}

export default ReaderConfig;
