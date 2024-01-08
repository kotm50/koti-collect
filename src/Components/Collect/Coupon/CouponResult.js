import React from "react";
import couponBg10 from "../../../Asset/coupon_bg_10.png";
import couponBg20 from "../../../Asset/coupon_bg_20.png";
import couponBg30 from "../../../Asset/coupon_bg_30.png";
import couponBg40 from "../../../Asset/coupon_bg_40.png";
import couponBg50 from "../../../Asset/coupon_bg_50.png";

function CouponResult(props) {
  return (
    <div
      id="couponResult"
      className="w-[500px] h-[500px] absolute left-0 top-32"
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
      <div className="absolute top-1/2 right-5 text-3xl font-medium rounded-full text-right text-[#df0517]">
        {props.code}
      </div>
    </div>
  );
}

export default CouponResult;
