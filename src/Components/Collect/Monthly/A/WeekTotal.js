import React from "react";

function WeekTotal(props) {
  return (
    <div className="flex flex-row justify-start">
      <div className="flex flex-col justify-center border-black bg-yellow-300 text-center text-black p-2 font-bold border-b w-[84px] h-[75px]">
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
          <div className="flex flex-col justify-center text-center">광고비</div>
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
          <div className="flex flex-col justify-center text-center">광고비</div>
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
          <div className="flex flex-col justify-center text-center">광고비</div>
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
          <div className="flex flex-col justify-center text-center">광고비</div>
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
          <div className="flex flex-col justify-center text-center">광고비</div>
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
            {props.total.mon.paidAd
              ? props.total.mon.paidAd.toLocaleString()
              : 0}
          </div>
          <div className="flex flex-col justify-center text-center border-l border-black">
            {props.total.mon.paidComm
              ? props.total.mon.paidComm.toLocaleString()
              : 0}
          </div>
          <div className="flex flex-col justify-center text-center border-l border-black">
            {props.total.mon.paidIntvCare
              ? props.total.mon.paidIntvCare.toLocaleString()
              : 0}
          </div>
          <div className="flex flex-col justify-center text-center border-l border-black">
            {props.total.mon.paidCommCare
              ? props.total.mon.paidCommCare.toLocaleString()
              : 0}
          </div>
          <div className="flex flex-col justify-center text-center border-l border-black">
            {props.total.mon.prepayment
              ? props.total.mon.prepayment.toLocaleString()
              : 0}
          </div>
        </div>
        <div className="grid grid-cols-5 h-full border-l border-t bg-green-100 text-black border-black">
          <div className="flex flex-col justify-center text-center">
            {props.total.tue.paidAd
              ? props.total.tue.paidAd.toLocaleString()
              : 0}
          </div>
          <div className="flex flex-col justify-center text-center border-l border-black">
            {props.total.tue.paidComm
              ? props.total.tue.paidComm.toLocaleString()
              : 0}
          </div>
          <div className="flex flex-col justify-center text-center border-l border-black">
            {props.total.tue.paidIntvCare
              ? props.total.tue.paidIntvCare.toLocaleString()
              : 0}
          </div>
          <div className="flex flex-col justify-center text-center border-l border-black">
            {props.total.tue.paidCommCare
              ? props.total.tue.paidCommCare.toLocaleString()
              : 0}
          </div>
          <div className="flex flex-col justify-center text-center border-l border-black">
            {props.total.tue.prepayment
              ? props.total.tue.prepayment.toLocaleString()
              : 0}
          </div>
        </div>
        <div className="grid grid-cols-5 h-full border-l border-t bg-green-100 text-black border-black">
          <div className="flex flex-col justify-center text-center">
            {props.total.wed.paidAd
              ? props.total.wed.paidAd.toLocaleString()
              : 0}
          </div>
          <div className="flex flex-col justify-center text-center border-l border-black">
            {props.total.wed.paidComm
              ? props.total.wed.paidComm.toLocaleString()
              : 0}
          </div>
          <div className="flex flex-col justify-center text-center border-l border-black">
            {props.total.wed.paidIntvCare
              ? props.total.wed.paidIntvCare.toLocaleString()
              : 0}
          </div>
          <div className="flex flex-col justify-center text-center border-l border-black">
            {props.total.wed.paidCommCare
              ? props.total.wed.paidCommCare.toLocaleString()
              : 0}
          </div>
          <div className="flex flex-col justify-center text-center border-l border-black">
            {props.total.wed.prepayment
              ? props.total.wed.prepayment.toLocaleString()
              : 0}
          </div>
        </div>
        <div className="grid grid-cols-5 h-full border-l border-t bg-green-100 text-black border-black">
          <div className="flex flex-col justify-center text-center">
            {props.total.thu.paidAd
              ? props.total.thu.paidAd.toLocaleString()
              : 0}
          </div>
          <div className="flex flex-col justify-center text-center border-l border-black">
            {props.total.thu.paidComm
              ? props.total.thu.paidComm.toLocaleString()
              : 0}
          </div>
          <div className="flex flex-col justify-center text-center border-l border-black">
            {props.total.thu.paidIntvCare
              ? props.total.thu.paidIntvCare.toLocaleString()
              : 0}
          </div>
          <div className="flex flex-col justify-center text-center border-l border-black">
            {props.total.thu.paidCommCare
              ? props.total.thu.paidCommCare.toLocaleString()
              : 0}
          </div>
          <div className="flex flex-col justify-center text-center border-l border-black">
            {props.total.thu.prepayment
              ? props.total.thu.prepayment.toLocaleString()
              : 0}
          </div>
        </div>
        <div className="grid grid-cols-5 h-full border-l border-t bg-green-100 text-black border-black">
          <div className="flex flex-col justify-center text-center">
            {props.total.fri.paidAd
              ? props.total.fri.paidAd.toLocaleString()
              : 0}
          </div>
          <div className="flex flex-col justify-center text-center border-l border-black">
            {props.total.fri.paidComm
              ? props.total.fri.paidComm.toLocaleString()
              : 0}
          </div>
          <div className="flex flex-col justify-center text-center border-l border-black">
            {props.total.fri.paidIntvCare
              ? props.total.fri.paidIntvCare.toLocaleString()
              : 0}
          </div>
          <div className="flex flex-col justify-center text-center border-l border-black">
            {props.total.fri.paidCommCare
              ? props.total.fri.paidCommCare.toLocaleString()
              : 0}
          </div>
          <div className="flex flex-col justify-center text-center border-l border-black">
            {props.total.fri.prepayment
              ? props.total.fri.prepayment.toLocaleString()
              : 0}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeekTotal;
