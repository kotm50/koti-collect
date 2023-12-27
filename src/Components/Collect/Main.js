import React, { useEffect } from "react";
import { Link, useLocation, useOutletContext } from "react-router-dom";

function Main() {
  const thisLocation = useLocation();
  const [title, setTitle] = useOutletContext();
  useEffect(() => {
    setTitle("코리아티엠 수금전산 페이지");
    //eslint-disable-next-line
  }, [thisLocation]);
  return (
    <div className="mx-4 grid grid-cols-3 gap-x-4" data={title}>
      <div className="text-sm">
        <h3 className="font-bold text-lg">메뉴안내</h3>
        <div className="p-4 flex flex-col justify-start gap-y-2 border">
          <div>
            <div className="font-bold p-2">수금 업무</div>
            <div className="p-2 flex flex-row justify-between bg-gray-100">
              <div className="text-blue-800 font-medium">수수료 관리</div>
              <div className="font-normal">
                광고일정, 미수금, 수금내역을 입력하고 관리합니다
              </div>
              <Link
                to="/collect/ur"
                className="text-blue-800 font-medium hover:text-rose-500"
              >
                바로가기
              </Link>
            </div>
            <div className="p-2 flex flex-row justify-between bg-gray-100">
              <div className="text-blue-800 font-medium">선입금 관리</div>
              <div className="font-normal">
                고객사의 선입금 내역을 관리합니다
              </div>
              <Link
                to="/collect/prepaid"
                className="text-blue-800 font-medium hover:text-rose-500"
              >
                바로가기
              </Link>
            </div>
            <div className="p-2 flex flex-row justify-between bg-gray-100">
              <div className="text-blue-800 font-medium">결제카드 관리</div>
              <div className="font-normal">
                고객사 결제용 카드정보를 관리합니다
              </div>
              <Link
                to="/collect/card"
                className="text-blue-800 font-medium hover:text-rose-500"
              >
                바로가기
              </Link>
            </div>
          </div>
          <div>
            <div className="font-bold p-2">보고 양식</div>
            <div className="p-2 flex flex-row justify-between bg-gray-100">
              <div className="text-blue-800 font-medium">일일 보고</div>
              <div className="font-normal">일일 결제내역 보고 양식</div>
              <Link
                to="/collect/dailyreport"
                className="text-blue-800 font-medium hover:text-rose-500"
              >
                바로가기
              </Link>
            </div>
            <div className="p-2 flex flex-row justify-between bg-gray-100">
              <div className="text-blue-800 font-medium">월별 보고</div>
              <div className="font-normal">월별 결제내역 보고 양식</div>
              <Link
                to="/collect/monthlyreport"
                className="text-blue-800 font-medium hover:text-rose-500"
              >
                바로가기
              </Link>
            </div>
          </div>
          <div>
            <div className="font-bold p-2">통계 보기</div>
            <div className="p-2 flex flex-row justify-between bg-gray-100">
              <div className="text-blue-800 font-medium">기간 별 조회</div>
              <div className="font-normal">
                일별/월별/연도별 기간 설정 후 통계를 확인합니다
              </div>
              <Link
                to="/collect/statistics"
                className="text-blue-800 font-medium hover:text-rose-500"
              >
                바로가기
              </Link>
            </div>
            <div className="p-2 flex flex-row justify-between bg-gray-100">
              <div className="text-blue-800 font-medium">고객사별 월별종합</div>
              <div className="font-normal">
                고객사별 월간 결제내역 통계를 확인합니다
              </div>
              <Link
                to="/collect/yeartotal"
                className="text-blue-800 font-medium hover:text-rose-500"
              >
                바로가기
              </Link>
            </div>

            <div className="p-2 flex flex-row justify-between bg-gray-100">
              <div className="text-blue-800 font-medium">기프티콘 충전현황</div>
              <div className="font-normal">
                고객사별 기프티콘 충전현황을 확인합니다
              </div>
              <Link
                to="/collect/gifticon"
                className="text-blue-800 font-medium hover:text-rose-500"
              >
                바로가기
              </Link>
            </div>
          </div>
          <div>
            <div className="font-bold p-2">고객사 관리</div>
            <div className="p-2 flex flex-row justify-between bg-gray-100">
              <div className="text-blue-800 font-medium">고객사 리스트</div>
              <div className="font-normal">고객사 리스트를 확인합니다</div>
              <Link
                to="/collect/company"
                className="text-blue-800 font-medium hover:text-rose-500"
              >
                바로가기
              </Link>
            </div>
            <div className="p-2 flex flex-row justify-between bg-gray-100">
              <div className="text-blue-800 font-medium">듀얼/채널 관리</div>
              <div className="font-normal">
                광고진행방식, 고객사 채널 등을 관리합니다
              </div>
              <Link
                to="/collect/channel"
                className="text-blue-800 font-medium hover:text-rose-500"
              >
                바로가기
              </Link>
            </div>
          </div>
          <div>
            <div className="font-bold p-2">회의록</div>
            <div className="p-2 flex flex-row justify-between bg-gray-100">
              <div className="text-blue-800 font-medium">회의록 보기</div>
              <div className="font-normal">
                현재까지 진행된 회의 내용을 열람합니다
              </div>
              <Link
                to="/board/list/B04"
                className="text-blue-800 font-medium hover:text-rose-500"
              >
                바로가기
              </Link>
            </div>
            <div className="p-2 flex flex-row justify-between bg-gray-100">
              <div className="text-blue-800 font-medium">회의록 작성</div>
              <div className="font-normal">회의 내용을 기록합니다</div>
              <Link to="/board/write/B04" className="text-blue-800 font-medium">
                바로가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
