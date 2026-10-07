import { useEffect, useState, useRef } from "react";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { FaSearch } from "react-icons/fa";

import queryString from "query-string";

import Pagenate from "../Layout/Pagenate";
import ComList from "./ComList";
import { clearUser } from "../../Reducer/userSlice";
import axiosInstance from "../../Api/axiosInstance";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import dayjs from "dayjs";
import axios from "axios";

const BILLING_COMPANY_INFO_URL =
  "https://adimg.ikoreatm.com/api/billing/company-info";

// 빌링 응답은 snake_case다. 테이블과 수정 화면은 기존 camelCase 필드를 읽는다.
const toCompanyRow = row => ({
  ...row,
  companyCode: row.company_code ?? "",
  companyName: row.company_name ?? "",
  companyBranch: row.company_branch ?? "",
  manager1: row.manager_1 ?? "",
  manager2: row.manager_2 ?? "",
  alias_list: row.alias_list ?? "",
  gubun: row.gubun ?? "",
  channel: row.channel ?? "",
  regDate: row.reg_date ?? "",
  uptDate: row.upt_date ?? "",
});

// 검색어가 있으면 검색 API, 없으면 목록 API. size는 1~200.
const fetchCompanyInfoPage = async ({ page, size, keyword }) => {
  const trimmed = keyword ? String(keyword).trim() : "";
  const params = { page, size };
  const url = trimmed
    ? `${BILLING_COMPANY_INFO_URL}/search`
    : `${BILLING_COMPANY_INFO_URL}/list`;
  if (trimmed) {
    params.keyword = trimmed;
  }
  const res = await axios.get(url, { params });
  return res.data;
};

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
  // 고유번호. 여러 개면 콤마로 구분해 alias_list로 전송한다.
  const [inputAliasList, setInputAliasList] = useState("");
  const gubunRef = useRef();
  const nameRef = useRef();
  const branchRef = useRef();
  const channelRef = useRef();
  const manager1Ref = useRef();
  const manager2Ref = useRef();
  const aliasRef = useRef();

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
      // 고객사 등록은 청구 서버로 보낸다.
      // axiosInstance는 응답 오류 시 로그아웃 처리가 있어, 외부 API는 axios로 호출한다.
      const data = {
        gubun: inputGubun,
        company_name: inputCompanyName,
        company_branch: inputCompanyBranch,
        channel: inputChannel,
        manager_1: inputManager1,
        manager_2: inputMananger2,
        // 화면에는 연락처 입력이 없어 빈 값으로 맞춘다.
        com_contact: "",
        alias_list: inputAliasList,
      };
      try {
        await axios.post(
          "https://adimg.ikoreatm.com/api/billing/company-info",
          data
        );
        alert("등록되었습니다");
        setInputGubun("");
        setInputCompanyName("");
        setInputCompanyBranch("");
        setInputChannel("");
        setInputManager1("");
        setInputManager2("");
        setInputAliasList("");
        getCompanyList(page, keyword, gubun, channel);
      } catch (e) {
        console.log(e);
        alert(e.response?.data?.message || "등록에 실패했습니다");
      }
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

  const getCompanyList = async (p, k) => {
    setCompanyList([]);
    setErrMsg("");
    try {
      // 검색어가 있으면 /search, 없으면 /list. 페이지 크기는 기존과 같이 20.
      const data = await fetchCompanyInfoPage({
        page: Number(p) || 1,
        size: 20,
        keyword: k,
      });
      if (!data?.success) {
        setErrMsg(data?.message || "목록을 불러오지 못했습니다");
        setTotalPage(0);
        setPagenate([]);
        return false;
      }
      const totalP = Number(data.totalPage) || 0;
      setTotalPage(totalP);
      setPagenate(generatePaginationArray(p, totalP));
      const rows = Array.isArray(data.data) ? data.data.map(toCompanyRow) : [];
      if (rows.length === 0) {
        setErrMsg("조회된 고객사가 없습니다");
        return false;
      }
      setCompanyList(rows);
    } catch (e) {
      console.log(e);
      setErrMsg(e.response?.data?.message || "목록을 불러오지 못했습니다");
      return false;
    }

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

  const saveExcel = async (type, p, k) => {
    try {
      let compList = [];
      if (type === "this") {
        const data = await fetchCompanyInfoPage({
          page: Number(p) || 1,
          size: 20,
          keyword: k,
        });
        if (!data?.success) {
          alert(data?.message || "목록을 불러오지 못했습니다");
          return false;
        }
        compList = (data.data || []).map(toCompanyRow);
      } else {
        // 목록 API의 size 상한은 200이라 페이지를 나눠 전체를 모은다.
        const pageSize = 200;
        let pageNo = 1;
        let totalPageCount = 1;
        do {
          const data = await fetchCompanyInfoPage({
            page: pageNo,
            size: pageSize,
            keyword: k,
          });
          if (!data?.success) {
            alert(data?.message || "목록을 불러오지 못했습니다");
            return false;
          }
          totalPageCount = Number(data.totalPage) || 0;
          compList = compList.concat((data.data || []).map(toCompanyRow));
          pageNo += 1;
        } while (pageNo <= totalPageCount);
      }
      if (compList.length === 0) {
        alert("조회된 고객사가 없습니다");
        return false;
      }

      const allowedKeys = [
        "gubun",
        "companyName",
        "companyBranch",
        "channel",
        "manager1",
        "manager2",
        "alias_list",
        "regDate",
        "uptDate",
      ];

      const keyMap = {
        gubun: "구분",
        companyName: "고객사명",
        companyBranch: "지점명",
        channel: "채널",
        manager1: "담당자1",
        manager2: "담당자2",
        alias_list: "고유번호",
        regDate: "등록일",
        uptDate: "수정일",
      };

      const processedData = compList.map(row => {
        const newRow = {};
        allowedKeys.forEach(key => {
          newRow[keyMap[key]] = row[key];
        });
        return newRow;
      });

      const worksheet = XLSX.utils.json_to_sheet(processedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(
        blob,
        `${type === "all" ? "전체 " : ""}고객사목록_${dayjs().format(
          "YYMMDDhhmmss"
        )}.xlsx`
      );
    } catch (e) {
      console.log(e);
      alert(e.response?.data?.message || "엑셀 저장에 실패했습니다");
      return false;
    }
  };

  return (
    <div className="mx-4" data={title}>
      <div className="flex justify-between">
        <div className="flex flex-row justify-start mb-2 gap-x-1">
          <input
            value={searchKeyword}
            className="border border-gray-300 p-2 w-80 block rounded font-neo"
            placeholder="고객사/지점/담당자/고유번호 검색"
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
            onClick={() => saveExcel("this", page, keyword, gubun, channel)}
          >
            현재페이지저장
          </button>
          <button
            className="py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded transition-all duration-300"
            onClick={() => saveExcel("all", page, keyword, gubun, channel)}
          >
            전체고객사저장
          </button>
        </div>
      </div>
      <div className="w-full min-w-0 text-center">
        <table className="w-full table-fixed [&_td]:overflow-hidden [&_input]:max-w-full [&_select]:max-w-full">
          <colgroup>
            <col className="w-[4%]" />
            <col className="w-[4%]" />
            <col className="w-[7%]" />
            <col className="w-[11%]" />
            <col className="w-[10%]" />
            <col className="w-[14%]" />
            <col className="w-[8%]" />
            <col className="w-[8%]" />
            <col className="w-[20%]" />
            <col className="w-[14%]" />
          </colgroup>
          <thead>
            <tr className="bg-blue-400 text-white">
              <td className="py-2">신규</td>
              <td className="py-2">번호</td>
              <td className="p-1">
                <select
                  className="p-1 bg-blue-600 font-medium w-full min-w-0"
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
                  className="p-1 bg-blue-600 font-medium w-full min-w-0"
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
              <td className="py-2">고유번호</td>
              <td className="py-2">수정/삭제</td>
            </tr>
          </thead>
          <tbody>
            {user.admin ? (
              <tr className="bg-green-100">
                <td className="p-2 truncate">신규</td>
                <td className="p-2 truncate">입력</td>
                <td className="p-1">
                  <select
                    className="p-1 border bg-white focus:border-gray-500 uppercase w-full min-w-0"
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
                    className="p-1 border bg-white focus:border-gray-500 uppercase w-full min-w-0"
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
                    className="p-1 border bg-white focus:border-gray-500 w-full min-w-0"
                    placeholder="고객사명 입력"
                    onChange={e => setInputCompanyName(e.currentTarget.value)}
                  />
                </td>
                <td className="p-1">
                  <input
                    type="text"
                    ref={branchRef}
                    value={inputCompanyBranch}
                    className="p-1 border bg-white focus:border-gray-500 w-full min-w-0"
                    placeholder="지점명 입력"
                    onChange={e => setInputCompanyBranch(e.currentTarget.value)}
                  />
                </td>
                <td className="p-1">
                  <input
                    type="text"
                    ref={manager1Ref}
                    value={inputManager1}
                    className="p-1 border bg-white focus:border-gray-500 w-full min-w-0"
                    placeholder="담당자 1 입력"
                    onChange={e => setInputManager1(e.currentTarget.value)}
                  />
                </td>
                <td className="p-1">
                  <input
                    type="text"
                    ref={manager2Ref}
                    value={inputMananger2}
                    className="p-1 border bg-white focus:border-gray-500 w-full min-w-0"
                    placeholder="담당자 2 입력"
                    onChange={e => setInputManager2(e.currentTarget.value)}
                  />
                </td>
                <td className="p-1">
                  <input
                    type="text"
                    ref={aliasRef}
                    value={inputAliasList}
                    className="p-1 border bg-white focus:border-gray-500 w-full min-w-0"
                    placeholder="(여러개일경우 컬럼(,)으로 구분)"
                    onChange={e => setInputAliasList(e.currentTarget.value)}
                  />
                </td>
                <td className="p-1">
                  <button
                    className="text-white bg-green-600 py-1 px-2 block w-full"
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
                <td colSpan={10} className="text-xl text-center font-bold">
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
