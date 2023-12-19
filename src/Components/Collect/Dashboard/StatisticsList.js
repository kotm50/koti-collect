import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function StatisticsList() {
  const user = useSelector(state => state.user);
  const thisLocation = useLocation();
  const navi = useNavigate();
  const [caTotal, setCaTotal] = useState("");
  const [coTotal, setCoTotal] = useState("");
  const [pgTotal, setPgTotal] = useState("");
  const [moTotal, setMoTotal] = useState("");
  const [heTotal, setHeTotal] = useState("");
  const [payType, setPayType] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  useEffect(() => {
    setYear(new Date().getFullYear().toString());
    getStatisticsList(payType, year, month, day);
    //eslint-disable-next-line
  }, [thisLocation]);
  const getStatisticsList = async payType => {
    let pType = payType;
    if (payType === "") {
      pType = null;
    }
    let data = {
      payType: pType,
    };
    if (year !== "") {
      data.searchYear = year;
    } else {
      data.searchYear = new Date().getFullYear().toString();
    }
    if (month !== "") {
      data.searchMonth = month;
    }
    if (day !== "") {
      data.searchDate = day;
    }
    console.log(data);
    await axios
      .post("/api/v1/comp/paytype/list", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(async res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          navi("/");
          return false;
        }
        console.log(res);
        let list = res.data.statisticsList;
        let caTotal = 0;
        let coTotal = 0;
        let pgTotal = 0;
        let moTotal = 0;
        let heTotal = 0;
        list.forEach(doc => {
          if (doc.payType === "CA") {
            if (doc.transactionType === "P") {
              caTotal = caTotal + doc.payment;
            } else {
              caTotal = caTotal - doc.payment;
            }
          } else if (doc.payType === "CO") {
            if (doc.transactionType === "P") {
              coTotal = coTotal + doc.payment;
            } else {
              coTotal = coTotal - doc.payment;
            }
          } else if (doc.payType === "PG") {
            if (doc.transactionType === "P") {
              pgTotal = pgTotal + doc.payment;
            } else {
              pgTotal = pgTotal - doc.payment;
            }
          } else if (doc.payType === "MO") {
            if (doc.transactionType === "P") {
              moTotal = moTotal + doc.payment;
            } else {
              moTotal = moTotal - doc.payment;
            }
          } else if (doc.payType === "HE") {
            if (doc.transactionType === "P") {
              heTotal = heTotal + doc.payment;
            } else {
              heTotal = heTotal - doc.payment;
            }
          }
        });
        setCaTotal(caTotal);
        setCoTotal(coTotal);
        setPgTotal(pgTotal);
        setMoTotal(moTotal);
        setHeTotal(heTotal);
      })
      .catch(e => console.log(e));
  };
  return (
    <div>
      <h3>{year}년 결제방식별 입금통계</h3>
      <div>개인계좌 : {caTotal}원</div>
      <div>법인계좌 : {coTotal}원</div>
      <div>PG카드 : {pgTotal}원</div>
      <div>몬카드 : {moTotal}원</div>
      <div>천국카드 : {heTotal}원</div>
    </div>
  );
}

export default StatisticsList;
