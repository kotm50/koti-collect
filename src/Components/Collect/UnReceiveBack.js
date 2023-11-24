import React, { useEffect, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import InputChargeBack from "./Charge/InputChargeBack";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

function UnReceive() {
  const thisLocation = useLocation();
  const [title, setTitle] = useOutletContext();
  const [inputOn, setInputOn] = useState(true);
  useEffect(() => {
    setTitle("수수료 관리");
    //eslint-disable-next-line
  }, [thisLocation]);

  return (
    <div className="mx-4 flex justify-start gap-2" data={title}>
      <div className="sticky top-0 left-0 z-50 bg-white p-2 border-b w-[480px] h-fit rounded-lg drop-shadow">
        <div className="flex justify-between mb-2">
          <h3 className="text-center text-lg font-bold">
            추가/수정하기{" "}
            <span className="text-sm font-normal">
              (<span className="text-rose-500">*</span>은 필수입력)
            </span>
          </h3>
          <button
            className="min-w-[24px] text-lg hover:text-gray-500"
            onClick={() => setInputOn(!inputOn)}
          >
            {inputOn ? <FaCaretUp /> : <FaCaretDown />}
          </button>
        </div>
        <div
          className={`transition-height duration-300 ${
            inputOn ? "h-fit opacity-100" : "h-0 overflow-hidden opacity-0"
          }`}
        >
          <InputChargeBack />
        </div>
      </div>
      <div className="h-screen bg-blue-100 p-2 w-full"></div>
    </div>
  );
}

export default UnReceive;
