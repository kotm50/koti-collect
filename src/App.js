import { Routes, Route } from "react-router-dom";
import Collect from "./Components/Collect/Collect";
import CollectMain from "./Components/Collect/Main";
import CollectIndex from "./Components/CollectIndex";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<CollectIndex />} />
        <Route path="/collect" element={<Collect />}>
          <Route path="" element={<CollectMain />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
