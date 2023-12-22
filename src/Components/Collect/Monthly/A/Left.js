import React from "react";

function Left(props) {
  return (
    <div className="sticky top-0 left-0 z-30 w-[840px] h-fit border-r border-black truncate">
      <div className="sticky top-0 left-0 z-50 w-full h-fit bg-blue-600 grid grid-cols-9">
        <div className="text-center text-white h-[60px] flex flex-col justify-center font-bold border border-r-0 border-black truncate">
          채널
        </div>
        <div className="text-center text-white h-[60px] flex flex-col justify-center font-bold border border-r-0 border-black truncate">
          보험사
        </div>
        <div className="text-center text-white h-[60px] flex flex-col justify-center font-bold border border-r-0 border-black truncate">
          지점
        </div>
        <div className="text-center text-white h-[60px] flex flex-col justify-center font-bold border border-r-0 border-black truncate">
          월 총액
        </div>
        <div className="text-center bg-gray-200 h-[60px] flex flex-col justify-center font-bold border border-r-0 border-black truncate">
          광고비
        </div>
        <div className="text-center bg-gray-200 h-[60px] flex flex-col justify-center font-bold border border-r-0 border-black truncate">
          위촉비
        </div>
        <div className="text-center bg-gray-200 h-[60px] flex flex-col justify-center font-bold border border-r-0 border-black truncate">
          면접케어
        </div>
        <div className="text-center bg-gray-200 h-[60px] flex flex-col justify-center font-bold border border-r-0 border-black truncate">
          위촉케어
        </div>
        <div className="text-center bg-gray-200 h-[60px] flex flex-col justify-center font-bold border border-r-0 border-black truncate">
          선입금
        </div>
        <div className="col-span-3 text-center bg-green-600 text-white h-[45px] flex flex-col justify-center font-bold border border-r-0 border-t-0 border-black truncate">
          전체 총액
        </div>
        <div className="text-center bg-gray-200 h-[45px] flex flex-col justify-center text-sm font-bold border border-r-0 border-t-0 border-black truncate">
          {props.allTotal.total.toLocaleString()}
        </div>
        <div className="text-center bg-gray-200 h-[45px] flex flex-col justify-center text-sm font-bold border border-r-0 border-t-0 border-black truncate">
          {props.allTotal.paidAd.toLocaleString()}
        </div>
        <div className="text-center bg-gray-200 h-[45px] flex flex-col justify-center text-sm font-bold border border-r-0 border-t-0 border-black truncate">
          {props.allTotal.paidComm.toLocaleString()}
        </div>
        <div className="text-center bg-gray-200 h-[45px] flex flex-col justify-center text-sm font-bold border border-r-0 border-t-0 border-black truncate">
          {props.allTotal.paidIntvCare.toLocaleString()}
        </div>
        <div className="text-center bg-gray-200 h-[45px] flex flex-col justify-center text-sm font-bold border border-r-0 border-t-0 border-black truncate">
          {props.allTotal.paidCommCare.toLocaleString()}
        </div>
        <div className="text-center bg-gray-200 h-[45px] flex flex-col justify-center text-sm font-bold border border-r-0 border-t-0 border-black truncate">
          {props.allTotal.prepayment.toLocaleString()}
        </div>
      </div>

      {props.list.length > 0 ? (
        <div className="w-full h-fit grid grid-cols-9">
          {props.list.map((com, idx) => (
            <React.Fragment key={idx}>
              <div
                className={`text-center bg-gray-100 border  ${
                  idx === 0 ? "border-t-0 h-[20px]" : "h-[21px]"
                } ${
                  idx !== props.list.length - 1 ? "border-b-0" : "h-[22px]"
                } border-r-0 border-black flex flex-col justify-center`}
              >
                {com.channel}
              </div>
              <div
                className={`text-center bg-gray-100 border ${
                  idx === 0 ? "border-t-0" : ""
                } ${
                  idx !== props.list.length - 1 ? "border-b-0" : ""
                } border-r-0 border-black flex flex-col justify-center`}
              >
                {com.companyName}
              </div>
              <div
                className={`text-center bg-gray-100 border ${
                  idx === 0 ? "border-t-0" : ""
                } ${
                  idx !== props.list.length - 1 ? "border-b-0" : ""
                } border-r-0 border-black flex flex-col justify-center`}
                title={com.companyBranch}
              >
                {com.companyBranch}
              </div>
              <div
                className={`text-center bg-gray-100 border ${
                  idx === 0 ? "border-t-0" : ""
                } ${
                  idx !== props.list.length - 1 ? "border-b-0" : ""
                } border-r-0 border-black flex flex-col justify-center`}
              >
                {(
                  com.paidAd +
                  com.paidComm +
                  com.paidIntvCare +
                  com.paidCommCare +
                  com.prepayment
                ).toLocaleString()}
              </div>
              <div
                className={`text-center bg-gray-100 border ${
                  idx === 0 ? "border-t-0" : ""
                } ${
                  idx !== props.list.length - 1 ? "border-b-0" : ""
                } border-r-0 border-black flex flex-col justify-center`}
              >
                {com.paidAd.toLocaleString()}
              </div>
              <div
                className={`text-center bg-gray-100 border ${
                  idx === 0 ? "border-t-0" : ""
                } ${
                  idx !== props.list.length - 1 ? "border-b-0" : ""
                } border-r-0 border-black flex flex-col justify-center`}
              >
                {com.paidComm.toLocaleString()}
              </div>
              <div
                className={`text-center bg-gray-100 border ${
                  idx === 0 ? "border-t-0" : ""
                } ${
                  idx !== props.list.length - 1 ? "border-b-0" : ""
                } border-r-0 border-black flex flex-col justify-center`}
              >
                {com.paidIntvCare.toLocaleString()}
              </div>
              <div
                className={`text-center bg-gray-100 border ${
                  idx === 0 ? "border-t-0" : ""
                } ${
                  idx !== props.list.length - 1 ? "border-b-0" : ""
                } border-r-0 border-black flex flex-col justify-center`}
              >
                {com.paidCommCare.toLocaleString()}
              </div>
              <div
                className={`text-center bg-gray-100 border ${
                  idx === 0 ? "border-t-0" : ""
                } ${
                  idx !== props.list.length - 1 ? "border-b-0" : ""
                } border-r-0 border-black flex flex-col justify-center`}
              >
                {com.prepayment.toLocaleString()}
              </div>
            </React.Fragment>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default Left;
