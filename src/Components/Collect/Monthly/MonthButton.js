import React from "react";

function MonthButton(props) {
  const monthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  return (
    <div className="flex flex-row justify-start flex-nowrap gap-x-1">
      <div className="grid grid-cols-12 gap-x-1">
        {monthList.map(mon => (
          <button
            key={mon}
            className={`border p-2 rounded-lg ${
              Number(props.month) === mon
                ? "bg-indigo-700 text-white hover:bg-indigo-500 font-bold"
                : "hover:bg-gray-100"
            }`}
            onClick={e => {
              props.setMonth(mon);
            }}
          >
            {mon}월
          </button>
        ))}
      </div>
    </div>
  );
}

export default MonthButton;
