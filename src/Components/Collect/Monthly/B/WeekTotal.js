import React from "react";

function WeekTotal(props) {
  return (
    <div className="bg-white p-4 rounded-lg drop-shadow">
      <h3 className="text-lg mb-2 font-bold">주차별 수수료 결제</h3>
      <div className="grid grid-cols-5 border border-black">
        <div className="bg-blue-200 text-center py-1 border-b border-black">
          1주차
        </div>
        <div className="bg-blue-200 text-center py-1 border-b border-l border-black">
          2주차
        </div>
        <div className="bg-blue-200 text-center py-1 border-b border-l border-black">
          3주차
        </div>
        <div className="bg-blue-200 text-center py-1 border-b border-l border-black">
          4주차
        </div>
        <div className="bg-blue-200 text-center py-1 border-b border-l border-black">
          5주차
        </div>
        <div className="bg-white text-center py-1 border-black">
          {props.weekList.first > 0
            ? props.weekList.first.toLocaleString()
            : null}
        </div>
        <div className="bg-white text-center py-1 border-l border-black">
          {props.weekList.second > 0
            ? props.weekList.second.toLocaleString()
            : null}
        </div>
        <div className="bg-white text-center py-1 border-l border-black">
          {props.weekList.third > 0
            ? props.weekList.third.toLocaleString()
            : null}
        </div>
        <div className="bg-white text-center py-1 border-l border-black">
          {props.weekList.fourth > 0
            ? props.weekList.fourth.toLocaleString()
            : null}
        </div>
        <div className="bg-white text-center py-1 border-l border-black">
          {props.weekList.fifth > 0
            ? props.weekList.fifth.toLocaleString()
            : null}
        </div>
      </div>
      <div className="grid grid-cols-5">
        <div className="col-span-3 border-r border-black"></div>
        <div className="bg-blue-200 text-center border-r border-b border-black py-1">
          합계
        </div>
        <div className="bg-white text-center border-r border-b border-black py-1">
          {props.weekList.total > 0
            ? props.weekList.total.toLocaleString()
            : null}
        </div>
      </div>
    </div>
  );
}

export default WeekTotal;
