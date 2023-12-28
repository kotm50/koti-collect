import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import sorry from "../../../Asset/sorry.png";
import ListDetail from "./ListDetail";

import dayjs from "dayjs";
function List(props) {
  const navi = useNavigate();
  const [list, setList] = useState([]);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [cashTotal, setCashTotal] = useState(0);
  const [comCashTotal, setComCashTotal] = useState(0);
  const [comTaxTotal, setComTaxTotal] = useState(0);
  const [cardTotal, setCardTotal] = useState(0);
  const [cardTaxTotal, setCardTaxTotal] = useState(0);

  useEffect(() => {
    changeDate();
    //eslint-disable-next-line
  }, [props.date]);

  const changeDate = async () => {
    if (props.date !== "") {
      const date = dayjs(new Date(props.date)).format("YYYY-MM-DD");
      const year = dayjs(new Date(props.date)).format("YYYY");
      const month = dayjs(new Date(props.date)).format("MM");
      const day = dayjs(new Date(props.date)).format("DD");
      await setYearMonth(year, month);
      await changeList(year, month, day, date);
      setYear(year);
      setMonth(month);
      setDay(day);
    } else {
      setYear("");
      setMonth("");
      setDay("");
    }
  };

  const setYearMonth = (year, month) => {
    props.setYear(year);
    props.setMonth(month);
  };

  const changeList = async (year, month, day, date) => {
    await getGifticonList(year, month, day);
    props.setDate(date);
  };

  useEffect(() => {
    setYear(String(props.year));
    if (props.year !== year) {
      props.setCalendarDate("");
      props.setDate("");
      setDay("");
      setMonth("");
    }
    if (props.month !== "" || props.month !== month) {
      setMonth(String(props.month));
      props.setCalendarDate("");
      props.setDate("");
      setDay("");
    }
    //eslint-disable-next-line
  }, [props.year, props.month]);

  useEffect(() => {
    getGifticonList(year, month, day);
    //eslint-disable-next-line
  }, [year, month, day]);

  const getGifticonList = async (year, month, day) => {
    let data = {
      searchYear: year === "" ? null : year,
      searchMonth: month === "" ? null : month,
      searchDay: day === "" ? null : day,
    };
    await axios
      .post("/api/v1/comp/commcare/status", data, {
        headers: { Authorization: props.user.accessToken },
      })
      .then(async res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          navi("/");
          return false;
        }
        await getTax(res.data.payList);
        setList(res.data.payList);
      })
      .catch(e => console.log(e));
  };

  const getTax = list => {
    let a = 0; // 현금(미발행)
    let b = 0; // 현금(발행)
    let c = 0; // 현금(발행) 부가세
    let d = 0; // 카드
    let e = 0; // 카드 부가세
    list.forEach(doc => {
      if (
        doc.payType === "PG" ||
        doc.payType === "MO" ||
        doc.payType === "HE"
      ) {
        if (doc.transactionType === "P") {
          d = d + Math.round(doc.paidCommCare / 1.1);
          e = e + (doc.paidCommCare - Math.round(doc.paidCommCare / 1.1));
        } else if (doc.transactionType === "D") {
          d = d - Math.round(doc.paidCommCare / 1.1);
          e = e - (doc.paidCommCare - Math.round(doc.paidCommCare / 1.1));
        }
      } else {
        if (doc.taxBillYn === "Y") {
          if (doc.transactionType === "P") {
            b = b + Math.round(doc.paidCommCare / 1.1);
            c = c + (doc.paidCommCare - Math.round(doc.paidCommCare / 1.1));
          } else if (doc.transactionType === "D") {
            b = b - Math.round(doc.paidCommCare / 1.1);
            c = c - (doc.paidCommCare - Math.round(doc.paidCommCare / 1.1));
          }
        } else {
          if (doc.transactionType === "P") {
            a = a + doc.paidCommCare;
          } else if (doc.transactionType === "D") {
            a = a - doc.paidCommCare;
          }
        }
      }
    });
    setCashTotal(a);
    setComCashTotal(b);
    setComTaxTotal(c);
    setCardTotal(d);
    setCardTaxTotal(e);
  };
  return (
    <>
      {list.length > 0 ? (
        <table className="w-full">
          <thead className="sticky top-0 bg-white">
            <tr>
              <td colSpan="14" className="border border-white">
                <div className="flex justify-between py-2 pr-2">
                  <h3 className="font-bold text-xl">
                    기프티콘 충전내역{" "}
                    {year ? (
                      <span>
                        | 조회기간 : {year}년{" "}
                        {month !== "" ? month + "월" : null}{" "}
                        {day !== "" ? day + "일" : null}
                      </span>
                    ) : null}
                  </h3>
                </div>
              </td>
            </tr>
            <tr className="bg-blue-600 text-white text-center">
              <td rowSpan="3" className="border p-1">
                구분
              </td>
              <td rowSpan="3" className="border p-1">
                날짜
              </td>
              <td rowSpan="3" className="border p-1">
                고객사
              </td>
              <td rowSpan="3" className="border p-1">
                지점명
              </td>
              <td colSpan="5" className="border p-1">
                결제금액
              </td>
              <td rowSpan="4" className="border p-1">
                담당자1
              </td>
              <td rowSpan="4" className="border p-1">
                담당자2
              </td>
              <td rowSpan="4" className="border p-1">
                비고
              </td>
            </tr>
            <tr className="bg-blue-600 text-white text-center">
              <td rowSpan="2" className="border p-1">
                현금
              </td>
              <td colSpan="2" className="border p-1">
                카드
              </td>
              <td colSpan="2" className="border p-1">
                세금계산서
              </td>
            </tr>
            <tr className="bg-blue-600 text-white text-center">
              <td className="border p-1">공급가액</td>
              <td className="border p-1">부가세</td>
              <td className="border p-1">공급가액</td>
              <td className="border p-1">부가세</td>
            </tr>
            <tr className="bg-yellow-300 text-center font-bold text-lg">
              <td colSpan="4" className="border p-1">
                합계
              </td>
              <td className="border p-1">{cashTotal.toLocaleString()}</td>
              <td className="border p-1">{cardTotal.toLocaleString()}</td>
              <td className="border p-1">{cardTaxTotal.toLocaleString()}</td>
              <td className="border p-1">{comCashTotal.toLocaleString()}</td>
              <td className="border p-1">{comTaxTotal.toLocaleString()}</td>
            </tr>
          </thead>
          <tbody>
            {list.map((gifticon, idx) => (
              <React.Fragment key={idx}>
                <ListDetail
                  user={props.user}
                  gifticon={gifticon}
                  idx={idx}
                  memo={props.memo}
                  setMemo={props.setMemo}
                  setModalOn={props.setModalOn}
                />
              </React.Fragment>
            ))}
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
    </>
  );
}

export default List;
