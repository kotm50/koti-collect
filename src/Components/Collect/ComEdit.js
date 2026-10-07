import { useEffect, useState, useRef } from "react";
import axios from "axios";
import axiosInstance from "../../Api/axiosInstance";

// alias_list가 배열·객체로 오면 화면에는 콤마 문자열로 보여 준다.
const aliasItemToText = item => {
  if (item == null || item === "") return "";
  if (typeof item === "string" || typeof item === "number") return String(item);
  if (typeof item !== "object") return "";
  const keys = [
    "alias",
    "alias_list",
    "aliasList",
    "alias_code",
    "aliasCode",
    "com_name_alias",
    "comNameAlias",
    "alias_no",
    "aliasNo",
  ];
  for (const key of keys) {
    const value = item[key];
    if (value != null && value !== "" && typeof value !== "object") {
      return String(value);
    }
  }
  const aliasKey = Object.keys(item).find(key => /alias/i.test(key));
  if (
    aliasKey &&
    item[aliasKey] != null &&
    item[aliasKey] !== "" &&
    typeof item[aliasKey] !== "object"
  ) {
    return String(item[aliasKey]);
  }
  return "";
};

export const formatAliasList = value => {
  if (value == null || value === "") return "";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (
      (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
      (trimmed.startsWith("{") && trimmed.endsWith("}"))
    ) {
      try {
        return formatAliasList(JSON.parse(trimmed));
      } catch (e) {
        return value;
      }
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(aliasItemToText).filter(Boolean).join(", ");
  }
  if (typeof value === "object") {
    const nested = value.alias_list ?? value.aliasList;
    if (nested != null && nested !== value) return formatAliasList(nested);
    return aliasItemToText(value);
  }
  return "";
};

const hasAliasValue = value => {
  if (value == null || value === "") return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
};

// 청구 API 필드명 alias_list를 우선해서 읽는다.
export const getAliasList = com => {
  if (!com) return "";
  const raw = hasAliasValue(com.alias_list)
    ? com.alias_list
    : hasAliasValue(com.aliasList)
      ? com.aliasList
      : "";
  return formatAliasList(raw);
};

function ComEdit(props) {
  const [selectGubun, setSelectGubun] = useState("");
  const [inputCompanyName, setInputCompanyName] = useState("");
  const [inputCompanyBranch, setInputCompanyBranch] = useState("");
  const [selectChannel, setSelectChannel] = useState("");
  const [inputManager1, setInputManager1] = useState("");
  const [inputMananger2, setInputManager2] = useState("");
  const [inputAliasList, setInputAliasList] = useState("");

  const [categoryList, setCategoryList] = useState([]);
  const [channelList, setChannelList] = useState([]);

  const gubunRef = useRef();
  const nameRef = useRef();
  const branchRef = useRef();
  const channelRef = useRef();
  const manager1Ref = useRef();
  const manager2Ref = useRef();
  const aliasRef = useRef();
  useEffect(() => {
    getCategory();
    setInputCompanyName(props.com.companyName);
    setInputCompanyBranch(props.com.companyBranch);
    setInputManager1(props.com.manager1);
    setInputManager2(props.com.manager2);
    setInputAliasList(getAliasList(props.com));
    //eslint-disable-next-line
  }, [props.com]);

  useEffect(() => {
    setSelectChannel(props.com.channel);
    //eslint-disable-next-line
  }, [channelList]);

  const getChannelList = async category => {
    setChannelList([]);
    const data = {
      category: category,
      useYn: "Y",
    };
    await axiosInstance
      .post("/api/v1/comp/get/comlist", data, {
        headers: { Authorization: props.user.accessToken },
      })
      .then(res => {
        setChannelList(res.data.commList);
      })
      .catch(e => console.log(e));
  };

  const getCategory = async () => {
    const data = {
      category: "GU",
      useYn: "Y",
    };
    await axiosInstance
      .post("/api/v1/comp/get/comlist", data, {
        headers: { Authorization: props.user.accessToken },
      })
      .then(res => {
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
      if (e.key === "ArrowRight") {
        aliasRef.current.focus();
      } else if (e.key === "ArrowLeft") {
        manager1Ref.current.focus();
      }
    }
    if (e.target === aliasRef.current) {
      if (e.key === "ArrowLeft") {
        manager2Ref.current.focus();
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
    setInputAliasList(getAliasList(props.com));
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
      // 바뀐 항목과 company_code만 청구 수정 API로 보낸다.
      const originalAlias = getAliasList(props.com);
      const data = {
        company_code: props.com.companyCode,
      };
      if (selectGubun !== props.com.gubun) {
        data.gubun = selectGubun;
      }
      if (inputCompanyName !== props.com.companyName) {
        data.company_name = inputCompanyName;
      }
      if (inputCompanyBranch !== props.com.companyBranch) {
        data.company_branch = inputCompanyBranch;
      }
      if (selectChannel !== props.com.channel) {
        data.channel = selectChannel;
      }
      if (inputManager1 !== props.com.manager1) {
        data.manager_1 = inputManager1;
      }
      if (inputMananger2 !== props.com.manager2) {
        data.manager_2 = inputMananger2;
      }
      if (inputAliasList !== originalAlias) {
        data.alias_list = inputAliasList;
      }

      try {
        await axios.post(
          "https://adimg.ikoreatm.com/api/billing/company-info/update",
          data
        );
        alert("수정하였습니다");
        cancelEdit();
        props.getCompanyList(
          props.page,
          props.keyword,
          props.gubun,
          props.channel
        );
      } catch (e) {
        console.log(e);
        alert(e.response?.data?.message || "수정에 실패했습니다");
      }
    }
  };
  const inputTest = async () => {
    if (
      selectGubun === props.com.gubun &&
      inputCompanyName === props.com.companyName &&
      inputCompanyBranch === props.com.companyBranch &&
      selectChannel === props.com.channel &&
      inputManager1 === props.com.manager1 &&
      inputMananger2 === props.com.manager2 &&
      inputAliasList === getAliasList(props.com)
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
      <td className="p-2 font-bold bg-indigo-100"></td>
      <td className="p-2 font-bold bg-indigo-100">{props.num}</td>
      <td className="p-1 bg-indigo-100">
        <select
          className="p-1 border bg-white focus:border-gray-500 uppercase w-full min-w-0 max-w-full"
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
          className="p-1 border bg-white focus:border-gray-500 uppercase w-full min-w-0 max-w-full"
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
          className="p-1 border bg-white focus:border-gray-500 text-sm w-full min-w-0"
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
          className="p-1 border bg-white focus:border-gray-500 text-sm w-full min-w-0"
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
          className="p-1 border bg-white focus:border-gray-500 text-sm w-full min-w-0"
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
          className="p-1 border bg-white focus:border-gray-500 text-sm w-full min-w-0"
          placeholder="담당자 2 입력"
          onChange={e => setInputManager2(e.currentTarget.value)}
          onKeyDown={inputKeyDown}
        />
      </td>
      <td className="p-1 bg-indigo-100">
        <input
          type="text"
          ref={aliasRef}
          value={inputAliasList}
          className="p-1 border bg-white focus:border-gray-500 text-sm w-full min-w-0"
          placeholder="(여러개일경우 컬럼(,)으로 구분)"
          onChange={e => setInputAliasList(e.currentTarget.value)}
          onKeyDown={inputKeyDown}
        />
      </td>
      <td className="p-1 bg-indigo-100">
        <div className="flex gap-1">
          <button
            className="flex-1 bg-green-500 text-white py-1 px-1"
            onClick={e => editCompany()}
          >
            적용
          </button>
          <button
            className="flex-1 bg-gray-500 text-white py-1 px-1"
            onClick={e => cancelEdit()}
          >
            취소
          </button>
        </div>
      </td>
    </>
  );
}

export default ComEdit;
