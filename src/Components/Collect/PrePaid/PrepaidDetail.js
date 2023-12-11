import React, { useState } from "react";

function PrepaidDetail(props) {
  const [focus, setFocus] = useState(null);
  return (
    <>
      <tr
        className={`text-center hover:cursor-pointer ${
          focus === props.idx ? "bg-blue-100" : "bg-white"
        }`}
        title="수정하려면 클릭하세요"
        onClick={() => {
          console.log(props);
          if (focus !== props.idx) {
            props.setCompanyCode(props.pay.companyCode);
            props.setCompanyName(
              `${props.pay.companyName} ${props.pay.companyBranch}`
            );
            props.getCompanyPrepayList(
              props.pay.companyCode,
              props.transactionType
            );
            props.setCCode(props.pay.companyCode);
            props.setPrepayCode(null);
            props.setInputOn(true);

            setFocus(props.idx);
          } else {
            props.setCompanyCode(null);
            props.setCompanyName(null);
            setFocus(null);
          }
        }}
      >
        <td className="p-1 border text-sm">
          {props.pay.companyName} {props.pay.companyBranch}
        </td>
        <td className="p-1 border text-sm">{props.pay.manager1}</td>
        <td className="p-1 border text-sm">{props.pay.manager2 || ""}</td>
      </tr>
    </>
  );
}

export default PrepaidDetail;
