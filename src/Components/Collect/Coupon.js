import React, { useEffect, useState } from "react";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "axios";
import CouponDetail from "./Coupon/CouponDetail";
import GenerateCoupon from "./Coupon/GenerateCoupon";

function Coupon() {
  const navi = useNavigate();
  const user = useSelector(state => state.user);
  const thisLocation = useLocation();
  const [title, setTitle] = useOutletContext();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponOn, setCouponOn] = useState(false);
  const [couponList, setCouponList] = useState([]);
  useEffect(() => {
    setTitle("쿠폰관리");
    getCouponList();
    //eslint-disable-next-line
  }, [thisLocation]);

  const getCouponList = async () => {
    const data = {
      couponStatus: "AVAILABLE",
    };
    await axios
      .post("/api/v1/comp/cpn/list", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          navi("/");
          return false;
        }
        console.log(res);
        const compCpnList = res.data.compCpnList;
        setCouponList(compCpnList);
      })
      .catch(e => console.log(e));
  };

  const showCoupon = (code, dc) => {
    setCouponCode(code);
    setDiscount(dc);
    setCouponOn(true);
  };

  const reset = () => {
    setCouponCode("");
    setDiscount(0);
    setCouponOn(false);
  };
  return (
    <div className="mx-4" data={title}>
      <GenerateCoupon showCoupon={showCoupon} reset={reset} />
      <div className="grid grid-cols-2 mt-4">
        <div className="grid grid-cols-1">
          <h3 className="font-bold text-lg py-1">쿠폰목록</h3>
          <div className="px-3 py-4 flex flex-col justify-start gap-y-2 border bg-white drop-shadow-sm relative">
            {couponList && couponList.length > 0 ? (
              <>
                <div className="grid grid-cols-6">
                  <div className="text-center">상태</div>
                  <div className="text-center">고객사</div>
                  <div className="text-center">할인율</div>
                  <div className="text-center col-span-2">쿠폰번호</div>
                  <div className="text-center">쿠폰보기</div>
                </div>
                {couponList.map((coupon, idx) => (
                  <div
                    className={`grid grid-cols-6 gap-y-2 ${
                      idx % 2 === 1 ? "bg-green-100" : ""
                    }`}
                    key={idx}
                  >
                    <div className="text-center p-2">
                      {coupon.couponStatus === "AVAILABLE"
                        ? "사용 가능"
                        : "사용 불가"}
                    </div>
                    <div className="text-center p-2">
                      {coupon.companyName} {coupon.companyBranch}
                    </div>
                    <div className="text-center p-2">
                      {coupon.discountAmount}%
                    </div>
                    <div
                      className="text-center col-span-2 truncate p-2"
                      title={coupon.couponCode}
                    >
                      {coupon.couponCode}
                    </div>
                    <div className="text-center p-1">
                      <button
                        className="p-1 px-2 bg-blue-500 hover:bg-blue-700 text-white"
                        onClick={() =>
                          showCoupon(coupon.couponCode, coupon.discountAmount)
                        }
                      >
                        쿠폰보기
                      </button>
                    </div>
                  </div>
                ))}
              </>
            ) : null}
          </div>
        </div>
        <div className="relative">
          {couponOn ? (
            <CouponDetail code={couponCode} discount={discount} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Coupon;
