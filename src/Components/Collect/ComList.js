import React, { useState } from "react";
import ComEdit, { getAliasList } from "./ComEdit";
import axiosInstance from "../../Api/axiosInstance";

function ComList(props) {
  const [edit, setEdit] = useState(false);

  const deleteCompany = async () => {
    const deleteIt = window.confirm("삭제하면 복구할 수 없습니다. 진행할까요?");
    if (!deleteIt) {
      return false;
    } else {
      const data = {
        companyCode: props.com.companyCode,
      };
      await axiosInstance
        .delete("/api/v1/comp/del/company", {
          data: data,
          headers: { Authorization: props.user.accessToken },
        })
        .then(res => {
          alert("삭제하였습니다");
          props.getCompanyList(props.page, props.keyword);
        })
        .catch(e => console.log(e));
    }
  };
  return (
    <>
      {edit ? (
        <ComEdit
          com={props.com}
          setEdit={setEdit}
          user={props.user}
          getCompanyList={props.getCompanyList}
          page={props.page}
          keyword={props.keyword}
          gubun={props.gubun}
          channel={props.channel}
        />
      ) : (
        <>
          <td className="p-2 text-rose-500 text-xs font-bold uppercase truncate">
            {props.com.newYn === "Y" ? "new" : null}
          </td>
          <td className="p-2">{props.num}</td>
          <td className="p-2 truncate">{props.com.gubun}</td>
          <td className="p-2 truncate">{props.com.channel}</td>
          <td className="p-2 truncate" title={props.com.companyName}>
            {props.com.companyName}
          </td>
          <td className="p-2 truncate" title={props.com.companyBranch}>
            {props.com.companyBranch}
          </td>
          <td className="p-2 truncate">{props.com.manager1}</td>
          <td className="p-2 truncate">{props.com.manager2}</td>
          <td className="p-2 truncate" title={getAliasList(props.com)}>
            {getAliasList(props.com)}
          </td>
          <td className="p-1">
            <div className="flex gap-1">
              <button
                className="flex-1 bg-blue-500 text-white py-1 px-1"
                onClick={e => setEdit(true)}
                disabled={!props.user.admin}
              >
                수정
              </button>
              <button
                className="flex-1 bg-rose-500 text-white py-1 px-1"
                onClick={e => deleteCompany()}
                disabled={!props.user.admin}
              >
                삭제
              </button>
            </div>
          </td>
        </>
      )}
    </>
  );
}

export default ComList;
