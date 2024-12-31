import { useState, useEffect, useRef } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import MonthButton from "./Statistics/MonthButton";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // css import

import dayjs from "dayjs";
import { FaCalendarAlt, FaFileExcel } from "react-icons/fa";
import Statistics from "./Statistics/Statistics";
import MemoModal from "../Layout/MemoModal";
import { exportTableToExcel } from "../../Api/capture";

function StatisticsList() {
  const user = useSelector(state => state.user);
  const thisLocation = useLocation();
  const captureRef = useRef();

  const [title, setTitle] = useOutletContext();
  const [year, setYear] = useState(dayjs(new Date()).format("YYYY"));
  const [month, setMonth] = useState(dayjs(new Date()).format("MM"));
  const [date, setDate] = useState("");
  const [calendarDate, setCalendarDate] = useState("");
  const [calendarOn, setCalendarOn] = useState(false);
  const [memo, setMemo] = useState("");
  const [modalOn, setModalOn] = useState(false);

  const [searchOn, setSearchOn] = useState(false);

  useEffect(() => {
    setTitle("기간 별 조회");
    //eslint-disable-next-line
  }, [thisLocation]);

  useEffect(() => {
    if (calendarDate !== "") {
      const date = dayjs(calendarDate).format("YYYY년 MM월 DD일");
      setCalendarOn(false);
      setDate(date);
    }
    //eslint-disable-next-line
  }, [calendarDate]);

  return (
    <div className="mx-4" data={title}>
      <div className="flex justify-start gap-x-3 py-2 px-4 bg-white rounded-lg drop-shadow-lg relative z-30 w-1/2">
        <div className="flex justify-start gap-x-3">
          <span className="font-bold whitespace-nowrap py-2">조회방식</span>
          <button
            className={`border border-green-500 hover:border-green-700 ${
              !searchOn
                ? "bg-green-500 hover:bg-green-700 text-white"
                : "bg-white hover:bg-gray-100 text-green-500 hover:text-green-700"
            } p-2 rounded`}
            onClick={() => setSearchOn(false)}
            disabled={!searchOn}
          >
            기본조회
          </button>
          <button
            className={`border border-green-500 hover:border-green-700 ${
              searchOn
                ? "bg-green-500 hover:bg-green-700 text-white"
                : "bg-white hover:bg-gray-100 text-green-500 hover:text-green-700"
            } p-2 rounded`}
            onClick={() => setSearchOn(true)}
            disabled={searchOn}
          >
            상세조회
          </button>
        </div>
      </div>
      {!searchOn ? (
        <div className="flex justify-between py-2 px-4 bg-white rounded-lg drop-shadow-lg relative z-50 mt-4">
          <div
            className="flex justify-start gap-x-3"
            onClick={() => setCalendarOn(false)}
          >
            <span className="font-bold whitespace-nowrap py-2">
              연도별 보기
            </span>
            <select
              className="p-2 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              value={year}
              onChange={e => setYear(e.currentTarget.value)}
            >
              <option value="">연도 선택</option>
              <option value="2023">2023년</option>
              <option value="2024">2024년</option>
              <option value="2025">2025년</option>
            </select>
          </div>
          <div
            className="flex justify-start gap-x-3"
            onClick={() => setCalendarOn(false)}
          >
            <span className="font-bold whitespace-nowrap py-2">월별 보기</span>
            <MonthButton month={month} setMonth={setMonth} />
          </div>
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
          </div>
        </div>
      ) : null}
      <Statistics
        year={year}
        setYear={setYear}
        setMonth={setMonth}
        month={month}
        date={calendarDate}
        user={user}
        memo={memo}
        setMemo={setMemo}
        setModalOn={setModalOn}
        setCalendarDate={setCalendarDate}
        setDate={setDate}
        setCalendarOn={setCalendarOn}
        searchOn={searchOn}
        captureRef={captureRef}
      />

      <button
        className={`fixed transition-all duration-300 right-[60px] bottom-0 w-[48px] h-[48px] bg-green-600 hover:bg-green-700 text-white border flex justify-center items-center`}
        onClick={() =>
          exportTableToExcel(
            "xlsx",
            captureRef,
            `기간별 ${searchOn ? "상세" : "기본"}조회${dayjs(new Date()).format(
              "YYMMDD_HHssmm"
            )}`
          )
        }
        style={{ zIndex: "999999" }}
      >
        <FaFileExcel size={32} />
      </button>
      {modalOn && <MemoModal memo={memo} setModalOn={setModalOn} />}
    </div>
  );
}

export default StatisticsList;
