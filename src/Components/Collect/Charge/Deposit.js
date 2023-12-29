import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 로케일 import
import CommisionMemo from "./CommisionMemo";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Deposit(props) {
  const navi = useNavigate();
  const [payList, setPayList] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [payCode, setPayCode] = useState("");

  const getPayList = async commCode => {
    const data = {
      commCode: commCode,
    };
    await axios
      .post("/api/v1/comp/get/pay/list", data, {
        headers: { Authorization: props.user.accessToken },
      })
      .then(res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          navi("/");
          return false;
        }
        setPayList(res.data.payList);
      })
      .catch(e => console.log(e));
  };

  const handleList = async pCode => {
    setPayCode(pCode);
    await resetPayCode();
    await getPayCode(pCode);
  };

  const getPayCode = code => {
    props.setPayCode(code);
  };

  const resetPayCode = () => {
    props.setPayCode(null);
  };
  useEffect(() => {
    if (props.detailOn) {
      getPayList(props.commCode);
    } else {
      setPayList([]);
    }
    //eslint-disable-next-line
  }, [props.detailOn]);

  useEffect(() => {
    console.log(props.payCode);
    if (props.payCode === payCode) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [props.payCode, payCode]);
  return (
    <>
      <tr className="bg-yellow-300 font-bold text-center border-t-2 border-black">
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
      {payList.length > 0 ? (
        <>
          {payList.map((pay, idx) => (
            <tr
              key={idx}
              className={`hover:cursor-pointer text-center border-b-2 border-black ${
                isSelected ? "bg-teal-200" : "bg-gray-200"
              }`}
              data-code={pay.payCode}
            >
              <td
                className="p-1 border border-stone-400"
                onClick={() => {
                  handleList(pay.payCode);
                }}
              >
                {pay.transactionType === "P"
                  ? "입금"
                  : pay.transactionType === "D"
                  ? "환급"
                  : "오류"}
              </td>
              <td
                className="p-1 border border-stone-400"
                onClick={() => {
                  handleList(pay.payCode);
                }}
              >
                {pay.payType === "CA"
                  ? "현금"
                  : pay.payType === "CO"
                  ? "법인"
                  : pay.payType === "PG"
                  ? "PG카드"
                  : pay.payType === "MO"
                  ? "알바몬카드"
                  : pay.payType === "HE"
                  ? "천국카드"
                  : pay.payType === "PR"
                  ? "선입금"
                  : "오류"}
              </td>
              <td
                className="p-1 border border-stone-400"
                onClick={() => {
                  handleList(pay.payCode);
                }}
              >
                {pay.cardComp}
              </td>
              <td
                className="p-1 border border-stone-400"
                colSpan="2"
                onClick={() => {
                  handleList(pay.payCode);
                }}
              >
                {pay.cardCode === "" ||
                pay.cardCode === null ||
                pay.cardCode === undefined
                  ? pay.payerName
                  : pay.cardOwner}
              </td>
              <td
                className="p-1 border border-stone-400 truncate"
                colSpan="4"
                onClick={() => {
                  handleList(pay.payCode);
                }}
              >
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
                onClick={() => {
                  handleList(pay.payCode);
                }}
              >
                {Number(pay.paidAd) > 0 && pay.transactionType === "P"
                  ? "+"
                  : Number(pay.paidAd) > 0 && pay.transactionType === "D"
                  ? "-"
                  : ""}
                {Number(pay.paidAd).toLocaleString()}
              </td>
              <td
                onClick={() => {
                  handleList(pay.payCode);
                }}
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
                onClick={() => {
                  handleList(pay.payCode);
                }}
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
                onClick={() => {
                  handleList(pay.payCode);
                }}
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
              <td
                onClick={() => {
                  handleList(pay.payCode);
                }}
                className="p-1 border border-stone-400"
              >
                {dayjs(new Date(pay.paidDate)).format("YY-MM-DD")}
              </td>
              <td className="border border-stone-400 w-[150px] relative">
                <CommisionMemo
                  memo={pay.bigo}
                  setMemo={props.setMemo}
                  setModalOn={props.setModalOn}
                />
              </td>
            </tr>
          ))}
        </>
      ) : (
        <tr className="text-center border-b-2 border-black">
          <td className="p-1 border bg-gray-100" colSpan="15">
            입금 내역이 없습니다
          </td>
        </tr>
      )}
    </>
  );
}

export default Deposit;
