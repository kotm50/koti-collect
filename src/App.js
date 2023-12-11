import { Routes, Route } from "react-router-dom";
import Collect from "./Components/Collect/Collect";
import CollectMain from "./Components/Collect/Main";
import CollectIndex from "./Components/CollectIndex";
import Receive from "./Components/Collect/Receive";
import UnReceive from "./Components/Collect/UnReceive";
import UnReceiveBack from "./Components/Collect/UnReceiveBack";
import Company from "./Components/Collect/Company";
import Channel from "./Components/Collect/Channel";
import Test from "./Components/Test";
import CardList from "./Components/Collect/CardList";
import PrePaid from "./Components/Collect/PrePaid";

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
          <Route path="urback" element={<UnReceiveBack />} />
          <Route path="company" element={<Company />} />
          <Route path="channel" element={<Channel />} />
        </Route>
        <Route path="/test" element={<Test />} />
      </Routes>
    </>
  );
}

export default App;
