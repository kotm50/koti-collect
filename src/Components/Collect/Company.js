import React, { useEffect, useState, useRef } from "react";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { FaSearch } from "react-icons/fa";

import queryString from "query-string";

import Pagenate from "../Layout/Pagenate";
import ComList from "./ComList";
import { clearUser } from "../../Reducer/userSlice";
import axiosInstance from "../../Api/axiosInstance";

function Company() {
  const navi = useNavigate();
  const thisLocation = useLocation();
  const pathName = thisLocation.pathname;
  const parsed = queryString.parse(thisLocation.search);
  const dispatch = useDispatch();
  const page = parsed.page || 1;
  const keyword = parsed.keyword || "";
  const gubun = parsed.gubun || "";
  const channel = parsed.channel || "";
  const usable = parsed.usable || "";
  const user = useSelector(state => state.user);
  const [companyList, setCompanyList] = useState([]);
  const [title, setTitle] = useOutletContext();
  const [selectGubun, setSelectGubun] = useState("");
  const [selectChannel, setSelectChannel] = useState("");
  const [totalPage, setTotalPage] = useState(1);
  const [pagenate, setPagenate] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const [categoryList, setCategoryList] = useState([]);
  const [channelList, setChannelList] = useState([]);
  const [inputChannelList, setInputChannelList] = useState([]);

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

  const logout = async () => {
    await axiosInstance
      .post("/api/v1/user/logout", null, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        dispatch(clearUser());
        navi("/");
      })
      .catch(e => {
        console.log(e);
        navi("/");
      });
  };

  useEffect(() => {
    initializer();
    //eslint-disable-next-line
  }, [thisLocation]);

  const initializer = async () => {
    setTitle("고객사 리스트");
    setTotalPage(1);
    setPagenate([]);
    if (keyword !== "") {
      setSearchKeyword(keyword);
    }
    if (gubun !== "") {
      setInputChannelList([]);
      setSelectGubun(gubun);
      setInputGubun(gubun);
      getChannelList(gubun, "B");
    } else {
      setInputChannelList([]);
      setSelectGubun("");
      setInputGubun("");
    }
    getCategory();
    getCompanyList(page, keyword, gubun, channel);
  };

  const getChannelList = async (category, type) => {
    if (type === "B") {
      setChannelList([]);
    }
    setInputChannelList([]);
    const data = {
      category: category,
      useYn: "Y",
    };
    await axiosInstance
      .post("/api/v1/comp/get/comlist", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (type === "B") {
          setChannelList(res.data.commList);
          setInputChannelList(res.data.commList);
          if (channel !== "") {
            setSelectChannel(channel);
            setInputChannel(channel);
          } else {
            setSelectChannel("");
            setInputChannel("");
          }
        } else if (type === "I") {
          setInputChannelList(res.data.commList);
        }
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
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          logout();
          return false;
        }
        setCategoryList(res.data.commList);
      })
      .catch(e => console.log(e));
  };

  //구분 셀렉박스 핸들링
  const handleGubunSelect = e => {
    setSelectGubun(e.currentTarget.value);
    if (e.currentTarget.value === selectGubun) {
      return false;
    } else {
      if (e.currentTarget.value !== "") {
        navi(`/collect/company?page=1&gubun=${e.currentTarget.value}`);
      } else {
        navi("/collect/company");
      }
    }
  };

  //구분 셀렉박스 핸들링(입력창)
  const handleInputGubunSelect = e => {
    setInputChannel([]);
    setInputGubun(e.currentTarget.value);
    getChannelList(e.currentTarget.value, "I");
  };

  //채널 셀렉박스 핸들링(입력창)
  const handleInputChannelSelect = e => {
    setInputChannel(e.currentTarget.value);
  };

  //채널 셀렉박스 핸들링
  const handleChannelSelect = e => {
    setSelectChannel(e.currentTarget.value);
    if (e.currentTarget.value === selectChannel) {
      return false;
    } else {
      if (e.currentTarget.value !== "") {
        navi(
          `/collect/company?page=1&gubun=${gubun}&channel=${e.currentTarget.value}`
        );
      } else {
        navi(`/collect/company?page=1&gubun=${gubun}`);
      }
    }
  };

  const handleKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchIt();
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
      await axiosInstance
        .post("/api/v1/comp/add/company", data, {
          headers: { Authorization: user.accessToken },
        })
        .then(res => {
          if (res.data.code === "C000") {
            alert("등록되었습니다");
            setInputGubun("");
            setInputCompanyName("");
            setInputCompanyBranch("");
            setInputChannel("");
            setInputManager1("");
            setInputManager2("");
          }
          getCompanyList(page, keyword, gubun, channel);
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
    let domain = `${pathName}?page=1${gubun !== "" ? `&gubun=${gubun}` : ""}${
      channel !== "" ? `&channel=${channel}` : ""
    }${keyword !== "" ? `&keyword=${keyword}` : ""}`;
    navi(domain);
  };

  const getCompanyList = async (p, k, g, c) => {
    console.log("getCompanyList", p, k, g, c);
    setCompanyList([]);
    const paging = {
      page: p,
      size: 20,
    };
    let comp = {};

    if (k !== "") {
      paging.searchKeyword = k;
    }
    if (g !== "") {
      comp.gubun = g;
    }
    if (c !== "") {
      comp.channel = c;
    }
    console.log(paging, comp);
    await axiosInstance
      .post(
        "/api/v1/comp/list",
        { paging, comp },
        {
          headers: {
            Authorization: user.accessToken,
          },
        }
      )
      .then(async res => {
        console.log(res.data);
        if (res.data.code === "E999" || res.data.code === "E403") {
          logout();
          return false;
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

  const saveExcel = async type => {
    const data = {};
    if (type === "this") {
      data.page = page;
      data.size = 20;
    } else if (type === "all") {
      data.page = 1;
      data.size = 1000000; // 전체 페이지를 가져오기 위해 큰 숫자로 설정
    }
  };

  return (
    <div className="mx-4" data={title}>
      <div className="flex justify-between">
        <div className="flex flex-row justify-start mb-2 gap-x-1">
          <input
            value={searchKeyword}
            className="border border-gray-300 p-2 w-80 block rounded font-neo"
            placeholder="지점명/담당자명 으로 검색"
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
        <div className="flex flex-row justify-start mb-2 gap-x-1">
          <button
            className="py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded transition-all duration-300"
            onClick={() => saveExcel("this")}
          >
            현재페이지저장
          </button>
          <button
            className="py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded transition-all duration-300"
            onClick={() => saveExcel("all")}
          >
            전체고객사저장
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 text-center">
        <table>
          <thead>
            <tr className="bg-blue-400 text-white">
              <td className="py-2">신규</td>
              <td className="py-2">번호</td>
              <td className="p-1 w-28">
                <select
                  className="p-1 bg-blue-600 font-medium w-full min-w-[100px]"
                  onChange={handleGubunSelect}
                  value={selectGubun}
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
              <td className="p-1">
                <select
                  className="p-1 bg-blue-600 font-medium"
                  onChange={handleChannelSelect}
                  value={selectChannel}
                >
                  {gubun === "" ? (
                    <option value="">먼저 구분값을 정해 주세요</option>
                  ) : (
                    <>
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
                    </>
                  )}
                </select>
              </td>
              <td className="py-2">고객사</td>
              <td className="py-2">지점</td>
              <td className="py-2">담당자1</td>
              <td className="py-2">담당자2</td>
              <td className="py-2">수정/삭제</td>
            </tr>
          </thead>
          <tbody>
            {user.admin ? (
              <tr className="bg-green-100">
                <td className="p-2 truncate">신규</td>
                <td className="p-2 truncate">입력</td>
                <td className="p-1 w-28">
                  <select
                    className="p-1 border bg-white focus:border-gray-500 uppercase w-full min-w-[100px]"
                    ref={gubunRef}
                    onChange={handleInputGubunSelect}
                    value={inputGubun}
                  >
                    <option value="">구분 선택</option>
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
                <td className="p-1">
                  <select
                    className="p-1 border bg-white focus:border-gray-500 uppercase w-full"
                    ref={channelRef}
                    onChange={handleInputChannelSelect}
                    value={inputChannel}
                  >
                    <option value="">채널 선택</option>
                    {inputChannelList && inputChannelList.length > 0 ? (
                      <>
                        {inputChannelList.map((chn, idx) => (
                          <option key={idx} value={chn.useValue}>
                            {chn.useValue}
                          </option>
                        ))}
                      </>
                    ) : null}
                  </select>
                </td>
                <td className="p-1">
                  <input
                    type="text"
                    ref={nameRef}
                    value={inputCompanyName}
                    className="p-1 border bg-white focus:border-gray-500"
                    placeholder="고객사명 입력"
                    onChange={e => setInputCompanyName(e.currentTarget.value)}
                  />
                </td>
                <td className="p-1">
                  <input
                    type="text"
                    ref={branchRef}
                    value={inputCompanyBranch}
                    className="p-1 border bg-white focus:border-gray-500"
                    placeholder="지점명 입력"
                    onChange={e => setInputCompanyBranch(e.currentTarget.value)}
                  />
                </td>
                <td className="p-1">
                  <input
                    type="text"
                    ref={manager1Ref}
                    value={inputManager1}
                    className="p-1 border bg-white focus:border-gray-500"
                    placeholder="담당자 1 입력"
                    onChange={e => setInputManager1(e.currentTarget.value)}
                  />
                </td>
                <td className="p-1">
                  <input
                    type="text"
                    ref={manager2Ref}
                    value={inputMananger2}
                    className="p-1 border bg-white focus:border-gray-500"
                    placeholder="담당자 2 입력"
                    onChange={e => setInputManager2(e.currentTarget.value)}
                  />
                </td>
                <td className="p-1">
                  <button
                    className="text-white bg-green-600 py-1 px-2 block min-w-[200px] w-full"
                    onClick={e => inputCompany()}
                  >
                    등록
                  </button>
                </td>
              </tr>
            ) : null}

            {companyList && companyList.length > 0 ? (
              <>
                {companyList.map((com, idx) => (
                  <tr
                    className={`${idx % 2 === 0 ? "bg-blue-50" : "bg-gray-50"}`}
                    data={com.companyCode}
                    key={idx}
                  >
                    <ComList
                      com={com}
                      num={idx + 1 + (Number(page) - 1) * 20}
                      getCompanyList={getCompanyList}
                      page={page}
                      keyword={keyword}
                      gubun={gubun}
                      channel={channel}
                      user={user}
                      logout={logout}
                    />
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
        gubun={gubun}
        channel={channel}
        usable={usable}
      />
    </div>
  );
}

export default Company;
