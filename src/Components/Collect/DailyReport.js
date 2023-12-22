import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import TodayReport from "./DailyReport/TodayReport";
import TomorrowReport from "./DailyReport/TomorrowReport";
import MemoModal from "../Layout/MemoModal";

function DailyReport() {
  const navi = useNavigate();
  const user = useSelector(state => state.user);
  const thisLocation = useLocation();
  const [title, setTitle] = useOutletContext();
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
  useEffect(() => {
    setTitle("일간보고");
    getTodayReport();
    getTomorrowReport();
    //eslint-disable-next-line
  }, [thisLocation]);

  const getTodayReport = async () => {
    await axios
      .post("/api/v1/comp/today/pay/list", null, {
        headers: { Authorization: user.accessToken },
      })
      .then(async res => {
        console.log("오늘", res);
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
        console.log("내일", res);
        if (res.data.code === "E999" || res.data.code === "E403") {
          navi("/");
          return false;
        }
        console.log("내일", res);
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
    <div className="mx-4 grid grid-cols-2 gap-x-4" data={title}>
      {today && today.length > 0 ? (
        <TodayReport
          list={today}
          total={todayTotal}
          memo={memo}
          setModalOn={setModalOn}
          setMemo={setMemo}
        />
      ) : null}
      {tomorrow && tomorrow.length > 0 ? (
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
