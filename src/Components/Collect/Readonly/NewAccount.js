import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function NewAccount(props) {
  const user = useSelector(state => state.user);
  const [userId, setUserId] = useState("");
  const [userPwd, setUserPwd] = useState("");
  const [userName, setUserName] = useState("");
  const submit = async () => {
    const data = { userId: userId, userPwd: userPwd, userName: userName };
    await axios
      .post("/api/v1/user/add/role/readonly", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        console.log(res);
        alert(res.data.message);
        if (res.data.code === "C000") {
          props.getAccountList();
        }
      })
      .catch(e => console.log(e));
  };
  return (
    <div className="w-full mb-4">
      <h3 className="font-bold text-lg">읽기전용 계정 추가</h3>
      <div className="p-4 flex flex-col justify-start gap-y-2 border bg-white drop-shadow-sm">
        <div className="flex flex-row justify-start gap-x-2">
          <div className="w-[120px] p-2 text-right">아이디</div>
          <div className="w-full">
            <input
              type="text"
              id="userId"
              className="p-2 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full rounded"
              value={userId}
              placeholder="아이디 입력"
              onChange={e => setUserId(e.currentTarget.value)}
            />
          </div>
        </div>
        <div className="flex flex-row justify-start gap-x-2">
          <div className="w-[120px] p-2 text-right">비밀번호</div>
          <div className="w-full">
            <input
              type="password"
              id="userPwd"
              className="p-2 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full rounded"
              value={userPwd}
              placeholder="비밀번호 입력"
              onChange={e => setUserPwd(e.currentTarget.value)}
            />
          </div>
        </div>
        <div className="flex flex-row justify-start gap-x-2">
          <div className="w-[120px] p-2 text-right">유저명</div>
          <div className="w-full">
            <input
              type="text"
              id="userName"
              className="p-2 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full rounded"
              value={userName}
              placeholder="유저명 입력"
              onChange={e => setUserName(e.currentTarget.value)}
            />
          </div>
        </div>
        <button
          className="p-2 text-white bg-indigo-500 hover:bg-indigo-700"
          onClick={() => submit()}
        >
          저장하기
        </button>
      </div>
    </div>
  );
}

export default NewAccount;
