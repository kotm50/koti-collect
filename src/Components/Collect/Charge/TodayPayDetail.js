import { useEffect, useState } from "react";
import MemoModal from "../../Layout/MemoModal";

import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 로케일 import
import CommisionMemo from "./CommisionMemo";

function TodayPayDetail(props) {
  const [modalOn, setModalOn] = useState(false);
  const [detailOn, setDetailOn] = useState(false);
  const [period, setPeriod] = useState(10);
  const [memo, setMemo] = useState("");

  const getPayTitle = payType => {
    if (payType === "CA") {
      return "개인";
    } else if (payType === "CO") {
      return "법인";
    } else if (payType === "PG") {
      return "카드(PG)";
    } else if (payType === "MO") {
      return "카드(몬)";
    } else if (payType === "HE") {
      return "카드(천국)";
    } else {
      return "오류";
    }
  };

  const handleList = () => {
    setDetailOn(!detailOn);
    props.setActiveDetailId(props.idx);
  };

  useEffect(() => {
    // 상위 컴포넌트로부터 받은 isActive prop에 따라 detailOn 상태를 설정
    setDetailOn(props.isActive);
  }, [props.isActive]);

  useEffect(() => {
    if (
      props.comm.paymentDueDate !== null &&
      props.comm.paymentDueDate !== undefined &&
      props.comm.paymentDueDate !== ""
    ) {
      chkDueDate(props.comm.paymentDueDate);
    }
    //eslint-disable-next-line
  }, [props.comm]);

  const chkDueDate = date => {
    const today = new Date();
    const dueDate = new Date(date);
    const timeDifference = Math.abs(dueDate - today);
    const daysDifference = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
    setPeriod(daysDifference);
  };

  useEffect(() => {
    if (detailOn) {
      props.setCommCode(props.comm.commCode);
      props.setPayCode(props.comm.payCode);
      props.setInputOn(true);
    }
    //eslint-disable-next-line
  }, [detailOn]);

  return (
    <>
      <tr
        className={`text-center hover:cursor-pointer`}
        title="수정하려면 클릭하세요"
      >
        <td
          className={`p-1 border ${detailOn ? "bg-blue-100 font-bold" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {props.comm.channel}
        </td>
        <td
          className={`p-1 border ${detailOn ? "bg-blue-100 font-bold" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {props.comm.companyName}
        </td>
        <td
          className={`p-1 border ${detailOn ? "bg-blue-100 font-bold" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {props.comm.companyBranch}
        </td>
        <td
          className={`p-1 border ${detailOn ? "bg-blue-100 font-bold" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {props.comm.manager1}
        </td>
        <td
          className={`p-1 border ${detailOn ? "bg-blue-100 font-bold" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {props.comm.manager2}
        </td>
        <td
          className={`p-1 border ${detailOn ? "bg-blue-100 font-bold" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {props.comm.hireStartDate
            ? dayjs(new Date(props.comm.hireStartDate)).format("YY-MM-DD")
            : ""}
        </td>
        <td
          className={`p-1 border ${detailOn ? "bg-blue-100 font-bold" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {props.comm.hireEndDate
            ? dayjs(new Date(props.comm.hireEndDate)).format("YY-MM-DD")
            : ""}
        </td>
        <td
          className={`p-1 border ${detailOn ? "bg-blue-100 font-bold" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {props.comm.week &&
          props.comm.day &&
          props.comm.week !== "0" &&
          props.comm.day !== "0"
            ? `${props.comm.week}주 ${props.comm.day}일`
            : null}
        </td>
        <td
          className={`p-1 border ${detailOn ? "bg-blue-100 font-bold" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {props.comm.dualType}
        </td>
        <td
          className={`p-1 border font-medium ${
            props.comm.paidAdYn === "N" ? "text-rose-500" : ""
          } ${detailOn ? "bg-blue-100 font-bold" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {Number(props.comm.paidAd).toLocaleString()}
        </td>

        <td
          className={`p-1 border font-medium ${
            props.comm.paidIntvCareYn === "N" ? "text-rose-500" : ""
          } ${detailOn ? "bg-blue-100 font-bold" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {Number(props.comm.paidIntvCare).toLocaleString()}
        </td>

        <td
          className={`p-1 border font-medium ${
            props.comm.paidCommCareYn === "N" ? "text-rose-500" : ""
          } ${detailOn ? "bg-blue-100 font-bold" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {Number(props.comm.paidCommCare).toLocaleString()}
        </td>

        <td
          className={`p-1 border font-medium ${
            props.comm.paidCommYn === "N" ? "text-rose-500" : ""
          } ${detailOn ? "bg-blue-100 font-bold" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {Number(props.comm.paidComm).toLocaleString()}
        </td>

        <td
          className={`p-1 border ${detailOn ? "bg-blue-100 font-bold" : ""} ${
            period <= 1 ? "font-bold" : ""
          }`}
          onClick={() => {
            handleList();
          }}
        >
          {getPayTitle(props.comm.payType)}
        </td>
        <td
          className={`border w-[150px] relative hover:cursor-auto ${
            detailOn ? "bg-blue-100 font-bold" : ""
          }`}
        >
          <CommisionMemo
            memo={props.comm.bigo}
            setMemo={setMemo}
            setModalOn={setModalOn}
          />
          {modalOn && <MemoModal memo={memo} setModalOn={setModalOn} />}
        </td>
      </tr>
    </>
  );
}

export default TodayPayDetail;
