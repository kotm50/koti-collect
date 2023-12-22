import React from "react";

function WeekReport(props) {
  console.log("오른쪽", props.list);
  return (
    <>
      {props.list.map((list, idx) => (
        <div
          className="flex flex-row justify-start border-b border-black"
          key={idx}
        >
          <div
            className="flex flex-col justify-center  bg-yellow-300 text-black p-2 h-[20px]"
            data-code={list.companyCode}
          >
            결제 방법
          </div>
          <div className="flex-auto grid grid-cols-5 text-center bg-blue-600 text-white h-[20px] border border-t-0 border-l-0 border-black">
            <div className="grid grid-cols-5 h-full border-l bg-white text-black border-black">
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
            <div className="grid grid-cols-5 h-full border-l bg-white text-black border-black">
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
            <div className="grid grid-cols-5 h-full border-l bg-white text-black border-black">
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
            <div className="grid grid-cols-5 h-full border-l bg-white text-black border-black">
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
            <div className="grid grid-cols-5 h-full border-l bg-white text-black border-black">
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
          </div>
        </div>
      ))}
    </>
  );
}

export default WeekReport;
