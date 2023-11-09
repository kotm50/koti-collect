import React from "react";
import { Outlet } from "react-router-dom";

function Collect() {
  return (
    <>
      <div className="fixed top-0 left-0 w-[240px] h-screen py-4 border-r bg-white shadow-lg">
        <h2 className="font-bold p-4 text-xl">수금전산 테스트페이지</h2>
        <div className="flex flex-col justify-start divide-y border-y">
          <div className="p-4">메뉴 1</div>
          <div className="p-4">메뉴 2</div>
          <div className="p-4">메뉴 3</div>
          <div className="p-4">메뉴 4</div>
          <div className="p-4">메뉴 5</div>
        </div>
      </div>

      <div className="pl-[250px]">
        <Outlet />
      </div>
    </>
  );
}

export default Collect;
