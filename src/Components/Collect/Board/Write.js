import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../../Reducer/userSlice";

import ReactQuill from "react-quill";
import { modulesB, formats } from "../../Layout/QuillModule";

import axios from "axios";

function Write() {
  const navi = useNavigate();
  const thisLocation = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const { bid, pid } = useParams();
  const [title, setTitle] = useState("");
  const [userName, setUserName] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    console.log(bid, pid);
    //eslint-disable-next-line
  }, [thisLocation]);

  const logout = async () => {
    await axios
      .post("/api/v1/user/logout", null, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        dispatch(clearUser());
        navi("/");
      })
      .catch(e => {
        console.log(e);
        navi("/");
      });
  };

  const submit = async () => {
    const escapeContent = await escapeHTML(content);

    console.log(escapeContent.length);
    console.log(content.length);
    let data = {
      boardId: bid,
      userName: userName,
      title: title,
      content: content,
    };
    if (pid) {
      data.postId = pid;
    }

    console.log(content);

    await axios
      .post("/api/v1/board/admin/write/post", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        console.log(res);
        alert(res.data.message);
        if (res.data.code === "E999" || res.data.code === "E403") {
          logout();
          return false;
        }
        if (res.data.code === "C000") {
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  const escapeHTML = text => {
    return text
      .replace(/</g, "_여꺾_")
      .replace(/>/g, "_닫꺾_")
      .replace(/=/g, "_등호_")
      .replace(/\(/g, "_여괄_")
      .replace(/\)/g, "_닫괄_")
      .replace(/,/g, "_쉼표_")
      .replace(/"/g, "_마침_")
      .replace(/:/g, "_콜론_")
      .replace(/;/g, "_세콜_")
      .replace(/\//g, "_슬시_");
  };

  /*
  const unescapeHTML = text => {
    return text
      .replace(/_여는꺾쇠_/g, "<")
      .replace(/_닫는꺾쇠_/g, ">")
      .replace(/_등호_/g, "=")
      .replace(/_여는괄호_/g, "(")
      .replace(/_닫는괄호_/g, ")")
      .replace(/_쉼표_/g, ",")
      .replace(/_마침표_/g, '"')
      .replace(/_콜론_/g, ":")
      .replace(/_세미콜론_/g, ";")
      .replace(/_슬래시_/g, "/");
  };
  */
  return (
    <div className="mx-4">
      <div className="p-3 bg-white drop-shadow flex flex-col justify-start gap-y-2">
        <div className="flex flex-row flex-nowrap justify-start gap-x-[12px]">
          <div className="w-[108px] p-2 bg-gray-50 text-lg font-bold text-right">
            작성자
          </div>
          <div className="w-full">
            <input
              type="text"
              className="p-2 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              value={userName}
              placeholder="작성자를 입력하세요"
              onChange={e => setUserName(e.currentTarget.value)}
            />
          </div>
        </div>
        <div className="flex flex-row flex-nowrap justify-start gap-x-[12px]">
          <div className="w-[108px] p-2 bg-gray-50 text-lg font-bold text-right">
            제목
          </div>
          <div className="w-full">
            <input
              type="text"
              className="p-2 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              value={title}
              placeholder="제목을 입력하세요"
              onChange={e => setTitle(e.currentTarget.value)}
            />
          </div>
        </div>
        <div className="flex flex-row flex-nowrap justify-start gap-x-[12px]">
          <div className="w-[108px] p-2 bg-gray-50 text-lg font-bold text-right">
            내용
          </div>
          <ReactQuill
            modules={modulesB}
            formats={formats}
            theme="snow"
            value={content}
            onChange={setContent}
            className="p-0 w-full border-0 bg-white h-full quillCustomC"
            placeholder="여기에 회의내용을 입력하세요"
          />
        </div>
      </div>
      <div className="flex justify-center gap-x-4 mt-4">
        <button
          className="p-2 bg-green-500 hover:bg-green-700 text-white rounded"
          onClick={submit}
        >
          저장하기
        </button>
      </div>
    </div>
  );
}

export default Write;
