import React, { useEffect, useRef, useState } from "react";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import InputCharge from "./Charge/InputCharge";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import CommissionList from "./Charge/CommissionList";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../Api/axiosInstance";
import { clearUser } from "../../Reducer/userSlice";
import MonthButton from "./Charge/MonthButton";
import InputDeposit from "./Charge/InputDeposit";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 로케일 import
import MemoModal from "../Layout/MemoModal";
import TodayPayList from "./Charge/TodayPayList";

function UnReceive() {
  const stickyRef = useRef(null);
  const navi = useNavigate();
  const thisLocation = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [title, setTitle] = useOutletContext();
  const [inputOn, setInputOn] = useState(false);
  const [testNum, setTestNum] = useState(null);

  const [year, setYear] = useState(dayjs(new Date()).format("YYYY"));
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const [isUnpaid, setIsUnpaid] = useState("N");

  const [searchKeyword, setSearchKeyword] = useState("");
  const [keyword, setKeyword] = useState("");

  const [feeList, setFeeList] = useState([]);
  const [sortedList, setSortedList] = useState([]);

  const [commCode, setCommCode] = useState(null);
  const [payCode, setPayCode] = useState(null);

  const [loaded, setLoaded] = useState(false);

  const [paid, setPaid] = useState(null);
  const [unPaid, setUnPaid] = useState(null);

  const [memo, setMemo] = useState("");
  const [modalOn, setModalOn] = useState(false);

  const [todayOn, setTodayOn] = useState(false);
  const [todayList, setTodayList] = useState([]);

  const [sortA, setSortA] = useState("");
  const [sortB, setSortB] = useState("");

  const [sorting, setSorting] = useState(false);

  const handleSearch = e => {
    if (e.key === "Enter") {
      setSearchKeyword(e.target.value);
      setCommCode(null);
      setPayCode(null);
    }
  };

  const handleYear = e => {
    setYear(e.target.value);
    setIsUnpaid("N");
  };

  const resetCharge = async () => {
    const code = commCode;
    setCommCode(null);
    setTimeout(() => {
      setCommCode(code);
    }, 100);
  };

  useEffect(() => {
    setTitle("수수료 관리");
    //eslint-disable-next-line
  }, [thisLocation]);

  useEffect(() => {
    initializer();
    //eslint-disable-next-line
  }, [isUnpaid, month, year, searchKeyword]);

  const initializer = async () => {
    getFeeList(month, year, searchKeyword);
    getTodayList();
  };

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

  const loadReset = () => {
    setLoaded(false);
  };

  const feeReset = () => {
    setFeeList([]);
  };

  const getFeeList = async (month, year, keyword) => {
    await loadReset();
    await feeReset();
    let commission;
    if (isUnpaid === "N") {
      commission = {
        hireStartMonth: String(month),
        hireStartYear: String(year),
        commStatus: isUnpaid,
      };
    } else {
      commission = {
        hireStartMonth: String(new Date().getMonth() + 1),
        hireStartYear: String(dayjs(new Date()).format("YYYY")),
        commStatus: isUnpaid,
      };
    }
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
    await axiosInstance
      .post("/api/v1/comp/get/ad", reqData, {
        headers: { Authorization: user.accessToken },
      })
      .then(async res => {
        let unPaid = res.data.commission;
        if (
          unPaid.unpaidAd === 0 &&
          unPaid.unpaidComm === 0 &&
          unPaid.unpaidCommCare === 0 &&
          unPaid.unpaidIntvCare === 0
        ) {
          unPaid = null;
        }
        const commisionList = res.data.commissionList;
        setPaid(res.data.pay || null);
        setUnPaid(unPaid);
        setFeeList(commisionList);
        setLoaded(true);
      })
      .catch(e => console.log(e));
  };

  const getTodayList = async () => {
    setTodayList([]);

    await axiosInstance
      .post("/api/v1/comp/today/pay/info/list", null, {
        headers: { Authorization: user.accessToken },
      })
      .then(async res => {
        if (res.data.code === "E403") {
          return alert(res.data.message);
        }
        setTodayList(res.data.payList);
      })
      .catch(e => console.log(e));
  };

  const handleUnpaidChk = e => {
    setIsUnpaid(e.target.value);
  };

  const sortIt = txt => {
    if (sortA !== txt) {
      setSortA(txt);
      setSortB("asc");
    } else if (sortB === "asc") {
      setSortB("desc");
    } else {
      setSortA("");
      setSortB("");
    }
  };

  useEffect(() => {
    setSorting(true);
    if (sortA === "") {
      setSortedList([]);
    } else {
      const sortedList = [...feeList].sort((a, b) => {
        const valA = a[sortA];
        const valB = b[sortA];
        console.log(valA);
        console.log(valB);
        // 값이 null인 경우 무조건 뒤로 보냄
        if (valA === null) return 1;
        if (valB === null) return -1;

        // 값이 null이 아닌 경우 기존 정렬 로직 수행
        if (valA < valB) return sortB === "desc" ? 1 : -1;
        if (valA > valB) return sortB === "desc" ? -1 : 1;
        return 0;
      });
      setSortedList(sortedList);
    }
    setSorting(false);
    //eslint-disable-next-line
  }, [sortA, sortB]);

  return (
    <div className="mx-4" data={title}>
      {user.admin ? (
        <div className="w-[1280px] h-[88px] fixed top-0 right-0 py-2 px-4 grid grid-cols-2 z-50 gap-x-2 font-medium bg-gray-50">
          {unPaid !== null ? (
            <table className="w-full">
              <thead>
                <tr className="bg-rose-500 text-white">
                  <td className="p-1 border text-center">미수금 합계</td>
                  <td className="p-1 border text-center">광고비 미수금</td>
                  <td className="p-1 border text-center">면케 미수금</td>
                  <td className="p-1 border text-center">위케 미수금</td>
                  <td className="p-1 border text-center">위촉비 미수금</td>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="p-1 border bg-rose-50 text-right font-bold">
                    {Number(
                      unPaid.unpaidAd +
                        unPaid.unpaidComm +
                        unPaid.unpaidIntvCare +
                        unPaid.unpaidCommCare
                    ).toLocaleString()}{" "}
                    원
                  </td>
                  <td className="p-1 border text-right">
                    {Number(unPaid.unpaidAd).toLocaleString()} 원
                  </td>
                  <td className="p-1 border text-right">
                    {Number(unPaid.unpaidIntvCare).toLocaleString()} 원
                  </td>
                  <td className="p-1 border text-right">
                    {Number(unPaid.unpaidCommCare).toLocaleString()} 원
                  </td>
                  <td className="p-1 border text-right">
                    {Number(unPaid.unpaidComm).toLocaleString()} 원
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-rose-500 text-white">
                  <td className="p-1 border text-center">미수금 합계</td>
                  <td className="p-1 border text-center">광고비 미수금</td>
                  <td className="p-1 border text-center">면케 미수금</td>
                  <td className="p-1 border text-center">위케 미수금</td>
                  <td className="p-1 border text-center">위촉비 미수금</td>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="p-1 border bg-rose-50 text-right font-bold">
                    0 원
                  </td>
                  <td className="p-1 border text-right">0 원</td>
                  <td className="p-1 border text-right">0 원</td>
                  <td className="p-1 border text-right">0 원</td>
                  <td className="p-1 border text-right">0 원</td>
                </tr>
              </tbody>
            </table>
          )}
          {paid !== null ? (
            <table className="w-full">
              <thead>
                <tr className="bg-green-600 text-white">
                  <td className="p-1 border text-center">수금 합계</td>
                  <td className="p-1 border text-center">광고비 수금</td>
                  <td className="p-1 border text-center">면케 수금</td>
                  <td className="p-1 border text-center">위케 수금</td>
                  <td className="p-1 border text-center">위촉비 수금</td>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="p-1 border bg-rose-50 text-right font-bold">
                    {Number(
                      paid.paidAd +
                        paid.paidComm +
                        paid.paidIntvCare +
                        paid.paidCommCare
                    ).toLocaleString()}{" "}
                    원
                  </td>
                  <td className="p-1 border text-right">
                    {Number(paid.paidAd).toLocaleString()} 원
                  </td>
                  <td className="p-1 border text-right">
                    {Number(paid.paidIntvCare).toLocaleString()} 원
                  </td>
                  <td className="p-1 border text-right">
                    {Number(paid.paidCommCare).toLocaleString()} 원
                  </td>
                  <td className="p-1 border text-right">
                    {Number(paid.paidComm).toLocaleString()} 원
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-green-600 text-white">
                  <td className="p-1 border text-center">수금 합계</td>
                  <td className="p-1 border text-center">광고비 수금</td>
                  <td className="p-1 border text-center">위촉비 수금</td>
                  <td className="p-1 border text-center">면케 수금</td>
                  <td className="p-1 border text-center">위케 수금</td>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="p-1 border bg-rose-50 text-right font-bold">
                    0원
                  </td>
                  <td className="p-1 border text-right">0원</td>
                  <td className="p-1 border text-right">0원</td>
                  <td className="p-1 border text-right">0원</td>
                  <td className="p-1 border text-right">0원</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      ) : null}

      <div ref={stickyRef} className="bg-gray-50 pb-2 grid grid-cols-2 gap-x-2">
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
              commCode={commCode}
              setCommCode={setCommCode}
              month={month}
              year={year}
              searchKeyword={searchKeyword}
              isUnpaid={isUnpaid}
              setMemo={setMemo}
              setModalOn={setModalOn}
              resetCharge={resetCharge}
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
              commCode={commCode}
              setCommCode={setCommCode}
              payCode={payCode}
              setPayCode={setPayCode}
              month={month}
              year={year}
              searchKeyword={searchKeyword}
              isUnpaid={isUnpaid}
              logout={logout}
              testNum={testNum}
              resetCharge={resetCharge}
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
            <select
              className="px-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-[100px] rounded"
              value={year}
              onChange={handleYear}
            >
              <option value="2023">2023년</option>
              <option value="2024">2024년</option>
            </select>
            <div className="grid grid-cols-12 gap-x-1">
              <MonthButton
                month={month}
                setMonth={setMonth}
                isUnpaid={isUnpaid}
                setIsUnpaid={setIsUnpaid}
              />
            </div>
          </div>
          <div className="flex flex-row justify-start gap-x-1">
            <select
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              value={isUnpaid}
              onChange={handleUnpaidChk}
            >
              <option value="N">월별 조회</option>
              <option value="Y">미수금 전체 조회</option>
              <option value="L">미수금 조회</option>
              <option value="B">발행 미수금 조회</option>
              <option value="F">면세 조회</option>
              <option value="S">예정 7일</option>
              <option value="V">예정 5일</option>
              <option value="U">예정 4일</option>
              <option value="T">예정 3일</option>
              <option value="W">예정 2일</option>
              <option value="O">예정 1일</option>
              <option value="C">금일 조회</option>
            </select>
          </div>
        </div>
      </div>
      <div className="w-full mt-2 mb-20">
        <CommissionList
          user={user}
          feeList={feeList}
          inputOn={inputOn}
          payCode={payCode}
          commCode={commCode}
          setCommCode={setCommCode}
          setPayCode={setPayCode}
          loading={loaded}
          setInputOn={setInputOn}
          setTestNum={setTestNum}
          sortIt={sortIt}
          sortA={sortA}
          sortB={sortB}
          sortedList={sortedList}
          sorting={sorting}
        />
      </div>
      <button
        className={`fixed transition-all duration-300 right-[60px] ${
          !todayOn ? "bottom-0" : "bottom-[320px]"
        } w-[48px] h-[48px] bg-indigo-500 hover:bg-indigo-700 text-white border flex justify-center items-center`}
        onClick={() => setTodayOn(!todayOn)}
        style={{ zIndex: "999999" }}
      >
        {!todayOn ? <FaCaretUp size={32} /> : <FaCaretDown size={32} />}
      </button>
      <div
        className={`transition-all duration-300 fixed bottom-0 right-2 ${
          todayOn ? "h-[320px] border-t border-x overflow-auto p-2" : "h-1"
        } bg-white`}
        style={{ zIndex: "999999", width: "calc(100% - 250px)" }}
      >
        <div className="flex justify-start gap-x-3 items-center mb-3">
          <h4 className="text-lg font-bold">입금내역</h4>
          {todayOn ? (
            <button
              className="p-1 bg-violet-500 hover:bg-violet-700 text-white"
              onClick={() => getTodayList()}
            >
              새로고침
            </button>
          ) : null}

          <span className="p-1 text-sm">
            목록이 갱신되지 않으면 새로고침 버튼을 눌러주세요
          </span>
        </div>
        <TodayPayList
          todayList={todayList}
          payCode={payCode}
          commCode={commCode}
          setCommCode={setCommCode}
          setPayCode={setPayCode}
          setInputOn={setInputOn}
        />
      </div>
      {modalOn && <MemoModal memo={memo} setModalOn={setModalOn} />}
    </div>
  );
}

export default UnReceive;
