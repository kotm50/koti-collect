import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../../../Api/axiosInstance";

import sorry from "../../../Asset/sorry.png";
import StatisticsDetail from "./StatisticsDetail";

import dayjs from "dayjs";
import Calendar from "react-calendar";
import { FaCalendarAlt } from "react-icons/fa";

function Statistics(props) {
  const navi = useNavigate();
  const [statisticsList, setStatisticsList] = useState([]);
  const [payTitle, setPayTitle] = useState("");
  const [payType, setPayType] = useState("");
  const [year, setYear] = useState(dayjs(new Date(props.date)).format("YYYY"));
  const [month, setMonth] = useState(dayjs(new Date(props.date)).format("MM"));
  const [day, setDay] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [withdraw, setWithdraw] = useState(0);

  const [calendarDate1, setCalendarDate1] = useState("");
  const [calendarDate2, setCalendarDate2] = useState("");
  const [startCalendarOn, setStartCalendarOn] = useState(false);
  const [endCalendarOn, setEndCalendarOn] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startKeyword, setStartKeyword] = useState("");
  const [endKeyword, setEndKeyword] = useState("");

  const [searchKeyword, setSearchKeyword] = useState("");

  const handlePayType = e => {
    setPayType(e.target.value);
    getStatisticsList(year, month, day, e.target.value);
  };

  useEffect(() => {
    changeDate();
    //eslint-disable-next-line
  }, [props.date]);

  useEffect(() => {
    if (calendarDate1 !== "") {
      const startDate1 = dayjs(calendarDate1).format("YYYY년 MM월 DD일");
      const startDate2 = dayjs(calendarDate1).format("YYYY-MM-DD");
      setStartCalendarOn(false);
      setStartDate(startDate1);
      setStartKeyword(startDate2);
    }
    if (calendarDate2 !== "") {
      const endDate1 = dayjs(calendarDate2).format("YYYY년 MM월 DD일");
      const endDate2 = dayjs(calendarDate2).format("YYYY-MM-DD");
      setEndCalendarOn(false);
      setEndDate(endDate1);
      setEndKeyword(endDate2);
    }
  }, [calendarDate1, calendarDate2]);

  const changeDate = async () => {
    if (props.date !== "") {
      const date = dayjs(new Date(props.date)).format("YYYY-MM-DD");
      const year = dayjs(new Date(props.date)).format("YYYY");
      const month = dayjs(new Date(props.date)).format("MM");
      const day = dayjs(new Date(props.date)).format("DD");
      await setYearMonth(year, month);
      await changeList(year, month, day, date);
      setYear(year);
      setMonth(month);
      setDay(day);
      getStatisticsList(year, month, day, payType);
    } else {
      setYear("");
      setMonth("");
      setDay("");
    }
  };

  const searchIt = async () => {
    setStatisticsList([]);
    const data = {
      searchKeyword: searchKeyword === "" ? null : searchKeyword,
      searchStartDate: startKeyword === "" ? null : startKeyword,
      searchEndDate: endKeyword === "" ? null : endKeyword,
    };
    await axiosInstance
      .post("/api/v1/comp/paytype/list", data, {
        headers: { Authorization: props.user.accessToken },
      })
      .then(async res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          navi("/");
          return false;
        }
        //await getTotal(res.data.statisticsList);
        setDeposit(res.data.totalPaymentP || 0);
        setWithdraw(res.data.totalPaymentD || 0);
        setTotalCost(res.data.totalPayment || 0);
        await setStatisticsList(res.data.statisticsList || []);
      })
      .catch(e => console.log(e));
  };

  const reset = () => {
    window.location.reload();
  };

  const setYearMonth = (year, month) => {
    props.setYear(year);
    props.setMonth(month);
  };

  const changeList = async (year, month, day, date) => {
    await getStatisticsList(year, month, day);
    props.setDate(date);
  };

  useEffect(() => {
    if (props.year !== year) {
      setYear(String(props.year));
      props.setCalendarDate("");
      props.setDate("");
      setDay("");
      setMonth("");
      resetIt();
    }
    if (props.month !== "" || props.month !== month) {
      setMonth(String(props.month));
      props.setCalendarDate("");
      props.setDate("");
      setDay("");
      resetIt();
    }
    getStatisticsList(props.year, props.month, "", payType);
    //eslint-disable-next-line
  }, [props.year, props.month]);

  const resetIt = () => {
    setSearchKeyword("");
    setCalendarDate1("");
    setCalendarDate2("");
    setStartDate("");
    setEndDate("");
    setStartKeyword("");
    setEndKeyword("");
  };

  useEffect(() => {
    setPayTitle(getPayTitle(payType));
  }, [payType]);

  const getPayTitle = payType => {
    if (payType === "CA") {
      return "현금(개인)";
    } else if (payType === "CO") {
      return "현금(법인)";
    } else if (payType === "PG") {
      return "카드(PG)";
    } else if (payType === "MO") {
      return "카드(몬)";
    } else if (payType === "HE") {
      return "카드(천국)";
    } else if (payType === "PR") {
      return "선입금";
    } else {
      return "전체";
    }
  };

  const getStatisticsList = async (year, month, day, payType) => {
    await setStatisticsList([]);
    setTotalCost(0);
    setDeposit(0);
    setWithdraw(0);
    let pType = payType;
    if (payType === "") {
      pType = null;
    }
    let data = {
      searchKeyword: searchKeyword === "" ? null : searchKeyword,
      payType: pType,
      searchYear: year,
      searchMonth: month === "" ? null : month,
      searchDay: day === "" ? null : day,
    };
    await axiosInstance
      .post("/api/v1/comp/paytype/list", data, {
        headers: { Authorization: props.user.accessToken },
      })
      .then(async res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          navi("/");
          return false;
        }
        console.log(res);
        //await getTotal(res.data.statisticsList);
        setDeposit(res.data.totalPaymentP || 0);
        setWithdraw(res.data.totalPaymentD || 0);
        setTotalCost(res.data.totalPayment || 0);
        await setStatisticsList(res.data.statisticsList || []);
      })
      .catch(e => console.log(e));
  };

  //합계구하는거 (이제 안씀)
  /*
  const getTotal = list => {
    let depositCost = 0;
    let withdrawCost = 0;
    list.forEach(doc => {
      let cost = doc.payment;
      if (doc.payType === "CA" || doc.payType === "CO") {
        if (doc.taxBillStatus === "Y") {
          Math.round(cost / 1.1);
        }
        if (doc.transactionType === "P") {
          depositCost = depositCost + cost;
        } else {
          withdrawCost = withdrawCost + cost;
        }
      } else {
        Math.round(cost / 1.1);
        if (doc.transactionType === "P") {
          depositCost = depositCost + cost;
        } else {
          withdrawCost = withdrawCost + cost;
        }
      }
    });
    let total = depositCost - withdrawCost;
    setDeposit(depositCost);
    setWithdraw(withdrawCost);
    setTotalCost(total);
  };
  */
  return (
    <>
      {props.searchOn ? (
        <div className="flex justify-start gap-x-10 py-2 px-4 bg-white rounded-lg drop-shadow-lg relative z-10 mt-4">
          <div
            className="flex justify-start gap-x-3"
            onClick={() => props.setCalendarOn(false)}
          >
            <span className="font-bold whitespace-nowrap py-2">검색</span>
            <input
              type="text"
              className="p-2 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.currentTarget.value)}
            />
          </div>
          <div className="flex justify-start gap-x-3">
            <span
              className="font-bold whitespace-nowrap py-2"
              onClick={() => props.setCalendarOn(false)}
            >
              날짜 선택
            </span>
            <div className="relative min-w-[350px]">
              {startCalendarOn ? (
                <div className="calendarArea top-2 left-0 w-fit h-fit">
                  <button
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white p-2 mb-1"
                    onClick={() => setStartCalendarOn(false)}
                  >
                    닫기
                  </button>
                  <Calendar onChange={setCalendarDate1} value={calendarDate1} />
                </div>
              ) : (
                <div
                  className="border p-2 hover:cursor-pointer flex flex-row justify-start gap-x-2"
                  onClick={() => setStartCalendarOn(true)}
                >
                  <FaCalendarAlt size={24} />
                  {startDate === "" ? (
                    <span className="ml-2">시작일을 골라주세요</span>
                  ) : (
                    <span className="ml-2">시작일 : {startDate}</span>
                  )}
                  {startDate !== "" && (
                    <span className="text-gray-400">(변경하려면 클릭)</span>
                  )}
                </div>
              )}
            </div>
            <div className="relative min-w-[350px]">
              {endCalendarOn ? (
                <div className="calendarArea top-2 left-0 w-fit h-fit">
                  <button
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white p-2 mb-1"
                    onClick={() => setEndCalendarOn(false)}
                  >
                    닫기
                  </button>
                  <Calendar onChange={setCalendarDate2} value={calendarDate2} />
                </div>
              ) : (
                <div
                  className="border p-2 hover:cursor-pointer flex flex-row justify-start gap-x-2"
                  onClick={() => setEndCalendarOn(true)}
                >
                  <FaCalendarAlt size={24} />
                  {endDate === "" ? (
                    <span className="ml-2">종료일을 골라주세요</span>
                  ) : (
                    <span className="ml-2">종료일 : {endDate}</span>
                  )}
                  {endDate !== "" && (
                    <span className="text-gray-400">(변경하려면 클릭)</span>
                  )}
                </div>
              )}
            </div>
            <button
              className="bg-indigo-500 hover:bg-indigo-700 text-white py-2 px-4"
              onClick={searchIt}
            >
              검색하기
            </button>
            <button
              className="text-rose-500 hover:text-rose-700 hover:bg-gray-100 border border-rose-500 hover:border-rose-700  py-2 px-4"
              onClick={() => reset()}
            >
              초기화
            </button>
          </div>
          <div></div>
        </div>
      ) : null}

      <div
        className="p-4 bg-white drop-shadow-lg rounded-lg mt-4"
        onClick={() => props.setCalendarOn(false)}
      >
        <div className="h-[640px] overflow-y-auto relative">
          {statisticsList.length > 0 ? (
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr>
                  <td colSpan="14" className="border border-white">
                    <div className="flex justify-between py-2 pr-2">
                      <h3 className="font-bold text-xl">
                        {payTitle} 결제 내역 | 조회기간 : {year}년{" "}
                        {month !== "" ? month + "월 " : null}
                        {day !== "" ? day + "일 " : null}
                      </h3>
                      {totalCost !== 0 ? (
                        <span className="text-xl font-medium">
                          수금 합계 :{" "}
                          <span className="text-green-600 font-bold">
                            {deposit.toLocaleString()}
                          </span>
                          원 | 환급 합계 :{" "}
                          <span className="text-rose-600 font-bold">
                            {withdraw.toLocaleString()}
                          </span>
                          원 | 총 합계 :{" "}
                          <span className="text-stone-900 font-bold">
                            {totalCost.toLocaleString()}
                          </span>
                          원
                        </span>
                      ) : null}
                      <select
                        className="px-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-[144px] rounded"
                        value={payType}
                        onChange={handlePayType}
                      >
                        <option value="">결제방식 선택</option>
                        <option value="CA">개인</option>
                        <option value="CO">법인</option>
                        <option value="MO">몬카드</option>
                        <option value="HE">천국카드</option>
                        <option value="PG">PG카드</option>
                      </select>
                    </div>
                  </td>
                </tr>
                <tr className="bg-green-600 text-white text-center">
                  <td className="border p-2">구분</td>
                  <td className="border p-2">날짜</td>
                  <td className="border p-2">고객사</td>
                  <td className="border p-2">지점</td>
                  <td className="border p-2">결제방식</td>
                  <td className="border p-2">금액</td>
                  <td className="border p-2">공급가액</td>
                  <td className="border p-2">부가세</td>
                  <td className="border p-2">입금자명</td>
                  <td className="border p-2">카드사</td>
                  <td className="border p-2">카드번호</td>
                  <td className="border p-2">유효기간</td>
                  <td className="border p-2">비밀번호</td>
                  <td className="border p-2">비고</td>
                </tr>
              </thead>
              <tbody>
                {statisticsList.map((statistics, idx) => (
                  <React.Fragment key={idx}>
                    <StatisticsDetail
                      user={props.user}
                      statistics={statistics}
                      idx={idx}
                      memo={props.memo}
                      setMemo={props.setMemo}
                      setModalOn={props.setModalOn}
                    />
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <>
              <div className="flex justify-between py-2 pr-2">
                <h3 className="font-bold text-xl">
                  {payTitle} 결제 내역 | 조회기간 : {year}년{" "}
                  {month !== "" ? month + "월 " : null}
                  {day !== "" ? day + "일 " : null}
                </h3>
                {totalCost !== 0 ? (
                  <span className="text-xl font-medium">
                    수금액 :{" "}
                    <span className="text-green-600 font-bold">
                      {deposit.toLocaleString()}
                    </span>
                    원 | 환급액 :{" "}
                    <span className="text-rose-600 font-bold">
                      {withdraw.toLocaleString()}
                    </span>
                    원 | 합계 :{" "}
                    <span className="text-stone-900 font-bold">
                      {totalCost.toLocaleString()}
                    </span>
                    원
                  </span>
                ) : null}
                <select
                  className="px-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-[144px] rounded"
                  value={payType}
                  onChange={handlePayType}
                >
                  <option value="">결제방식 선택</option>
                  <option value="CA">현금</option>
                  <option value="CO">법인</option>
                  <option value="PG">PG카드</option>
                  <option value="MO">몬카드</option>
                  <option value="HE">천국카드</option>
                </select>
              </div>
              <div className="text-2xl text-bold text-center h-fit p-4">
                <img
                  src={sorry}
                  className="mx-auto w-auto h-[150px] mb-3"
                  alt="오류"
                />
                조회 된 내용이 없습니다
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Statistics;
