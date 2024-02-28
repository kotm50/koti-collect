import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import NewAccount from "./Readonly/NewAccount";
import axios from "axios";
import Logs from "./Readonly/Logs";

function ReadOnly() {
  const user = useSelector(state => state.user);
  const navi = useNavigate();
  const thisLocation = useLocation();
  const [title, setTitle] = useOutletContext();
  const [accountList, setAccountList] = useState([]);

  useEffect(() => {
    setTitle("읽기 전용 계정 관리");
    getAccountList();
    //eslint-disable-next-line
  }, [thisLocation]);

  const getAccountList = async () => {
    setAccountList([]);
    await axios
      .post("/api/v1/user/get/role/readonly/list", null, {
        headers: { Authorization: user.accessToken },
      })
      .then(async res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          navi("/");
          return false;
        }
        console.log(res);
        setAccountList(res.data.userList || []);
      })
      .catch(e => console.log(e));
  };
  return (
    <div className="mx-4 grid grid-cols-5 gap-x-4" data={title}>
      <div>
        <NewAccount getAccountList={getAccountList} />
        {accountList.length > 0 ? (
          <div className="w-full bg-white p-4 border drop-shadow-sm  h-[500px] max-h-[500px] overflow-auto">
            <div className="grid grid-cols-2 mb-2">
              <div className="text-center">아이디</div>
              <div className="text-center">이름</div>
            </div>
            {accountList.map((acc, idx) => (
              <div key={idx} className="flex flex-col justify-star">
                <div className="grid grid-cols-2 mb-2">
                  <div className="text-center">{acc.userId}</div>
                  <div className="text-center">{acc.userName}</div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <Logs gubun="IN" />
      <Logs gubun="AP" />
    </div>
  );
}

export default ReadOnly;
