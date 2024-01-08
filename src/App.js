import { Routes, Route } from "react-router-dom";
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

function App() {
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
