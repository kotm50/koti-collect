import React, { useEffect, useState } from "react";

function Deposit(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(count + 1);
    //eslint-disable-next-line
  }, []);
  return (
    <table className="border w-full h-full">
      <thead>
        <tr
          className="bg-indigo-500 text-white text-center cursor-pointer"
          onClick={() => props.setEdit(null)}
        >
          <td className="p-1">
            {props.company} {props.branch} 지점 입금내역 (여길 누르면 닫힙니다)
          </td>
        </tr>
      </thead>
      <tbody>
        <tr className="text-center">
          <td className="p-1">
            {props.commCode} - {props.company}의 입금내역 올라올 화면 {count}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default Deposit;
