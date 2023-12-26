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
    <div className="mx-4" data={title}>
      <h3 className="font-bold text-xl">메뉴안내</h3>
      <div className="p-4 flex flex-col justify-start gap-y-4 divide-y border">
        <div className="flex justify-between">
          <div className="font-bold"></div>
        </div>
      </div>
    </div>
  );
}

export default Main;
