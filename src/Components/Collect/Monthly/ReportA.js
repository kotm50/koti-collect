import React, { useState, useEffect } from "react";

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
            <div className="col-span-3 text-center bg-green-600 text-white h-[20px] flex flex-col justify-center font-bold border border-r-0 border-t-0 border-black truncate">
              전체 총액
            </div>
            <div className="text-center bg-gray-200 h-[20px] flex flex-col justify-center text-sm font-bold border border-r-0 border-t-0 border-black truncate">
              {allTotal.total.toLocaleString()}
            </div>
            <div className="text-center bg-gray-200 h-[20px] flex flex-col justify-center text-sm font-bold border border-r-0 border-t-0 border-black truncate">
              {allTotal.paidAd.toLocaleString()}
            </div>
            <div className="text-center bg-gray-200 h-[20px] flex flex-col justify-center text-sm font-bold border border-r-0 border-t-0 border-black truncate">
              {allTotal.paidComm.toLocaleString()}
            </div>
            <div className="text-center bg-gray-200 h-[20px] flex flex-col justify-center text-sm font-bold border border-r-0 border-t-0 border-black truncate">
              {allTotal.paidIntvCare.toLocaleString()}
            </div>
            <div className="text-center bg-gray-200 h-[20px] flex flex-col justify-center text-sm font-bold border border-r-0 border-t-0 border-black truncate">
              {allTotal.paidCommCare.toLocaleString()}
            </div>
            <div className="text-center bg-gray-200 h-[20px] flex flex-col justify-center text-sm font-bold border border-r-0 border-t-0 border-black truncate">
              {allTotal.prepayment.toLocaleString()}
            </div>
          </div>

          {list.length > 0 ? (
            <div className="w-full h-fit bg-black grid grid-cols-9">
              {list.map((com, idx) => (
                <React.Fragment key={idx}>
                  <div
                    className={`h-[20px] text-center bg-gray-100 border ${
                      idx === 0 && "border-t-0"
                    } ${
                      idx !== list.length - 1 && "border-b-0"
                    } border-r-0 border-black flex flex-col justify-center`}
                  >
                    {com.channel}
                  </div>
                  <div
                    className={`text-center bg-gray-100 border ${
                      idx === 0 && "border-t-0"
                    } ${
                      idx !== list.length - 1 && "border-b-0"
                    } border-r-0 border-black flex flex-col justify-center`}
                  >
                    {com.companyName}
                  </div>
                  <div
                    className={`text-center bg-gray-100 border ${
                      idx === 0 && "border-t-0"
                    } ${
                      idx !== list.length - 1 && "border-b-0"
                    } border-r-0 border-black flex flex-col justify-center`}
                  >
                    {com.companyBranch}
                  </div>
                  <div
                    className={`text-center bg-gray-100 border ${
                      idx === 0 && "border-t-0"
                    } ${
                      idx !== list.length - 1 && "border-b-0"
                    } border-r-0 border-black flex flex-col justify-center`}
                  >
                    {(
                      com.paidAd +
                      com.paidComm +
                      com.paidIntvCare +
                      com.paidCommCare
                    ).toLocaleString()}
                  </div>
                  <div
                    className={`text-center bg-gray-100 border ${
                      idx === 0 && "border-t-0"
                    } ${
                      idx !== list.length - 1 && "border-b-0"
                    } border-r-0 border-black flex flex-col justify-center`}
                  >
                    {com.paidAd.toLocaleString()}
                  </div>
                  <div
                    className={`text-center bg-gray-100 border ${
                      idx === 0 && "border-t-0"
                    } ${
                      idx !== list.length - 1 && "border-b-0"
                    } border-r-0 border-black flex flex-col justify-center`}
                  >
                    {com.paidComm.toLocaleString()}
                  </div>
                  <div
                    className={`text-center bg-gray-100 border ${
                      idx === 0 && "border-t-0"
                    } ${
                      idx !== list.length - 1 && "border-b-0"
                    } border-r-0 border-black flex flex-col justify-center`}
                  >
                    {com.paidIntvCare.toLocaleString()}
                  </div>
                  <div
                    className={`text-center bg-gray-100 border ${
                      idx === 0 && "border-t-0"
                    } ${
                      idx !== list.length - 1 && "border-b-0"
                    } border-r-0 border-black flex flex-col justify-center`}
                  >
                    {com.paidCommCare.toLocaleString()}
                  </div>
                  <div
                    className={`text-center bg-gray-100 border ${
                      idx === 0 && "border-t-0"
                    } ${
                      idx !== list.length - 1 && "border-b-0"
                    } border-r-0 border-black flex flex-col justify-center`}
                  >
                    {com.prepayment.toLocaleString()}
                  </div>
                </React.Fragment>
              ))}
            </div>
          ) : null}
        </div>
        <div className="w-[2000px] h-fit">
          <div className="sticky top-0 left-0 z-10 w-full h-fit grid grid-cols-5">
            <div className="col-span-5 text-center bg-blue-600 text-white h-[20px] flex flex-col justify-center font-bold border border-l-0 border-black">
              1주차
            </div>
            <div className="col-span-5 grid grid-cols-11 text-center bg-blue-600 text-white h-[60px] font-bold border border-l-0 border-black">
              <div className="flex flex-col justify-end h-full border-l border-black bg-green-600">
                결제
              </div>
              <div className="col-span-2 flex flex-col justify-center h-full border-l border-black">
                월
              </div>
              <div className="col-span-2 flex flex-col justify-center h-full border-l border-black">
                화
              </div>
              <div className="col-span-2 flex flex-col justify-center h-full border-l border-black">
                수
              </div>
              <div className="col-span-2 flex flex-col justify-center h-full border-l border-black">
                목
              </div>
              <div className="col-span-2 flex flex-col justify-center h-full border-l border-black">
                금
              </div>
              <div className="flex flex-col justify-start h-full border-l border-black bg-green-600">
                방법
              </div>
              <div className="col-span-2 grid grid-cols-5 h-full border-l border-t border-black bg-white text-black">
                <div className="flex flex-col justify-center">광고비</div>
                <div className="border-l border-black flex flex-col justify-center">
                  위촉비
                </div>
                <div className="border-l border-black flex flex-col justify-center">
                  면접케어
                </div>
                <div className="border-l border-black flex flex-col justify-center">
                  위촉케어
                </div>
                <div className="flex flex-col border-l border-black justify-center">
                  선입금
                </div>
              </div>
              <div className="col-span-2  grid grid-cols-5 h-full border-t border-l border-black bg-white text-black">
                <div className="flex flex-col justify-center">광고비</div>
                <div className="border-l border-black flex flex-col justify-center">
                  위촉비
                </div>
                <div className="border-l border-black flex flex-col justify-center">
                  면접케어
                </div>
                <div className="border-l border-black flex flex-col justify-center">
                  위촉케어
                </div>
                <div className="flex flex-col border-l border-black justify-center">
                  선입금
                </div>
              </div>
              <div className="col-span-2  grid grid-cols-5 h-full border-t border-l border-black bg-white text-black">
                <div className="flex flex-col justify-center">광고비</div>
                <div className="border-l border-black flex flex-col justify-center">
                  위촉비
                </div>
                <div className="border-l border-black flex flex-col justify-center">
                  면접케어
                </div>
                <div className="border-l border-black flex flex-col justify-center">
                  위촉케어
                </div>
                <div className="flex flex-col border-l border-black justify-center">
                  선입금
                </div>
              </div>
              <div className="col-span-2  grid grid-cols-5 h-full border-t border-l border-black bg-white text-black">
                <div className="flex flex-col justify-center">광고비</div>
                <div className="border-l border-black flex flex-col justify-center">
                  위촉비
                </div>
                <div className="border-l border-black flex flex-col justify-center">
                  면접케어
                </div>
                <div className="border-l border-black flex flex-col justify-center">
                  위촉케어
                </div>
                <div className="flex flex-col border-l border-black justify-center">
                  선입금
                </div>
              </div>
              <div className="col-span-2  grid grid-cols-5 h-full border-t border-l border-black bg-white text-black">
                <div className="flex flex-col justify-center">광고비</div>
                <div className="border-l border-black flex flex-col justify-center">
                  위촉비
                </div>
                <div className="border-l border-black flex flex-col justify-center">
                  면접케어
                </div>
                <div className="border-l border-black flex flex-col justify-center">
                  위촉케어
                </div>
                <div className="flex flex-col border-l border-black justify-center">
                  선입금
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportA;
