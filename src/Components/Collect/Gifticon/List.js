import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import sorry from "../../../Asset/sorry.png";
import ListDetail from "./ListDetail";

import dayjs from "dayjs";
function List(props) {
  const navi = useNavigate();
  const [list, setList] = useState([]);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  useEffect(() => {
    if (props.date !== "") {
      const year = dayjs(new Date(props.date)).format("YYYY");
      const month = dayjs(new Date(props.date)).format("MM");
      const day = dayjs(new Date(props.date)).format("DD");
      setYear(year);
      setMonth(month);
      setDay(day);
    } else {
      setYear(dayjs(new Date()).format("YYYY"));
      setMonth("");
      setDay("");
    }
    //eslint-disable-next-line
  }, [props.date]);

  useEffect(() => {
    setYear(props.year);
    if (props.year !== year) {
      props.setCalendarDate("");
      setDay("");
      setMonth("");
    }
    if (props.year === "") {
      const now = new Date();
      setYear(now.getFullYear().toString());
      props.setYear(now.getFullYear().toString());
    }

    if (props.month !== "") {
      setMonth(props.month);
      props.setCalendarDate("");
      setDay("");
    }
    //eslint-disable-next-line
  }, [props.year, props.month]);

  useEffect(() => {
    if (year !== "") {
      getGifticonList(year, month, day);
    }
    //eslint-disable-next-line
  }, [year, month, day]);

  const getGifticonList = async (year, month, day) => {
    let data = {
      searchYear: year,
      searchMonth: month === "" ? null : month,
      searchDay: day === "" ? null : day,
    };
    console.log(data);
    await axios
      .post("/api/v1/comp/commcare/status", data, {
        headers: { Authorization: props.user.accessToken },
      })
      .then(async res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          navi("/");
          return false;
        }
        console.log("깊콘", res);
        setList(res.data.payList);
      })
      .catch(e => console.log(e));
  };
  return (
    <>
      {list.length > 0 ? (
        <table className="w-full">
          <thead className="sticky top-0 bg-white">
            <tr>
              <td colSpan="14" className="border border-white">
                <div className="flex justify-between py-2 pr-2">
                  <h3 className="font-bold text-xl">
                    기프티콘 충전내역 | 기간 - {year}년{" "}
                    {month !== "" ? month + "월" : null}{" "}
                    {day !== "" ? day + "일" : null}
                  </h3>
                </div>
              </td>
            </tr>
            <tr className="bg-blue-600 text-white text-center">
              <td className="border p-2">구분</td>
              <td className="border p-2">날짜</td>
              <td className="border p-2">고객사</td>
              <td className="border p-2">지점</td>
              <td className="border p-2">결제방식</td>
              <td className="border p-2">금액</td>
              <td className="border p-2">공급가액</td>
              <td className="border p-2">부가세</td>
              <td className="border p-2">입금자명</td>
              <td className="border p-2">카드사</td>
              <td className="border p-2">카드번호</td>
              <td className="border p-2">유효기간</td>
              <td className="border p-2">비밀번호</td>
              <td className="border p-2">비고</td>
            </tr>
          </thead>
          <tbody>
            {list.map((gifticon, idx) => (
              <React.Fragment key={idx}>
                <ListDetail
                  user={props.user}
                  gifticon={gifticon}
                  idx={idx}
                  memo={props.memo}
                  setMemo={props.setMemo}
                  setModalOn={props.setModalOn}
                />
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-2xl text-bold text-center">
          <img
            src={sorry}
            className="mx-auto w-[240px] h-auto mb-5 mt-20"
            alt="오류"
          />
          조회 된 내용이 없습니다
        </div>
      )}
    </>
  );
}

export default List;
