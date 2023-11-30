import { useEffect, useState } from "react";

import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 로케일 import
import CommisionMemo from "./CommisionMemo";
import Deposit from "./Deposit";

function CommissionDetail(props) {
  const [detailOn, setDetailOn] = useState(false);
  const handleList = async () => {
    await resetEdit();
    if (!detailOn) {
      let com = props.comm;
      com.idNum = props.idx;
      props.setEdit(com);
    }
  };

  const resetEdit = () => {
    props.setEdit(null);
  };

  useEffect(() => {
    console.log(props.comm);
    if (props.edit) {
      if (props.edit.idNum === props.idx) {
        setDetailOn(true);
      } else {
        setDetailOn(false);
      }
    } else {
      setDetailOn(false);
    }
    //eslint-disable-next-line
  }, [props.edit]);
  return (
    <>
      <tr
        className="bg-white text-center hover:cursor-pointer"
        title="수정하려면 클릭하세요"
        onClick={() => {
          handleList();
        }}
      >
        <td className="p-1 border">{props.comm.channel}</td>
        <td className="p-1 border">{props.comm.companyName}</td>
        <td className="p-1 border">{props.comm.companyBranch}</td>
        <td className="p-1 border">{props.comm.manager1}</td>
        <td className="p-1 border">{props.comm.manager2}</td>
        <td className="p-1 border">
          {dayjs(props.comm.hireStartDate).format("YY-MM-DD")}
        </td>
        <td className="p-1 border">
          {dayjs(props.comm.hireEndDate).format("YY-MM-DD")}
        </td>
        <td className="p-1 border">
          {props.comm.week}주 {props.comm.day}일
        </td>
        <td className="p-1 border">{props.comm.dualType}</td>
        <td
          className={`p-1 border ${
            props.comm.paidAdYn === "N"
              ? "text-rose-500"
              : props.comm.paidAdYn === "Y"
              ? "text-green-500"
              : ""
          }`}
        >
          {Number(props.comm.unpaidAd).toLocaleString()}
        </td>

        <td
          className={`p-1 border ${
            props.comm.paidCommYn === "N"
              ? "text-rose-500"
              : props.comm.paidCommYn === "Y"
              ? "text-green-500"
              : ""
          }`}
        >
          {Number(props.comm.unpaidComm).toLocaleString()}
        </td>

        <td
          className={`p-1 border ${
            props.comm.paidIntvCareYn === "N"
              ? "text-rose-500"
              : props.comm.paidIntvCareYn === "Y"
              ? "text-green-500"
              : ""
          }`}
        >
          {Number(props.comm.unpaidIntvCare).toLocaleString()}
        </td>

        <td
          className={`p-1 border ${
            props.comm.paidCommCareYn === "N"
              ? "text-rose-500"
              : props.comm.paidCommCareYn === "Y"
              ? "text-green-500"
              : ""
          }`}
        >
          {Number(props.comm.unpaidCommCare).toLocaleString()}
        </td>
        <td className="p-1 border max-w-[150px] relative">
          <CommisionMemo memo={props.comm.memo} />
        </td>
      </tr>
      {detailOn ? (
        <tr>
          <td colSpan="14" className="bg-gray-100 text-center p-0 border-x">
            <Deposit
              commCode={props.comm.commCode}
              branch={props.comm.companyBranch}
              company={props.comm.companyName}
              setEdit={props.setEdit}
            />
          </td>
        </tr>
      ) : null}
    </>
  );
}

export default CommissionDetail;
