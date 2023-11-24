import { useState } from "react";
import dompurify from "dompurify";

function CommisionMemo(props) {
  const sanitizer = dompurify.sanitize;
  const [hovered, setHovered] = useState(false);
  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div
        className="flex flex-row flex-nowrap w-full truncate memo-nowrap"
        dangerouslySetInnerHTML={{
          __html: sanitizer(props.memo),
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
