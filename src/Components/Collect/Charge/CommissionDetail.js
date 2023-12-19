import { useEffect, useState } from "react";
import MemoModal from "../../Layout/MemoModal";

import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 로케일 import
import CommisionMemo from "./CommisionMemo";
import Deposit from "./Deposit";

function CommissionDetail(props) {
  const [modalOn, setModalOn] = useState(false);
  const [detailOn, setDetailOn] = useState(false);
  const [period, setPeriod] = useState(10);
  const [memo, setMemo] = useState("");

  const handleList = () => {
    console.log(props.isActive);
    if (props.isActive) {
      props.setCommCode(null);
      props.setActiveDetailId(null); // 현재 컴포넌트가 활성화되어 있다면 비활성화
    } else {
      props.setCommCode(props.comm.commCode);
      props.setTestNum(props.idx);
      props.setActiveDetailId(props.idx); // 다른 컴포넌트를 활성화
    }
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
      props.setInputOn(true);
    }
    //eslint-disable-next-line
  }, [detailOn]);

  return (
    <>
      <tr
        className={`text-center hover:cursor-pointer ${
          period <= 3 && period > 1
            ? "bg-purple-100"
            : period <= 1
            ? "bg-violet-200"
            : "bg-white"
        }`}
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
          {props.comm.week !== null && props.comm.day !== null ? (
            <>
              {props.comm.week !== "" && props.comm.day !== ""
                ? `${props.comm.week}주 ${props.comm.day}일`
                : ""}
            </>
          ) : null}
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
          {Number(props.comm.unpaidAd).toLocaleString()}
        </td>

        <td
          className={`p-1 border font-medium ${
            props.comm.paidCommYn === "N" ? "text-rose-500" : ""
          } ${detailOn ? "bg-blue-100 font-bold" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {Number(props.comm.unpaidComm).toLocaleString()}
        </td>

        <td
          className={`p-1 border font-medium ${
            props.comm.paidIntvCareYn === "N" ? "text-rose-500" : ""
          } ${detailOn ? "bg-blue-100 font-bold" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {Number(props.comm.unpaidIntvCare).toLocaleString()}
        </td>

        <td
          className={`p-1 border font-medium ${
            props.comm.paidCommCareYn === "N" ? "text-rose-500" : ""
          } ${detailOn ? "bg-blue-100 font-bold" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {Number(props.comm.unpaidCommCare).toLocaleString()}
        </td>
        <td
          className={`p-1 border ${detailOn ? "bg-blue-100 font-bold" : ""} ${
            period <= 1 ? "font-bold" : ""
          }`}
          onClick={() => {
            handleList();
          }}
        >
          {props.comm.paymentDueDate
            ? dayjs(new Date(props.comm.paymentDueDate)).format("YY-MM-DD")
            : ""}
        </td>
        <td
          className={`border w-[150px] relative hover:cursor-auto ${
            detailOn ? "bg-blue-100 font-bold" : ""
          }`}
        >
          <CommisionMemo
            memo={props.comm.memo}
            setMemo={setMemo}
            setModalOn={setModalOn}
          />
          {modalOn && <MemoModal memo={memo} setModalOn={setModalOn} />}
        </td>
      </tr>
      {detailOn ? (
        <Deposit
          accessToken={props.user.accessToken}
          commCode={props.comm.commCode}
          branch={props.comm.companyBranch}
          company={props.comm.companyName}
          payList={props.payList}
          getPayList={props.getPayList}
          setPayCode={props.setPayCode}
          detailOn={detailOn}
          setMemo={setMemo}
          setModalOn={setModalOn}
        />
      ) : null}
    </>
  );
}

export default CommissionDetail;
