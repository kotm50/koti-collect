import React, { useEffect, useState } from "react";
import StatisticsMemo from "./StatisticsMemo";
import MemoModal from "../../Layout/MemoModal";

function DailyDetail(props) {
  const [payTitle, setPayTitle] = useState("");
  const [payment, setPayment] = useState(0);
  const [amount, setAmount] = useState(0);
  const [vat, setVat] = useState(0);
  const [memo, setMemo] = useState("");
  const [modalOn, setModalOn] = useState(false);

  useEffect(() => {
    setPayTitle(getPayTitle(props.daily.payType));
    getTax(props.daily.payment);
    //eslint-disable-next-line
  }, [props.daily]);

  const getTax = cost => {
    if (
      props.daily.payType === "PG" ||
      props.daily.payType === "MO" ||
      props.daily.payType === "HE"
    ) {
      const camount = Math.round(cost / 1.1);
      const cvat = cost - camount;
      setPayment(cost);
      setAmount(camount);
      setVat(cvat);
    } else {
      if (props.daily.taxBillStatus === "Y") {
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
    } else if (payType === "PR") {
      return "선입금";
    } else {
      return "전체";
    }
  };
  return (
    <tr
      className={`${
        props.daily.transactionType === "D"
          ? "bg-red-100"
          : props.idx % 2 === 1
          ? "bg-green-100"
          : "bg-white"
      } text-center`}
    >
      <td className="p-1 border">
        {props.daily.transactionType === "P" ? "입금" : "환급"}
      </td>
      <td className="p-1 border">{props.daily.paidDate}</td>
      <td className="p-1 border">{props.daily.companyName}</td>
      <td className="p-1 border">{props.daily.companyBranch}</td>
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
        {props.daily.cardOwner ? props.daily.cardOwner : props.daily.payerName}
      </td>
      <td className="p-1 border">{props.daily.cardComp}</td>
      <td className="p-1 border">{props.daily.cardNum}</td>
      <td className="p-1 border">{props.daily.cardExp}</td>
      <td className="p-1 border">{props.daily.cardPwd}</td>
      <td className="p-1 border">
        <StatisticsMemo
          memo={props.daily.bigo}
          setMemo={setMemo}
          setModalOn={setModalOn}
        />
        {modalOn && <MemoModal memo={memo} setModalOn={setModalOn} />}
      </td>
    </tr>
  );
}

export default DailyDetail;
