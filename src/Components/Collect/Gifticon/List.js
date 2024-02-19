import React from "react";

import sorry from "../../../Asset/sorry.png";
import ListDetail from "./ListDetail";

function List(props) {
  return (
    <>
      {props.list && props.list.length > 0 ? (
        <table className="w-full">
          <thead className="sticky top-0 bg-white">
            <tr>
              <td colSpan="14" className="border border-white">
                <div className="flex justify-between py-2 pr-2">
                  <h3 className="font-bold text-xl">기프티콘 충전내역</h3>
                </div>
              </td>
            </tr>
            <tr className="bg-blue-600 text-white text-center">
              <td rowSpan="3" className="border p-1">
                구분
              </td>
              <td rowSpan="3" className="border p-1">
                날짜
              </td>
              <td rowSpan="3" className="border p-1">
                고객사
              </td>
              <td rowSpan="3" className="border p-1">
                지점명
              </td>
              <td colSpan="5" className="border p-1">
                결제금액
              </td>
              <td rowSpan="4" className="border p-1">
                담당자1
              </td>
              <td rowSpan="4" className="border p-1">
                담당자2
              </td>
              <td rowSpan="4" className="border p-1">
                비고
              </td>
            </tr>
            <tr className="bg-blue-600 text-white text-center">
              <td rowSpan="2" className="border p-1">
                현금
              </td>
              <td colSpan="2" className="border p-1">
                카드
              </td>
              <td colSpan="2" className="border p-1">
                세금계산서
              </td>
            </tr>
            <tr className="bg-blue-600 text-white text-center">
              <td className="border p-1">공급가액</td>
              <td className="border p-1">부가세</td>
              <td className="border p-1">공급가액</td>
              <td className="border p-1">부가세</td>
            </tr>
            <tr className="bg-yellow-300 text-center font-bold text-lg">
              <td colSpan="3" className="border p-1">
                합계
              </td>
              <td className="border p-1">{props.allTotal.toLocaleString()}</td>
              <td className="border p-1">{props.cashTotal.toLocaleString()}</td>
              <td className="border p-1">{props.cardTotal.toLocaleString()}</td>
              <td className="border p-1">
                {props.cardTaxTotal.toLocaleString()}
              </td>
              <td className="border p-1">
                {props.comCashTotal.toLocaleString()}
              </td>
              <td className="border p-1">
                {props.comTaxTotal.toLocaleString()}
              </td>
            </tr>
          </thead>
          <tbody>
            {props.list.map((gifticon, idx) => (
              <React.Fragment key={idx}>
                <ListDetail
                  user={props.user}
                  gifticon={gifticon}
                  idx={idx}
                  memo={props.memo}
                  setMemo={props.setMemo}
                  setModalOn={props.setModalOn}
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
    </>
  );
}

export default List;
