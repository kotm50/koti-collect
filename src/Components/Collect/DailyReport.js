import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";

import TodayReport from "./DailyReport/TodayReport";
import TomorrowReport from "./DailyReport/TomorrowReport";
import MemoModal from "../Layout/MemoModal";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // css import

import dayjs from "dayjs";
import { FaCalendarAlt } from "react-icons/fa";

import domtoimage from "dom-to-image";
import axiosInstance from "../../Api/axiosInstance";

function DailyReport() {
  const navi = useNavigate();
  const user = useSelector(state => state.user);
  const thisLocation = useLocation();
  const [title, setTitle] = useOutletContext();
  const [horizontal, setHorizontal] = useState(false);
  const [memo, setMemo] = useState("");
  const [modalOn, setModalOn] = useState(false);
  const [today, setToday] = useState([]);
  const [tomorrow, setTomorrow] = useState([]);
  const [todayTotal, setTodayTotal] = useState({
    dailyPaidAd: 0,
    dailyPaidComm: 0,
    dailyPaidCommCare: 0,
    dailyPaidIntvCare: 0,
    dailyPrepayment: 0,
    totalCardPayment: 0,
    totalCashPayment: 0,
    totalDailyPaidAd: 0,
    totalDailyPaidComm: 0,
    totalDailyPaidCommCare: 0,
    totalDailyPaidIntvCare: 0,
    totalDailyPrepayment: 0,
  });
  const [tomorrowTotal, setTomorrowTotal] = useState({
    totalUnpaid: 0,
    totalUnpaidAd: 0,
    totalUnpaidComm: 0,
    totalUnpaidCommCare: 0,
    totalUnpaidIntvCare: 0,
    unpaidAd: 0,
    unpaidComm: 0,
    unpaidCommCare: 0,
    unpaidIntvCare: 0,
  });
  const [calendarDate, setCalendarDate] = useState("");
  const [date, setDate] = useState("");
  const [calendarOn, setCalendarOn] = useState(false);
  const [calendarDate1, setCalendarDate1] = useState("");
  const [date1, setDate1] = useState("");
  const [calendarOn1, setCalendarOn1] = useState(false);
  useEffect(() => {
    setTitle("일간보고");
    //eslint-disable-next-line
  }, [thisLocation]);

  useEffect(() => {
    if (calendarDate !== "") {
      const date = dayjs(calendarDate).format("YYYY-MM-DD");
      setCalendarOn(false);
      setDate(date);
    }
    //eslint-disable-next-line
  }, [calendarDate]);

  useEffect(() => {
    if (calendarDate1 !== "") {
      const date = dayjs(calendarDate1).format("YYYY-MM-DD");
      setCalendarOn1(false);
      setDate1(date);
    }
    //eslint-disable-next-line
  }, [calendarDate1]);

  useEffect(() => {
    initializer();
    //eslint-disable-next-line
  }, [date, date1]);
  const initializer = async () => {
    getTodayReport();
    getTomorrowReport();
  };

  const getTodayReport = async () => {
    let data = null;
    if (date !== "") {
      data = {
        paidDate: date,
      };
    } else {
      data = {
        paidDate: dayjs(new Date()).format("YYYY-MM-DD"),
      };
    }
    await axiosInstance
      .post("/api/v1/comp/today/pay/list", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(async res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          navi("/");
          return false;
        }
        setToday(res.data.dailyPayList);
        setTodayTotal(res.data.dailyPay);
      })
      .catch(e => console.log(e));
  };
  const getTomorrowReport = async () => {
    let data = null;
    if (date1 !== "") {
      data = {
        nextUnpaidDate: date1,
      };
    } else {
      data = {
        nextUnpaidDate: null,
      };
    }
    await axiosInstance
      .post("/api/v1/comp/sched/unpaid", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(async res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          navi("/");
          return false;
        }
        if (res.data.commissionList) {
          setTomorrow(res.data.commissionList);
        }
        if (res.data.commission) {
          setTomorrowTotal(res.data.commission);
        }
      })
      .catch(e => console.log(e));
  };

  const captureReport = () => {
    const reportElement = document.getElementById("reportResult"); // 캡처하고자 하는 요소의 id

    domtoimage
      .toPng(reportElement)
      .then(dataUrl => {
        // 이미지 다운로드 (예: a 태그를 사용)
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `report_${dayjs(new Date()).format("YYYY-MM-DD")}.png`;
        link.click();
        alert("보고서 저장 완료");
      })
      .catch(error => {
        console.error("dom-to-image에서 에러가 발생했습니다", error);
        alert("보고서 저장에 실패했습니다");
      });
  };
  return (
    <div className={`mx-4`} data={title}>
      <div
        className={`flex justify-start gap-x-10 py-2 px-4 bg-white rounded-lg drop-shadow relative z-10 mb-4 ${
          !horizontal ? "col-span-2" : ""
        }`}
      >
        <div className="flex justify-start gap-x-3">
          <span
            className="font-bold whitespace-nowrap py-2"
            onClick={() => setCalendarOn(false)}
          >
            왼쪽 선택
          </span>
          <div className="relative min-w-[350px]">
            {calendarOn ? (
              <div className="calendarArea top-2 left-0 w-fit h-fit">
                <Calendar onChange={setCalendarDate} value={calendarDate} />
              </div>
            ) : (
              <div
                className="border p-2 hover:cursor-pointer flex flex-row justify-start gap-x-2"
                onClick={() => setCalendarOn(true)}
              >
                <FaCalendarAlt size={24} />
                {date === "" ? (
                  <span className="ml-2">날짜를 변경하려면 클릭하세요</span>
                ) : (
                  <span className="ml-2">{date}</span>
                )}
                {date !== "" && (
                  <span className="text-gray-400">(변경하려면 클릭)</span>
                )}
              </div>
            )}
          </div>
          <button
            className="bg-indigo-500 hover:bg-indigo-700 p-2 text-white"
            onClick={() => setDate("")}
          >
            날짜 초기화
          </button>
        </div>
        <div className="flex justify-start gap-x-3">
          <span
            className="font-bold whitespace-nowrap py-2"
            onClick={() => setCalendarOn1(false)}
          >
            익일 선택
          </span>
          <div className="relative min-w-[350px]">
            {calendarOn1 ? (
              <div className="calendarArea top-2 left-0 w-fit h-fit">
                <Calendar onChange={setCalendarDate1} value={calendarDate1} />
              </div>
            ) : (
              <div
                className="border p-2 hover:cursor-pointer flex flex-row justify-start gap-x-2"
                onClick={() => setCalendarOn1(true)}
              >
                <FaCalendarAlt size={24} />
                {date1 === "" ? (
                  <span className="ml-2">날짜를 변경하려면 클릭하세요</span>
                ) : (
                  <span className="ml-2">{date1}</span>
                )}
                {date1 !== "" && (
                  <span className="text-gray-400">(변경하려면 클릭)</span>
                )}
              </div>
            )}
          </div>
          <button
            className="bg-indigo-500 hover:bg-indigo-700 p-2 text-white"
            onClick={() => setDate1("")}
          >
            날짜 초기화
          </button>
        </div>
        <div className="flex justify-start gap-x-3">
          <button
            className="p-2 border hover:bg-gray-100"
            onClick={() => setHorizontal(false)}
          >
            두줄보기
          </button>
          <button
            className="p-2 border hover:bg-gray-100"
            onClick={() => setHorizontal(true)}
          >
            한줄보기
          </button>
        </div>
        <button
          className="bg-green-500 hover:bg-green-700 text-white p-2"
          onClick={captureReport}
        >
          보고양식 이미지 저장
        </button>
      </div>
      <div
        id="reportResult"
        className={`p-4 bg-gray-100 grid ${
          horizontal
            ? "grid-cols-1 w-1/2 gap-y-4"
            : "w-full grid-cols-2 gap-x-4"
        }`}
      >
        <TodayReport
          list={today}
          total={todayTotal}
          memo={memo}
          setModalOn={setModalOn}
          setMemo={setMemo}
          date={date}
        />
        <TomorrowReport
          list={tomorrow}
          total={tomorrowTotal}
          memo={memo}
          setModalOn={setModalOn}
          setMemo={setMemo}
          date={date1}
        />
      </div>
      {modalOn && <MemoModal memo={memo} setModalOn={setModalOn} />}
    </div>
  );
}

export default DailyReport;
