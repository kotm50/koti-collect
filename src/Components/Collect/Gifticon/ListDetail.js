import React, { useEffect, useState } from "react";
import GifticonMemo from "./GifticonMemo";

function ListDetail(props) {
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
    if (props.gifticon.payType === "PR") {
      if (props.idx % 2 === 1) {
        color = "bg-stone-100 text-indigo-700";
      } else {
        color = "bg-stone-50 text-indigo-500";
      }
    }
    setColor(color);
    //eslint-disable-next-line
  }, [props.gifticon]);

  useEffect(() => {
    getTax(props.gifticon.paidCommCare);
    //eslint-disable-next-line
  }, [props.gifticon]);

  const getTax = cost => {
    if (
      props.gifticon.payType === "PG" ||
      props.gifticon.payType === "MO" ||
      props.gifticon.payType === "HE" ||
      props.gifticon.prepayType === "CD"
    ) {
      const camount = Math.round(cost / 1.1);
      const cvat = cost - camount;
      setPayment(cost);
      setAmount(camount);
      setVat(cvat);
    } else {
      if (props.gifticon.taxBillStatus === "Y") {
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
  return (
    <tr className={`${color} text-center`}>
      <td className="p-1 border">
        {props.gifticon.transactionType === "P" ? "입금" : "환급"}
      </td>
      <td className="p-1 border">{props.gifticon.paidDate}</td>
      <td className="p-1 border">{props.gifticon.companyName}</td>
      <td className="p-1 border">{props.gifticon.companyBranch}</td>
      <td className="p-1 border">
        {props.gifticon.payType === "CA" ||
        props.gifticon.payType === "CO" ||
        props.gifticon.prepayType === "CA" ||
        props.gifticon.prepayType === "CO" ? (
          <span>
            {props.gifticon.taxBillStatus !== "Y"
              ? payment.toLocaleString()
              : null}
          </span>
        ) : null}
      </td>
      <td className="p-1 border text-center">
        {props.gifticon.payType !== "CA" &&
        props.gifticon.payType !== "CO" &&
        props.gifticon.prepayType !== "CO" &&
        props.gifticon.prepayType !== "CA" ? (
          <span>{amount > 0 ? amount.toLocaleString() : null}</span>
        ) : null}
      </td>
      <td className="p-1 border text-center">
        {props.gifticon.payType !== "CA" &&
        props.gifticon.payType !== "CO" &&
        props.gifticon.prepayType !== "CO" &&
        props.gifticon.prepayType !== "CA" ? (
          <span>{vat > 0 ? vat.toLocaleString() : null}</span>
        ) : null}
      </td>
      <td className="p-1 border text-center">
        {props.gifticon.payType === "CA" ||
        props.gifticon.payType === "CO" ||
        props.gifticon.prepayType === "CA" ||
        props.gifticon.prepayType === "CO" ? (
          <span>
            {props.gifticon.taxBillStatus === "Y"
              ? amount.toLocaleString()
              : null}
          </span>
        ) : null}
      </td>
      <td className="p-1 border text-center">
        {props.gifticon.payType === "CA" ||
        props.gifticon.payType === "CO" ||
        props.gifticon.prepayType === "CA" ||
        props.gifticon.prepayType === "CO" ? (
          <span>
            {props.gifticon.taxBillStatus === "Y" ? vat.toLocaleString() : null}
          </span>
        ) : null}
      </td>
      <td className="p-1 border">{props.gifticon.manager1}</td>
      <td className="p-1 border">{props.gifticon.manager2}</td>
      <td className="p-1 border">
        {props.gifticon.bigo ? (
          <GifticonMemo
            memo={props.gifticon.bigo}
            setMemo={props.setMemo}
            setModalOn={props.setModalOn}
          />
        ) : null}
      </td>
    </tr>
  );
}

export default ListDetail;
