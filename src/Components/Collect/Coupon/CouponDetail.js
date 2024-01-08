import React from "react";
import html2canvas from "html2canvas";
import couponBg10 from "../../../Asset/coupon_bg_10.png";
import couponBg20 from "../../../Asset/coupon_bg_20.png";
import couponBg30 from "../../../Asset/coupon_bg_30.png";
import couponBg40 from "../../../Asset/coupon_bg_40.png";
import couponBg50 from "../../../Asset/coupon_bg_50.png";

function CouponDetail(props) {
  const captureCoupon = () => {
    const couponElement = document.getElementById("couponResult"); // 'coupon'은 CouponResult 컴포넌트의 div id
    html2canvas(couponElement).then(canvas => {
      // 캔버스를 이미지로 변환
      const image = canvas.toDataURL("image/png");
      // 이미지 다운로드 (예: a 태그를 사용)
      const link = document.createElement("a");
      link.href = image;
      link.download = `coupon_${props.code}.png`;
      link.click();
    });
    alert("쿠폰 저장 완료");
  };
  return (
    <div className="absolute left-4 top-0 -translate-y-2">
      <div className="grid grid-cols-2 py-1">
        <h3 className="font-bold text-lg p-1">쿠폰보기</h3>
        <button
          className={`bg-green-500 hover:bg-green-700 text-white p-1 text-base`}
          onClick={captureCoupon}
        >
          쿠폰 이미지 저장
        </button>
      </div>
      <div className=" p-4 bg-white border">
        <div
          id="couponResult"
          className="w-[500px] h-[500px]"
          style={{
            backgroundImage: `url(${
              props.discount === 10
                ? couponBg10
                : props.discount === 20
                ? couponBg20
                : props.discount === 30
                ? couponBg30
                : props.discount === 40
                ? couponBg40
                : props.discount === 50
                ? couponBg50
                : ""
            })`,
          }}
        >
          <div className="absolute top-1/2 translate-y-6 right-8 text-3xl font-medium rounded-full text-right text-[#df0517]">
            {props.code}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CouponDetail;
