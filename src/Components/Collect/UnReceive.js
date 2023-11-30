import React, { useEffect, useRef, useState } from "react";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import InputCharge from "./Charge/InputCharge";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import CommissionList from "./Charge/CommissionList";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { clearUser } from "../../Reducer/userSlice";
import MonthButton from "./Charge/MonthButton";
import InputDeposit from "./Charge/InputDeposit";

function UnReceive() {
  const stickyRef = useRef(null);
  const navi = useNavigate();
  const thisLocation = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [title, setTitle] = useOutletContext();
  const [inputOn, setInputOn] = useState(false);

  const [bottom, setBottom] = useState(0);

  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const [isUnpaid, setIsUnpaid] = useState("N");

  const [searchKeyword, setSearchKeyword] = useState("");
  const [keyword, setKeyword] = useState("");

  const [feeList, setFeeList] = useState([]);

  const [edit, setEdit] = useState(null);

  const handleSearch = e => {
    if (e.key === "Enter") {
      setSearchKeyword(e.target.value);
      setEdit(null);
    }
  };

  useEffect(() => {
    if (edit !== null) {
      setInputOn(true);
    }
    //eslint-disable-next-line
  }, [edit]);

  useEffect(() => {
    setTitle("수수료 관리");
    //eslint-disable-next-line
  }, [thisLocation]);

  useEffect(() => {
    if (stickyRef.current) {
      const rect = stickyRef.current.getBoundingClientRect();
      const bottomY = rect.bottom; // 뷰포트 상단으로부터의 div 하단의 Y 좌표
      console.log(bottomY);
      setBottom(bottomY);
    }
  }, [inputOn]);

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

  const getFeeList = async (month, keyword) => {
    let commission = {
      hireStartMonth: String(month),
      unpaidYn: isUnpaid,
    };
    let reqData;
    let paging;

    if (searchKeyword !== "") {
      paging = {
        searchKeyword: keyword,
      };
    } else {
      paging = {
        searchKeyword: null,
      };
    }

    reqData = { paging, commission };
    console.log(reqData);
    await axios
      .post("/api/v1/comp/get/ad", reqData, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          logout();
          return false;
        }
        console.log(res.data.commissionList);
        setFeeList(res.data.commissionList);
      })
      .catch(e => console.log(e));
  };
  const handleUnpaidChk = () => {
    setFeeList([]);
    setIsUnpaid(isUnpaid === "Y" ? "N" : "Y");
  };
  return (
    <div className="mx-4" data={title}>
      <div
        ref={stickyRef}
        className="sticky top-0 left-0 z-50 bg-gray-50 pb-2 grid grid-cols-2 gap-x-2"
      >
        <div className="bg-white p-2 border-b w-full h-fit rounded-lg drop-shadow">
          <div
            className={`flex justify-between hover:cursor-pointer hover:bg-gray-100 hover:rounded-full px-2 ${
              inputOn && "mb-2"
            }`}
            onClick={() => {
              setInputOn(!inputOn);
            }}
          >
            <h3 className="text-center font-bold py-1 pl-2">
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
            <InputCharge
              getFeeList={getFeeList}
              edit={edit}
              setEdit={setEdit}
              month={month}
              searchKeyword={searchKeyword}
              isUnpaid={isUnpaid}
            />
          </div>
        </div>
        <div className="bg-white p-2 border-b w-full h-fit rounded-lg drop-shadow">
          <div
            className={`flex justify-between hover:cursor-pointer hover:bg-gray-100 hover:rounded-full px-2 ${
              inputOn && "mb-2"
            }`}
            onClick={() => {
              setInputOn(!inputOn);
            }}
          >
            <h3 className="text-center font-bold py-1 pl-2">
              수금 입력
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
            <InputDeposit
              user={user}
              getFeeList={getFeeList}
              edit={edit}
              setEdit={setEdit}
              month={month}
              searchKeyword={searchKeyword}
              isUnpaid={isUnpaid}
              logout={logout}
            />
          </div>
        </div>
        <div
          id="searchArea"
          className="mt-2 flex flex-row justify-between flex-nowrap gap-x-4 p-2 bg-white rounded-lg drop-shadow col-span-2"
        >
          <div className="flex flex-row justify-start gap-x-1">
            <label htmlFor="inputKeyword" className="p-2 font-bold">
              검색하기
            </label>
            <input
              id="inputKeyword"
              type="text"
              value={keyword}
              className="p-1 border"
              placeholder="지점명/담당자명으로 검색"
              onChange={e => setKeyword(e.currentTarget.value)}
              onKeyDown={handleSearch}
            />
            <button
              className="bg-teal-500 hover:bg-teal-700 text-white p-1 rounded"
              onClick={() => setSearchKeyword(keyword)}
            >
              검색하기
            </button>
          </div>
          <div className="flex flex-row justify-start gap-x-1">
            <div className="p-2 font-bold">월별보기</div>
            <div className="grid grid-cols-12 gap-x-1">
              <MonthButton month={month} setMonth={setMonth} />
            </div>
          </div>
          <div className="flex flex-row justify-start gap-x-1">
            <label htmlFor="unpaidChk" className="p-2">
              미수금 항목만 보기
            </label>
            <input
              id="unpaidChk"
              type="checkbox"
              checked={isUnpaid !== "N"}
              className="p-1 border"
              placeholder="지점명/담당자명으로 검색"
              onChange={handleUnpaidChk}
            />
          </div>
        </div>
      </div>
      <div className="w-full mt-2 mb-[100px]">
        <CommissionList
          feeList={feeList}
          edit={edit}
          setEdit={setEdit}
          bottom={bottom}
        />
      </div>
    </div>
  );
}

export default UnReceive;
