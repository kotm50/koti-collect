import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../Reducer/userSlice";

import axios from "axios";

function Collect() {
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
      <div className="fixed top-0 left-0 w-[240px] h-screen py-4 border-r bg-white shadow-lg">
        <h2 className="font-bold p-4 text-xl text-center">
          수금전산 테스트페이지
        </h2>
        <div className="flex flex-col justify-start divide-y border-y">
          <div className="p-4">메인</div>
          <div className="p-4">미수금 입력</div>
          <div className="p-4">수금 입력</div>
          <div className="p-4">월별 내역보기</div>
          <div className="p-4">기프티콘 충전현황</div>
        </div>
        <div className="flex flex-con justify-end">
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white p-2"
            onClick={logout}
          >
            로그아웃
          </button>
        </div>
      </div>

      <div className="pl-[250px]">
        <Outlet />
      </div>
    </>
  );
}

export default Collect;
