import { useState, useEffect } from "react";

function StatisticsMemo(props) {
  const [memo, setMemo] = useState("");

  const unescapeHTML = text => {
    return text
      .replace(/＜/g, "<")
      .replace(/＞/g, ">")
      .replace(/＝/g, "=")
      .replace(/（/g, "(")
      .replace(/）/g, ")")
      .replace(/，/g, ",")
      .replace(/＂/g, '"')
      .replace(/：/g, ":")
      .replace(/；/g, ";")
      .replace(/／/g, "/");
  };

  useEffect(() => {
    if (props.memo !== null && props.memo !== undefined && props.memo !== "") {
      const memo = unescapeHTML(props.memo);
      setMemo(memo);
    }
  }, [props.memo]);

  const handleModal = () => {
    props.setMemo(memo);
    props.setModalOn(true);
  };

  return (
    <>
      {props.memo !== null ? (
        <button
          className="py-1 px-3 text-sm font-bold bg-blue-600 hover:bg-blue-800 text-white h-full rounded-lg"
          onClick={handleModal}
        >
          내용보기
        </button>
      ) : (
        ""
      )}
    </>
  );
}

export default StatisticsMemo;
