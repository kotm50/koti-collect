import { useEffect, useState } from "react";

import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 로케일 import
import CommisionMemo from "./CommisionMemo";
import Deposit from "./Deposit";

function CommissionDetail(props) {
  const [detailOn, setDetailOn] = useState(false);
  const handleList = () => {
    if (!detailOn) {
      props.setCommCode(props.comm.commCode);
      props.setIdNum(props.idx);
    } else {
      props.setCommCode(null);
      props.setPayCode(null);
      props.setIdNum(null);
    }
    setDetailOn(!detailOn);
  };

  useEffect(() => {
    if (props.idx === props.idNum) {
      props.setInputOn(true);
      setDetailOn(true);
    } else {
      setDetailOn(false);
    }
    //eslint-disable-next-line
  }, [props.idNum]);

  return (
    <>
      <tr
        className="bg-white text-center hover:cursor-pointer"
        title="수정하려면 클릭하세요"
      >
        <td
          className={`p-1 border ${detailOn ? "bg-blue-100 font-medium" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {props.comm.channel}
        </td>
        <td
          className={`p-1 border ${detailOn ? "bg-blue-100 font-medium" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {props.comm.companyName}
        </td>
        <td
          className={`p-1 border ${detailOn ? "bg-blue-100 font-medium" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {props.comm.companyBranch}
        </td>
        <td
          className={`p-1 border ${detailOn ? "bg-blue-100 font-medium" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {props.comm.manager1}
        </td>
        <td
          className={`p-1 border ${detailOn ? "bg-blue-100 font-medium" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {props.comm.manager2}
        </td>
        <td
          className={`p-1 border ${detailOn ? "bg-blue-100 font-medium" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {dayjs(props.comm.hireStartDate).format("YY-MM-DD")}
        </td>
        <td
          className={`p-1 border ${detailOn ? "bg-blue-100 font-medium" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {dayjs(props.comm.hireEndDate).format("YY-MM-DD")}
        </td>
        <td
          className={`p-1 border ${detailOn ? "bg-blue-100 font-medium" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {props.comm.week}주 {props.comm.day}일
        </td>
        <td
          className={`p-1 border ${detailOn ? "bg-blue-100 font-medium" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {props.comm.dualType}
        </td>
        <td
          className={`p-1 border ${
            props.comm.paidAdYn === "N" ? "text-rose-500" : ""
          } ${detailOn ? "bg-blue-100 font-medium" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {Number(props.comm.unpaidAd).toLocaleString()}
        </td>

        <td
          className={`p-1 border ${
            props.comm.paidCommYn === "N" ? "text-rose-500" : ""
          } ${detailOn ? "bg-blue-100 font-medium" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {Number(props.comm.unpaidComm).toLocaleString()}
        </td>

        <td
          className={`p-1 border ${
            props.comm.paidIntvCareYn === "N" ? "text-rose-500" : ""
          } ${detailOn ? "bg-blue-100 font-medium" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {Number(props.comm.unpaidIntvCare).toLocaleString()}
        </td>

        <td
          className={`p-1 border ${
            props.comm.paidCommCareYn === "N" ? "text-rose-500" : ""
          } ${detailOn ? "bg-blue-100 font-medium" : ""}`}
          onClick={() => {
            handleList();
          }}
        >
          {Number(props.comm.unpaidCommCare).toLocaleString()}
        </td>
        <td
          className={`border w-[150px] relative ${
            detailOn ? "bg-blue-100 font-medium" : ""
          }`}
        >
          <CommisionMemo memo={props.comm.memo} />
        </td>
      </tr>
      {detailOn ? (
        <tr>
          <td colSpan="14" className="bg-blue-100 text-center p-1 border-x">
            <Deposit
              accessToken={props.user.accessToken}
              commCode={props.comm.commCode}
              branch={props.comm.companyBranch}
              company={props.comm.companyName}
              payList={props.payList}
              getPayList={props.getPayList}
              setPayCode={props.setPayCode}
              detailOn={detailOn}
            />
          </td>
        </tr>
      ) : null}
    </>
  );
}

export default CommissionDetail;
