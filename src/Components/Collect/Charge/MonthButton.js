import React from "react";

function MonthButton(props) {
  const monthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  return (
    <>
      {monthList.map(mon => (
        <button
          key={mon}
          className={`border p-2 rounded-lg ${
            Number(props.month) === mon
              ? "bg-indigo-700 text-white hover:bg-indigo-500 font-bold"
              : "hover:bg-gray-100"
          }`}
          onClick={e => props.setMonth(mon)}
        >
          {mon}월
        </button>
      ))}
    </>
  );
}

export default MonthButton;
