import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko"; //한국어
import sorry from "../../../Asset/sorry.png";

function TodayReport(props) {
  dayjs.locale("ko");
  const [date, setDate] = useState("");
  const [dateLong, setDateLong] = useState("");
  useEffect(() => {
    let today;
    if (props.date === "") {
      today = new Date();
    } else {
      today = new Date(props.date);
    }
    const date = dayjs(today).format("MM/DD");
    const dateLong = dayjs(today).format("YYYY/MM/DD(dd요일)");
    setDate(date);
    setDateLong(dateLong);
  }, [props.date]);
  const getPayTitle = payType => {
    if (payType === "CA") {
      return "개인";
    } else if (payType === "CO") {
      return "법인";
    } else if (payType === "PG") {
      return "카드(PG)";
    } else if (payType === "MO") {
      return "카드(몬)";
    } else if (payType === "HE") {
      return "카드(천국)";
    } else {
      return "오류";
    }
  };

  const colorChk = payType => {
    if (payType === "CA") {
      return "bg-white";
    } else if (payType === "CO") {
      return "bg-green-100";
    } else if (payType === "PG") {
      return "bg-blue-100";
    } else if (payType === "MO") {
      return "bg-yellow-100";
    } else if (payType === "HE") {
      return "bg-orange-100";
    } else {
      return "";
    }
  };
  return (
    <div className="p-2 bg-white">
      <h3 className="text-xl font-bold">오늘 - {dateLong}</h3>
      {props.list ? (
        <table className="w-full">
          <thead>
            <tr className="bg-blue-600 text-white text-center">
              <td className="border p-1">채널</td>
              <td className="border p-1">고객사</td>
              <td className="border p-1">지점</td>
              <td className="border p-1">광고비</td>
              <td className="border p-1">위촉비</td>
              <td className="border p-1">면접케어</td>
              <td className="border p-1">위촉케어</td>
              <td className="border p-1">선입금</td>
              <td className="border p-1">결제방법</td>
            </tr>
          </thead>
          <tbody className="text-sm">
            {props.list.map((item, idx) => (
              <tr
                className={`text-center ${
                  item.sortNum === 1 ? "" : ""
                } ${colorChk(item.payType)}`}
                key={idx}
              >
                <td className="border p-1">{item.channel}</td>
                <td className="border p-1">{item.companyName}</td>
                <td className="border p-1">{item.companyBranch}</td>
                <td className="border p-1">
                  {item.dailyPaidAd.toLocaleString()}
                </td>
                <td className="border p-1">
                  {item.dailyPaidComm.toLocaleString()}
                </td>
                <td className="border p-1">
                  {item.dailyPaidIntvCare.toLocaleString()}
                </td>
                <td className="border p-1">
                  {item.dailyPaidCommCare.toLocaleString()}
                </td>
                <td className="border p-1">
                  {item.dailyPrepayment.toLocaleString()}
                </td>
                <td className="border p-1">{getPayTitle(item.payType)}</td>
              </tr>
            ))}
            <tr className="bg-blue-600 text-white text-center">
              <td className="border p-1" colSpan="3" rowSpan="2">
                {date} 당일 수금액
              </td>
              <td className="border p-1 font-bold">
                {props.total.totalDailyPaidAd.toLocaleString()}
              </td>
              <td className="border p-1 font-bold">
                {props.total.totalDailyPaidComm.toLocaleString()}
              </td>
              <td className="border p-1 font-bold">
                {props.total.totalDailyPaidIntvCare.toLocaleString()}
              </td>
              <td className="border p-1 font-bold">
                {props.total.totalDailyPaidCommCare.toLocaleString()}
              </td>
              <td className="border p-1 font-bold">
                {props.total.totalDailyPrepayment.toLocaleString()}
              </td>
              <td className="border p-1"></td>
            </tr>
            <tr className="bg-blue-600 text-white text-center">
              <td colSpan="5" className="border p-1 font-bold">
                {(
                  props.total.totalDailyPaidAd +
                  props.total.totalDailyPaidComm +
                  props.total.totalDailyPaidIntvCare +
                  props.total.totalDailyPaidCommCare +
                  props.total.totalDailyPrepayment
                ).toLocaleString()}
              </td>
              <td className="border p-1"></td>
            </tr>
            <tr className="bg-gray-300 text-center">
              <td colSpan="3" className="border p-1">
                카드 결제 금액
              </td>
              <td colSpan="5" className="border p-1 font-bold">
                {props.total.totalCardPayment.toLocaleString()}
              </td>
              <td className="border p-1"></td>
            </tr>
            <tr className="bg-gray-300 text-center">
              <td colSpan="3" className="border p-1">
                카드 외 결제 금액
              </td>
              <td colSpan="5" className="border p-1 font-bold">
                {props.total.totalCashPayment.toLocaleString()}
              </td>
              <td className="border p-1"></td>
            </tr>
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
    </div>
  );
}

export default TodayReport;
