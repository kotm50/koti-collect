import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import TodayReport from "./DailyReport/TodayReport";
import TomorrowReport from "./DailyReport/TomorrowReport";
import MemoModal from "../Layout/MemoModal";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // css import

import dayjs from "dayjs";
import { FaCalendarAlt } from "react-icons/fa";

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
    getTodayReport();
    if (date === "") {
      getTomorrowReport();
    }
    //eslint-disable-next-line
  }, [date]);

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
    await axios
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
    await axios
      .post("/api/v1/comp/sched/unpaid", null, {
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
  return (
    <div
      className={`mx-4 grid gap-y-4 ${
        horizontal ? "grid-cols-1" : "grid-cols-2 gap-x-4"
      }`}
      data={title}
    >
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
            날짜 선택
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
      </div>
      <TodayReport
        list={today}
        total={todayTotal}
        memo={memo}
        setModalOn={setModalOn}
        setMemo={setMemo}
        date={date}
      />
      {date === "" ? (
        <TomorrowReport
          list={tomorrow}
          total={tomorrowTotal}
          memo={memo}
          setModalOn={setModalOn}
          setMemo={setMemo}
        />
      ) : null}

      {modalOn && <MemoModal memo={memo} setModalOn={setModalOn} />}
    </div>
  );
}

export default DailyReport;
