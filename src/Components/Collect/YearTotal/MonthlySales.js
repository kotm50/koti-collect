import React, { useEffect, useState } from "react";

function MonthlySales(props) {
  const [ad, setAd] = useState(0);
  const [comm, setComm] = useState(0);
  const [care, setCare] = useState(0);
  const [prepay, setPrepay] = useState(0);
  useEffect(() => {
    props.month.forEach(doc => {
      console.log(props.monthNum);
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
    <>
      <div className="text-center h-[30px] grid grid-cols-4 bg-white text-black border border-t-0 border-l-0 border-black divide-x divide-black">
        <div className="text-center flex flex-col justify-center">
          {ad.toLocaleString()}
        </div>
        <div className="text-center flex flex-col justify-center">
          {comm.toLocaleString()}
        </div>
        <div className="text-center flex flex-col justify-center">
          {care.toLocaleString()}
        </div>
        <div className="text-center flex flex-col justify-center">
          {prepay.toLocaleString()}
        </div>
      </div>
    </>
  );
}

export default MonthlySales;
