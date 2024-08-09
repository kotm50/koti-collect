import React from "react";

function PaytypeTotal(props) {
  return (
    <div className="bg-white p-4 rounded-lg drop-shadow">
      <h3 className="text-lg mb-2 font-bold">고객사 결제 방식별 수수료</h3>
      <div className="grid grid-cols-5 border border-black">
        <div className="bg-blue-200 text-center py-1 border-b border-black">
          고객사별
        </div>
        <div className="bg-blue-200 text-center py-1 border-b border-l border-black">
          현금
        </div>
        <div className="bg-blue-200 text-center py-1 border-b border-l border-black">
          카드
        </div>
        <div className="bg-blue-200 text-center py-1 border-b border-l border-black">
          세금계산서
        </div>
        <div className="bg-blue-200 text-center py-1 border-b border-l border-black">
          합계
        </div>
        {props.compSumList && props.compSumList.length > 0 ? (
          <>
            {props.compSumList.map((comp, idx) => (
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
                  {comp.cashPayment.toLocaleString()}
                </div>
                <div
                  className={`bg-white text-center py-1 border-l border-black ${
                    idx > 0 && "border-t"
                  }`}
                >
                  {comp.cardPayment.toLocaleString()}
                </div>
                <div
                  className={`bg-white text-center py-1 border-l border-black ${
                    idx > 0 && "border-t"
                  }`}
                >
                  {comp.billPayment.toLocaleString()}
                </div>
                <div
                  className={`bg-white text-center py-1 border-l border-black ${
                    idx > 0 && "border-t"
                  }`}
                >
                  {(
                    comp.cashPayment +
                    comp.billPayment +
                    comp.cardPayment
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
          {props.compSumTotal.cashPayment.toLocaleString()}
        </div>
        <div className="bg-white text-center py-1 border-l border-black border-t">
          {props.compSumTotal.cardPayment.toLocaleString()}
        </div>
        <div className="bg-white text-center py-1 border-l border-black border-t">
          {props.compSumTotal.billPayment.toLocaleString()}
        </div>
        <div className="bg-white text-center py-1 border-l border-black border-t font-bold">
          {props.compSumTotal.total.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default PaytypeTotal;
