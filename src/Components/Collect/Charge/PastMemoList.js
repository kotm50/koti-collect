import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";

import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";
import "dayjs/locale/ko"; //한국어
import PastMemo from "./PastMemo";
import axiosInstance from "../../../Api/axiosInstance";

function PastMemoList(props) {
  const navi = useNavigate();
  const [memoList, setMemoList] = useState([]);
  const user = useSelector(state => state.user);
  useEffect(() => {
    getMemoList(props.companyCode, props.commCode);
    //eslint-disable-next-line
  }, [props.companyCode, props.commCode]);

  const getMemoList = async code => {
    let data = {
      companyCode: code,
    };
    if (props.commCode !== "") {
      data.commCode = props.commCode;
    }
    await axiosInstance
      .post("/api/v1/comp/memo", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.data.code === "E999") {
          navi("/");
          return false;
        }
        if (res.data.code === "E403") {
          return alert(res.data.message);
        }
        setMemoList(res.data.commissionList);
      })
      .catch(e => console.log(e));
  };

  const unescapeHTML = text => {
    return text
      .replace(/＜/g, "<")
      .replace(/＞/g, ">")
      .replace(/＝/g, "=")
      .replace(/（/g, "(")
      .replace(/）/g, ")")
      .replace(/，/g, ",")
      .replace(/＂/g, '"')
      .replace(/：/g, ":")
      .replace(/；/g, ";")
      .replace(/／/g, "/");
  };

  const handleMemoModal = memo => {
    props.setMemoModal(unescapeHTML(memo));
    props.setModalOn(true);
  };
  return (
    <div
      id="searchMemo"
      className="absolute bottom-[40px] border border-stone-300 drop-shadow-lg bg-white min-w-[360px] w-fit min-h-[100px] max-h-[360px] overflow-y-auto p-2 z-50 w-full"
    >
      <div className="flex justify-between mb-2">
        <h3 className="text-center text-lg font-bold">과거 메모 목록</h3>
        <button
          className="min-w-[24px] text-lg hover:text-gray-500"
          onClick={() => props.setPastMemoOn(false)}
        >
          <MdClose />
        </button>
      </div>
      {memoList.length > 0 ? (
        <>
          <table className="w-fit max-w-full">
            <thead>
              <tr className=" bg-blue-100">
                <td className="p-2 text-center truncate">작성일</td>
                <td className="p-2 text-center truncate">요약</td>
                <td className="p-2 text-center truncate">상세보기</td>
                <td className="p-1 text-center">등록</td>
              </tr>
            </thead>
            <tbody>
              {memoList.map((memo, idx) => (
                <tr key={idx}>
                  <td className="p-2 text-center truncate">
                    {dayjs(new Date(memo.regDate)).format("YYYY-MM-DD")}
                  </td>
                  <td className="p-2 text-center truncate max-w-[150px]">
                    <PastMemo
                      memo={memo.memo}
                      setMemo={props.setMemoModal}
                      setModalOn={props.setModalOn}
                    />
                  </td>
                  <td className="p-2 text-center truncate">
                    <button
                      className="py-1 px-2 bg-blue-500 text-white hover:bg-blue-700 truncate"
                      onClick={() => handleMemoModal(memo.memo)}
                    >
                      상세
                    </button>
                  </td>
                  <td className="p-2 text-center">
                    <button
                      className="py-1 px-2 bg-green-500 text-white hover:bg-green-700 truncate"
                      value={memo.memo}
                      onClick={e => {
                        props.setMemo(unescapeHTML(memo.memo));
                        props.setPastMemoOn(false);
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
        "메모 목록이 없습니다"
      )}
    </div>
  );
}

export default PastMemoList;
