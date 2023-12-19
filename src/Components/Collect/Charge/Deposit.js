import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 로케일 import
import CommisionMemo from "./CommisionMemo";
import { useEffect, useState } from "react";

function Deposit(props) {
  const [selected, setSelected] = useState("");
  const handleList = async pCode => {
    await resetPayCode();
    await setPayCode(pCode);
  };

  const setPayCode = code => {
    props.setPayCode(code);
  };

  const resetPayCode = () => {
    props.setPayCode(null);
  };
  useEffect(() => {
    if (props.detailOn) {
      props.getPayList(props.commCode);
    }
    //eslint-disable-next-line
  }, [props.detailOn]);
  return (
    <>
      <tr className="bg-blue-600 text-white text-center">
        <td className="p-1 border border-stone-400">입금/환급</td>
        <td className="p-1 border border-stone-400">결제방식</td>
        <td className="p-1 border border-stone-400">카드사</td>
        <td className="p-1 border border-stone-400" colSpan="2">
          명의자(계좌/카드)
        </td>
        <td className="p-1 border border-stone-400 truncate" colSpan="4">
          카드번호
        </td>
        <td className="p-1 border border-stone-400">광고비 입금</td>
        <td className="p-1 border border-stone-400">위촉비 입금</td>
        <td className="p-1 border border-stone-400">면케 입금</td>
        <td className="p-1 border border-stone-400">위케 입금</td>
        <td className="p-1 border border-stone-400">결제일</td>
        <td className="p-1 border border-stone-400">메모</td>
      </tr>
      {props.payList.length > 0 ? (
        <>
          {props.payList.map((pay, idx) => (
            <tr
              key={idx}
              onClick={() => {
                setSelected(pay.payCode);
                handleList(pay.payCode);
              }}
              className={`hover:cursor-pointer text-center ${
                selected === pay.payCode ? "bg-teal-100" : "bg-gray-100"
              }`}
            >
              <td className="p-1 border border-stone-400">
                {pay.transactionType === "P"
                  ? "입금"
                  : pay.transactionType === "D"
                  ? "환급"
                  : "오류"}
              </td>
              <td className="p-1 border border-stone-400">
                {pay.payType === "CA"
                  ? "현금"
                  : pay.payType === "CO"
                  ? "법인"
                  : pay.payType === "PG"
                  ? "PG카드"
                  : pay.payType === "MO"
                  ? "알바몬카드"
                  : pay.payType === "HE"
                  ? "알바천국카드"
                  : pay.payType === "PR"
                  ? "선입금"
                  : "오류"}
              </td>
              <td className="p-1 border border-stone-400">{pay.cardComp}</td>
              <td className="p-1 border border-stone-400" colSpan="2">
                {pay.cardCode === "" ||
                pay.cardCode === null ||
                pay.cardCode === undefined
                  ? pay.payerName
                  : pay.cardOwner}
              </td>
              <td className="p-1 border border-stone-400 truncate" colSpan="4">
                {pay.cardNum}
              </td>
              <td
                className={`p-1 border border-stone-400 ${
                  Number(pay.paidAd) > 0 && pay.transactionType === "P"
                    ? "text-green-600"
                    : Number(pay.paidAd) > 0 && pay.transactionType === "D"
                    ? "text-rose-600"
                    : ""
                }`}
              >
                {Number(pay.paidAd) > 0 && pay.transactionType === "P"
                  ? "+"
                  : Number(pay.paidAd) > 0 && pay.transactionType === "D"
                  ? "-"
                  : ""}
                {Number(pay.paidAd).toLocaleString()}
              </td>
              <td
                className={`p-1 border border-stone-400 ${
                  Number(pay.paidComm) > 0 && pay.transactionType === "P"
                    ? "text-green-600"
                    : Number(pay.paidComm) > 0 && pay.transactionType === "D"
                    ? "text-rose-600"
                    : ""
                }`}
              >
                {Number(pay.paidComm) > 0 && pay.transactionType === "P"
                  ? "+"
                  : Number(pay.paidComm) > 0 && pay.transactionType === "D"
                  ? "-"
                  : ""}
                {Number(pay.paidComm).toLocaleString()}
              </td>
              <td
                className={`p-1 border border-stone-400 ${
                  Number(pay.paidIntvCare) > 0 && pay.transactionType === "P"
                    ? "text-green-600"
                    : Number(pay.paidIntvCare) > 0 &&
                      pay.transactionType === "D"
                    ? "text-rose-600"
                    : ""
                }`}
              >
                {Number(pay.paidIntvCare) > 0 && pay.transactionType === "P"
                  ? "+"
                  : Number(pay.paidIntvCare) > 0 && pay.transactionType === "D"
                  ? "-"
                  : ""}
                {Number(pay.paidIntvCare).toLocaleString()}
              </td>
              <td
                className={`p-1 border border-stone-400 ${
                  Number(pay.paidCommCare) > 0 && pay.transactionType === "P"
                    ? "text-green-600"
                    : Number(pay.paidCommCare) > 0 &&
                      pay.transactionType === "D"
                    ? "text-rose-600"
                    : ""
                }`}
              >
                {Number(pay.paidCommCare) > 0 && pay.transactionType === "P"
                  ? "+"
                  : Number(pay.paidCommCare) > 0 && pay.transactionType === "D"
                  ? "-"
                  : ""}
                {Number(pay.paidCommCare).toLocaleString()}
              </td>
              <td className="p-1 border border-stone-400">
                {dayjs(pay.paidDate).format("YY-MM-DD")}
              </td>
              <td className="p-1 border border-stone-400 w-[150px] relative">
                <CommisionMemo
                  memo={pay.bigo}
                  setMemo={props.setBigo}
                  setModalOn={props.setModalOn}
                />
              </td>
            </tr>
          ))}
        </>
      ) : (
        <tr className="text-center">
          <td className="p-1 border bg-gray-100" colSpan="15">
            입금 내역이 없습니다
          </td>
        </tr>
      )}
    </>
  );
}

export default Deposit;
