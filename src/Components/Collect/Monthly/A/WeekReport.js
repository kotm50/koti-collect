import React from "react";

function WeekReport(props) {
  const getPayType = (companyCode, payType) => {
    const week = props.week;
    const isMon = week.mon.some(doc => doc.companyCode === companyCode);
    const isTue = week.tue.some(doc => doc.companyCode === companyCode);
    const isWed = week.wed.some(doc => doc.companyCode === companyCode);
    const isThu = week.thu.some(doc => doc.companyCode === companyCode);
    const isFri = week.fri.some(doc => doc.companyCode === companyCode);
    if (isMon || isTue || isWed || isThu || isFri) {
      return getPayTitle(payType);
    } else {
      return null;
    }
  };

  const getPayTitle = payType => {
    if (payType === "CA") {
      return "현금(개인)";
    } else if (payType === "CO") {
      return "현금(법인)";
    } else if (payType === "PG") {
      return "카드(PG)";
    } else if (payType === "MO") {
      return "카드(몬)";
    } else if (payType === "HE") {
      return "카드(천국)";
    } else if (payType === "PE") {
      return "카드(펄맥)";
    } else if (payType === "PR") {
      return "선입금";
    } else {
      return "오류";
    }
  };

  const getCost = (companyCode, date, pay) => {
    const isPaid = date.some(doc => doc.companyCode === companyCode);
    if (isPaid) {
      if (Number(pay) > 0) {
        return Number(pay).toLocaleString();
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  };
  return (
    <>
      {props.list && props.list.length > 0 && (
        <>
          {props.list.map((list, idx) => (
            <div
              className="flex flex-row justify-start border-b border-black"
              key={idx}
            >
              <div
                className="flex flex-col justify-center text-center bg-yellow-300 text-black py-2 h-[20px] w-[84px] truncate"
                data-code={list.companyCode}
              >
                {getPayType(list.companyCode, list.payType)}
              </div>
              <div className="flex-auto grid grid-cols-5 text-center bg-blue-600 text-white h-[20px] border border-t-0 border-l-0 border-black">
                <div className="grid grid-cols-5 h-full border-l bg-white text-black border-black">
                  <div
                    className={`flex flex-col justify-center text-center ${
                      getCost(list.companyCode, props.week.mon, list.paidAd) ===
                      0
                        ? "text-white"
                        : ""
                    }`}
                  >
                    {getCost(list.companyCode, props.week.mon, list.paidAd)}
                  </div>
                  <div
                    className={`flex flex-col justify-center text-center border-l border-black ${
                      getCost(
                        list.companyCode,
                        props.week.mon,
                        list.paidComm
                      ) === 0
                        ? "text-white"
                        : ""
                    }`}
                  >
                    {getCost(list.companyCode, props.week.mon, list.paidComm)}
                  </div>
                  <div
                    className={`flex flex-col justify-center text-center border-l border-black ${
                      getCost(
                        list.companyCode,
                        props.week.mon,
                        list.paidIntvCare
                      ) === 0
                        ? "text-white"
                        : ""
                    }`}
                  >
                    {getCost(
                      list.companyCode,
                      props.week.mon,
                      list.paidIntvCare
                    )}
                  </div>
                  <div
                    className={`flex flex-col justify-center text-center border-l border-black ${
                      getCost(
                        list.companyCode,
                        props.week.mon,
                        list.paidCommCare
                      ) === 0
                        ? "text-white"
                        : ""
                    }`}
                  >
                    {getCost(
                      list.companyCode,
                      props.week.mon,
                      list.paidCommCare
                    )}
                  </div>
                  <div
                    className={`flex flex-col justify-center text-center border-l border-black ${
                      getCost(
                        list.companyCode,
                        props.week.mon,
                        list.prepayment
                      ) === 0
                        ? "text-white"
                        : ""
                    }`}
                  >
                    {getCost(list.companyCode, props.week.mon, list.prepayment)}
                  </div>
                </div>
                <div className="grid grid-cols-5 h-full border-l bg-white text-black border-black">
                  <div
                    className={`flex flex-col justify-center text-center ${
                      getCost(list.companyCode, props.week.tue, list.paidAd) ===
                      0
                        ? "text-white"
                        : ""
                    }`}
                  >
                    {getCost(list.companyCode, props.week.tue, list.paidAd)}
                  </div>
                  <div
                    className={`flex flex-col justify-center text-center border-l border-black ${
                      getCost(
                        list.companyCode,
                        props.week.tue,
                        list.paidComm
                      ) === 0
                        ? "text-white"
                        : ""
                    }`}
                  >
                    {getCost(list.companyCode, props.week.tue, list.paidComm)}
                  </div>
                  <div
                    className={`flex flex-col justify-center text-center border-l border-black ${
                      getCost(
                        list.companyCode,
                        props.week.tue,
                        list.paidIntvCare
                      ) === 0
                        ? "text-white"
                        : ""
                    }`}
                  >
                    {getCost(
                      list.companyCode,
                      props.week.tue,
                      list.paidIntvCare
                    )}
                  </div>
                  <div
                    className={`flex flex-col justify-center text-center border-l border-black ${
                      getCost(
                        list.companyCode,
                        props.week.tue,
                        list.paidCommCare
                      ) === 0
                        ? "text-white"
                        : ""
                    }`}
                  >
                    {getCost(
                      list.companyCode,
                      props.week.tue,
                      list.paidCommCare
                    )}
                  </div>
                  <div
                    className={`flex flex-col justify-center text-center border-l border-black ${
                      getCost(
                        list.companyCode,
                        props.week.tue,
                        list.prepayment
                      ) === 0
                        ? "text-white"
                        : ""
                    }`}
                  >
                    {getCost(list.companyCode, props.week.tue, list.prepayment)}
                  </div>
                </div>
                <div className="grid grid-cols-5 h-full border-l bg-white text-black border-black">
                  <div
                    className={`flex flex-col justify-center text-center ${
                      getCost(list.companyCode, props.week.wed, list.paidAd) ===
                      0
                        ? "text-white"
                        : ""
                    }`}
                  >
                    {getCost(list.companyCode, props.week.wed, list.paidAd)}
                  </div>
                  <div
                    className={`flex flex-col justify-center text-center border-l border-black ${
                      getCost(
                        list.companyCode,
                        props.week.wed,
                        list.paidComm
                      ) === 0
                        ? "text-white"
                        : ""
                    }`}
                  >
                    {getCost(list.companyCode, props.week.wed, list.paidComm)}
                  </div>
                  <div
                    className={`flex flex-col justify-center text-center border-l border-black ${
                      getCost(
                        list.companyCode,
                        props.week.wed,
                        list.paidIntvCare
                      ) === 0
                        ? "text-white"
                        : ""
                    }`}
                  >
                    {getCost(
                      list.companyCode,
                      props.week.wed,
                      list.paidIntvCare
                    )}
                  </div>
                  <div
                    className={`flex flex-col justify-center text-center border-l border-black ${
                      getCost(
                        list.companyCode,
                        props.week.wed,
                        list.paidCommCare
                      ) === 0
                        ? "text-white"
                        : ""
                    }`}
                  >
                    {getCost(
                      list.companyCode,
                      props.week.wed,
                      list.paidCommCare
                    )}
                  </div>
                  <div
                    className={`flex flex-col justify-center text-center border-l border-black ${
                      getCost(
                        list.companyCode,
                        props.week.wed,
                        list.prepayment
                      ) === 0
                        ? "text-white"
                        : ""
                    }`}
                  >
                    {getCost(list.companyCode, props.week.wed, list.prepayment)}
                  </div>
                </div>
                <div className="grid grid-cols-5 h-full border-l bg-white text-black border-black">
                  <div
                    className={`flex flex-col justify-center text-center ${
                      getCost(list.companyCode, props.week.thu, list.paidAd) ===
                      0
                        ? "text-white"
                        : ""
                    }`}
                  >
                    {getCost(list.companyCode, props.week.thu, list.paidAd)}
                  </div>
                  <div
                    className={`flex flex-col justify-center text-center border-l border-black ${
                      getCost(
                        list.companyCode,
                        props.week.thu,
                        list.paidComm
                      ) === 0
                        ? "text-white"
                        : ""
                    }`}
                  >
                    {getCost(list.companyCode, props.week.thu, list.paidComm)}
                  </div>
                  <div
                    className={`flex flex-col justify-center text-center border-l border-black ${
                      getCost(
                        list.companyCode,
                        props.week.thu,
                        list.paidIntvCare
                      ) === 0
                        ? "text-white"
                        : ""
                    }`}
                  >
                    {getCost(
                      list.companyCode,
                      props.week.thu,
                      list.paidIntvCare
                    )}
                  </div>
                  <div
                    className={`flex flex-col justify-center text-center border-l border-black ${
                      getCost(
                        list.companyCode,
                        props.week.thu,
                        list.paidCommCare
                      ) === 0
                        ? "text-white"
                        : ""
                    }`}
                  >
                    {getCost(
                      list.companyCode,
                      props.week.thu,
                      list.paidCommCare
                    )}
                  </div>
                  <div
                    className={`flex flex-col justify-center text-center border-l border-black ${
                      getCost(
                        list.companyCode,
                        props.week.thu,
                        list.prepayment
                      ) === 0
                        ? "text-white"
                        : ""
                    }`}
                  >
                    {getCost(list.companyCode, props.week.thu, list.prepayment)}
                  </div>
                </div>
                <div className="grid grid-cols-5 h-full border-l bg-white text-black border-black">
                  <div
                    className={`flex flex-col justify-center text-center ${
                      getCost(list.companyCode, props.week.fri, list.paidAd) ===
                      0
                        ? "text-white"
                        : ""
                    }`}
                  >
                    {getCost(list.companyCode, props.week.fri, list.paidAd)}
                  </div>
                  <div
                    className={`flex flex-col justify-center text-center border-l border-black ${
                      getCost(
                        list.companyCode,
                        props.week.fri,
                        list.paidComm
                      ) === 0
                        ? "text-white"
                        : ""
                    }`}
                  >
                    {getCost(list.companyCode, props.week.fri, list.paidComm)}
                  </div>
                  <div
                    className={`flex flex-col justify-center text-center border-l border-black ${
                      getCost(
                        list.companyCode,
                        props.week.fri,
                        list.paidIntvCare
                      ) === 0
                        ? "text-white"
                        : ""
                    }`}
                  >
                    {getCost(
                      list.companyCode,
                      props.week.fri,
                      list.paidIntvCare
                    )}
                  </div>
                  <div
                    className={`flex flex-col justify-center text-center border-l border-black ${
                      getCost(
                        list.companyCode,
                        props.week.fri,
                        list.paidCommCare
                      ) === 0
                        ? "text-white"
                        : ""
                    }`}
                  >
                    {getCost(
                      list.companyCode,
                      props.week.fri,
                      list.paidCommCare
                    )}
                  </div>
                  <div
                    className={`flex flex-col justify-center text-center border-l border-black ${
                      getCost(
                        list.companyCode,
                        props.week.fri,
                        list.prepayment
                      ) === 0
                        ? "text-white"
                        : ""
                    }`}
                  >
                    {getCost(list.companyCode, props.week.fri, list.prepayment)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}

export default WeekReport;
