import React, { useState, useEffect } from "react";
import WeekTotal from "./B/WeekTotal";
import ChannelTotal from "./B/ChannelTotal";

function ReportB(props) {
  const [gubunTotal, setGubunTotal] = useState({
    im: 0,
    tm: 0,
    total: 0,
  });
  const [weekList, setWeekList] = useState({
    first: 0,
    second: 0,
    third: 0,
    fourth: 0,
    fifth: 0,
    total: 0,
  });

  const [compSumTotal, setCompSumTotal] = useState({
    cashPayment: 0,
    billPayment: 0,
    cardPayment: 0,
    total: 0,
  });

  const [compNmTotal, setCompNmTotal] = useState({
    paidAd: 0,
    paidComm: 0,
    paidIntvCare: 0,
    paidCommCare: 0,
    prepayment: 0,
    total: 0,
  });

  useEffect(() => {
    if (props.weekList && props.weekList.length > 0) {
      getWeeklyCost(props.weekList);
    } else {
      setWeekList({
        first: 0,
        second: 0,
        third: 0,
        fourth: 0,
        fifth: 0,
        total: 0,
      });
    }
  }, [props.weekList]);

  useEffect(() => {
    if (props.gubunList && props.gubunList.length > 0) {
      getGubun(props.gubunList);
    } else {
      setGubunTotal({
        im: 0,
        tm: 0,
        total: 0,
      });
    }
  }, [props.gubunList]);

  useEffect(() => {
    if (props.compNmList && props.compNmList.length > 0) {
      getCompNm(props.compNmList);
    } else {
      setCompNmTotal({
        paidAd: 0,
        paidComm: 0,
        paidIntvCare: 0,
        paidCommCare: 0,
        prepayment: 0,
        total: 0,
      });
    }
  }, [props.compNmList]);

  useEffect(() => {
    if (props.compSumList && props.compSumList.length > 0) {
      getCompSumm(props.compSumList);
    } else {
      setCompSumTotal({
        cashPayment: 0,
        billPayment: 0,
        cardPayment: 0,
        total: 0,
      });
    }
  }, [props.compSumList]);

  const getCompSumm = comp => {
    let list = [];
    let cashPayment = 0;
    let billPayment = 0;
    let cardPayment = 0;
    let total = 0;
    comp.forEach(doc => {
      list.push(doc);
      cashPayment = cashPayment + doc.cashPayment;
      billPayment = billPayment + doc.billPayment;
      cardPayment = cardPayment + doc.cardPayment;
    });
    total = cashPayment + billPayment + cardPayment;
    console.log("방식별", total, list);
    setCompSumTotal({
      cashPayment: cashPayment,
      billPayment: billPayment,
      cardPayment: cardPayment,
      total: total,
    });
  };

  const getCompNm = comp => {
    let list = [];
    let paidAd = 0;
    let paidComm = 0;
    let paidIntvCare = 0;
    let paidCommCare = 0;
    let prepayment = 0;
    let total = 0;
    comp.forEach(doc => {
      list.push(doc);
      paidAd = paidAd + doc.paidAd;
      paidComm = paidComm + doc.paidComm;
      paidIntvCare = paidIntvCare + doc.paidIntvCare;
      paidCommCare = paidCommCare + doc.paidCommCare;
      prepayment = prepayment + doc.prepayment;
    });
    total = paidAd + paidComm + paidIntvCare + paidCommCare + prepayment;
    console.log("사별", total, list);
    setCompNmTotal({
      paidAd: paidAd,
      paidComm: paidComm,
      paidIntvCare: paidIntvCare,
      paidCommCare: paidCommCare,
      prepayment: prepayment,
      total: total,
    });
  };

  const getGubun = gubun => {
    let total = 0;
    let im = 0;
    let tm = 0;
    gubun.forEach(doc => {
      total =
        total +
        (doc.paidAd +
          doc.paidComm +
          doc.paidIntvCare +
          doc.paidCommCare +
          doc.prepayment);
      if (doc.gubun === "IM") {
        im =
          im +
          (doc.paidAd +
            doc.paidComm +
            doc.paidIntvCare +
            doc.paidCommCare +
            doc.prepayment);
      }
      if (doc.gubun === "TM") {
        tm =
          tm +
          (doc.paidAd +
            doc.paidComm +
            doc.paidIntvCare +
            doc.paidCommCare +
            doc.prepayment);
      }
    });
    setGubunTotal({
      total: total,
      im: im,
      tm: tm,
    });
  };

  const getWeeklyCost = list => {
    let weekList = { total: 0 };
    list.forEach(doc => {
      weekList.total = weekList.total + doc.totalPayment;
      if (doc.weekOfMonth === "1") {
        weekList.first = doc.totalPayment;
      } else if (doc.weekOfMonth === "2") {
        weekList.second = doc.totalPayment;
      } else if (doc.weekOfMonth === "3") {
        weekList.third = doc.totalPayment;
      } else if (doc.weekOfMonth === "4") {
        weekList.fourth = doc.totalPayment;
      } else if (doc.weekOfMonth === "5") {
        weekList.fifth = doc.totalPayment;
      }
    });
    setWeekList(weekList);
  };
  return (
    <div className="grid grid-cols-1 gap-y-4 w-full">
      <WeekTotal weekList={weekList} />
      <ChannelTotal gubunList={props.gubunList} gubunTotal={gubunTotal} />
      <div className="bg-white p-4 rounded-lg drop-shadow">
        <h3 className="text-lg mb-2 font-bold">고객사별 결제수수료</h3>
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

          <div className="bg-blue-200 text-center py-1 border-black border-t">
            합계
          </div>
          <div className="bg-white text-center py-1 border-l border-black border-t">
            {compNmTotal.paidAd.toLocaleString()}
          </div>
          <div className="bg-white text-center py-1 border-l border-black border-t">
            {compNmTotal.paidComm.toLocaleString()}
          </div>
          <div className="bg-white text-center py-1 border-l border-black border-t">
            {compNmTotal.paidIntvCare.toLocaleString()}
          </div>
          <div className="bg-white text-center py-1 border-l border-black border-t">
            {compNmTotal.paidCommCare.toLocaleString()}
          </div>
          <div className="bg-white text-center py-1 border-l border-black border-t">
            {compNmTotal.prepayment.toLocaleString()}
          </div>
          <div className="bg-white text-center py-1 border-l border-black border-t">
            {compNmTotal.total.toLocaleString()}
          </div>
        </div>
      </div>
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

          <div className="bg-blue-200 text-center py-1 border-black border-t">
            합계
          </div>
          <div className="bg-white text-center py-1 border-l border-black border-t">
            {compSumTotal.cashPayment.toLocaleString()}
          </div>
          <div className="bg-white text-center py-1 border-l border-black border-t">
            {compSumTotal.billPayment.toLocaleString()}
          </div>
          <div className="bg-white text-center py-1 border-l border-black border-t">
            {compSumTotal.cardPayment.toLocaleString()}
          </div>
          <div className="bg-white text-center py-1 border-l border-black border-t">
            {compSumTotal.total.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportB;
