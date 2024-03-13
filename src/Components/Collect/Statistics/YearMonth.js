import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import sorry from "../../../Asset/sorry.png";
import YearMonthDetail from "./YearMonthDetail";
import axiosInstance from "../../../Api/axiosInstance";

function YearMonth(props) {
  const navi = useNavigate();
  const [yearMonthList, setYearMonthList] = useState([]);
  const [payTitle, setPayTitle] = useState("");
  const [payType, setPayType] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const handlePayType = e => {
    setPayType(e.target.value);
    getYearMonthList(year, month, null, e.target.value);
  };

  useEffect(() => {
    initializer();
    //eslint-disable-next-line
  }, [props.year, props.month]);

  const initializer = async () => {
    if (props.year !== "") {
      setYear(props.year);
      setMonth("");
      getYearMonthList(props.year, null, null, payType);
    }
    if (props.month !== "") {
      setMonth(props.month);
      getYearMonthList(props.year, props.month, null, payType);
    }
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

  const getYearMonthList = async (year, month, day, payType) => {
    let pType = payType;
    if (payType === "") {
      pType = null;
    }
    let data = {
      payType: pType,
      searchYear: year,
      searchMonth: month === "" ? null : month,
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
        setYearMonthList(res.data.statisticsList);
      })
      .catch(e => console.log(e));
  };
  return (
    <>
      {yearMonthList.length > 0 ? (
        <table className="w-full">
          <thead className="sticky top-0 bg-white">
            <tr>
              <td colSpan="14" className="border border-white">
                <div className="flex justify-between py-2 pr-2">
                  <h3 className="font-bold text-xl">
                    {year}년 {month !== "" ? month + " 월" : null} {payTitle}{" "}
                    결제내역
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
            <tr className="bg-blue-600 text-white text-center">
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
            {yearMonthList.map((yearMonth, idx) => (
              <React.Fragment key={idx}>
                <YearMonthDetail
                  user={props.user}
                  yearMonth={yearMonth}
                  idx={idx}
                />
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

export default YearMonth;
