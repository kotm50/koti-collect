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
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 로케일 import

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
  const [payList, setPayList] = useState([]);

  const [commCode, setCommCode] = useState(null);
  const [payCode, setPayCode] = useState(null);

  const [loaded, setLoaded] = useState(false);

  const [paid, setPaid] = useState(null);
  const [unPaid, setUnPaid] = useState(null);

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

  useEffect(() => {
    setTitle("수수료 관리");
    //eslint-disable-next-line
  }, [thisLocation]);

  useEffect(() => {
    getFeeList(month, year, searchKeyword);
    //eslint-disable-next-line
  }, [isUnpaid, month, year, searchKeyword]);

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

  const loadReset = () => {
    setLoaded(false);
  };

  const feeReset = () => {
    setFeeList([]);
  };

  const getFeeList = async (month, year, keyword) => {
    await loadReset();
    await feeReset();
    let commission = {
      hireStartMonth: String(month),
      hireStartYear: String(year),
      commStatus: isUnpaid,
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
    await axios
      .post("/api/v1/comp/get/ad", reqData, {
        headers: { Authorization: user.accessToken },
      })
      .then(async res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          logout();
          return false;
        }
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

  const handleUnpaidChk = e => {
    setIsUnpaid(e.target.value);
  };

  const resetPayList = () => {
    setPayList([]);
  };

  const getPayList = async commCode => {
    await resetPayList();
    const data = {
      commCode: commCode,
    };
    await axios
      .post("/api/v1/comp/get/pay/list", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          navi("/");
          return false;
        }
        setPayList(res.data.payList);
      })
      .catch(e => console.log(e));
  };

  return (
    <div className="mx-4" data={title}>
      <div className="w-[1280px] h-[88px] fixed top-0 right-0 py-2 px-4 grid grid-cols-2 z-10 gap-x-2 font-medium bg-gray-50">
        {unPaid !== null ? (
          <table className="w-full">
            <thead>
              <tr className="bg-rose-500 text-white">
                <td className="p-1 border text-center">미수금 합계</td>
                <td className="p-1 border text-center">광고비 미수금</td>
                <td className="p-1 border text-center">위촉비 미수금</td>
                <td className="p-1 border text-center">면케 미수금</td>
                <td className="p-1 border text-center">위케 미수금</td>
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
                  {Number(unPaid.unpaidComm).toLocaleString()} 원
                </td>
                <td className="p-1 border text-right">
                  {Number(unPaid.unpaidIntvCare).toLocaleString()} 원
                </td>
                <td className="p-1 border text-right">
                  {Number(unPaid.unpaidCommCare).toLocaleString()} 원
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
                <td className="p-1 border text-center">위촉비 미수금</td>
                <td className="p-1 border text-center">면케 미수금</td>
                <td className="p-1 border text-center">위케 미수금</td>
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
                <td className="p-1 border text-center">위촉비 수금</td>
                <td className="p-1 border text-center">면케 수금</td>
                <td className="p-1 border text-center">위케 수금</td>
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
                  {Number(paid.paidComm).toLocaleString()} 원
                </td>
                <td className="p-1 border text-right">
                  {Number(paid.paidIntvCare).toLocaleString()} 원
                </td>
                <td className="p-1 border text-right">
                  {Number(paid.paidCommCare).toLocaleString()} 원
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
              getPayList={getPayList}
              testNum={testNum}
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
              <option value="Y">미수금만 조회</option>
              <option value="S">시작 7일 전까지 조회</option>
              <option value="T">시작 3일 전까지 조회</option>
              <option value="O">시작 1일 전까지 조회</option>
            </select>
          </div>
        </div>
      </div>
      <div className="w-full mt-2 mb-20">
        <CommissionList
          user={user}
          feeList={feeList}
          inputOn={inputOn}
          payList={payList}
          getPayList={getPayList}
          commCode={commCode}
          setCommCode={setCommCode}
          setPayCode={setPayCode}
          loading={loaded}
          setInputOn={setInputOn}
          setTestNum={setTestNum}
        />
      </div>
    </div>
  );
}

export default UnReceive;
