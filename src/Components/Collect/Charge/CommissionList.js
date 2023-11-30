import React, { useEffect, useState } from "react";

import CommissionDetail from "./CommissionDetail";

function CommissionList(props) {
  const [commisionList, setCommissionList] = useState([]);
  useEffect(() => {
    setCommissionList(props.feeList);
  }, [props]);
  return (
    <>
      {commisionList.length > 0 ? (
        <table id="mainTable" className="w-full">
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
              <React.Fragment key={idx}>
                <CommissionDetail
                  comm={comm}
                  edit={props.edit}
                  setEdit={props.setEdit}
                  idx={idx}
                />
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : null}
    </>
  );
}

export default CommissionList;
