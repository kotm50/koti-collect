import React, { useEffect } from "react";
import { useSelector } from "react-redux";
//import axiosInstance from "../Api/axiosInstance";

function Test() {
  const user = useSelector(state => state.user);
  useEffect(() => {
    console.log(user);
    //eslint-disable-next-line
  }, [user]);
  const test = async () => {
    /*
    const data = {};
    const res = await axiosInstance.post("", data, {
      headers: { Authorization: user.accessToken },
    });
    console.log(res);
    */
    console.log(user.accessToken);
  };
  return (
    <div className="fixed w-fit min-w-[200px] h-fit min-h-[40px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 flex justify-center gap-x-2">
      <button
        className="bg-blue-500 hover:bg-opacity-80 text-white p-2"
        onClick={() => test()}
      >
        테스트
      </button>
    </div>
  );
}

export default Test;
