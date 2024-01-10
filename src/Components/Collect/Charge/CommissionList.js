import React, { useEffect, useState } from "react";
import sorry from "../../../Asset/sorry.png";

import CommissionDetail from "./CommissionDetail";

function CommissionList(props) {
  const [commissionList, setCommissionList] = useState([]);
  const [idNum, setIdNum] = useState(null);
  // 상태 추가: 현재 활성화된 CommissionDetail 컴포넌트 ID
  const [activeDetailId, setActiveDetailId] = useState(null);
  useEffect(() => {
    console.log(props.feeList);
    if (props.feeList.length === 0) {
      setIdNum(null);
    }
    setCommissionList(props.feeList);
  }, [props]);

  return (
    <>
      {commissionList.length > 0 ? (
        <table id="mainTable" className="w-full mb-[50px]">
          <thead className="sticky top-0 left-0 z-30">
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
              <td className="p-1 border">면케 미수금</td>
              <td className="p-1 border">위케 미수금</td>
              <td className="p-1 border">위촉비 미수금</td>
              <td className="p-1 border">입금 예정일</td>
              <td className="p-1 border">메모</td>
            </tr>
          </thead>
          <tbody>
            {commissionList.map((comm, idx) => (
              <React.Fragment key={idx}>
                <CommissionDetail
                  user={props.user}
                  comm={comm}
                  idx={idx}
                  idNum={idNum}
                  setIdNum={setIdNum}
                  payList={props.payList}
                  getPayList={props.getPayList}
                  commissionList={props.feeList}
                  setCommCode={props.setCommCode}
                  payCode={props.payCode}
                  setPayCode={props.setPayCode}
                  setInputOn={props.setInputOn}
                  setTestNum={props.setTestNum}
                  // 추가된 props
                  isActive={idx === activeDetailId} // 현재 활성화된 컴포넌트인지 체크
                  setActiveDetailId={setActiveDetailId} // 상태 업데이트 함수 전달
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
    </>
  );
}

export default CommissionList;
