import React, { useState } from "react";
import { useSelector } from "react-redux";
import html2canvas from "html2canvas";

import CouponResult from "./CouponResult";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function GenerateCoupon() {
  const navi = useNavigate();
  const user = useSelector(state => state.user);
  const [discount, setDiscount] = useState(0);
  const [couponOn, setCouponOn] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const captureCoupon = () => {
    const couponElement = document.getElementById("couponResult"); // 'coupon'은 CouponResult 컴포넌트의 div id
    html2canvas(couponElement).then(canvas => {
      // 캔버스를 이미지로 변환
      const image = canvas.toDataURL("image/png");
      // 이미지 다운로드 (예: a 태그를 사용)
      const link = document.createElement("a");
      link.href = image;
      link.download = `coupon_${couponCode}.png`;
      link.click();
    });
    alert("쿠폰 저장 완료");
  };

  const generateCoupon = async () => {
    if (discount === 0) {
      return alert("할인율을 선택해 주세요");
    }

    const data = {
      discountAmount: Number(discount),
    };

    await axios
      .post("/api/v1/comp/add/random/cpn", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          navi("/");
          return false;
        }
        alert(res.data.message);
        const compCpn = res.data.compCpn;
        setCouponCode(compCpn.couponCode);
        setCouponOn(true);
      })
      .catch(e => console.log(e));
  };
  return (
    <div className="flex-col justify-start gap-y-4 col-span-2 grid grid-cols-2">
      <div className="text-sm">
        <h3 className="font-bold text-lg">쿠폰생성</h3>
        <div className="px-3 py-4 flex flex-col justify-start gap-y-2 border bg-white drop-shadow-sm relative">
          <div className="grid grid-cols-4">
            <div className="p-1 items-center">할인율</div>
            <select
              className="col-span-3 p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600"
              value={discount}
              onChange={e => setDiscount(Number(e.currentTarget.value))}
            >
              <option value={0}>할인율 선택</option>
              <option value={10}>10%</option>
              <option value={20}>20%</option>
              <option value={30}>30%</option>
              <option value={40}>40%</option>
              <option value={50}>50%</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            {couponOn ? (
              <button
                className="bg-rose-500 hover:bg-rose-700 text-white p-2 text-base"
                onClick={() => {
                  setDiscount(0);
                  setCouponCode("");
                  setCouponOn(false);
                }}
              >
                쿠폰 다시 생성하기
              </button>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white p-2 text-base"
                onClick={generateCoupon}
              >
                쿠폰 생성하기
              </button>
            )}
            <button
              className={`${
                !couponOn
                  ? "bg-gray-500 hover:bg-gray-300"
                  : "bg-green-500 hover:bg-green-700"
              } text-white p-2 text-base`}
              onClick={captureCoupon}
              disabled={!couponOn}
            >
              {couponOn ? "쿠폰 이미지 저장" : "먼저 쿠폰을 생성해 주세요"}
            </button>
          </div>
          {couponOn ? (
            <CouponResult code={couponCode} discount={discount} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default GenerateCoupon;
