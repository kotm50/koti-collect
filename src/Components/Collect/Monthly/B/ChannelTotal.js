import React from "react";

function ChannelTotal(props) {
  const dummy = [
    {
      gubun: "IM",
      paidAd: 0,
      paidComm: 0,
      paidIntvCare: 0,
      paidCommCare: 0,
      prepayment: 0,
      im: 0,
    },
    {
      gubun: "TM",
      paidAd: 0,
      paidComm: 0,
      paidIntvCare: 0,
      paidCommCare: 0,
      prepayment: 0,
      tm: 0,
    },
  ];
  return (
    <div className="bg-white p-4 rounded-lg drop-shadow">
      <h3 className="text-lg mb-2 font-bold">채널별 결제 수수료</h3>
      <div className="grid grid-cols-7 border border-black">
        <div className="bg-blue-200 text-center py-1 border-b border-black">
          채널
        </div>
        <div className="bg-blue-200 text-center py-1 border-b border-l border-black">
          광고비
        </div>
        <div className="bg-blue-200 text-center py-1 border-b border-l border-black">
          위촉비
        </div>
        <div className="bg-blue-200 text-center py-1 border-b border-l border-black">
          면접케어
        </div>
        <div className="bg-blue-200 text-center py-1 border-b border-l border-black">
          위촉케어
        </div>
        <div className="bg-blue-200 text-center py-1 border-b border-l border-black">
          선입금
        </div>
        <div className="bg-blue-200 text-center py-1 border-b border-l border-black">
          합계
        </div>
        {props.gubunList && props.gubunList.length > 0 ? (
          <>
            {props.gubunList.map((gubun, idx) => (
              <React.Fragment key={idx}>
                <div
                  className={`bg-white text-center py-1 border-black ${
                    idx > 0 && "border-t"
                  }`}
                >
                  {gubun.gubun}
                </div>
                <div
                  className={`bg-white text-center py-1 border-l border-black ${
                    idx > 0 && "border-t"
                  }`}
                >
                  {gubun.paidAd.toLocaleString()}
                </div>
                <div
                  className={`bg-white text-center py-1 border-l border-black ${
                    idx > 0 && "border-t"
                  }`}
                >
                  {gubun.paidComm.toLocaleString()}
                </div>
                <div
                  className={`bg-white text-center py-1 border-l border-black ${
                    idx > 0 && "border-t"
                  }`}
                >
                  {gubun.paidIntvCare.toLocaleString()}
                </div>
                <div
                  className={`bg-white text-center py-1 border-l border-black ${
                    idx > 0 && "border-t"
                  }`}
                >
                  {gubun.paidCommCare.toLocaleString()}
                </div>
                <div
                  className={`bg-white text-center py-1 border-l border-black ${
                    idx > 0 && "border-t"
                  }`}
                >
                  {gubun.prepayment.toLocaleString()}
                </div>
                <div
                  className={`bg-white text-center py-1 border-l border-black ${
                    idx > 0 && "border-t"
                  }`}
                >
                  {gubun.gubun === "IM"
                    ? props.gubunTotal.im.toLocaleString()
                    : props.gubunTotal.tm.toLocaleString()}
                </div>
              </React.Fragment>
            ))}
          </>
        ) : (
          <>
            {dummy.map((gubun, idx) => (
              <React.Fragment key={idx}>
                <div
                  className={`bg-white text-center py-1 border-black ${
                    idx > 0 && "border-t"
                  }`}
                >
                  {gubun.gubun}
                </div>
                <div
                  className={`bg-white text-center py-1 border-l border-black ${
                    idx > 0 && "border-t"
                  }`}
                >
                  {gubun.paidAd.toLocaleString()}
                </div>
                <div
                  className={`bg-white text-center py-1 border-l border-black ${
                    idx > 0 && "border-t"
                  }`}
                >
                  {gubun.paidComm.toLocaleString()}
                </div>
                <div
                  className={`bg-white text-center py-1 border-l border-black ${
                    idx > 0 && "border-t"
                  }`}
                >
                  {gubun.paidIntvCare.toLocaleString()}
                </div>
                <div
                  className={`bg-white text-center py-1 border-l border-black ${
                    idx > 0 && "border-t"
                  }`}
                >
                  {gubun.paidCommCare.toLocaleString()}
                </div>
                <div
                  className={`bg-white text-center py-1 border-l border-black ${
                    idx > 0 && "border-t"
                  }`}
                >
                  {gubun.prepayment.toLocaleString()}
                </div>
                <div
                  className={`bg-white text-center py-1 border-l border-black ${
                    idx > 0 && "border-t"
                  }`}
                >
                  {gubun.gubun === "IM"
                    ? props.gubunTotal.im.toLocaleString()
                    : props.gubunTotal.tm.toLocaleString()}
                </div>
              </React.Fragment>
            ))}
          </>
        )}
      </div>
      <div className="grid grid-cols-7">
        <div className="col-span-5 border-r border-black"></div>
        <div className="bg-blue-200 text-center border-r border-b border-black py-1">
          합계
        </div>
        <div className="bg-white text-center border-r border-b border-black py-1">
          {props.gubunTotal.total > 0
            ? props.gubunTotal.total.toLocaleString()
            : 0}
        </div>
      </div>
    </div>
  );
}

export default ChannelTotal;
