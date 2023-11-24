import React, { useEffect, useState } from "react";

import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 로케일 import
import CommisionMemo from "./CommisionMemo";

function CommisionList(props) {
  const [commisionList, setCommisionList] = useState([]);
  useEffect(() => {
    setCommisionList(props.feeList);
  }, [props]);
  return (
    <>
      {commisionList.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr className="text-white bg-blue-500 text-center">
              <td className="p-1 border">채널</td>
              <td className="p-1 border">고객사</td>
              <td className="p-1 border">지점명</td>
              <td className="p-1 border">담당자1</td>
              <td className="p-1 border">담당자2</td>
              <td className="p-1 border">시작일</td>
              <td className="p-1 border">종료일</td>
              <td className="p-1 border">기간</td>
              <td className="p-1 border">듀얼</td>
              <td className="p-1 border">광고비 미수금</td>
              <td className="p-1 border">위촉비 미수금</td>
              <td className="p-1 border">면케 미수금</td>
              <td className="p-1 border">위케 미수금</td>
              <td className="p-1 border">메모</td>
            </tr>
          </thead>
          <tbody>
            {commisionList.map((comm, idx) => (
              <tr
                key={idx}
                className="bg-white text-center hover:cursor-pointer"
                title="수정하려면 클릭하세요"
                onClick={() => props.setEdit(comm)}
              >
                <td className="p-1 border">{comm.channel}</td>
                <td className="p-1 border">{comm.companyName}</td>
                <td className="p-1 border">{comm.companyBranch}</td>
                <td className="p-1 border">{comm.manager1}</td>
                <td className="p-1 border">{comm.manager2}</td>
                <td className="p-1 border">
                  {dayjs(comm.hireStartDate).format("YY-MM-DD")}
                </td>
                <td className="p-1 border">
                  {dayjs(comm.hireEndDate).format("YY-MM-DD")}
                </td>
                <td className="p-1 border">
                  {comm.week}주 {comm.day}일
                </td>
                <td className="p-1 border">{comm.dualType}</td>
                <td className="p-1 border">
                  {Number(comm.unpaidAd).toLocaleString()} 원
                </td>
                <td className="p-1 border">
                  {Number(comm.unpaidComm).toLocaleString()} 원
                </td>
                <td className="p-1 border">
                  {Number(comm.unpaidIntvCare).toLocaleString()} 원
                </td>
                <td className="p-1 border">
                  {Number(comm.unpaidCommCare).toLocaleString()} 원
                </td>
                <td className="p-1 border max-w-[150px] relative">
                  <CommisionMemo memo={comm.memo} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </>
  );
}

export default CommisionList;
