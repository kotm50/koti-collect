import React, { useEffect, useState } from "react";
import GifticonMemo from "./GifticonMemo";

function ListDetail(props) {
  const [payTitle, setPayTitle] = useState("");
  const [payment, setPayment] = useState(0);
  const [amount, setAmount] = useState(0);
  const [vat, setVat] = useState(0);
  const [color, setColor] = useState("");

  useEffect(() => {
    let color;
    if (props.gifticon.transactionType === "P") {
      if (props.idx % 2 === 0) {
        color = "bg-green-100";
      } else {
        color = "bg-green-50";
      }
    } else {
      if (props.idx % 2 === 0) {
        color = "bg-rose-100";
      } else {
        color = "bg-rose-50";
      }
    }
    setColor(color);
    //eslint-disable-next-line
  }, [props.gifticon]);

  useEffect(() => {
    setPayTitle(getPayTitle(props.gifticon.payType));
    getTax(props.gifticon.paidCommCare);
    //eslint-disable-next-line
  }, [props.gifticon]);

  const getTax = cost => {
    if (
      props.gifticon.payType === "PG" ||
      props.gifticon.payType === "MO" ||
      props.gifticon.payType === "HE"
    ) {
      const camount = Math.round(cost / 1.1);
      const cvat = cost - camount;
      setPayment(cost);
      setAmount(camount);
      setVat(cvat);
    } else {
      if (props.gifticon.taxBillYn === "Y") {
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
    console.log(payType);
    if (payType === "CA") {
      return "현금(개인)";
    } else if (payType === "CO") {
      return "현금(법인)";
    } else if (payType === "PG") {
      return "PG카드";
    } else if (payType === "MO") {
      return "알바몬카드";
    } else if (payType === "HE") {
      return "현금(개인)";
    } else {
      return "전체";
    }
  };
  return (
    <tr className={`${color} text-center`}>
      <td className="p-1 border">
        {props.gifticon.transactionType === "P" ? "입금" : "환급"}
      </td>
      <td className="p-1 border">{props.gifticon.paidDate}</td>
      <td className="p-1 border">{props.gifticon.companyName}</td>
      <td className="p-1 border">{props.gifticon.companyBranch}</td>
      <td className="p-1 border">
        {payTitle} |{" "}
        {props.gifticon.payType === "CA" || props.gifticon.payType === "CO" ? (
          <span>
            {props.gifticon.taxBillYn === "Y" ? "계산서 : O" : "계산서 : X"}
          </span>
        ) : null}
      </td>
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
        {props.gifticon.cardOwner
          ? props.gifticon.cardOwner
          : props.gifticon.payerName}
      </td>
      <td className="p-1 border">{props.gifticon.cardComp}</td>
      <td className="p-1 border">{props.gifticon.cardNum}</td>
      <td className="p-1 border">{props.gifticon.cardExp}</td>
      <td className="p-1 border">{props.gifticon.cardPwd}</td>
      <td className="p-1 border">
        <GifticonMemo
          memo={props.gifticon.bigo}
          setMemo={props.setMemo}
          setModalOn={props.setModalOn}
        />
      </td>
    </tr>
  );
}

export default ListDetail;
