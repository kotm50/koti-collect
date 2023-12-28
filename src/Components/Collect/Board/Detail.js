import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../../Reducer/userSlice";

import { FaAngleUp, FaAngleDown } from "react-icons/fa";

import axios from "axios";
import dompurify from "dompurify";
import dayjs from "dayjs";
import "dayjs/locale/ko"; //한국어

function Detail() {
  const sanitizer = dompurify.sanitize;
  const navi = useNavigate();
  const thisLocation = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const { bid, pid } = useParams();
  const [title, setTitle] = useState("");
  const [userName, setUserName] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [delYn, setDelYn] = useState("N");
  const [nextPid, setNextPid] = useState("");
  const [prevPid, setPrevPid] = useState("");
  const [nextTitle, setNextTitle] = useState("");
  const [prevTitle, setPrevTitle] = useState("");

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

  useEffect(() => {
    console.log(user);
    console.log(bid, pid);
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
    await axios
      .post("/api/v1/board/admin/post/data", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(async res => {
        console.log(res);
        if (res.data.code === "E999" || res.data.code === "E403") {
          logout();
          return false;
        }
        if (res.data.code === "C000") {
          const post = res.data.post;
          const postNav = res.data.postNavi;
          const unescapeContent = await unescapeHTML(post.content);
          setUserName(post.userName);
          setTitle(post.title);
          setContent(unescapeContent);
          setDate(getDate(post.regDate));
          setDelYn(post.delYn);
          setNextPid(postNav.nextPostId || "");
          setNextTitle(postNav.nextTitle || "");
          setPrevPid(postNav.prevPostId || "");
          setPrevTitle(postNav.prevTitle || "");
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const getDate = date => {
    return dayjs(new Date(date)).format("YYYY-MM-DD");
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

  const deleteIt = async () => {
    const data = {
      boardId: bid,
      postId: pid,
    };
    if (delYn === "N") {
      await axios
        .patch("/api/v1/board/admin/del/y/post", data, {
          headers: { Authorization: user.accessToken },
        })
        .then(res => {
          console.log(res);
          if (res.data.code === "E999" || res.data.code === "E403") {
            logout();
            return false;
          }

          if (res.data.code === "C000") {
            alert(res.data.message);
            navi(`/board/list/${bid}`);
          }
        });
    } else {
      const confirm = window.confirm(
        "영구삭제시 복구가 불가능합니다. 진행할까요?"
      );
      if (!confirm) {
        return false;
      }
      await axios
        .delete("/api/v1/board/admin/delete/post", {
          data: data,
          headers: { Authorization: user.accessToken },
        })
        .then(res => {
          console.log(res);
          if (res.data.code === "E999" || res.data.code === "E403") {
            logout();
            return false;
          }

          if (res.data.code === "C000") {
            alert(res.data.message);
            navi(`/board/list/${bid}`);
          }
        });
    }
  };
  const restoreIt = async () => {
    const data = {
      boardId: bid,
      postId: pid,
    };
    await axios
      .patch("/api/v1/board/admin/recv/post", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        console.log(res);
        if (res.data.code === "E999" || res.data.code === "E403") {
          logout();
          return false;
        }

        if (res.data.code === "C000") {
          alert(res.data.message);
          navi(`/board/list/${bid}`);
        }
      });
  };
  return (
    <div className="mx-4">
      <div className="border-y border-black bg-blue-100 flex justify-between py-1">
        <div className="w-[200px] text-center">{date}</div>
        <h3 className="w-full font-bold text-center">{title}</h3>

        <div className="w-[200px] text-center">{userName}</div>
      </div>
      <div className="bg-white p-2 border-b border-black">
        <div
          className="text-left"
          dangerouslySetInnerHTML={{
            __html: sanitizer(content),
          }}
        />
      </div>
      <div className="flex flex-col justify-start divide-y border-b border-black divide-black">
        {nextPid === "" ? (
          <div className="bg-gray-50 flex flex-row justify-start gap-x-2 py-2">
            <div className="w-[120px] text-center">다음 글</div>
            <div className="w-[48px] text-center flex flex-col justify-center">
              <FaAngleUp />
            </div>
            <div className="text-left">다음 글이 없습니다</div>
          </div>
        ) : (
          <Link
            to={`/board/detail/${bid}/${nextPid}`}
            className="bg-gray-50 hover:bg-gray-200 flex flex-row justify-start gap-x-2 py-2"
          >
            <div className="w-[120px] text-center">다음 글</div>
            <div className="w-[48px] text-center flex flex-col justify-center">
              <FaAngleUp />
            </div>
            <div className="text-left">{nextTitle}</div>
          </Link>
        )}
        {prevPid === "" ? (
          <div className="bg-gray-50 flex flex-row justify-start gap-x-2 py-2">
            <div className="w-[120px] text-center">이전 글</div>
            <div className="w-[48px] text-center flex flex-col justify-center">
              <FaAngleDown />
            </div>
            <div className="text-left">이전 글이 없습니다</div>
          </div>
        ) : (
          <Link
            to={`/board/detail/${bid}/${prevPid}`}
            className="bg-gray-50 hover:bg-gray-200 flex flex-row justify-start gap-x-2 py-2"
          >
            <div className="w-[120px] text-center">이전 글</div>
            <div className="w-[48px] text-center flex flex-col justify-center">
              <FaAngleDown />
            </div>
            <div className="text-left">{prevTitle}</div>
          </Link>
        )}
      </div>
      <div className="flex justify-between py-2 mb-24">
        <Link
          to={`/board/list/${bid}`}
          className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-center text-white rounded drop-shadow hover:drop-shadow-lg"
        >
          목록으로
        </Link>
        <div className="flex justify-end gap-x-1">
          {delYn === "N" ? (
            <Link
              to={`/board/write/${bid}/${pid}`}
              className="py-2 px-4 bg-green-500 hover:bg-green-700 text-center text-white rounded drop-shadow hover:drop-shadow-lg"
            >
              수정하기
            </Link>
          ) : (
            <button
              className="py-2 px-4 bg-green-500 hover:bg-green-700 text-center text-white rounded drop-shadow hover:drop-shadow-lg"
              onClick={() => restoreIt()}
            >
              복원하기
            </button>
          )}

          <button
            className="py-2 px-4 bg-rose-500 hover:bg-rose-700 text-center text-white rounded drop-shadow hover:drop-shadow-lg"
            onClick={() => deleteIt()}
          >
            {delYn === "N" ? "삭제하기" : "영구삭제"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Detail;
