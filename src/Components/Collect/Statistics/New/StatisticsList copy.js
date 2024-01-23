import { useState, useEffect } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";

import Statistics from "./Statistics/Statistics";
import MemoModal from "../Layout/MemoModal";

function StatisticsList() {
  const user = useSelector(state => state.user);
  const thisLocation = useLocation();

  const [title, setTitle] = useOutletContext();
  const [memo, setMemo] = useState("");
  const [modalOn, setModalOn] = useState(false);

  useEffect(() => {
    setTitle("기간 별 조회");
    //eslint-disable-next-line
  }, [thisLocation]);

  return (
    <div className="mx-4" data={title}>
      <Statistics
        user={user}
        memo={memo}
        setMemo={setMemo}
        setModalOn={setModalOn}
      />
      {modalOn && <MemoModal memo={memo} setModalOn={setModalOn} />}
    </div>
  );
}

export default StatisticsList;
