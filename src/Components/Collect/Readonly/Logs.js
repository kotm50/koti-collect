import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Logs(props) {
  const user = useSelector(state => state.user);
  const [list, setList] = useState([]);
  const [searchKeyword] = useState("");
  useEffect(() => {
    setList([]);
    getList(props.gubun, searchKeyword);
    //eslint-disable-next-line
  }, [searchKeyword]);

  const getList = async (gubun, keyword) => {
    const data = {
      gubun: gubun,
      searchKeyword: keyword,
    };

    axios
      .post("/api/v1/comp/get/apilog", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        const data = res.data;
        setList(data.loginLogList);
      })
      .catch(e => console.log(e));
  };

  return (
    <div>
      {list.length > 0 ? (
        <div className="flex flex-wrap justify-start gap-x-2">
          {list.map((o, idx) => (
            <span key={idx}>{o.requestURL}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default Logs;
