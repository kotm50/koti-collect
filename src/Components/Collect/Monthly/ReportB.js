import React, { useState, useEffect } from "react";
import WeekTotal from "./B/WeekTotal";
import ChannelTotal from "./B/ChannelTotal";
import CompanyTotal from "./B/CompanyTotal";
import PaytypeTotal from "./B/PaytypeTotal";

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

  const [statisticsTotal, setStatistictTotal] = useState(0);

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

  useEffect(() => {
    setStatistictTotal(
      props.statistics.cashPayment +
        props.statistics.billPayment +
        props.statistics.cardPayment
    );
  }, [props.statistics]);

  const getCompSumm = comp => {
    let list = [];
    let cashPayment = 0;
    let billPayment = 0;
    let cardPayment = 0;
    let total = 0;
    comp.forEach(doc => {
      cashPayment = cashPayment + doc.cashPayment;
      billPayment = billPayment + doc.billPayment;
      cardPayment = cardPayment + doc.cardPayment;
      const object = {
        name: doc.companyName,
        total: doc.cashPayment + doc.billPayment + doc.cardPayment,
      };
      list.push(object);
    });
    total = cashPayment + billPayment + cardPayment;
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
      paidAd = paidAd + doc.paidAd;
      paidComm = paidComm + doc.paidComm;
      paidIntvCare = paidIntvCare + doc.paidIntvCare;
      paidCommCare = paidCommCare + doc.paidCommCare;
      prepayment = prepayment + doc.prepayment;
      const object = {
        name: doc.companyName,
        total:
          doc.paidAd +
          doc.paidComm +
          doc.paidIntvCare +
          doc.paidCommCare +
          doc.prepayment,
      };
      list.push(object);
    });
    total = paidAd + paidComm + paidIntvCare + paidCommCare + prepayment;
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
      <CompanyTotal compNmList={props.compNmList} compNmTotal={compNmTotal} />
      <PaytypeTotal
        compSumList={props.compSumList}
        compSumTotal={compSumTotal}
      />
      <div className="grid grid-cols-2">
        <div className="bg-white p-4 rounded-lg drop-shadow">
          <h3 className="text-lg mb-2 font-bold">결제방식별 결제 비율</h3>
          <div className="grid grid-cols-3 border border-black">
            <div className="bg-green-200 text-center py-1 border-b border-black">
              구분
            </div>
            <div className="bg-green-200 text-center py-1 border-b border-l border-black">
              금액
            </div>
            <div className="bg-green-200 text-center py-1 border-b border-l border-black">
              비율
            </div>
            <div className="bg-white text-center py-1 border-black">현금</div>
            <div className="bg-white text-center py-1 border-l border-black">
              {props.statistics.cashPayment
                ? props.statistics.cashPayment.toLocaleString()
                : 0}
            </div>
            <div className="bg-white text-center py-1 border-l border-black">
              {props.statistics.cashRatio ? props.statistics.cashRatio : "0"}%
            </div>
            <div className="bg-white text-center py-1 border-black border-t">
              법인
            </div>
            <div className="bg-white text-center py-1 border-l border-black border-t">
              {props.statistics.billPayment
                ? props.statistics.billPayment.toLocaleString()
                : 0}
            </div>
            <div className="bg-white text-center py-1 border-l border-black border-t">
              {props.statistics.billRatio ? props.statistics.billRatio : "0"}%
            </div>
            <div className="bg-white text-center py-1 border-black border-t">
              카드(몬)
            </div>
            <div className="bg-white text-center py-1 border-l border-black border-t">
              {props.statistics.moCardPayment
                ? props.statistics.moCardPayment.toLocaleString()
                : 0}
            </div>
            <div className="bg-white text-center py-1 border-l border-black border-t">
              {props.statistics.moCardRatio
                ? props.statistics.moCardRatio
                : "0"}
              %
            </div>
            <div className="bg-white text-center py-1 border-black border-t">
              카드(천국)
            </div>
            <div className="bg-white text-center py-1 border-l border-black border-t">
              {props.statistics.heCardPayment
                ? props.statistics.heCardPayment.toLocaleString()
                : 0}
            </div>
            <div className="bg-white text-center py-1 border-l border-black border-t">
              {props.statistics.heCardRatio
                ? props.statistics.heCardRatio
                : "0"}
              %
            </div>
            <div className="bg-white text-center py-1 border-black border-t">
              카드(PG)
            </div>
            <div className="bg-white text-center py-1 border-l border-black border-t">
              {props.statistics.pgCardPayment
                ? props.statistics.pgCardPayment.toLocaleString()
                : 0}
            </div>
            <div className="bg-white text-center py-1 border-l border-black border-t">
              {props.statistics.pgCardRatio
                ? props.statistics.pgCardRatio
                : "0"}
              %
            </div>
            <div className="hidden bg-white text-center py-1 border-black border-t">
              카드 총합
            </div>
            <div className="hidden bg-white text-center py-1 border-l border-black border-t">
              {props.statistics.cardPayment
                ? props.statistics.cardPayment.toLocaleString()
                : 0}
            </div>
            <div className="hidden bg-white text-center py-1 border-l border-black border-t">
              {props.statistics.cardRatio ? props.statistics.cardRatio : "0"}%
            </div>
            <div className="bg-green-200 text-center py-1 border-black border-t font-bold">
              합계
            </div>
            <div className="col-span-2 bg-white text-center py-1 border-l border-black border-t font-bold">
              {statisticsTotal ? statisticsTotal.toLocaleString() : 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportB;
