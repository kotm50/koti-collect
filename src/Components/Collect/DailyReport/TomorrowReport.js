import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko"; //한국어
import sorry from "../../../Asset/sorry.png";

function TomorowReport(props) {
  dayjs.locale("ko");
  const [date, setDate] = useState("");
  const [dateLong, setDateLong] = useState("");
  useEffect(() => {
    // 현재 날짜와 시간을 나타내는 Date 객체 생성
    let today = new Date();

    // 현재 날짜에 1을 더하여 내일 날짜를 얻음
    let tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const date = dayjs(tomorrow).format("MM/DD");
    const dateLong = dayjs(tomorrow).format("YYYY/MM/DD(dd요일)");
    setDate(date);
    setDateLong(dateLong);
  }, []);
  return (
    <div className="p-2 bg-white">
      <h3 className="text-xl font-bold">내일 - {dateLong}</h3>
      {props.list.length > 0 ? (
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
            </tr>
          </thead>
          <tbody className="text-sm">
            {props.list.map((item, idx) => (
              <tr className="text-center" key={idx}>
                <td className="border p-1">{item.channel}</td>
                <td className="border p-1">{item.companyName}</td>
                <td className="border p-1">{item.companyBranch}</td>
                <td className="border p-1">{item.unpaidAd.toLocaleString()}</td>
                <td className="border p-1">
                  {item.unpaidComm.toLocaleString()}
                </td>
                <td className="border p-1">
                  {item.unpaidIntvCare.toLocaleString()}
                </td>
                <td className="border p-1">
                  {item.unpaidCommCare.toLocaleString()}
                </td>
              </tr>
            ))}
            <tr className="bg-blue-600 text-white text-center">
              <td className="border p-1" colSpan="3" rowSpan="2">
                {date} 수금 예정금액
              </td>
              <td className="border p-1 font-bold">
                {props.total.totalUnpaid
                  ? props.total.totalUnpaid.toLocaleString()
                  : 0}
              </td>
              <td className="border p-1 font-bold">
                {props.total.totalUnpaidComm
                  ? props.total.totalUnpaidComm.toLocaleString()
                  : 0}
              </td>
              <td className="border p-1 font-bold">
                {props.total.totalUnpaidIntvCare
                  ? props.total.totalUnpaidIntvCare.toLocaleString()
                  : 0}
              </td>
              <td className="border p-1 font-bold">
                {props.total.totalUnpaidCommCare
                  ? props.total.totalUnpaidCommCare.toLocaleString()
                  : 0}
              </td>
            </tr>
            <tr className="bg-blue-600 text-white text-center">
              <td colSpan="4" className="border p-1 font-bold">
                {props.total.totalUnpaid.toLocaleString()}
              </td>
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

export default TomorowReport;
