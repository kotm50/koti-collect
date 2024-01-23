import React from "react";

function MonthButton(props) {
  const monthList = [
    { txt: "01", num: 1 },
    { txt: "02", num: 2 },
    { txt: "03", num: 3 },
    { txt: "04", num: 4 },
    { txt: "05", num: 5 },
    { txt: "06", num: 6 },
    { txt: "07", num: 7 },
    { txt: "08", num: 8 },
    { txt: "09", num: 9 },
    { txt: "10", num: 10 },
    { txt: "11", num: 11 },
    { txt: "12", num: 12 },
  ];
  return (
    <div className="flex flex-row justify-start flex-nowrap gap-x-1">
      <div className="grid grid-cols-12 gap-x-1">
        {monthList.map(mon => (
          <button
            key={mon.txt}
            className={`border p-2 rounded-lg ${
              Number(props.month) === mon.num
                ? "bg-indigo-700 text-white hover:bg-indigo-500 font-bold"
                : "hover:bg-gray-100"
            }`}
            onClick={e => {
              props.setMonth(mon.txt);
              props.setDay("");
              props.getStatisticsList(
                props.year,
                props.month,
                "",
                props.payType
              );
            }}
          >
            {mon.num}월
          </button>
        ))}
      </div>
    </div>
  );
}

export default MonthButton;
