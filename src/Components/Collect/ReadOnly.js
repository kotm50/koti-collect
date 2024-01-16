import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import NewAccount from "./Readonly/NewAccount";
import axios from "axios";

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
    <div className="mx-4" data={title}>
      <NewAccount getAccountList={getAccountList} />
      {accountList.length > 0 ? (
        <div className="w-1/4 bg-white p-4 border drop-shadow-sm">
          <div className="grid grid-cols-2 mb-2">
            <div className="text-center">아이디</div>
            <div className="text-center">이름</div>
          </div>
          {accountList.map((acc, idx) => (
            <div key={idx} className="flex flex-col justify-start">
              <div className="grid grid-cols-2 mb-2">
                <div className="text-center">{acc.userId}</div>
                <div className="text-center">{acc.userName}</div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default ReadOnly;
