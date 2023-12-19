import React, { useEffect, useState } from "react";
import sorry from "../../../Asset/sorry.png";

import CommissionDetailBack from "./CommissionDetailBack";

function CommissionListBack(props) {
  const [commisionList, setCommissionList] = useState([]);
  const [idNum, setIdNum] = useState(null);
  const [height, setHeight] = useState(640);
  useEffect(() => {
    if (props.inputOn) {
      setHeight(240);
    } else {
      setHeight(640);
    }
  }, [props.inputOn]);
  useEffect(() => {
    if (props.feeList.length === 0) {
      setIdNum(null);
    }
    setCommissionList(props.feeList);
  }, [props]);

  useEffect(() => {
    //elint-disable-next-line
  }, [props.inputOn]);
  return (
    <div className="relative overflow-auto" style={{ height: `${height}px` }}>
      {commisionList.length > 0 ? (
        <table id="mainTable" className="w-full mb-[50px]">
          <thead className="sticky top-0 left-0 z-50">
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
              <td className="p-1 border">입금 예정일</td>
              <td className="p-1 border">메모</td>
            </tr>
          </thead>
          <tbody>
            {commisionList.map((comm, idx) => (
              <React.Fragment key={idx}>
                <CommissionDetailBack
                  user={props.user}
                  comm={comm}
                  idx={idx}
                  idNum={idNum}
                  setIdNum={setIdNum}
                  payList={props.payList}
                  getPayList={props.getPayList}
                  commisionList={props.feeList}
                  setCommCode={props.setCommCode}
                  setPayCode={props.setPayCode}
                  setInputOn={props.setInputOn}
                />
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : props.loading ? (
        <div className="text-2xl text-bold text-center">
          <img
            src={sorry}
            className="mx-auto w-[240px] h-auto mb-5 mt-20"
            alt="오류"
          />
          조회 된 내용이 없습니다
        </div>
      ) : (
        <div className="text-2xl text-center text-bold">
          잠시만 기다려 주세요
        </div>
      )}
    </div>
  );
}

export default CommissionListBack;
