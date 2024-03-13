import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";

import dayjs from "dayjs";
import "dayjs/locale/ko"; //한국어
import ReportA from "./Monthly/ReportA";
import ReportB from "./Monthly/ReportB";
import MonthButton from "./Monthly/MonthButton";
import axiosInstance from "../../Api/axiosInstance";

function MonthlyReport() {
  const navi = useNavigate();
  const user = useSelector(state => state.user);
  const thisLocation = useLocation();
  const [title, setTitle] = useOutletContext();

  const [tabMenu, setTabMenu] = useState(0);

  const [listA, setListA] = useState([]);
  const [weekList, setWeekList] = useState([]);
  const [compNmList, setCompNmList] = useState([]);
  const [compSumList, setCompSumList] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [gubunList, setGubunList] = useState([]);
  const [year, setYear] = useState(dayjs(new Date()).format("YYYY"));
  const [month, setMonth] = useState(dayjs(new Date()).format("MM"));
  useEffect(() => {
    initializer();
    //eslint-disable-next-line
  }, [thisLocation, tabMenu, year, month]);

  const initializer = async () => {
    setTitle("월간보고");
    if (tabMenu === 0) {
      await getMonthlyReport(year, month);
      setWeekList([]);
      setCompNmList([]);
      setCompSumList([]);
      setGubunList([]);
    } else {
      setListA([]);
      await getMonthlyStatisticReport(year, month);
    }
  };
  const getMonthlyReport = async (year, month) => {
    const data = {
      searchYear: year,
      searchMonth: month,
    };
    await axiosInstance
      .post("/api/v1/comp/month/pay/list", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(async res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          navi("/");
          return false;
        }
        setListA(res.data.statisticsList);
      })
      .catch(e => console.log(e));
  };

  const getMonthlyStatisticReport = async (year, month) => {
    const data = {
      searchYear: year,
      searchMonth: month,
    };
    await axiosInstance
      .post("/api/v1/comp/month/statistics", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(async res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          navi("/");
          return false;
        }
        const sumList = res.data.compSumList;
        let count = 0;
        let cash = 0;
        let card = 0;
        let bill = 0;
        sumList.forEach(doc => {
          count = count + 1;
          cash = cash + doc.cashPayment;
          card = card + doc.cardPayment;
          bill = bill + doc.billPayment;
        });
        console.log(res.data);
        setWeekList(res.data.weekList);
        setCompNmList(res.data.compNmList);
        setCompSumList(res.data.compSumList);
        setGubunList(res.data.gubunList);
        setStatistics(res.data.statistics);
      })
      .catch(e => console.log(e));
  };
  return (
    <div className="mx-4 gap-x-4" data={title}>
      <div className="py-2 px-4 bg-white flex flex-row justify-between w-full h-fit rounded drop-shadow">
        <div className="flex flex-row justify-start gap-x-2">
          <button
            className={`${
              tabMenu === 0
                ? "bg-green-500 text-white"
                : "bg-white hover:bg-green-700 hover:text-white text-green-700"
            } transition-all duration-300 border border-green-500 rounded p-2`}
            onClick={() => setTabMenu(0)}
            disabled={tabMenu === 0}
          >
            보고양식 1
          </button>
          <button
            className={`${
              tabMenu === 1
                ? "bg-green-500 text-white"
                : "bg-white hover:bg-green-700 hover:text-white text-green-700"
            } transition-all duration-300 border border-green-500 rounded p-2`}
            onClick={() => setTabMenu(1)}
            disabled={tabMenu === 1}
          >
            보고양식 2
          </button>
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
      <div className="mt-4">
        {tabMenu === 0 ? (
          <ReportA list={listA} />
        ) : (
          <ReportB
            weekList={weekList}
            compNmList={compNmList}
            compSumList={compSumList}
            gubunList={gubunList}
            statistics={statistics}
          />
        )}
      </div>
    </div>
  );
}

export default MonthlyReport;
