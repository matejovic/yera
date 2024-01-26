import { h } from "preact";

function ReaderConfig() {
  return (
    <div>
      Adjust your reading experience.
      <ul>
        <li>Font Select</li>
        <li>Font Size</li>
        <li>Letter Spacing</li>
        <li>Line Height</li>
      </ul>
      <div class="form-input">
        <label>Font Type: </label>
        <select>
          <option>Sans</option>
          <option>Mono</option>
          <option>Util</option>
        </select>
      </div>
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
    </div>
  );
}

export default ReaderConfig;
