import Collect from "./Components/Collect/Collect";
import CollectMain from "./Components/Collect/Main";
import CollectIndex from "./Components/CollectIndex";
import Receive from "./Components/Collect/Receive";
import UnReceive from "./Components/Collect/UnReceive";
import Company from "./Components/Collect/Company";
import Channel from "./Components/Collect/Channel";
import Test from "./Components/Test";
import CardList from "./Components/Collect/CardList";
import PrePaid from "./Components/Collect/PrePaid";
import ToTop from "./Components/Layout/ToTop";
import StatisticsList from "./Components/Collect/StatisticsList";
import Gifticon from "./Components/Collect/Gifticon";
import YearTotal from "./Components/Collect/YearTotal";
import DailyReport from "./Components/Collect/DailyReport";
import MonthlyReport from "./Components/Collect/MonthlyReport";
import Board from "./Components/Collect/Board";
import List from "./Components/Collect/Board/List";
import Write from "./Components/Collect/Board/Write";
import Detail from "./Components/Collect/Board/Detail";
import Coupon from "./Components/Collect/Coupon";
import ReadOnly from "./Components/Collect/ReadOnly";

import { useSelector } from "react-redux";
/*
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import { getNewToken } from "./Reducer/userSlice";
*/
import { Routes, Route } from "react-router-dom";
// 커스텀 훅 정의

/*
function useAuthTokenUpdater() {
  const [isTokenUpdated, setTokenUpdated] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.post("/api/v1/user/get/point", null, {
          headers: { Authorization: user.accessToken },
        });
        const newToken = response.headers.authorization;
        if (user.accessToken !== newToken) {
          dispatch(
            getNewToken({
              accessToken: newToken,
            })
          ); // 토큰 갱신
        }
        setTokenUpdated(true); // 토큰 갱신 완료 상태 설정
      } catch (error) {
        console.error("Token fetch error:", error);
        setTokenUpdated(true); // 에러가 발생해도 상태를 설정해 UI가 렌더링되도록
      }
    };
    setTokenUpdated(false); // 토큰 갱신 시작 전 상태 초기화
    fetchToken();
  }, [location, user, dispatch]);

  return isTokenUpdated; // 상태 반환
}
*/

function App() {
  //const isTokenUpdated = useAuthTokenUpdater();
  /*
  if (!isTokenUpdated) {
    // 토큰 갱신 중이면 로딩 인디케이터나 다른 UI 표시
    return <div>잠시만 기다려 주세요..</div>;
  }
  */

  const user = useSelector(state => state.user);
  console.log(user);
  return (
    <>
      <Routes>
        <Route path="/" element={<CollectIndex />} />
        <Route path="/collect" element={<Collect />}>
          <Route path="" element={<CollectMain />} />
          <Route path="ar" element={<Receive />} />
          <Route path="ur" element={<UnReceive />} />
          <Route path="prepaid" element={<PrePaid />} />
          <Route path="card" element={<CardList />} />
          <Route path="statistics" element={<StatisticsList />} />
          <Route path="gifticon" element={<Gifticon />} />
          <Route path="company" element={<Company />} />
          <Route path="channel" element={<Channel />} />
          <Route path="yeartotal" element={<YearTotal />} />
          <Route path="dailyreport" element={<DailyReport />} />
          <Route path="monthlyreport" element={<MonthlyReport />} />
          <Route path="coupon" element={<Coupon />} />
          <Route path="readonly" element={<ReadOnly />} />
        </Route>
        <Route path="/board" element={<Board />}>
          <Route path="list/:bid?" element={<List />} />
          <Route path="write/:bid?/:pid?" element={<Write />} />
          <Route path="detail/:bid?/:pid?" element={<Detail />} />
        </Route>
        <Route path="/test" element={<Test />} />
      </Routes>
      <ToTop />
    </>
  );
}

export default App;
