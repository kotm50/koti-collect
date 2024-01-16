import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";

import InputCompanyList from "./Card/InputCompanyList";
import InputCard from "./Card/InputCard";
import axios from "axios";
import { clearUser } from "../../Reducer/userSlice";

import sorry from "../../Asset/sorry.png";
import Cards from "./Card/Cards";

function CardList() {
  const navi = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const thisLocation = useLocation();
  const [title, setTitle] = useOutletContext();

  const [edit, setEdit] = useState(null);

  const [loaded, setLoaded] = useState(false);

  const comNameRef = useRef(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [companyListOn, setCompanyListOn] = useState(false);
  const [inputOn, setInputOn] = useState(false);
  const [cardList, setCardList] = useState([]);

  useEffect(() => {
    if (edit !== null) {
      setCompanyName(edit.companyBranch);
      setCompanyCode(edit.companyCode);
    }
  }, [edit]);
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

  // State to keep track of the timeout ID
  const [delayTimeout, setDelayTimeout] = useState(null);

  const handleDelay = e => {
    // If there's an existing timeout, clear it
    if (delayTimeout) {
      clearTimeout(delayTimeout);
    }

    // Create a new timeout
    const newTimeout = setTimeout(() => {
      setSearchKeyword(comNameRef.current.value);
      if (comNameRef.current.value === "") {
        setCompanyCode("");
      }
    }, 500); // 500 ms delay, adjust as needed

    // Set the new timeout ID
    setDelayTimeout(newTimeout);
  };
  useEffect(() => {
    setTitle("결제카드 관리");
    //eslint-disable-next-line
  }, [thisLocation]);

  useEffect(() => {
    if (companyCode === "") {
      setInputOn(false);
    } else {
      setInputOn(true);
    }
    getCardList(companyCode);
    //eslint-disable-next-line
  }, [companyCode]);

  const getCardList = async c => {
    setLoaded(false);
    let data = {
      companyCode: c === "" ? null : c,
    };
    await axios
      .post("/api/v1/comp/card/list", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        setCardList([]);
        if (res.data.code === "E999") {
          logout();
          return false;
        }
        if (res.data.code === "E403") {
          return alert(res.data.message);
        }
        if (res.data.code === "C000") {
          setCardList(res.data.cardList);
        }
        setLoaded(true);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const cancelSearch = () => {
    setCompanyCode("");
    setCompanyName("");
    setSearchKeyword("");
    setCompanyListOn(false);
  };

  return (
    <div className="mx-4" data={title}>
      <div className="sticky top-0 left-0 bg-gray-50 pb-2">
        <div className="flex flex-col justify-start gap-y-3 w-[360px] bg-white p-3 drop-shadow rounded-lg">
          <div className="text-lg font-bold">고객사 지점을 입력</div>
          <div className="w-full relative flex justify-start gap-x-1">
            <input
              type="text"
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              ref={comNameRef}
              value={companyName}
              placeholder="지점명/담당자명을 입력하세요"
              onChange={e => setCompanyName(e.currentTarget.value)}
              onKeyUp={handleDelay}
              data-comcode={companyCode}
              onFocus={() => {
                setCompanyListOn(true);
              }}
            />
            <button
              className="bg-gray-700 hover:bg-gray-500 text-white p-2 w-[100px]"
              onClick={() => {
                cancelSearch();
              }}
            >
              초기화
            </button>
          </div>
        </div>
        {companyListOn && (
          <InputCompanyList
            searchKeyword={searchKeyword}
            setCompanyCode={setCompanyCode}
            setCompanyName={setCompanyName}
            setCompanyListOn={setCompanyListOn}
          />
        )}
        {user.admin ? (
          <div className="bg-white p-2 border-b w-full h-fit rounded-lg drop-shadow mt-2">
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
              <InputCard
                cancelSearch={cancelSearch}
                companyName={companyName}
                companyCode={companyCode}
                getCardList={getCardList}
                edit={edit}
                setEdit={setEdit}
                setInputOn={setInputOn}
                setCompanyCode={setCompanyCode}
                setCompanyName={setCompanyName}
              />
            </div>
          </div>
        ) : null}
      </div>
      {loaded ? (
        <>
          {cardList.length > 0 ? (
            <Cards cardList={cardList} setEdit={setEdit} />
          ) : (
            <div className="text-2xl text-bold text-center">
              <img
                src={sorry}
                className="mx-auto w-[240px] h-auto mb-5 mt-20"
                alt="오류"
              />
              조회 된 내용이 없습니다
            </div>
          )}
        </>
      ) : (
        <div className="text-2xl text-center font-bold">
          잠시만 기다려 주세요...
        </div>
      )}
    </div>
  );
}

export default CardList;
