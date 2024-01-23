import React, { useEffect, useState } from "react";
import StatisticsMemo from "./StatisticsMemo";

function StatisticsDetail(props) {
  const [payTitle, setPayTitle] = useState("");
  const [payment, setPayment] = useState(0);
  const [amount, setAmount] = useState(0);
  const [vat, setVat] = useState(0);
  const [color, setColor] = useState("");

  useEffect(() => {
    setPayTitle(getPayTitle(props.statistics.payType));
    getTax(props.statistics.payment);
    //eslint-disable-next-line
  }, [props.statistics]);

  const getTax = cost => {
    if (
      props.statistics.payType === "PG" ||
      props.statistics.payType === "MO" ||
      props.statistics.payType === "HE"
    ) {
      const camount = Math.round(cost / 1.1);
      const cvat = cost - camount;
      setPayment(cost);
      setAmount(camount);
      setVat(cvat);
    } else {
      if (props.statistics.taxBillStatus === "Y") {
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

  useEffect(() => {
    let color;
    if (props.statistics.transactionType === "P") {
      if (props.statistics.payType === "CA") {
        color = "bg-white";
      } else if (props.statistics.payType === "CO") {
        color = "bg-green-100";
      } else if (props.statistics.payType === "PG") {
        color = "bg-blue-100";
      } else if (props.statistics.payType === "MO") {
        color = "bg-yellow-100";
      } else if (props.statistics.payType === "HE") {
        color = "bg-orange-100";
      } else {
        color = "";
      }
    } else {
      color = "bg-rose-100";
    }
    setColor(color);
    //eslint-disable-next-line
  }, [props.statistics]);

  const getPayTitle = payType => {
    if (props.statistics.payType === "CA") {
      return "개인";
    } else if (props.statistics.payType === "CO") {
      return "법인";
    } else if (props.statistics.payType === "PG") {
      return "카드(PG)";
    } else if (props.statistics.payType === "MO") {
      return "카드(몬)";
    } else if (props.statistics.payType === "HE") {
      return "카드(천국)";
    } else if (props.statistics.payType === "PR") {
      return "선입금";
    } else {
      return "전체";
    }
  };
  return (
    <tr className={`${color} text-center`}>
      <td className="p-1 border">
        {props.statistics.transactionType === "P" ? "입금" : "환급"}
      </td>
      <td className="p-1 border">{props.statistics.paidDate}</td>
      <td className="p-1 border">{props.statistics.companyName}</td>
      <td className="p-1 border">{props.statistics.companyBranch}</td>
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
        {props.statistics.cardOwner
          ? props.statistics.cardOwner
          : props.statistics.payerName}
      </td>
      <td className="p-1 border">{props.statistics.cardComp}</td>
      <td className="p-1 border">{props.statistics.cardNum}</td>
      <td className="p-1 border">{props.statistics.cardExp}</td>
      <td className="p-1 border">{props.statistics.cardPwd}</td>
      <td className="p-1 border">
        {props.statistics.bigo && (
          <StatisticsMemo
            memo={props.statistics.bigo}
            setMemo={props.setMemo}
            setModalOn={props.setModalOn}
          />
        )}
      </td>
    </tr>
  );
}

export default StatisticsDetail;
