import React, { useEffect, useState } from "react";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import InputCharge from "./Charge/InputCharge";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import CommisionList from "./Charge/CommisionList";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { clearUser } from "../../Reducer/userSlice";

function UnReceive() {
  const navi = useNavigate();
  const thisLocation = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [title, setTitle] = useOutletContext();
  const [inputOn, setInputOn] = useState(true);

  const [feeList, setFeeList] = useState([]);

  const [edit, setEdit] = useState(null);

  useEffect(() => {
    setTitle("수수료 관리");
    getFeeList();
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

  const getFeeList = async () => {
    await axios
      .post("/api/v1/comp/get/ad", null, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          alert(res.data.message);
          logout();
          return false;
        }
        setFeeList(res.data.commissionList);
      })
      .catch(e => console.log(e));
  };

  return (
    <div className="mx-4" data={title}>
      <div className="sticky top-0 left-0 z-50 bg-white p-2 border-b w-full h-fit rounded-lg drop-shadow">
        <div
          className="flex justify-between mb-2 hover:cursor-pointer hover:bg-gray-100 hover:rounded-full px-2"
          onClick={() => setInputOn(!inputOn)}
        >
          <h3 className="text-center text-lg font-bold py-2 pl-2">
            추가/수정하기{" "}
            <span className="text-sm font-normal">
              (<span className="text-rose-500">*</span>은 필수입력)
            </span>
          </h3>
          <button className="min-w-[24px] text-lg hover:text-gray-500">
            {inputOn ? <FaCaretUp /> : <FaCaretDown />}
          </button>
        </div>
        <div
          className={`transition-height duration-300 ${
            inputOn ? "h-fit opacity-100" : "h-0 overflow-hidden opacity-0"
          }`}
        >
          <InputCharge getFeeList={getFeeList} edit={edit} setEdit={setEdit} />
        </div>
      </div>
      <div className="w-full mt-2">
        <CommisionList feeList={feeList} setEdit={setEdit} />
      </div>
    </div>
  );
}

export default UnReceive;
