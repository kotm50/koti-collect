import React, { useEffect } from "react";
import { useLocation, useOutletContext } from "react-router-dom";

function Main() {
  const thisLocation = useLocation();
  const [title, setTitle] = useOutletContext();
  useEffect(() => {
    setTitle("코리아티엠 수금전산 페이지");
    //eslint-disable-next-line
  }, [thisLocation]);
  return (
    <div data={title}>
      <div className="flex flex-row flex-wrap justify-start gap-4 p-4">
        <h2 className="text-3xl font-bold">{title}</h2>
      </div>
    </div>
  );
}

export default Main;
