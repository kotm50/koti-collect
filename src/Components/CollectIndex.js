import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import axios from "axios";
import { loginUser } from "../Reducer/userSlice";

function CollectIndex() {
  const inputPwdRef = useRef();
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navi = useNavigate();
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    console.log(user);
    //eslint-disable-next-line
  }, []);

  const login = async () => {
    const data = {
      userId: id,
      userPwd: pwd,
    };
    await axios
      .post("/api/v1/user/login", data)
      .then(async res => {
        const token = res.headers.authorization;

        if (res.data.code === "C000") {
          chkAdmin(token, res.data.user);
        } else {
          setErrMsg(res.data.message);
          setPwd("");
          if (res.data.code === "E003") {
            inputPwdRef.current.focus();
          }
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const chkAdmin = async (token, user) => {
    await axios
      .post("/api/v1/user/rolechk", null, {
        headers: { Authorization: token },
      })
      .then(res => {
        if (res.data.code === "A100") {
          dispatch(
            loginUser({
              userId: id,
              userName: user.userName,
              accessToken: token,
              lastLogin: new Date(),
              point: user.point,
              admin: true,
            })
          );
          navi("/collect");
        } else {
          setErrMsg("잘못된 계정을 입력하셨습니다. 관리자에게 문의하세요");
          return false;
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  const handleSubmit = e => {
    e.preventDefault();
    setErrMsg("");
    if (id === "") {
      setErrMsg("아이디를 입력하세요");
      return false;
    }
    if (pwd === "") {
      setErrMsg("비밀번호를 입력하세요");
      return false;
    }
    login();
  };
  return (
    <>
      <div className="fixed left-1/2 top-1/2 w-fit h-fit -translate-x-1/2 -translate-y-1/2">
        <div className="text-6xl">코리아티엠 수금전산!</div>
        <form onSubmit={handleSubmit}>
          <div className="mt-48 p-4 rounded border boder-gray-200 bg-gray-50 shadow-lg grid grid-cols-1 gap-y-3">
            <div>
              <label
                htmlFor="userName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                아이디
              </label>
              <input
                type="text"
                name="userName"
                id="userName"
                value={id}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="아이디를 입력하세요"
                onChange={e => setId(e.currentTarget.value)}
                onBlur={e => setId(e.currentTarget.value)}
              />
            </div>
            <div>
              <label
                htmlFor="inputPwd"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                비밀번호
              </label>
              <input
                type="password"
                name="inputPwd"
                id="inputPwd"
                placeholder="비밀번호를 입력하세요"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
                onChange={e => setPwd(e.currentTarget.value)}
                onBlur={e => setPwd(e.currentTarget.value)}
                autoComplete="off"
              />
            </div>
            {errMsg !== "" && (
              <div className="text-sm text-rose-500 text-center font-bold">
                {errMsg}
              </div>
            )}
            <button
              className="w-full px-2 py-4 text-center bg-blue-500 hover:bg-blue-700 text-white rounded"
              type="submit"
            >
              로그인
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CollectIndex;
