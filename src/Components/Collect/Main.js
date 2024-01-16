import React, { useEffect } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import MenuExplain from "./Dashboard/MenuExplain";

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
        <MenuExplain />
      </div>
    </div>
  );
}

export default Main;
