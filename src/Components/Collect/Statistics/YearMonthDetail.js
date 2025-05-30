import React, { useEffect, useState } from "react";
import StatisticsMemo from "./StatisticsMemo";
import MemoModal from "../../Layout/MemoModal";

function YearMonthDetail(props) {
  const [payTitle, setPayTitle] = useState("");
  const [payment, setPayment] = useState(0);
  const [amount, setAmount] = useState(0);
  const [vat, setVat] = useState(0);
  const [memo, setMemo] = useState("");
  const [modalOn, setModalOn] = useState(false);

  useEffect(() => {
    setPayTitle(getPayTitle(props.yearMonth.payType));
    getTax(props.yearMonth.payment);
    //eslint-disable-next-line
  }, [props.yearMonth]);

  const getTax = cost => {
    if (
      props.yearMonth.payType === "PG" ||
      props.yearMonth.payType === "MO" ||
      props.yearMonth.payType === "HE" ||
      props.yearMonth.payType === "PE"
    ) {
      const camount = Math.round(cost / 1.1);
      const cvat = cost - camount;
      setPayment(cost);
      setAmount(camount);
      setVat(cvat);
    } else {
      if (props.yearMonth.taxBillStatus === "Y") {
        const camount = Math.round(cost / 1.1);
        const cvat = cost - camount;
        setPayment(cost);
        setAmount(camount);
        setVat(cvat);
      } else {
        setPayment(cost);
        setAmount(cost);
        setVat(0);
      }
    }
  };

  const getPayTitle = payType => {
    if (payType === "CA") {
      return "현금(개인)";
    } else if (payType === "CO") {
      return "현금(법인)";
    } else if (payType === "PG") {
      return "카드(PG)";
    } else if (payType === "MO") {
      return "카드(몬)";
    } else if (payType === "HE") {
      return "카드(천국)";
    } else if (payType === "PE") {
      return "카드(펄)";
    } else if (payType === "PR") {
      return "선입금";
    } else {
      return "전체";
    }
  };
  return (
    <tr
      className={`${
        props.yearMonth.transactionType === "D"
          ? "bg-red-100"
          : props.idx % 2 === 1
          ? "bg-green-100"
          : "bg-white"
      } text-center`}
    >
      <td className="p-1 border">
        {props.yearMonth.transactionType === "P" ? "입금" : "환급"}
      </td>
      <td className="p-1 border">{props.yearMonth.paidDate}</td>
      <td className="p-1 border">{props.yearMonth.companyName}</td>
      <td className="p-1 border">{props.yearMonth.companyBranch}</td>
      <td className="p-1 border">{payTitle}</td>
      <td className="p-1 border text-right">
        {payment > 0 ? payment.toLocaleString() : null}
      </td>
      <td className="p-1 border text-right">
        {amount > 0 ? amount.toLocaleString() : null}
      </td>
      <td className="p-1 border text-right">
        {vat > 0 ? vat.toLocaleString() : null}
      </td>
      <td className="p-1 border">
        {props.yearMonth.cardOwner
          ? props.yearMonth.cardOwner
          : props.yearMonth.payerName}
      </td>
      <td className="p-1 border">{props.yearMonth.cardComp}</td>
      <td className="p-1 border">{props.yearMonth.cardNum}</td>
      <td className="p-1 border">{props.yearMonth.cardExp}</td>
      <td className="p-1 border">{props.yearMonth.cardPwd}</td>
      <td className="p-1 border">
        <StatisticsMemo
          memo={props.yearMonth.bigo}
          setMemo={setMemo}
          setModalOn={setModalOn}
        />
        {modalOn && <MemoModal memo={memo} setModalOn={setModalOn} />}
      </td>
    </tr>
  );
}

export default YearMonthDetail;
