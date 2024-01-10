import { useEffect, useState, useRef } from "react";
import axios from "axios";

function ComEdit(props) {
  const [selectGubun, setSelectGubun] = useState("");
  const [inputCompanyName, setInputCompanyName] = useState("");
  const [inputCompanyBranch, setInputCompanyBranch] = useState("");
  const [selectChannel, setSelectChannel] = useState("");
  const [inputManager1, setInputManager1] = useState("");
  const [inputMananger2, setInputManager2] = useState("");

  const [categoryList, setCategoryList] = useState([]);
  const [channelList, setChannelList] = useState([]);

  const gubunRef = useRef();
  const nameRef = useRef();
  const branchRef = useRef();
  const channelRef = useRef();
  const manager1Ref = useRef();
  const manager2Ref = useRef();
  useEffect(() => {
    getCategory();
    setInputCompanyName(props.com.companyName);
    setInputCompanyBranch(props.com.companyBranch);
    setInputManager1(props.com.manager1);
    setInputManager2(props.com.manager2);
    //eslint-disable-next-line
  }, [props.com]);

  useEffect(() => {
    setSelectChannel(props.com.channel);
    //eslint-disable-next-line
  }, [channelList]);

  const getChannelList = async category => {
    console.log("리스트 불러오기");
    setChannelList([]);
    const data = {
      category: category,
      useYn: "Y",
    };
    await axios
      .post("/api/v1/comp/get/comlist", data, {
        headers: { Authorization: props.user.accessToken },
      })
      .then(res => {
        setChannelList(res.data.commList);
      })
      .catch(e => console.log(e));
  };

  useEffect(() => {
    console.log(categoryList);
  }, [categoryList]);

  const getCategory = async () => {
    const data = {
      category: "GU",
      useYn: "Y",
    };
    await axios
      .post("/api/v1/comp/get/comlist", data, {
        headers: { Authorization: props.user.accessToken },
      })
      .then(res => {
        console.log(res);
        if (res.data.code === "E999" || res.data.code === "E403") {
          alert(res.data.message);
          props.logout();
          return false;
        }
        setCategoryList(res.data.commList);
      })
      .catch(e => console.log(e));
  };

  const inputKeyDown = e => {
    if (e.key === "Enter") {
      editCompany();
    }
    if (e.target === gubunRef.current) {
      if (e.key === "ArrowRight") {
        channelRef.current.focus();
      }
    }

    if (e.target === channelRef.current) {
      if (e.key === "ArrowRight") {
        nameRef.current.focus();
      } else if (e.key === "ArrowLeft") {
        gubunRef.current.focus();
      }
    }

    if (e.target === nameRef.current) {
      if (e.key === "ArrowRight") {
        branchRef.current.focus();
      } else if (e.key === "ArrowLeft") {
        channelRef.current.focus();
      }
    }
    if (e.target === branchRef.current) {
      if (e.key === "ArrowRight") {
        manager1Ref.current.focus();
      } else if (e.key === "ArrowLeft") {
        nameRef.current.focus();
      }
    }
    if (e.target === manager1Ref.current) {
      if (e.key === "ArrowRight") {
        manager2Ref.current.focus();
      } else if (e.key === "ArrowLeft") {
        branchRef.current.focus();
      }
    }
    if (e.target === manager2Ref.current) {
      if (e.key === "ArrowLeft") {
        manager1Ref.current.focus();
      }
    }
  };

  const cancelEdit = () => {
    setSelectGubun(props.com.gubun);
    setInputCompanyName(props.com.companyName);
    setInputCompanyBranch(props.com.companyBranch);
    setSelectChannel(props.com.channel);
    setInputManager1(props.com.manager1);
    setInputManager2(props.com.manager2);
    props.setEdit(false);
  };

  useEffect(() => {
    setSelectGubun(props.com.gubun);
    //eslint-disable-next-line
  }, [categoryList]);

  useEffect(() => {
    getChannelList(selectGubun);
    //eslint-disable-next-line
  }, [selectGubun]);
  const editCompany = async () => {
    const test = await inputTest();
    if (test !== "완료") {
      return alert(test);
    }
    const editIt = window.confirm("수정하시겠습니까?");
    if (!editIt) {
      return false;
    } else {
      const data = {
        companyCode: props.com.companyCode,
        gubun: selectGubun,
        companyName: inputCompanyName,
        companyBranch: inputCompanyBranch,
        channel: selectChannel,
        manager1: inputManager1,
        manager2: inputMananger2,
      };

      await axios
        .patch("/api/v1/comp/upt/company", data, {
          headers: { Authorization: props.user.accessToken },
        })
        .then(res => {
          alert("수정하였습니다");
          cancelEdit();
          props.getCompanyList(
            props.page,
            props.keyword,
            props.gubun,
            props.channel
          );
        })
        .catch(e => console.log(e));
    }
  };
  const inputTest = async () => {
    if (
      selectGubun === props.com.gubun &&
      inputCompanyName === props.com.companyName &&
      inputCompanyBranch === props.com.companyBranch &&
      selectChannel === props.com.channel &&
      inputManager1 === props.com.manager1 &&
      inputMananger2 === props.com.manager2
    ) {
      return "수정 된 데이터가 없습니다";
    }

    if (selectGubun === "") {
      return "구분값을 입력하세요";
    }

    if (inputCompanyName === "") {
      return "고객사명을 입력하세요";
    }

    if (inputCompanyBranch === "") {
      return "지점명을 입력하세요";
    }

    if (selectChannel === "") {
      return "채널을 입력하세요";
    }

    if (inputManager1 === "") {
      return "담당자를 1명 이상 입력하세요";
    }
    return "완료";
  };

  //구분 셀렉박스 핸들링
  const handleGubunSelect = e => {
    setSelectGubun(e.currentTarget.value);
  };

  //채널 셀렉박스 핸들링
  const handleChannelSelect = e => {
    setSelectChannel(e.currentTarget.value);
  };
  return (
    <>
      <td className="p-2 font-bold bg-indigo-100 w-8"></td>
      <td className="p-2 font-bold bg-indigo-100">{props.num}</td>
      <td className="p-1 bg-indigo-100">
        <select
          className="p-1 border bg-white focus:border-gray-500 uppercase w-full"
          ref={gubunRef}
          onChange={handleGubunSelect}
          value={selectGubun}
          onKeyDown={inputKeyDown}
        >
          <option value="">구분</option>
          {categoryList && categoryList.length > 0 ? (
            <>
              {categoryList.map((cat, idx) => (
                <option key={idx} value={cat.useValue}>
                  {cat.useValue}
                </option>
              ))}
            </>
          ) : null}
        </select>
      </td>
      <td className="p-1 bg-indigo-100">
        <select
          ref={channelRef}
          className="p-1 border bg-white focus:border-gray-500 uppercase w-full"
          onChange={handleChannelSelect}
          value={selectChannel}
          onKeyDown={inputKeyDown}
        >
          <option value="">채널 선택</option>
          {channelList && channelList.length > 0 && (
            <>
              {channelList.map((chn, idx) => (
                <option key={idx} value={chn.useValue}>
                  {chn.useValue}
                </option>
              ))}
            </>
          )}
        </select>
      </td>

      <td className="p-1 bg-indigo-100">
        <input
          type="text"
          ref={nameRef}
          value={inputCompanyName}
          className="p-1 border bg-white focus:border-gray-500 text-sm"
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
          className="p-1 border bg-white focus:border-gray-500 text-sm"
          placeholder="지점명 입력"
          onChange={e => setInputCompanyBranch(e.currentTarget.value)}
          onKeyDown={inputKeyDown}
        />
      </td>
      <td className="p-1 bg-indigo-100">
        <input
          type="text"
          ref={manager1Ref}
          value={inputManager1}
          className="p-1 border bg-white focus:border-gray-500 text-sm"
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
          className="p-1 border bg-white focus:border-gray-500 text-sm"
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
  );
}

export default ComEdit;
