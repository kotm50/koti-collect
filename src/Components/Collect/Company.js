import React, { useEffect, useState, useRef } from "react";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { FaSearch } from "react-icons/fa";

import queryString from "query-string";

import axios from "axios";

import Pagenate from "../Layout/Pagenate";

function Company(props) {
  const navi = useNavigate();
  const thisLocation = useLocation();
  const pathName = thisLocation.pathname;
  const parsed = queryString.parse(thisLocation.search);
  const page = parsed.page || 1;
  const keyword = parsed.keyword || "";
  const user = useSelector(state => state.user);
  const [companyList, setCompanyList] = useState([]);
  const [title, setTitle] = useOutletContext();
  const [totalPage, setTotalPage] = useState(1);
  const [pagenate, setPagenate] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [errMsg, setErrMsg] = useState("");

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
    setTitle("고객사 리스트");
    setTotalPage(1);
    setPagenate([]);
    if (keyword !== "") {
      setSearchKeyword(keyword);
    }
    getCompanyList(page, keyword);
    //eslint-disable-next-line
  }, [thisLocation]);

  const handleKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchIt();
    }
  };

  const inputKeyDown = e => {
    if (e.key === "Enter") {
      inputCompany();
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

  const inputCompany = async () => {
    const test = await inputTest();
    if (test !== "완료") {
      return alert(test);
    } else {
      const data = {
        gubun: inputGubun,
        companyName: inputCompanyName,
        companyBranch: inputCompanyBranch,
        channel: inputChannel,
        manager1: inputManager1,
        manager2: inputMananger2,
      };
      await axios
        .post("/api/v1/comp/add/company", data, {
          headers: { Authorization: user.accessToken },
        })
        .then(res => {
          console.log(res);
          getCompanyList(page, keyword);
        })
        .catch(e => console.log(e));
    }
  };

  const inputTest = () => {
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

  const searchIt = () => {
    const keyword = searchKeyword.trim();
    let domain = `${pathName}${keyword !== "" ? `?keyword=${keyword}` : ""}`;
    navi(domain);
  };

  const getCompanyList = async (p, k) => {
    setCompanyList([]);
    let data = {
      page: p,
      size: 20,
    };
    if (k !== "") {
      data.searchKeyword = k;
    }
    await axios
      .get("/api/v1/comp/list", {
        params: data,
        headers: {
          Authorization: user.accessToken,
        },
      })
      .then(async res => {
        if (res.data.code === "E999") {
          await props.logout();
        }
        if (res.data.code === "C000") {
          const totalP = res.data.totalPages;
          setTotalPage(res.data.totalPages);
          const pagenate = generatePaginationArray(p, totalP);
          setPagenate(pagenate);
        }
        if (res.data.compList.length === 0) {
          setErrMsg(res.data.message);
          return false;
        }
        setCompanyList(res.data.compList ?? [{ compId: "없음" }]);
      })
      .catch(e => {
        console.log(e);
        return false;
      });

    function generatePaginationArray(currentPage, totalPage) {
      let paginationArray = [];

      // 최대 페이지가 4 이하인 경우
      if (Number(totalPage) <= 4) {
        for (let i = 1; i <= totalPage; i++) {
          paginationArray.push(i);
        }
        return paginationArray;
      }

      // 현재 페이지가 1 ~ 3인 경우
      if (Number(currentPage) <= 3) {
        return [1, 2, 3, 4, 5];
      }

      // 현재 페이지가 totalPage ~ totalPage - 2인 경우
      if (Number(currentPage) >= Number(totalPage) - 2) {
        return [
          Number(totalPage) - 4,
          Number(totalPage) - 3,
          Number(totalPage) - 2,
          Number(totalPage) - 1,
          Number(totalPage),
        ];
      }

      // 그 외의 경우
      return [
        Number(currentPage) - 2,
        Number(currentPage) - 1,
        Number(currentPage),
        Number(currentPage) + 1,
        Number(currentPage) + 2,
      ];
    }
  };

  const getDate = d => {
    const date = new Date(d);
    const formattedDate = date.toISOString().split("T")[0];
    return formattedDate;
  };
  return (
    <div className="mx-4" data={title}>
      <div className="flex flex-row justify-start mb-2 gap-x-1">
        <input
          value={searchKeyword}
          className="border border-gray-300 p-2 w-80 block rounded font-neo"
          placeholder="고객사명/담당자명 으로 검색"
          onChange={e => setSearchKeyword(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded transition-all duration-300"
          onClick={() => searchIt()}
        >
          <FaSearch />
        </button>
      </div>
      <div className="grid grid-cols-1 text-center">
        <table>
          <thead>
            <tr className="bg-blue-400 text-white">
              <td className="py-2">번호</td>
              <td className="py-2">구분</td>
              <td className="py-2">고객사</td>
              <td className="py-2">지점</td>
              <td className="py-2">채널</td>
              <td className="py-2">담당자1</td>
              <td className="py-2">담당자2</td>
              <td className="py-2">등록일시</td>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-50">
              <td className="p-2">new</td>
              <td className="p-1">
                <input
                  type="text"
                  ref={gubunRef}
                  value={inputGubun}
                  className="p-1 border bg-white uppercase"
                  placeholder
                  onChange={e => setInputGubun(e.currentTarget.value)}
                  onKeyDown={inputKeyDown}
                />
              </td>
              <td className="p-1">
                <input
                  type="text"
                  ref={nameRef}
                  value={inputCompanyName}
                  className="p-1 border bg-white"
                  placeholder
                  onChange={e => setInputCompanyName(e.currentTarget.value)}
                  onKeyDown={inputKeyDown}
                />
              </td>
              <td className="p-1">
                <input
                  type="text"
                  ref={branchRef}
                  value={inputCompanyBranch}
                  className="p-1 border bg-white"
                  placeholder
                  onChange={e => setInputCompanyBranch(e.currentTarget.value)}
                  onKeyDown={inputKeyDown}
                />
              </td>
              <td className="p-1">
                <input
                  type="text"
                  ref={channelRef}
                  value={inputChannel}
                  className="p-1 border bg-white uppercase"
                  placeholder
                  onChange={e => setInputChannel(e.currentTarget.value)}
                  onKeyDown={inputKeyDown}
                />
              </td>
              <td className="p-1">
                <input
                  type="text"
                  ref={manager1Ref}
                  value={inputManager1}
                  className="p-1 border bg-white"
                  placeholder
                  onChange={e => setInputManager1(e.currentTarget.value)}
                  onKeyDown={inputKeyDown}
                />
              </td>
              <td className="p-1">
                <input
                  type="text"
                  ref={manager2Ref}
                  value={inputMananger2}
                  className="p-1 border bg-white"
                  placeholder
                  onChange={e => setInputManager2(e.currentTarget.value)}
                  onKeyDown={inputKeyDown}
                />
              </td>
              <td className="p-1">
                <button
                  className="text-white bg-green-600 py-1 px-2"
                  onClick={e => inputCompany()}
                >
                  등록
                </button>
              </td>
            </tr>
            {companyList.length > 0 ? (
              <>
                {companyList.map((com, idx) => (
                  <tr
                    className={`${idx % 2 === 0 ? "bg-blue-50" : "bg-gray-50"}`}
                    key={idx}
                  >
                    <td className="p-2">{idx + 1 + (Number(page) - 1) * 20}</td>
                    <td className="p-2">{com.gubun}</td>
                    <td className="p-2">{com.companyName}</td>
                    <td className="p-2">{com.companyBranch}</td>
                    <td className="p-2">{com.channel}</td>
                    <td className="p-2">{com.manager1}</td>
                    <td className="p-2">{com.manager2}</td>
                    <td className="p-2">{getDate(com.regDate)}</td>
                  </tr>
                ))}
              </>
            ) : (
              <tr>
                <td colSpan={8} className="text-xl text-center font-bold">
                  {errMsg}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagenate
        pagenate={pagenate}
        page={Number(page)}
        totalPage={Number(totalPage)}
        pathName={pathName}
        keyword={keyword}
      />
    </div>
  );
}

export default Company;
