import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

function CollectIndex() {
  useEffect(() => {
    getGoods();
    //eslint-next-line
  }, []);
  const getGoods = async (c, b, p) => {
    let listUrl = "/api/v1/shop/goods/list";
    const data = {
      page: p,
      size: 1,
    };
    await axios
      .get(listUrl, {
        params: data,
      })
      .then(async res => {
        console.log(res);
        console.log(res.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  return (
    <>
      <div className="fixed left-1/2 top-1/2 w-fit h-fit -translate-x-1/2 -translate-y-1/2">
        <div className="text-6xl">코리아티엠 수금전산</div>
        <div className="mt-48">
          <Link
            to="/collect"
            className="block px-2 py-4 text-center bg-blue-500 hover:bg-blue-700 text-white rounded"
          >
            로그인
          </Link>
        </div>
      </div>
    </>
  );
}

export default CollectIndex;
