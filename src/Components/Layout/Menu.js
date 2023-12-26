import React from "react";
import { Link } from "react-router-dom";

function Menu() {
  return (
    <div className="flex flex-col justify-start divide-y border-y">
      <Link
        to="/collect"
        className="p-3 hover:bg-gray-200 transition-all duration-300"
      >
        메인
      </Link>
      <div className="p-3 font-bold">
        <span>수금 업무</span>
      </div>
      <div className="bg-gray-100 flex flex-col justify-start divide-y border-y">
        <Link
          to="/collect/ur"
          className="px-3 py-2 text-sm hover:bg-gray-200 hover:text-rose-500 transition-all duration-300"
        >
          수수료 관리
        </Link>
        <Link
          to="/collect/prepaid"
          className="px-3 py-2 text-sm hover:bg-gray-200 hover:text-rose-500 transition-all duration-300"
        >
          선입금 관리
        </Link>
        <Link
          to="/collect/card"
          className="px-3 py-2 text-sm hover:bg-gray-200 hover:text-rose-500 transition-all duration-300"
        >
          결제카드 관리
        </Link>
      </div>
      <div className="p-3 font-bold">보고 양식</div>
      <div className="bg-gray-100 flex flex-col justify-start divide-y border-y">
        <Link
          to="/collect/dailyreport"
          className="px-3 py-2 text-sm hover:bg-gray-200 hover:text-rose-500 transition-all duration-300"
        >
          일일 보고
        </Link>
        <Link
          to="/collect/monthlyreport"
          className="px-3 py-2 text-sm hover:bg-gray-200 hover:text-rose-500 transition-all duration-300"
        >
          월별 보고
        </Link>
      </div>

      <div className="p-3 font-bold">통계 보기</div>
      <div className="bg-gray-100 flex flex-col justify-start divide-y border-y">
        <Link
          to="/collect/statistics"
          className="px-3 py-2 text-sm hover:bg-gray-200 hover:text-rose-500 transition-all duration-300"
        >
          기간 별 조회
        </Link>
        <Link
          to="/collect/yeartotal"
          className="px-3 py-2 text-sm hover:bg-gray-200 hover:text-rose-500 transition-all duration-300"
        >
          고객사별 월별종합
        </Link>
        <Link
          to="/collect/gifticon"
          className="px-3 py-2 text-sm hover:bg-gray-200 hover:text-rose-500 transition-all duration-300"
        >
          기프티콘 충전현황
        </Link>
      </div>
      <div className="p-3 font-bold">고객사 관리</div>
      <div className="bg-gray-100 flex flex-col justify-start divide-y border-y">
        <Link
          to="/collect/company"
          className="px-3 py-2 text-sm hover:bg-gray-200 hover:text-rose-500 transition-all duration-300"
        >
          고객사 리스트
        </Link>
        <Link
          to="/collect/channel"
          className="px-3 py-2 text-sm hover:bg-gray-200 hover:text-rose-500 transition-all duration-300"
        >
          듀얼/채널 관리
        </Link>
      </div>
      <div className="p-3 font-bold">회의록</div>
      <div className="bg-gray-100 flex flex-col justify-start divide-y border-y">
        <Link
          to="/board/list/B04"
          className="px-3 py-2 text-sm hover:bg-gray-200 hover:text-rose-500 transition-all duration-300"
        >
          회의록 목록
        </Link>
        <Link
          to="/board/write/B04"
          className="px-3 py-2 text-sm hover:bg-gray-200 hover:text-rose-500 transition-all duration-300"
        >
          회의록 작성
        </Link>
      </div>
    </div>
  );
}

export default Menu;
