import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

function ComList(props) {
  const [edit, setEdit] = useState(false);
  const [inputGubun, setInputGubun] = useState("");
  const [inputCompanyName, setInputCompanyName] = useState("");
  const [inputCompanyBranch, setInputCompanyBranch] = useState("");
  const [inputChannel, setInputChannel] = useState("");
  const [inputManager1, setInputManager1] = useState("");
  const [inputMananger2, setInputManager2] = useState("");
  const gubunRef = useRef();
  const nameRef = useRef();
  const branchRef = useRef();
  const channelRef = useRef();
  const manager1Ref = useRef();
  const manager2Ref = useRef();
  useEffect(() => {
    setInputGubun(props.com.gubun);
    setInputCompanyName(props.com.companyName);
    setInputCompanyBranch(props.com.companyBranch);
    setInputChannel(props.com.channel);
    setInputManager1(props.com.manager1);
    setInputManager2(props.com.manager2);
  }, [props.com]);
  const inputKeyDown = e => {
    if (e.key === "Enter") {
      editCompany();
    }
    if (e.target === gubunRef.current) {
      if (e.key === "ArrowRight") {
        nameRef.current.focus();
      }
    }

    if (e.target === nameRef.current) {
      if (e.key === "ArrowRight") {
        branchRef.current.focus();
      } else if (e.key === "ArrowLeft") {
        gubunRef.current.focus();
      }
    }

    if (e.target === branchRef.current) {
      if (e.key === "ArrowRight") {
        channelRef.current.focus();
      } else if (e.key === "ArrowLeft") {
        nameRef.current.focus();
      }
    }
    if (e.target === channelRef.current) {
      if (e.key === "ArrowRight") {
        manager1Ref.current.focus();
      } else if (e.key === "ArrowLeft") {
        branchRef.current.focus();
      }
    }
    if (e.target === manager1Ref.current) {
      if (e.key === "ArrowRight") {
        manager2Ref.current.focus();
      } else if (e.key === "ArrowLeft") {
        channelRef.current.focus();
      }
    }
    if (e.target === manager2Ref.current) {
      if (e.key === "ArrowLeft") {
        manager1Ref.current.focus();
      }
    }
  };

  const cancelEdit = () => {
    setInputGubun(props.com.gubun);
    setInputCompanyName(props.com.companyName);
    setInputCompanyBranch(props.com.companyBranch);
    setInputChannel(props.com.channel);
    setInputManager1(props.com.manager1);
    setInputManager2(props.com.manager2);
    setEdit(false);
  };

  const editCompany = async () => {
    const test = await inputTest();
    if (test !== "완료") {
      return alert(test);
    }
    const editIt = window.confirm("수정하면 복구할 수 없습니다. 진행할까요?");
    if (!editIt) {
      return false;
    } else {
      const data = {
        companyCode: props.com.companyCode,
        gubun: inputGubun,
        companyName: inputCompanyName,
        companyBranch: inputCompanyBranch,
        channel: inputChannel,
        manager1: inputManager1,
        manager2: inputMananger2,
      };

      await axios
        .post("/api/v1/comp/upt/company", data, {
          headers: { Authorization: props.user.accessToken },
        })
        .then(res => {
          console.log(res);
          alert("수정하였습니다");
          cancelEdit();
          props.getCompanyList(props.page, props.keyword);
        })
        .catch(e => console.log(e));
    }
  };

  const inputTest = async () => {
    if (
      inputGubun === props.com.gubun &&
      inputCompanyName === props.com.companyName &&
      inputCompanyBranch === props.com.companyBranch &&
      inputChannel === props.com.channel &&
      inputManager1 === props.com.manager1 &&
      inputMananger2 === props.com.manager2
    ) {
      return "수정 된 값이 없습니다";
    }

    if (inputGubun === "") {
      return "구분값을 입력하세요";
    }

    if (inputCompanyName === "") {
      return "고객사명을 입력하세요";
    }

    if (inputCompanyBranch === "") {
      return "지점명을 입력하세요";
    }

    if (inputChannel === "") {
      return "채널을 입력하세요";
    }

    if (inputManager1 === "") {
      return "담당자를 1명 이상 입력하세요";
    }
    return "완료";
  };
  const deleteCompany = async () => {
    console.log(props.user);
    console.log(props.com.companyCode);
    const deleteIt = window.confirm("삭제하면 복구할 수 없습니다. 진행할까요?");
    if (!deleteIt) {
      return false;
    } else {
      const data = {
        companyCode: props.com.companyCode,
      };
      await axios
        .post("/api/v1/comp/del/company", data, {
          headers: { Authorization: props.user.accessToken },
        })
        .then(res => {
          console.log(res);
          alert("삭제하였습니다");
          props.getCompanyList(props.page, props.keyword);
        })
        .catch(e => console.log(e));
    }
  };
  return (
    <>
      {edit ? (
        <>
          <td className="p-2 font-bold bg-indigo-100">{props.num}</td>
          <td className="p-1 bg-indigo-100">
            <input
              type="text"
              ref={gubunRef}
              value={inputGubun}
              className="p-1 border bg-white focus:border-gray-500 uppercase"
              placeholder="구분값 입력"
              onChange={e => setInputGubun(e.currentTarget.value)}
              onKeyDown={inputKeyDown}
            />
          </td>
          <td className="p-1 bg-indigo-100">
            <input
              type="text"
              ref={nameRef}
              value={inputCompanyName}
              className="p-1 border bg-white focus:border-gray-500"
              placeholder="고객사명 입력"
              onChange={e => setInputCompanyName(e.currentTarget.value)}
              onKeyDown={inputKeyDown}
            />
          </td>
          <td className="p-1 bg-indigo-100">
            <input
              type="text"
              ref={branchRef}
              value={inputCompanyBranch}
              className="p-1 border bg-white focus:border-gray-500"
              placeholder="지점명 입력"
              onChange={e => setInputCompanyBranch(e.currentTarget.value)}
              onKeyDown={inputKeyDown}
            />
          </td>
          <td className="p-1 bg-indigo-100">
            <input
              type="text"
              ref={channelRef}
              value={inputChannel}
              className="p-1 border bg-white focus:border-gray-500 uppercase"
              placeholder="채널 입력"
              onChange={e => setInputChannel(e.currentTarget.value)}
              onKeyDown={inputKeyDown}
            />
          </td>
          <td className="p-1 bg-indigo-100">
            <input
              type="text"
              ref={manager1Ref}
              value={inputManager1}
              className="p-1 border bg-white focus:border-gray-500"
              placeholder="담당자 1 입력"
              onChange={e => setInputManager1(e.currentTarget.value)}
              onKeyDown={inputKeyDown}
            />
          </td>
          <td className="p-1 bg-indigo-100">
            <input
              type="text"
              ref={manager2Ref}
              value={inputMananger2}
              className="p-1 border bg-white focus:border-gray-500"
              placeholder="담당자 2 입력"
              onChange={e => setInputManager2(e.currentTarget.value)}
              onKeyDown={inputKeyDown}
            />
          </td>
          <td className="p-1 grid grid-cols-2 gap-x-[10px] bg-indigo-100">
            <button
              className="bg-green-500 text-white p-1 min-w-[95px] w-full"
              onClick={e => editCompany()}
            >
              적용
            </button>
            <button
              className="bg-gray-500 text-white p-1 min-w-[95px] w-full"
              onClick={e => cancelEdit()}
            >
              취소
            </button>
          </td>
        </>
      ) : (
        <>
          <td className="p-2">{props.num}</td>
          <td className="p-2">{props.com.gubun}</td>
          <td className="p-2">{props.com.companyName}</td>
          <td className="p-2">{props.com.companyBranch}</td>
          <td className="p-2">{props.com.channel}</td>
          <td className="p-2">{props.com.manager1}</td>
          <td className="p-2">{props.com.manager2}</td>
          <td className="p-1 grid grid-cols-2 gap-x-[10px]">
            <button
              className="bg-blue-500 text-white p-1 min-w-[95px] w-full"
              onClick={e => setEdit(true)}
            >
              수정
            </button>
            <button
              className="bg-rose-500 text-white p-1 min-w-[95px] w-full"
              onClick={e => deleteCompany()}
            >
              삭제
            </button>
          </td>
        </>
      )}
    </>
  );
}

export default ComList;
