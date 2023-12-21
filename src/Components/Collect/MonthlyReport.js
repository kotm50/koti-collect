import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/ko"; //한국어

function MonthlyReport() {
  const navi = useNavigate();
  const user = useSelector(state => state.user);
  const thisLocation = useLocation();
  const [title, setTitle] = useOutletContext();
  const [list, setList] = useState([]);
  const [statisticsList, setStatisticsList] = useState([]);
  const [year, setYear] = useState(dayjs(new Date()).format("YYYY"));
  const [month, setMonth] = useState(dayjs(new Date()).format("MM"));
  useEffect(() => {
    setTitle("월간보고");
    getMonthlyReport(year, month);
    getMonthlyStatisticReport(year, month);
    //eslint-disable-next-line
  }, [thisLocation]);
  const getMonthlyReport = async (year, month) => {
    const data = {
      searchYear: year,
      searchMonth: month,
    };
    await axios
      .post("/api/v1/comp/month/pay/list", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(async res => {
        console.log("월별", res);
        if (res.data.code === "E999" || res.data.code === "E403") {
          navi("/");
          return false;
        }
      })
      .catch(e => console.log(e));
  };

  const getMonthlyStatisticReport = async (year, month) => {
    const data = {
      searchYear: year,
      searchMonth: month,
    };
    await axios
      .post("/api/v1/comp/month/statistics", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(async res => {
        console.log("통계", res);
        if (res.data.code === "E999" || res.data.code === "E403") {
          navi("/");
          return false;
        }
      })
      .catch(e => console.log(e));
  };

  return <div className="mx-4 grid grid-cols-2 gap-x-4" data={title}></div>;
}

export default MonthlyReport;
