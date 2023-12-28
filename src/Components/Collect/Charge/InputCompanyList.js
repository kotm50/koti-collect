import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";

import axios from "axios";

function InputCompanyList(props) {
  const [companyList, setCompanyList] = useState([]);
  const [loadMsg, setLoadMsg] = useState("검색어를 입력해 주세요");
  const user = useSelector(state => state.user);
  useEffect(() => {
    if (props.searchKeyword.length > 1) {
      setLoadMsg("검색 중 입니다...");
      getCompanyList(props.searchKeyword);
    } else {
      setCompanyList([]);
      setLoadMsg("검색하실 지점명/담당자명을 입력해 주세요");
    }
    //eslint-disable-next-line
  }, [props.searchKeyword]);

  const getCompanyList = async c => {
    setLoadMsg("검색 중 입니다...");
    const data = {
      searchKeyword: c,
    };
    await axios
      .post("/api/v1/comp/search/list", data, {
        headers: {
          Authorization: user.accessToken,
        },
      })
      .then(async res => {
        if (!res.data.compList || res.data.compList.length === 0) {
          setLoadMsg("검색 실패");
        }
        setCompanyList(res.data.compList ?? []);
      })
      .catch(e => {
        console.log(e);
        return false;
      });
  };
  return (
    <div
      id="searchCompany"
      className="absolute top-[40px] border bg-white min-w-[360px] w-fit min-h-[100px] max-h-[360px] overflow-y-auto p-2"
    >
      <div className="flex justify-between mb-2">
        <h3 className="text-center text-lg font-bold">고객사 검색결과</h3>
        <button
          className="min-w-[24px] text-lg hover:text-gray-500"
          onClick={() => props.setCompanyListOn(false)}
        >
          <MdClose />
        </button>
      </div>
      {companyList.length > 0 ? (
        <>
          <table className="w-fit">
            <thead>
              <tr className=" bg-blue-100">
                <td className="p-2 text-center truncate">고객사</td>
                <td className="p-2 text-center truncate">지점</td>
                <td className="p-2 text-center truncate">담당자 1</td>
                <td className="p-2 text-center truncate">담당자 2</td>
                <td className="p-1 text-center">등록</td>
              </tr>
            </thead>
            <tbody>
              {companyList.map((com, idx) => (
                <tr key={idx}>
                  <td className="p-2 text-center truncate">
                    {com.companyName}
                  </td>
                  <td className="p-2 text-center truncate">
                    {com.companyBranch}
                  </td>
                  <td className="p-2 text-center truncate">{com.manager1}</td>
                  <td className="p-2 text-center truncate">{com.manager2}</td>
                  <td className="p-2 text-center">
                    <button
                      className="py-1 px-2 bg-green-500 text-white hover:bg-green-700 truncate"
                      value={com.companyCode}
                      onClick={e => {
                        props.companyReset(
                          e.currentTarget.value,
                          com.companyBranch
                        );
                      }}
                    >
                      등록
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className="m-auto text-center h-full pt-5">{loadMsg}</div>
      )}
    </div>
  );
}

export default InputCompanyList;
