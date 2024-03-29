import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../../Reducer/userSlice";

import ReactQuill from "react-quill";
import { modulesB, formats } from "../../Layout/QuillModule";
import axiosInstance from "../../../Api/axiosInstance";

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
    if (pid) {
      getPost(pid);
    }
    //eslint-disable-next-line
  }, [thisLocation]);

  const getPost = async pid => {
    const data = {
      boardId: bid,
      postId: pid,
    };

    await axiosInstance
      .post("/api/v1/board/admin/post/data", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(async res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          logout();
          return false;
        }
        if (res.data.code === "C000") {
          const post = res.data.post;
          const unescapeContent = await unescapeHTML(post.content);
          setUserName(post.userName);
          setTitle(post.title);
          setContent(unescapeContent);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const resetIt = () => {
    const confirm = window.confirm(
      "입력한 내용이 전부 사라집니다. 진행할까요?"
    );
    if (!confirm) {
      return false;
    } else {
      navi(-1);
    }
  };

  const logout = async () => {
    await axiosInstance
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

    let data = {
      boardId: bid,
      userName: userName,
      title: title,
      content: escapeContent,
    };
    if (pid) {
      data.postId = pid;
    }

    await axiosInstance
      .post("/api/v1/board/admin/write/post", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        alert(res.data.message);
        if (res.data.code === "E999" || res.data.code === "E403") {
          logout();
          return false;
        }
        if (res.data.code === "C000") {
          navi(`/board/list/${bid}`);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  const escapeHTML = text => {
    return text
      .replace(/</g, "＜")
      .replace(/>/g, "＞")
      .replace(/=/g, "＝")
      .replace(/\(/g, "（")
      .replace(/\)/g, "）")
      .replace(/,/g, "，")
      .replace(/"/g, "＂")
      .replace(/:/g, "：")
      .replace(/;/g, "；")
      .replace(/\//g, "／");
  };

  const unescapeHTML = text => {
    return text
      .replace(/＜/g, "<")
      .replace(/＞/g, ">")
      .replace(/＝/g, "=")
      .replace(/（/g, "(")
      .replace(/）/g, ")")
      .replace(/，/g, ",")
      .replace(/＂/g, '"')
      .replace(/：/g, ":")
      .replace(/；/g, ";")
      .replace(/／/g, "/");
  };

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
      <div className="flex justify-center gap-x-2 mt-4">
        <button
          className="p-2 bg-green-500 hover:bg-green-700 text-white rounded"
          onClick={submit}
        >
          저장하기
        </button>
        <button
          className="p-2 bg-gray-300 hover:bg-gray-700 hover:text-white rounded"
          onClick={resetIt}
        >
          취소
        </button>
      </div>
    </div>
  );
}

export default Write;
