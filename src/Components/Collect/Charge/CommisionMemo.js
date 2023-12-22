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
    if (props.memo !== null && props.memo !== undefined && props.memo !== "") {
      const memo = unescapeHTML(props.memo);
      setMemo(memo);
    }
  }, [props.memo]);

  const handleModal = () => {
    props.setMemo(memo);
    props.setModalOn(true);
    setHovered(false);
  };

  return (
    <div
      className="h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="flex flex-row flex-nowrap w-full max-w-[150px] truncate memo-nowrap h-[30px]"
        dangerouslySetInnerHTML={{
          __html: sanitizer(memo),
        }}
      />
      {hovered && (
        <div className="bg-black border drop-shadow absolute top-0 bottom-0 left-0 right-0 w-full z-10 bg-opacity-20 text-white p-[2px] h-full">
          <button
            className="py-1 px-3 text-sm font-bold bg-green-600 hover:bg-green-800 text-white h-full rounded-lg"
            onClick={handleModal}
          >
            메모 전체보기
          </button>
        </div>
      )}
    </div>
  );
}

export default CommisionMemo;
