import React from "react";

function CompanyTotal(props) {
  return (
    <div className="bg-white p-4 rounded-lg drop-shadow">
      <h3 className="text-lg mb-2 font-bold">고객사별 결제 수수료</h3>
      <div className="grid grid-cols-7 border border-black">
        <div className="bg-blue-200 text-center py-1 border-b border-black">
          고객사별
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
        {props.compNmList && props.compNmList.length > 0 ? (
          <>
            {props.compNmList.map((comp, idx) => (
              <React.Fragment key={idx}>
                <div
                  className={`bg-white text-center py-1 border-black ${
                    idx > 0 && "border-t"
                  }`}
                >
                  {comp.companyName}
                </div>
                <div
                  className={`bg-white text-center py-1 border-l border-black ${
                    idx > 0 && "border-t"
                  }`}
                >
                  {comp.paidAd.toLocaleString()}
                </div>
                <div
                  className={`bg-white text-center py-1 border-l border-black ${
                    idx > 0 && "border-t"
                  }`}
                >
                  {comp.paidComm.toLocaleString()}
                </div>
                <div
                  className={`bg-white text-center py-1 border-l border-black ${
                    idx > 0 && "border-t"
                  }`}
                >
                  {comp.paidIntvCare.toLocaleString()}
                </div>
                <div
                  className={`bg-white text-center py-1 border-l border-black ${
                    idx > 0 && "border-t"
                  }`}
                >
                  {comp.paidCommCare.toLocaleString()}
                </div>
                <div
                  className={`bg-white text-center py-1 border-l border-black ${
                    idx > 0 && "border-t"
                  }`}
                >
                  {comp.prepayment.toLocaleString()}
                </div>
                <div
                  className={`bg-white text-center py-1 border-l border-black ${
                    idx > 0 && "border-t"
                  }`}
                >
                  {(
                    comp.paidAd +
                    comp.paidComm +
                    comp.paidIntvCare +
                    comp.paidCommCare +
                    comp.prepayment
                  ).toLocaleString()}
                </div>
              </React.Fragment>
            ))}
          </>
        ) : null}

        <div className="bg-blue-200 text-center py-1 border-black border-t font-bold">
          합계
        </div>
        <div className="bg-white text-center py-1 border-l border-black border-t">
          {props.compNmTotal.paidAd.toLocaleString()}
        </div>
        <div className="bg-white text-center py-1 border-l border-black border-t">
          {props.compNmTotal.paidComm.toLocaleString()}
        </div>
        <div className="bg-white text-center py-1 border-l border-black border-t">
          {props.compNmTotal.paidIntvCare.toLocaleString()}
        </div>
        <div className="bg-white text-center py-1 border-l border-black border-t">
          {props.compNmTotal.paidCommCare.toLocaleString()}
        </div>
        <div className="bg-white text-center py-1 border-l border-black border-t">
          {props.compNmTotal.prepayment.toLocaleString()}
        </div>
        <div className="bg-white text-center py-1 border-l border-black border-t font-bold">
          {props.compNmTotal.total.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default CompanyTotal;
