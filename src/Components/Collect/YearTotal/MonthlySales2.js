import React, { useEffect, useState } from "react";

function MonthlySales2(props) {
  const [ad, setAd] = useState(0);
  const [comm, setComm] = useState(0);
  const [care, setCare] = useState(0);
  const [prepay, setPrepay] = useState(0);

  useEffect(() => {
    props.month.forEach(doc => {
      if (doc.companyCode === props.companyCode) {
        setAd(Number(doc.compMonthPaidAd));
        setComm(Number(doc.compMonthPaidComm));
        setCare(Number(doc.compMonthCare));
        setPrepay(Number(doc.compMonthPrepayment));
      }
    });
    //eslint-disable-next-line
  }, []);

  return (
    <td className="text-center h-[30px] bg-white text-black border border-t-0 border-l-0 border-black">
      <table className="w-full h-full border-collapse">
        <tr>
          <td className="text-center border-r border-black">{ad.toLocaleString()}</td>
          <td className="text-center border-r border-black">{comm.toLocaleString()}</td>
          <td className="text-center border-r border-black">{care.toLocaleString()}</td>
          <td className="text-center">{prepay.toLocaleString()}</td>
        </tr>
      </table>
    </td>
  );
}

export default MonthlySales2;
