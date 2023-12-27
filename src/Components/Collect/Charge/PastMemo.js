import { useState, useEffect } from "react";
import dompurify from "dompurify";

function PastMemo(props) {
  const sanitizer = dompurify.sanitize;
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

  return (
    <div className="h-full">
      <div
        className="flex flex-row flex-nowrap w-full max-w-[150px] truncate memo-nowrap h-[30px]"
        dangerouslySetInnerHTML={{
          __html: sanitizer(memo),
        }}
      />
    </div>
  );
}

export default PastMemo;
