import React, { useState, useEffect } from "react";
import Left from "./A/Left";
import WeekReport from "./A/WeekReport";

function ReportA(props) {
  const [list, setList] = useState([]);
  const [weeks, setWeeks] = useState({
    week1: { mon: [], tue: [], wed: [], thu: [], fri: [] },
    week2: { mon: [], tue: [], wed: [], thu: [], fri: [] },
    week3: { mon: [], tue: [], wed: [], thu: [], fri: [] },
    week4: { mon: [], tue: [], wed: [], thu: [], fri: [] },
    week5: { mon: [], tue: [], wed: [], thu: [], fri: [] },
  });

  const [total, setTotal] = useState({
    week1: {
      mon: {
        paidAd: 0,
        paidComm: 0,
        paidIntvCare: 0,
        paidCommCare: 0,
        prepayment: 0,
      },
      tue: {
        paidAd: 0,
        paidComm: 0,
        paidIntvCare: 0,
        paidCommCare: 0,
        prepayment: 0,
      },
      wed: {
        paidAd: 0,
        paidComm: 0,
        paidIntvCare: 0,
        paidCommCare: 0,
        prepayment: 0,
      },
      thu: {
        paidAd: 0,
        paidComm: 0,
        paidIntvCare: 0,
        paidCommCare: 0,
        prepayment: 0,
      },
      fri: {
        paidAd: 0,
        paidComm: 0,
        paidIntvCare: 0,
        paidCommCare: 0,
        prepayment: 0,
      },
    },
    week2: {
      mon: {
        paidAd: 0,
        paidComm: 0,
        paidIntvCare: 0,
        paidCommCare: 0,
        prepayment: 0,
      },
      tue: {
        paidAd: 0,
        paidComm: 0,
        paidIntvCare: 0,
        paidCommCare: 0,
        prepayment: 0,
      },
      wed: {
        paidAd: 0,
        paidComm: 0,
        paidIntvCare: 0,
        paidCommCare: 0,
        prepayment: 0,
      },
      thu: {
        paidAd: 0,
        paidComm: 0,
        paidIntvCare: 0,
        paidCommCare: 0,
        prepayment: 0,
      },
      fri: {
        paidAd: 0,
        paidComm: 0,
        paidIntvCare: 0,
        paidCommCare: 0,
        prepayment: 0,
      },
    },
    week3: {
      mon: {
        paidAd: 0,
        paidComm: 0,
        paidIntvCare: 0,
        paidCommCare: 0,
        prepayment: 0,
      },
      tue: {
        paidAd: 0,
        paidComm: 0,
        paidIntvCare: 0,
        paidCommCare: 0,
        prepayment: 0,
      },
      wed: {
        paidAd: 0,
        paidComm: 0,
        paidIntvCare: 0,
        paidCommCare: 0,
        prepayment: 0,
      },
      thu: {
        paidAd: 0,
        paidComm: 0,
        paidIntvCare: 0,
        paidCommCare: 0,
        prepayment: 0,
      },
      fri: {
        paidAd: 0,
        paidComm: 0,
        paidIntvCare: 0,
        paidCommCare: 0,
        prepayment: 0,
      },
    },
    week4: {
      mon: {
        paidAd: 0,
        paidComm: 0,
        paidIntvCare: 0,
        paidCommCare: 0,
        prepayment: 0,
      },
      tue: {
        paidAd: 0,
        paidComm: 0,
        paidIntvCare: 0,
        paidCommCare: 0,
        prepayment: 0,
      },
      wed: {
        paidAd: 0,
        paidComm: 0,
        paidIntvCare: 0,
        paidCommCare: 0,
        prepayment: 0,
      },
      thu: {
        paidAd: 0,
        paidComm: 0,
        paidIntvCare: 0,
        paidCommCare: 0,
        prepayment: 0,
      },
      fri: {
        paidAd: 0,
        paidComm: 0,
        paidIntvCare: 0,
        paidCommCare: 0,
        prepayment: 0,
      },
    },
    week5: {
      mon: {
        paidAd: 0,
        paidComm: 0,
        paidIntvCare: 0,
        paidCommCare: 0,
        prepayment: 0,
      },
      tue: {
        paidAd: 0,
        paidComm: 0,
        paidIntvCare: 0,
        paidCommCare: 0,
        prepayment: 0,
      },
      wed: {
        paidAd: 0,
        paidComm: 0,
        paidIntvCare: 0,
        paidCommCare: 0,
        prepayment: 0,
      },
      thu: {
        paidAd: 0,
        paidComm: 0,
        paidIntvCare: 0,
        paidCommCare: 0,
        prepayment: 0,
      },
      fri: {
        paidAd: 0,
        paidComm: 0,
        paidIntvCare: 0,
        paidCommCare: 0,
        prepayment: 0,
      },
    },
  });

  const [allTotal, setAllTotal] = useState({
    total: 0,
    paidAd: 0,
    paidComm: 0,
    paidIntvCare: 0,
    paidCommCare: 0,
    prepayment: 0,
  });

  const convertNumberToDay = dayNumber => {
    const numberMap = { 2: "mon", 3: "tue", 4: "wed", 5: "thu", 6: "fri" };
    return numberMap[dayNumber] || null;
  };

  useEffect(() => {
    setList(props.list);
    // total과 allTotal을 초기화하고 getWeekDay 함수 호출
    resetTotals(props.list);
    //eslint-disable-next-line
  }, [props.list]);

  // total과 allTotal 상태를 초기화하는 함수
  const resetTotals = async list => {
    setTotal({
      week1: {
        mon: {
          paidAd: 0,
          paidComm: 0,
          paidIntvCare: 0,
          paidCommCare: 0,
          prepayment: 0,
        },
        tue: {
          paidAd: 0,
          paidComm: 0,
          paidIntvCare: 0,
          paidCommCare: 0,
          prepayment: 0,
        },
        wed: {
          paidAd: 0,
          paidComm: 0,
          paidIntvCare: 0,
          paidCommCare: 0,
          prepayment: 0,
        },
        thu: {
          paidAd: 0,
          paidComm: 0,
          paidIntvCare: 0,
          paidCommCare: 0,
          prepayment: 0,
        },
        fri: {
          paidAd: 0,
          paidComm: 0,
          paidIntvCare: 0,
          paidCommCare: 0,
          prepayment: 0,
        },
      },
      week2: {
        mon: {
          paidAd: 0,
          paidComm: 0,
          paidIntvCare: 0,
          paidCommCare: 0,
          prepayment: 0,
        },
        tue: {
          paidAd: 0,
          paidComm: 0,
          paidIntvCare: 0,
          paidCommCare: 0,
          prepayment: 0,
        },
        wed: {
          paidAd: 0,
          paidComm: 0,
          paidIntvCare: 0,
          paidCommCare: 0,
          prepayment: 0,
        },
        thu: {
          paidAd: 0,
          paidComm: 0,
          paidIntvCare: 0,
          paidCommCare: 0,
          prepayment: 0,
        },
        fri: {
          paidAd: 0,
          paidComm: 0,
          paidIntvCare: 0,
          paidCommCare: 0,
          prepayment: 0,
        },
      },
      week3: {
        mon: {
          paidAd: 0,
          paidComm: 0,
          paidIntvCare: 0,
          paidCommCare: 0,
          prepayment: 0,
        },
        tue: {
          paidAd: 0,
          paidComm: 0,
          paidIntvCare: 0,
          paidCommCare: 0,
          prepayment: 0,
        },
        wed: {
          paidAd: 0,
          paidComm: 0,
          paidIntvCare: 0,
          paidCommCare: 0,
          prepayment: 0,
        },
        thu: {
          paidAd: 0,
          paidComm: 0,
          paidIntvCare: 0,
          paidCommCare: 0,
          prepayment: 0,
        },
        fri: {
          paidAd: 0,
          paidComm: 0,
          paidIntvCare: 0,
          paidCommCare: 0,
          prepayment: 0,
        },
      },
      week4: {
        mon: {
          paidAd: 0,
          paidComm: 0,
          paidIntvCare: 0,
          paidCommCare: 0,
          prepayment: 0,
        },
        tue: {
          paidAd: 0,
          paidComm: 0,
          paidIntvCare: 0,
          paidCommCare: 0,
          prepayment: 0,
        },
        wed: {
          paidAd: 0,
          paidComm: 0,
          paidIntvCare: 0,
          paidCommCare: 0,
          prepayment: 0,
        },
        thu: {
          paidAd: 0,
          paidComm: 0,
          paidIntvCare: 0,
          paidCommCare: 0,
          prepayment: 0,
        },
        fri: {
          paidAd: 0,
          paidComm: 0,
          paidIntvCare: 0,
          paidCommCare: 0,
          prepayment: 0,
        },
      },
      week5: {
        mon: {
          paidAd: 0,
          paidComm: 0,
          paidIntvCare: 0,
          paidCommCare: 0,
          prepayment: 0,
        },
        tue: {
          paidAd: 0,
          paidComm: 0,
          paidIntvCare: 0,
          paidCommCare: 0,
          prepayment: 0,
        },
        wed: {
          paidAd: 0,
          paidComm: 0,
          paidIntvCare: 0,
          paidCommCare: 0,
          prepayment: 0,
        },
        thu: {
          paidAd: 0,
          paidComm: 0,
          paidIntvCare: 0,
          paidCommCare: 0,
          prepayment: 0,
        },
        fri: {
          paidAd: 0,
          paidComm: 0,
          paidIntvCare: 0,
          paidCommCare: 0,
          prepayment: 0,
        },
      },
    });

    setAllTotal({
      total: 0,
      paidAd: 0,
      paidComm: 0,
      paidIntvCare: 0,
      paidCommCare: 0,
      prepayment: 0,
    });

    getWeekDay(list);
  };

  useEffect(() => {
    console.log(list, total);
    //eslint-disable-next-line
  }, [list]);

  const getWeekDay = list => {
    let newWeeks = { ...weeks };
    // 새로운 total과 allTotal 객체 초기화
    let newTotal = initializeTotal();
    let newAllTotal = initializeAllTotal();

    list.forEach(item => {
      let weekKey = `week${item.weekOfMonth}`;
      let dayOfWeek = convertNumberToDay(item.dayOfWeek);

      if (newWeeks[weekKey] && dayOfWeek) {
        newWeeks[weekKey][dayOfWeek] = [...newWeeks[weekKey][dayOfWeek], item];

        // total 상태 업데이트
        let totals = newTotal[weekKey][dayOfWeek];
        totals.paidAd += item.paidAd;
        totals.paidComm += item.paidComm;
        totals.paidIntvCare += item.paidIntvCare;
        totals.paidCommCare += item.paidCommCare;
        totals.prepayment += item.prepayment;

        // allTotal 상태 업데이트
        newAllTotal.paidAd += item.paidAd;
        newAllTotal.paidComm += item.paidComm;
        newAllTotal.paidIntvCare += item.paidIntvCare;
        newAllTotal.paidCommCare += item.paidCommCare;
        newAllTotal.prepayment += item.prepayment;
      }
    });

    // 전체 total 계산
    newAllTotal.total =
      newAllTotal.paidAd +
      newAllTotal.paidComm +
      newAllTotal.paidIntvCare +
      newAllTotal.paidCommCare +
      newAllTotal.prepayment;

    setWeeks(newWeeks);
    setTotal(newTotal);
    setAllTotal(newAllTotal);
  };

  // total을 초기화하는 함수
  const initializeTotal = () => {
    return {
      week1: { mon: {}, tue: {}, wed: {}, thu: {}, fri: {} },
      week2: { mon: {}, tue: {}, wed: {}, thu: {}, fri: {} },
      week3: { mon: {}, tue: {}, wed: {}, thu: {}, fri: {} },
      week4: { mon: {}, tue: {}, wed: {}, thu: {}, fri: {} },
      week5: { mon: {}, tue: {}, wed: {}, thu: {}, fri: {} },
      // 각 요일별 필드 초기화 필요
    };
  };

  // allTotal을 초기화하는 함수
  const initializeAllTotal = () => {
    return {
      total: 0,
      paidAd: 0,
      paidComm: 0,
      paidIntvCare: 0,
      paidCommCare: 0,
      prepayment: 0,
    };
  };

  return (
    <div className="relative min-h-[720px] h-fit overflow-auto text-sm">
      <div className="flex flex-row w-[10840px] h-full justify-start">
        <Left list={list} allTotal={allTotal} />
        <div className="w-[2000px] h-fit">
          <div className="sticky top-0 left-0 z-10 w-full h-fit grid grid-cols-5">
            <div className="grid grid-cols-1 col-span-5">
              <div className="text-left bg-blue-600 text-white h-[30px] flex flex-col justify-center font-bold border border-l-0 border-black pl-10 text-base">
                1주차
              </div>
              <div className="flex flex-row justify-start">
                <div className="flex flex-col justify-center border-black bg-yellow-300 text-black p-2 font-bold border-b h-[75px]">
                  결제 방법
                </div>
                <div className="flex-auto grid grid-cols-5 text-center bg-blue-600 text-white h-[75px] font-bold border border-t-0 border-l-0 border-black">
                  <div className="flex flex-col justify-center h-full border-l border-black">
                    월
                  </div>
                  <div className="flex flex-col justify-center h-full border-l border-black">
                    화
                  </div>
                  <div className="flex flex-col justify-center h-full border-l border-black">
                    수
                  </div>
                  <div className="flex flex-col justify-center h-full border-l border-black">
                    목
                  </div>
                  <div className="flex flex-col justify-center h-full border-l border-black">
                    금
                  </div>
                  <div className="grid grid-cols-5 h-full border-l border-t bg-white text-black border-black">
                    <div className="flex flex-col justify-center text-center">
                      광고비
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      위촉비
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      면접케어
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      위촉케어
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      선입금
                    </div>
                  </div>
                  <div className="grid grid-cols-5 h-full border-l border-t bg-white text-black border-black">
                    <div className="flex flex-col justify-center text-center">
                      광고비
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      위촉비
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      면접케어
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      위촉케어
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      선입금
                    </div>
                  </div>
                  <div className="grid grid-cols-5 h-full border-l border-t bg-white text-black border-black">
                    <div className="flex flex-col justify-center text-center">
                      광고비
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      위촉비
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      면접케어
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      위촉케어
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      선입금
                    </div>
                  </div>
                  <div className="grid grid-cols-5 h-full border-l border-t bg-white text-black border-black">
                    <div className="flex flex-col justify-center text-center">
                      광고비
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      위촉비
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      면접케어
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      위촉케어
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      선입금
                    </div>
                  </div>
                  <div className="grid grid-cols-5 h-full border-l border-t bg-white text-black border-black">
                    <div className="flex flex-col justify-center text-center">
                      광고비
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      위촉비
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      면접케어
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      위촉케어
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      선입금
                    </div>
                  </div>
                  <div className="grid grid-cols-5 h-full border-l border-t bg-green-100 text-black border-black">
                    <div className="flex flex-col justify-center text-center">
                      {total.week1.mon.paidAd
                        ? total.week1.mon.paidAd.toLocaleString()
                        : 0}
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      {total.week1.mon.paidComm
                        ? total.week1.mon.paidComm.toLocaleString()
                        : 0}
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      {total.week1.mon.paidIntvCare
                        ? total.week1.mon.paidIntvCare.toLocaleString()
                        : 0}
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      {total.week1.mon.paidCommCare
                        ? total.week1.mon.paidCommCare.toLocaleString()
                        : 0}
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      {total.week1.mon.prepayment
                        ? total.week1.mon.prepayment.toLocaleString()
                        : 0}
                    </div>
                  </div>
                  <div className="grid grid-cols-5 h-full border-l border-t bg-green-100 text-black border-black">
                    <div className="flex flex-col justify-center text-center">
                      {total.week1.tue.paidAd
                        ? total.week1.tue.paidAd.toLocaleString()
                        : 0}
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      {total.week1.tue.paidComm
                        ? total.week1.tue.paidComm.toLocaleString()
                        : 0}
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      {total.week1.tue.paidIntvCare
                        ? total.week1.tue.paidIntvCare.toLocaleString()
                        : 0}
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      {total.week1.tue.paidCommCare
                        ? total.week1.tue.paidCommCare.toLocaleString()
                        : 0}
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      {total.week1.tue.prepayment
                        ? total.week1.tue.prepayment.toLocaleString()
                        : 0}
                    </div>
                  </div>
                  <div className="grid grid-cols-5 h-full border-l border-t bg-green-100 text-black border-black">
                    <div className="flex flex-col justify-center text-center">
                      {total.week1.wed.paidAd
                        ? total.week1.wed.paidAd.toLocaleString()
                        : 0}
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      {total.week1.wed.paidComm
                        ? total.week1.wed.paidComm.toLocaleString()
                        : 0}
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      {total.week1.wed.paidIntvCare
                        ? total.week1.wed.paidIntvCare.toLocaleString()
                        : 0}
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      {total.week1.wed.paidCommCare
                        ? total.week1.wed.paidCommCare.toLocaleString()
                        : 0}
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      {total.week1.wed.prepayment
                        ? total.week1.wed.prepayment.toLocaleString()
                        : 0}
                    </div>
                  </div>
                  <div className="grid grid-cols-5 h-full border-l border-t bg-green-100 text-black border-black">
                    <div className="flex flex-col justify-center text-center">
                      {total.week1.thu.paidAd
                        ? total.week1.thu.paidAd.toLocaleString()
                        : 0}
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      {total.week1.thu.paidComm
                        ? total.week1.thu.paidComm.toLocaleString()
                        : 0}
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      {total.week1.thu.paidIntvCare
                        ? total.week1.thu.paidIntvCare.toLocaleString()
                        : 0}
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      {total.week1.thu.paidCommCare
                        ? total.week1.thu.paidCommCare.toLocaleString()
                        : 0}
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      {total.week1.thu.prepayment
                        ? total.week1.thu.prepayment.toLocaleString()
                        : 0}
                    </div>
                  </div>
                  <div className="grid grid-cols-5 h-full border-l border-t bg-green-100 text-black border-black">
                    <div className="flex flex-col justify-center text-center">
                      {total.week1.fri.paidAd
                        ? total.week1.fri.paidAd.toLocaleString()
                        : 0}
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      {total.week1.fri.paidComm
                        ? total.week1.fri.paidComm.toLocaleString()
                        : 0}
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      {total.week1.fri.paidIntvCare
                        ? total.week1.fri.paidIntvCare.toLocaleString()
                        : 0}
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      {total.week1.fri.paidCommCare
                        ? total.week1.fri.paidCommCare.toLocaleString()
                        : 0}
                    </div>
                    <div className="flex flex-col justify-center text-center border-l border-black">
                      {total.week1.fri.prepayment
                        ? total.week1.fri.prepayment.toLocaleString()
                        : 0}
                    </div>
                  </div>
                </div>
              </div>
              <WeekReport list={list} week={weeks.week1} total={total.week1} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportA;
