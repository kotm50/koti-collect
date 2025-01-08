import React, { useEffect, useState } from "react";

import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 로케일 import

import PrePaidMemo from "./PrePaidMemo";

function CompanyPrepaidDetail(props) {
  const [payResult, setPayResult] = useState("");
  const [payBg, setPayBg] = useState("");
  const [payStat, setPayStat] = useState("");
  useEffect(() => {
    let result;
    if (props.pay.payType === "CA") {
      result = "현금";
    } else if (props.pay.payType === "CO") {
      result = "법인";
    } else if (props.pay.payType === "PG") {
      result = "PG카드";
    } else if (props.pay.payType === "MO") {
      result = "알바몬카드";
    } else if (props.pay.payType === "HE") {
      result = "알바천국카드";
    } else if (props.pay.payType === "PE") {
      result = "펄스맥카드";
    } else {
      result = "";
    }
    let bg;
    let stat;
    if (props.pay.transactionType === "P") {
      bg = "bg-green-100";
      stat = "선입금";
    } else if (props.pay.transactionType === "D") {
      bg = "bg-rose-100";
      stat = "환급";
    } else if (props.pay.transactionType === "B") {
      bg = "bg-gray-100";
      stat = "사용";
      if (props.pay.prepayType === "CA") {
        result = "현금";
      } else if (props.pay.prepayType === "CO") {
        result = "법인";
      } else if (props.pay.prepayType === "CD") {
        result = "카드";
      }
    } else if (props.pay.transactionType === "C") {
      bg = "bg-white";
      stat = "미사용";
      if (props.pay.prepayType === "CA") {
        result = "현금";
      } else if (props.pay.prepayType === "CO") {
        result = "법인";
      } else if (props.pay.prepayType === "CD") {
        result = "카드";
      }
    }
    setPayStat(stat);
    setPayBg(bg);
    setPayResult(result);
  }, [props.pay]);

  const editIt = ppCode => {
    if (
      props.pay.transactionType === "B" ||
      props.pay.transactionType === "C"
    ) {
      return alert("선입금 항목만 수정 가능합니다");
    }
    if (props.pay.payType === null) {
      return alert("선입금 항목만 수정 가능합니다");
    }
    props.setPrepayCode(ppCode);
    props.setInputOn(true);
  };

  return (
    <>
      <tr
        className={`text-center hover:cursor-pointer ${payBg}`}
        title="수정하려면 클릭하세요"
      >
        <td
          className="p-1 border text-sm"
          onClick={() => {
            editIt(props.pay.prepayCode);
          }}
        >
          {payStat}
        </td>
        <td
          className="p-1 border text-sm"
          onClick={() => {
            editIt(props.pay.prepayCode);
          }}
        >
          {dayjs(new Date(props.pay.paidDate)).format("YYYY-MM-DD")}
        </td>
        <td
          className="p-1 border text-sm"
          onClick={() => {
            editIt(props.pay.prepayCode);
          }}
        >
          {Number(props.pay.prepayment).toLocaleString()}
        </td>
        <td
          className="p-1 border text-sm hidden"
          onClick={() => {
            editIt(props.pay.prepayCode);
          }}
        >
          {Number(props.pay.actualPrepayment).toLocaleString()}
        </td>
        <td
          className="p-1 border text-sm"
          onClick={() => {
            editIt(props.pay.prepayCode);
          }}
        >
          {payResult}
          {props.pay.payType === "CA" || props.pay.payType === "CO" ? (
            <span>
              {props.pay.taxBillStatus === "Y" ? "(발행)" : "(미발행)"}
            </span>
          ) : null}
        </td>
        <td
          className="p-1 border text-sm"
          onClick={() => {
            editIt(props.pay.prepayCode);
          }}
        >
          {payResult === "현금" || payResult === "법인"
            ? props.pay.payerName
            : props.pay.cardOwner}
        </td>
        <td
          className="border max-w-[150px] w-[150px] min-w-[150px] text-sm px-2"
          title={`${props.pay.cardComp} | ${props.pay.cardOwner} | ${props.pay.cardNum}`}
          onClick={() => {
            editIt(props.pay.prepayCode);
          }}
        >
          <div className="w-[142px] overflow-x-hidden truncate">
            {props.pay.cardComp} {props.pay.cardNum}
          </div>
        </td>
        <td
          className={`p-1 border max-w-[150px] w-[150px] min-w-[150px] relative ${
            props.pay.transactionType === "B" ||
            props.pay.transactionType === "C"
              ? "text-xs"
              : "text-sm"
          }`}
        >
          <PrePaidMemo
            memo={props.pay.bigo}
            setMemo={props.setMemo}
            setModalOn={props.setModalOn}
          />
        </td>
      </tr>
    </>
  );
}

export default CompanyPrepaidDetail;
