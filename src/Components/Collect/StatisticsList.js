import { useState, useEffect } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import MonthButton from "./Statistics/MonthButton";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // css import

import dayjs from "dayjs";
import { FaCalendarAlt } from "react-icons/fa";
import Daily from "./Statistics/Daily";
import YearMonth from "./Statistics/YearMonth";

function StatisticsList() {
  const user = useSelector(state => state.user);
  const thisLocation = useLocation();

  const [title, setTitle] = useOutletContext();
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [date, setDate] = useState("");
  const [calendarDate, setCalendarDate] = useState("");
  const [calendarOn, setCalendarOn] = useState(false);
  useEffect(() => {
    const now = new Date();
    setYear(now.getFullYear().toString());
    setTitle("결제 내역");
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
      <div className="flex justify-between py-2 px-4 bg-white rounded-lg drop-shadow-lg relative z-10">
        <div className="flex justify-start gap-x-3">
          <span className="font-bold whitespace-nowrap py-2">날짜 선택</span>
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
        <div className="flex justify-start gap-x-3">
          <span className="font-bold whitespace-nowrap py-2">연도별 보기</span>
          <select
            className="p-2 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
            value={year}
            onChange={e => setYear(e.currentTarget.value)}
          >
            <option value="">연도 선택</option>
            <option value="2023">2023년</option>
            <option value="2024">2024년</option>
          </select>
        </div>
        <div className="flex justify-start gap-x-3">
          <span className="font-bold whitespace-nowrap py-2">월별 보기</span>
          <MonthButton month={month} setMonth={setMonth} />
        </div>
      </div>
      <div className="p-4 bg-white drop-shadow-lg rounded-lg">
        <div className="h-[240px] overflow-y-auto relative">
          <Daily date={calendarDate} user={user} />
        </div>
      </div>
      <div className="p-4 bg-white drop-shadow-lg rounded-lg mt-4">
        <div className="h-[400px] overflow-y-auto relative">
          <YearMonth year={year} month={month} user={user} />
        </div>
      </div>
    </div>
  );
}

export default StatisticsList;
