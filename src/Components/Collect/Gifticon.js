import { useState, useEffect } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";

import MonthButton from "./Statistics/MonthButton";
import List from "./Gifticon/List";
import MemoModal from "../Layout/MemoModal";
import axiosInstance from "../../Api/axiosInstance";

function Gifticon() {
  const navi = useNavigate();
  const user = useSelector(state => state.user);
  const thisLocation = useLocation();

  const [title, setTitle] = useOutletContext();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [memo, setMemo] = useState("");
  const [modalOn, setModalOn] = useState(false);

  const [list, setList] = useState([]);
  const [cashTotal, setCashTotal] = useState(0);
  const [comCashTotal, setComCashTotal] = useState(0);
  const [comTaxTotal, setComTaxTotal] = useState(0);
  const [cardTotal, setCardTotal] = useState(0);
  const [cardTaxTotal, setCardTaxTotal] = useState(0);
  const [allTotal, setAllTotal] = useState(0);

  useEffect(() => {
    setTitle("기프티콘 충전현황");
    //eslint-disable-next-line
  }, [thisLocation]);

  useEffect(() => {
    getGifticonList(year, month, null, null);
    //eslint-disable-next-line
  }, [year, month]);
  const getGifticonList = async (year, month, start, end) => {
    if (start !== null || end !== null) {
      setYear("");
      setMonth("");
    } else {
      setStartDate("");
      setEndDate("");
    }
    setCashTotal(0);
    setComCashTotal(0);
    setComTaxTotal(0);
    setCardTotal(0);
    setCardTaxTotal(0);
    setAllTotal(0);
    setList([]);
    let data = {
      searchYear: year === "" ? null : year,
      searchMonth: month === "" ? null : month,
      searchStartDate: start === "" ? null : start,
      searchEndDate: end === "" ? null : end,
    };
    await axiosInstance
      .post("/api/v1/comp/commcare/status", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(async res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          navi("/");
          return false;
        }
        const pay = res.data.pay;
        setCashTotal(pay.cashCommPayment);
        setComCashTotal(pay.billCommPayment);
        setComTaxTotal(pay.billCommPaymentVAT);
        setCardTotal(pay.cardCommPayment);
        setCardTaxTotal(pay.cardCommPaymentVAT);
        setAllTotal(pay.totalPayment);
        setList(res.data.payList);
      })
      .catch(e => console.log(e));
  };

  return (
    <div className="mx-4" data={title}>
      <div className="flex justify-between py-2 px-4 bg-white rounded-lg drop-shadow-lg relative z-10">
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
            <option value="2025">2025년</option>
          </select>
        </div>
        <div className="flex justify-start gap-x-3">
          <span className="font-bold whitespace-nowrap py-2">월별 보기</span>
          <MonthButton month={month} setMonth={setMonth} />
        </div>
        <div className="flex justify-start gap-x-3">
          <span className="font-bold whitespace-nowrap py-2">시작일</span>
          <input
            type="date"
            value={startDate}
            className="border px-2 rounded"
            onChange={e => setStartDate(e.currentTarget.value)}
          />
          <span className="font-bold whitespace-nowrap py-2">종료일</span>
          <input
            type="date"
            value={endDate}
            className="border px-2 rounded"
            onChange={e => setEndDate(e.currentTarget.value)}
            disabled={startDate === ""}
          />
          <button
            className="bg-violet-500 hover:bg-violet-700 text-white p-2 rounded"
            onClick={() => getGifticonList(null, null, startDate, endDate)}
          >
            기간 검색
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white p-2 rounded"
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
          >
            초기화
          </button>
        </div>
      </div>

      <div className="p-4 bg-white drop-shadow-lg rounded-lg mt-4">
        <div className="h-fit max-h-[640px] overflow-y-auto relative">
          <List
            list={list}
            cashTotal={cashTotal}
            comCashTotal={comCashTotal}
            comTaxTotal={comTaxTotal}
            cardTotal={cardTotal}
            cardTaxTotal={cardTaxTotal}
            allTotal={allTotal}
            user={user}
            memo={memo}
            setMemo={setMemo}
            setModalOn={setModalOn}
          />
        </div>
      </div>

      {modalOn && <MemoModal memo={memo} setModalOn={setModalOn} />}
    </div>
  );
}

export default Gifticon;
