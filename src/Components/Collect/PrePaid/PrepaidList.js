import React, { useEffect, useState } from "react";
import sorry from "../../../Asset/sorry.png";
import PrepaidDetail from "./PrepaidDetail";
import CompanyPrepaidDetail from "./CompanyPrepaidDetail";
import MemoModal from "../../Layout/MemoModal";

function PrepaidList(props) {
  const [height, setHeight] = useState(640);
  const [transactionType, setTransactionType] = useState(null);
  const [tType, setTType] = useState("");
  const [cCode, setCCode] = useState("");

  const [modalOn, setModalOn] = useState(false);
  const [memo, setMemo] = useState("");
  // 상태 추가: 현재 포커스된 PrepaidDetail 컴포넌트 인덱스
  const [focusedDetailIndex, setFocusedDetailIndex] = useState(null);
  useEffect(() => {
    if (props.inputOn) {
      setHeight(470);
    } else {
      setHeight(640);
    }
  }, [props.inputOn]);

  const handleTType = e => {
    setTType(e.target.value);
    props.getCompanyPrepayList(cCode, e.target.value);
  };

  return (
    <div className="grid grid-cols-4 gap-x-2">
      {modalOn && <MemoModal memo={memo} setModalOn={setModalOn} />}
      <div className="bg-white rounded-lg drop-shadow h-fit p-4">
        <div
          className="overflow-auto relative"
          style={{ height: `${height}px` }}
        >
          <h3 className="font-bold text-3xl p-2">선입금 고객사 목록</h3>
          {props.prepayList.length > 0 ? (
            <table id="mainTable" className="w-full">
              <thead className="sticky top-0 left-0">
                <tr className="text-white bg-blue-500 text-center">
                  <td className="p-1 border text-sm">고객사명</td>
                  <td className="p-1 border text-sm">담당자 1</td>
                  <td className="p-1 border text-sm">담당자 2</td>
                </tr>
              </thead>
              <tbody>
                {props.prepayList.map((pay, idx) => (
                  <React.Fragment key={idx}>
                    <PrepaidDetail
                      user={props.user}
                      pay={pay}
                      idx={idx}
                      getCompanyPrepayList={props.getCompanyPrepayList}
                      transactionType={transactionType}
                      setTransactionType={setTransactionType}
                      setCompanyCode={props.setCompanyCode}
                      setInputOn={props.setInputOn}
                      setPrepayCode={props.setPrepayCode}
                      setCCode={setCCode}
                      setCompanyName={props.setCompanyName}
                      // 추가된 props
                      isFocused={idx === focusedDetailIndex} // 현재 포커스된 컴포넌트인지 체크
                      setFocusedDetailIndex={setFocusedDetailIndex} // 상태 업데이트 함수 전달
                    />
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-2xl text-bold text-center">
              <img
                src={sorry}
                className="mx-auto w-[240px] h-auto mb-5 mt-20"
                alt="오류"
              />
              조회 된 내용이 없습니다
            </div>
          )}
        </div>
      </div>
      <div className="bg-white rounded-lg drop-shadow h-fit p-4 col-span-3">
        <div
          className="overflow-auto relative"
          style={{ height: `${height}px` }}
        >
          <div className="flex flex-row justify-between">
            <div className="flex flex-row justify-start gap-x-2">
              <h3 className="font-bold text-3xl p-2">선입금 상세내역</h3>
              <div className="text-base pt-5">
                선입금 잔액{" : "}
                <span className="text-rose-500 font-bold">
                  {Number(props.totalPrepay).toLocaleString()}
                </span>
                원
              </div>
            </div>
            <div className="p-2 text-right">
              <select
                className="px-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-fit rounded text-sm"
                value={tType}
                onChange={handleTType}
              >
                <option value="">전체보기</option>
                <option value="P">선입금</option>
                <option value="D">환급</option>
                <option value="B">사용</option>
                <option value="C">미사용</option>
              </select>
            </div>
          </div>
          {props.companyPrepayList.length > 0 ? (
            <table id="mainTable" className="w-full">
              <thead className="sticky top-0 left-0">
                <tr className="text-white bg-blue-500 text-center">
                  <td className="p-1 border text-sm">구분</td>
                  <td className="p-1 border text-sm">날짜</td>
                  <td className="p-1 border text-sm">입금액</td>
                  <td className="p-1 border text-sm hidden">실제잔액</td>
                  <td className="p-1 border text-sm">결제방법</td>
                  <td className="p-1 border text-sm">입금자명</td>
                  <td className="p-1 border text-sm">카드정보</td>
                  <td className="p-1 border text-sm">비고</td>
                </tr>
              </thead>
              <tbody>
                {props.companyPrepayList.map((pay, idx) => (
                  <React.Fragment key={idx}>
                    <CompanyPrepaidDetail
                      user={props.user}
                      pay={pay}
                      idx={idx}
                      getCompanyPrepayList={props.getCompanyPrepayList}
                      companyCode={props.companyCode}
                      setCompanyCode={props.setCompanyCode}
                      setPrepayCode={props.setPrepayCode}
                      setInputOn={props.setInputOn}
                      memo={memo}
                      setMemo={setMemo}
                      setModalOn={setModalOn}
                    />
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-2xl text-bold text-center">
              <img
                src={sorry}
                className="mx-auto w-[240px] h-auto mb-5 mt-20"
                alt="오류"
              />
              조회 된 내용이 없습니다
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PrepaidList;
