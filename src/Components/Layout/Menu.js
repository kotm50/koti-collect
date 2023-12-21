import React from "react";
import { Link } from "react-router-dom";

function Menu() {
  return (
    <div className="flex flex-col justify-start divide-y border-y">
      <Link
        to="/collect"
        className="p-4 hover:bg-gray-100 transition-all duration-300"
      >
        메인
      </Link>
      <Link
        to="/collect/ur"
        className="p-4 hover:bg-gray-100 transition-all duration-300"
      >
        광고일정 등록
      </Link>
      <Link
        to="/collect/dailyreport"
        className="p-4 hover:bg-gray-100 transition-all duration-300"
      >
        일일 보고
      </Link>
      <Link
        to="/collect/yeartotal"
        className="p-4 hover:bg-gray-100 transition-all duration-300"
      >
        고객사별 월별종합
      </Link>
      <Link
        to="/collect/card"
        className="p-4 hover:bg-gray-100 transition-all duration-300"
      >
        결제카드 관리
      </Link>
      <Link
        to="/collect/prepaid"
        className="p-4 hover:bg-gray-100 transition-all duration-300"
      >
        선입금 추가/수정
      </Link>
      <Link
        to="/collect/statistics"
        className="p-4 hover:bg-gray-100 transition-all duration-300"
      >
        기간 별 조회
      </Link>
      <Link
        to="/collect/gifticon"
        className="p-4 hover:bg-gray-100 transition-all duration-300"
      >
        기프티콘 충전현황
      </Link>
      <Link
        to="/collect/company"
        className="p-4 hover:bg-gray-100 transition-all duration-300"
      >
        고객사 리스트
      </Link>
      <Link
        to="/collect/channel"
        className="p-4 hover:bg-gray-100 transition-all duration-300"
      >
        듀얼/채널 관리
      </Link>
    </div>
  );
}

export default Menu;
