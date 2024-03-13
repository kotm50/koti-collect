import React, { useEffect, useRef, useState } from "react";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import InputPrePaid from "./PrePaid/InputPrePaid";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../Reducer/userSlice";
import PrepaidList from "./PrePaid/PrepaidList";
import axiosInstance from "../../Api/axiosInstance";

function PrePaid() {
  const stickyRef = useRef(null);
  const navi = useNavigate();
  const thisLocation = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [title, setTitle] = useOutletContext();
  const [inputOn, setInputOn] = useState(false);

  const [bottom, setBottom] = useState(0);

  const [companyPrepayList, setCompanyPrepayList] = useState([]);
  const [totalPrepay, setTotalPrepay] = useState(0);
  const [cardPrepay, setCardPrepay] = useState(0);
  const [cashPrepay, setCashPrepay] = useState(0);
  const [corpPrepay, setCorpPrepay] = useState(0);

  const [companyCode, setCompanyCode] = useState(null);
  const [companyName, setCompanyName] = useState(null);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [keyword, setKeyword] = useState("");

  const [prepayCode, setPrepayCode] = useState(null);
  const [prepayList, setPrepayList] = useState([]);

  const handleSearch = e => {
    if (e.key === "Enter") {
      setSearchKeyword(e.target.value);
    }
  };

  useEffect(() => {
    setTitle("선입금 관리");

    //eslint-disable-next-line
  }, [thisLocation]);

  useEffect(() => {
    getPrepayList(searchKeyword);
    //eslint-disable-next-line
  }, [searchKeyword]);

  const getCompanyPrepayList = async (cCode, tType) => {
    setTotalPrepay(0);
    setCardPrepay(0);
    setCashPrepay(0);
    setCorpPrepay(0);
    setCompanyPrepayList([]);
    if (cCode === "cancel") {
      return true;
    }
    const data = {
      companyCode: cCode,
      transactionType: tType,
    };
    await axiosInstance
      .post("/api/v1/comp/prepay/list", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.data.code === "E999") {
          return false;
        }
        if (res.data.code === "E403") {
          return alert(res.data.message);
        }
        setTotalPrepay(res.data.prepay.prepayment);
        setCardPrepay(res.data.prepay.cardPrepayment);
        setCashPrepay(res.data.prepay.cashPrepayment);
        setCorpPrepay(res.data.prepay.corporatePrepayment);
        setCompanyPrepayList(res.data.prepayList);
      })
      .catch(e => console.log(e));
  };

  const getPrepayList = async keyword => {
    await prepayReset();
    let word = keyword;
    if (keyword === "") {
      word = null;
    }
    const data = {
      searchKeyword: word,
    };

    await axiosInstance
      .post("/api/v1/comp/prepay/complist", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.data.code === "E999") {
          logout();
          return false;
        }
        if (res.data.code === "E403") {
          return alert(res.data.message);
        }
        setPrepayList(res.data.prepayList);
      })
      .catch(e => console.log(e));
  };

  const prepayReset = () => {
    setPrepayList([]);
  };

  useEffect(() => {
    if (stickyRef.current) {
      const rect = stickyRef.current.getBoundingClientRect();
      const bottomY = rect.bottom; // 뷰포트 상단으로부터의 div 하단의 Y 좌표
      setBottom(bottomY);
    }
  }, [inputOn]);

  const logout = async () => {
    await axiosInstance
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

  return (
    <div className="mx-4" data={title}>
      <div
        ref={stickyRef}
        className="sticky top-0 left-0 z-50 bg-gray-50 pb-2 grid grid-cols-1 gap-x-2"
      >
        <div
          id="searchArea"
          className="flex flex-row justify-between flex-nowrap gap-x-4 p-2 bg-white rounded-lg drop-shadow w-full"
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
        </div>
        {user.admin ? (
          <div
            id="inputArea"
            className="bg-white p-2 border-b w-full h-fit rounded-lg drop-shadow mt-2"
          >
            <div
              className={`flex justify-between hover:cursor-pointer hover:bg-gray-100 hover:rounded-full relative px-2 ${
                inputOn && "mb-2"
              }`}
              onClick={() => {
                setInputOn(!inputOn);
              }}
            >
              <h3 className="text-center text-lg font-bold py-2 pl-2">
                추가/수정하기
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
              <InputPrePaid
                user={user}
                companyName={companyName}
                keyword={searchKeyword}
                companyCode={companyCode}
                setCompanyCode={setCompanyCode}
                prepayCode={prepayCode}
                setPrepayCode={setPrepayCode}
                setInputOn={setInputOn}
                getCompanyPrepayList={getCompanyPrepayList}
                getPrepayList={getPrepayList}
              />
            </div>
          </div>
        ) : null}
      </div>
      <div className="w-full mt-2">
        <PrepaidList
          user={user}
          inputOn={inputOn}
          prepayList={prepayList}
          bottom={bottom}
          companyCode={companyCode}
          setCompanyCode={setCompanyCode}
          setPrepayCode={setPrepayCode}
          setInputOn={setInputOn}
          setCompanyName={setCompanyName}
          companyPrepayList={companyPrepayList}
          totalPrepay={totalPrepay}
          cardPrepay={cardPrepay}
          cashPrepay={cashPrepay}
          corpPrepay={corpPrepay}
          getCompanyPrepayList={getCompanyPrepayList}
        />
      </div>
    </div>
  );
}

export default PrePaid;
