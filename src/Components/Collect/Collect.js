import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../Reducer/userSlice";

import axios from "axios";

function Collect() {
  const [title, setTitle] = useState("코리아티엠 수금전산 페이지");
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navi = useNavigate();
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
      });
  };
  return (
    <>
      <div className="fixed top-0 left-0 w-[240px] h-screen py-4 border-r bg-white shadow-lg flex flex-col justify-between">
        <div>
          <h2 className="font-bold p-4 text-xl text-center">
            수금전산 테스트페이지
          </h2>
          <div className="flex flex-col justify-start divide-y border-y">
            <Link
              to="/collect"
              className="p-4 hover:bg-gray-100 transition-all duration-300"
            >
              메인
            </Link>
            <Link
              to="/collect/ur"
              className="p-4 hover:bg-gray-100 transition-all duration-300"
            >
              미수금 입력
            </Link>
            <Link
              to="/collect/ar"
              className="p-4 hover:bg-gray-100 transition-all duration-300"
            >
              수금 입력
            </Link>
            <div className="p-4 hover:bg-gray-100 transition-all duration-300">
              월별 내역보기
            </div>
            <div className="p-4 hover:bg-gray-100 transition-all duration-300">
              기프티콘 충전현황
            </div>
            <Link
              to="/collect/company"
              className="p-4 hover:bg-gray-100 transition-all duration-300"
            >
              고객사 리스트
            </Link>
          </div>
        </div>
        <div className="p-2">
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white p-2 w-full hover:rounded-lg transition-all duration-300"
            onClick={logout}
          >
            로그아웃
          </button>
        </div>
      </div>
      <div className="pl-[250px]">
        <h1 className="my-8 mx-4 text-3xl">{title}</h1>
        <Outlet context={[title, setTitle]} logout={logout} />
      </div>
    </>
  );
}

export default Collect;
