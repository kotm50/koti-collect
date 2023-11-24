import React from "react";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { modules } from "./Layout/QuillModule";

function Test() {
  return (
    <div className="w-[480px] h-[200px] bg-gray-200">
      <ReactQuill modules={modules} theme="snow" className="max-w-full" />
    </div>
  );
}

export default Test;
