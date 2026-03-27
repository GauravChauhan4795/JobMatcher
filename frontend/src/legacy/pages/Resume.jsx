import { useState } from "react";
import API from "../api/Api";

export default function Resume() {
  const [text, setText] = useState("");

  const upload = async () => {
    await API.post("/resume", { raw_text: text });
    alert("Uploaded!");
  };

  return (
    <div>
      <textarea
        rows="10"
        cols="50"
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={upload}>Upload Resume</button>
    </div>
  );
}