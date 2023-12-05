import { useState, useEffect } from "react";
import dompurify from "dompurify";

function CommisionMemo(props) {
  const sanitizer = dompurify.sanitize;
  const [hovered, setHovered] = useState(false);
  const [memo, setMemo] = useState("");
  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };
  const unescapeHTML = text => {
    return text
      .replace(/_여는꺾쇠_/g, "<")
      .replace(/_닫는꺾쇠_/g, ">")
      .replace(/_등호_/g, "=")
      .replace(/_여는괄호_/g, "(")
      .replace(/_닫는괄호_/g, ")")
      .replace(/_쉼표_/g, ",")
      .replace(/_마침표_/g, '"')
      .replace(/_콜론_/g, ":")
      .replace(/_세미콜론_/g, ";")
      .replace(/_슬래시_/g, "/");
  };

  useEffect(() => {
    console.log(props.memo);
    if (props.memo !== null && props.memo !== undefined && props.memo !== "") {
      const memo = unescapeHTML(props.memo);
      setMemo(memo);
    }
  }, [props.memo]);

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div
        className="flex flex-row flex-nowrap w-full max-w-[150px] truncate memo-nowrap"
        dangerouslySetInnerHTML={{
          __html: sanitizer(memo),
        }}
      />
      {hovered && (
        <div
          className="bg-white border drop-shadow h-fit w-fit absolute top-0 right-0 p-2 -translate-y-100 min-w-[240px] z-50"
          style={{ marginTop: "30px" }}
        >
          <h4 className="text-center font-bold">메모 전체보기</h4>
          <div
            className="w-full text-left"
            dangerouslySetInnerHTML={{
              __html: sanitizer(props.memo),
            }}
          />
        </div>
      )}
    </div>
  );
}

export default CommisionMemo;
