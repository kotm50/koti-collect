function PrepaidDetail(props) {
  return (
    <>
      <tr
        className={`text-center hover:cursor-pointer ${
          props.isFocused ? "bg-blue-100" : "bg-white"
        }`}
        title="수정하려면 클릭하세요"
        onClick={() => {
          if (!props.isFocused) {
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

            props.setFocusedDetailIndex(props.idx);
          } else {
            props.setCompanyCode(null);
            props.setCompanyName(null);
            props.setFocusedDetailIndex(null);
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
