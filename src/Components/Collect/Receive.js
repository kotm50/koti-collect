import React, { useEffect } from "react";
import { useLocation, useOutletContext } from "react-router-dom";

function Receive() {
  const thisLocation = useLocation();
  const [title, setTitle] = useOutletContext();
  useEffect(() => {
    setTitle("수금 입력");
    //eslint-disable-next-line
  }, [thisLocation]);
  return (
    <div className="mx-4" data={title}>
      수금입력창
    </div>
  );
}

export default Receive;
