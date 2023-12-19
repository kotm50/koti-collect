import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

import sorry from "../../../Asset/sorry.png";
import DailyDetail from "./DailyDetail";

function Daily(props) {
  const navi = useNavigate();
  const [dailyList, setDailyList] = useState([]);
  const [payTitle, setPayTitle] = useState("");
  const [payType, setPayType] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  const handlePayType = e => {
    setPayType(e.target.value);
  };

  useEffect(() => {
    let now;
    if (props.date === "") {
      now = new Date();
    } else {
      now = props.date;
    }
    const year = dayjs(now).format("YYYY");
    const month = dayjs(now).format("MM");
    const day = dayjs(now).format("DD");
    setYear(year);
    setMonth(month);
    setDay(day);
    getDailyList(year, month, day, payType);
    //eslint-disable-next-line
  }, [props.date]);

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

  const getDailyList = async (year, month, day, payType) => {
    let pType = payType;
    if (payType === "") {
      pType = null;
    }
    let data = {
      payType: pType,
      searchYear: year,
      searchMonth: month,
      searchDay: day,
    };
    console.log(data);
    await axios
      .post("/api/v1/comp/paytype/list", data, {
        headers: { Authorization: props.user.accessToken },
      })
      .then(async res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          navi("/");
          return false;
        }
        setDailyList(res.data.statisticsList);
      })
      .catch(e => console.log(e));
  };
  return (
    <>
      {dailyList.length > 0 ? (
        <table className="w-full">
          <thead className="sticky top-0 bg-white">
            <tr>
              <td colSpan="13" className="border border-white">
                <div className="flex justify-between py-2 pr-2">
                  <h3 className="font-bold text-xl">
                    {year}년 {month}월 {day}일 {payTitle} 결제내역
                  </h3>
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
              <td className="border p-2">날짜</td>
              <td className="border p-2">고객사</td>
              <td className="border p-2">지점</td>
              <td className="border p-2">결제방식</td>
              <td className="border p-2">금액</td>
              <td className="border p-2">공급가액</td>
              <td className="border p-2">부가세</td>
              <td className="border p-2">카드사</td>
              <td className="border p-2">카드번호</td>
              <td className="border p-2">카드소유주</td>
              <td className="border p-2">유효기간</td>
              <td className="border p-2">비밀번호</td>
              <td className="border p-2">비고</td>
            </tr>
          </thead>
          <tbody>
            {dailyList.map((daily, idx) => (
              <React.Fragment key={idx}>
                <DailyDetail user={props.user} daily={daily} idx={idx} />
              </React.Fragment>
            ))}
          </tbody>
        </table>
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
  );
}

export default Daily;
