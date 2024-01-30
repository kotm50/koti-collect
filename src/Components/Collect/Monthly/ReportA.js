import React, { useState, useEffect } from "react";
import Left from "./A/Left";
import WeekReport from "./A/WeekReport";
import WeekTotal from "./A/WeekTotal";

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

  const getWeekDay = list => {
    if (list === undefined) {
      return false;
    }
    let newWeeks = { ...weeks };
    // 새로운 total과 allTotal 객체 초기화
    let newTotal = initializeTotal();
    let newAllTotal = initializeAllTotal();
    console.log(newAllTotal);
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
    console.log(newAllTotal);
    setWeeks(newWeeks);
    setTotal(newTotal);
    setAllTotal(newAllTotal);
  };

  // total을 초기화하는 함수
  const initializeTotal = () => {
    return {
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
    <div className="relative max-h-[720px] h-fit overflow-auto text-sm">
      <div className="flex flex-row w-[12840px] h-full justify-start">
        <Left list={list} allTotal={allTotal} />
        <div className="w-[2400px] h-fit" data-txt={"week1"}>
          <div className="sticky top-0 left-0 z-10 w-full h-fit grid grid-cols-5">
            <div className="grid grid-cols-1 col-span-5">
              <div className="text-left bg-blue-600 text-white h-[30px] flex flex-col justify-center font-bold border border-l-0 border-black pl-4 text-base">
                1주차
              </div>
              <WeekTotal total={total.week1} />
              <WeekReport list={list} week={weeks.week1} />
            </div>
          </div>
        </div>
        <div className="w-[2400px] h-fit" data-txt={"week1"}>
          <div className="sticky top-0 left-0 z-10 w-full h-fit grid grid-cols-5">
            <div className="grid grid-cols-1 col-span-5">
              <div className="text-left bg-blue-600 text-white h-[30px] flex flex-col justify-center font-bold border border-l-0 border-black pl-4 text-base">
                2주차
              </div>
              <WeekTotal total={total.week2} />
              <WeekReport list={list} week={weeks.week2} />
            </div>
          </div>
        </div>
        <div className="w-[2400px] h-fit" data-txt={"week3"}>
          <div className="sticky top-0 left-0 z-10 w-full h-fit grid grid-cols-5">
            <div className="grid grid-cols-1 col-span-5">
              <div className="text-left bg-blue-600 text-white h-[30px] flex flex-col justify-center font-bold border border-l-0 border-black pl-4 text-base">
                3주차
              </div>
              <WeekTotal total={total.week3} />
              <WeekReport list={list} week={weeks.week3} />
            </div>
          </div>
        </div>
        <div className="w-[2400px] h-fit" data-txt={"week4"}>
          <div className="sticky top-0 left-0 z-10 w-full h-fit grid grid-cols-5">
            <div className="grid grid-cols-1 col-span-5">
              <div className="text-left bg-blue-600 text-white h-[30px] flex flex-col justify-center font-bold border border-l-0 border-black pl-4 text-base">
                4주차
              </div>
              <WeekTotal total={total.week4} />
              <WeekReport list={list} week={weeks.week4} />
            </div>
          </div>
        </div>
        <div className="w-[2400px] h-fit" data-txt={"week5"}>
          <div className="sticky top-0 left-0 z-10 w-full h-fit grid grid-cols-5">
            <div className="grid grid-cols-1 col-span-5">
              <div className="text-left bg-blue-600 text-white h-[30px] flex flex-col justify-center font-bold border border-l-0 border-black pl-4 text-base">
                5주차
              </div>
              <WeekTotal total={total.week5} />
              <WeekReport list={list} week={weeks.week5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportA;
