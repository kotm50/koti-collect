import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../../Reducer/userSlice";

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
          const unescapeContent = await unescapeHTML(post.content);
          setUserName(post.userName);
          setTitle(post.title);
          setContent(unescapeContent);
          setDate(getDate(post.regDate));
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

  return (
    <div className="mx-4">
      <div className="border-y border-black bg-blue-100 flex justify-between py-1">
        <h3 className="w-full font-bold text-center">{title}</h3>

        <div className="w-[200px] text-center">{userName}</div>
        <div className="w-[200px] text-center">{date}</div>
      </div>
      <div className="bg-white p-2">
        <div
          className="text-left"
          dangerouslySetInnerHTML={{
            __html: sanitizer(content),
          }}
        />
      </div>
    </div>
  );
}

export default Detail;
