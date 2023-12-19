import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

import sorry from "../../../Asset/sorry.png";
import StatisticsDetail from "./StatisticsDetail";

function Statistics(props) {
  const navi = useNavigate();
  const [statisticsList, setStatisticsList] = useState([]);
  const [payTitle, setPayTitle] = useState("");
  const [payType, setPayType] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [withdraw, setWithdraw] = useState(0);

  const handlePayType = e => {
    setPayType(e.target.value);
  };

  useEffect(() => {
    if (props.date !== "") {
      const year = dayjs(new Date(props.date)).format("YYYY");
      const month = dayjs(new Date(props.date)).format("MM");
      const day = dayjs(new Date(props.date)).format("DD");
      setYear(year);
      setMonth(month);
      props.setYear("");
      props.setMonth("");
      setDay(day);
    } else {
      setYear(dayjs(new Date()).format("YYYY"));
      setMonth("");
      setDay("");
    }
    //eslint-disable-next-line
  }, [props.date]);

  useEffect(() => {
    setYear(props.year);
    if (props.year !== "") {
      props.setCalendarDate("");
      setDay("");
      setMonth("");
    }
    //eslint-disable-next-line
  }, [props.year]);

  useEffect(() => {
    setMonth(props.month);
    if (props.month !== "") {
      props.setCalendarDate("");
      setDay("");
    }
    //eslint-disable-next-line
  }, [props.month]);

  useEffect(() => {
    console.log(year, month, day, payType);
    getStatisticsList(year, month, day, payType);
    //eslint-disable-next-line
  }, [year, month, day, payType]);

  useEffect(() => {
    setPayTitle(getPayTitle(payType));
  }, [payType]);

  const getPayTitle = payType => {
    if (payType === "CA") {
      return "현금(개인)";
    } else if (payType === "CO") {
      return "현금(법인)";
    } else if (payType === "PG") {
      return "PG카드";
    } else if (payType === "MO") {
      return "알바몬카드";
    } else if (payType === "HE") {
      return "현금(개인)";
    } else {
      return "전체";
    }
  };

  const getStatisticsList = async (year, month, day, payType) => {
    await setStatisticsList([]);
    let pType = payType;
    if (payType === "") {
      pType = null;
    }
    let data = {
      payType: pType,
      searchYear: year,
      searchMonth: month === "" ? null : month,
      searchDay: day === "" ? null : day,
    };
    console.log("통합 리퀘", data);
    await axios
      .post("/api/v1/comp/paytype/list", data, {
        headers: { Authorization: props.user.accessToken },
      })
      .then(async res => {
        console.log("통합", res);
        if (res.data.code === "E999" || res.data.code === "E403") {
          navi("/");
          return false;
        }
        await getTotal(res.data.statisticsList);
        await setStatisticsList(res.data.statisticsList);
      })
      .catch(e => console.log(e));
  };

  const getTotal = list => {
    let depositCost = 0;
    let withdrawCost = 0;
    list.forEach(doc => {
      let cost = doc.payment;
      if (doc.payType === "CA" || doc.payType === "CO") {
        if (doc.taxBillYn === "Y") {
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
    console.log("환급액", withdrawCost);
    console.log("수금액", depositCost);
    setDeposit(depositCost);
    setWithdraw(withdrawCost);
    setTotalCost(total);
  };
  return (
    <>
      {statisticsList.length > 0 ? (
        <table className="w-full">
          <thead className="sticky top-0 bg-white">
            <tr>
              <td colSpan="14" className="border border-white">
                <div className="flex justify-between py-2 pr-2">
                  <h3 className="font-bold text-xl">
                    {payTitle} 결제 내역 | 기간 -{year}년{" "}
                    {month !== "" ? month + "월 " : null}
                    {day !== "" ? day + "일 " : null}
                  </h3>
                  {totalCost > 0 ? (
                    <span className="text-base font-medium">
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
        <div className="text-2xl text-bold text-center h-full p-4">
          <img
            src={sorry}
            className="mx-auto w-auto h-[150px] mb-3"
            alt="오류"
          />
          조회 된 내용이 없습니다
        </div>
      )}
    </>
  );
}

export default Statistics;
