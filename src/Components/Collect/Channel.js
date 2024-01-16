import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";

import sorry from "../../Asset/sorry.png";
import ChnList from "./ChnList";
import { clearUser } from "../../Reducer/userSlice";

function Channel() {
  const navi = useNavigate();
  const dispatch = useDispatch();
  const chnRef = useRef();
  const user = useSelector(state => state.user);
  const [title, setTitle] = useOutletContext();
  const [category, setCategory] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");
  const [description, setDescription] = useState("");
  const [channelCode, setChannelCode] = useState("");
  const [usable, setUsable] = useState("Y");
  const [commList, setCommList] = useState([]);
  const [loadFail, setLoadFail] = useState(false);
  useEffect(() => {
    setTitle("듀얼/채널 관리");
    getCategory();
    getCommList("", "Y");
    //eslint-disable-next-line
  }, []);

  //구분 셀렉박스 핸들링
  const handleCategorySelect = e => {
    setSelectCategory(e.currentTarget.value);
    getCommList(e.currentTarget.value, usable);
    chnRef.current.focus();
  };

  const getCommList = async (c, u) => {
    setLoadFail(true);
    let data = {
      useYn: u,
    };
    if (c !== "") {
      data.category = c;
    }
    await axios
      .post("/api/v1/comp/get/comlist", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        setCommList(res.data.commList || []);
        if (!res.data.commList || res.data.commList.legnth === 0) {
          setLoadFail(true);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const getCategory = async () => {
    await axios
      .get("/api/v1/comp/get/code", {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (!res.data.codeList || res.data.codeList.length === 0) {
          setLoadFail(true);
        } else {
          setCategory(res.data.codeList);
        }
      })
      .catch(e => console.log(e));
  };

  const logout = async () => {
    await axios
      .post("/api/v1/user/logout", null, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        dispatch(clearUser());
        navi("/");
      })
      .catch(e => {
        console.log(e);
        navi("/");
      });
  };

  const submit = async () => {
    const test = await testIt();
    if (test !== "완료") {
      return alert(test);
    } else {
      const data = {
        category: selectCategory,
        value: channelCode,
        description: description,
      };
      await axios
        .post("/api/v1/comp/add/common", data, {
          headers: { Authorization: user.accessToken },
        })
        .then(res => {
          if (res.data.code === "E999" || res.data.code === "E403") {
            alert(res.data.message);
            logout();
          }
          if (res.data.code === "C000") {
            alert("채널이 등록되었습니다");
            setChannelCode("");
            setDescription("");
            getCommList(selectCategory, usable);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  };

  const testIt = () => {
    if (selectCategory === "") {
      return "카테고리를 선택해 주세요";
    }
    if (channelCode === "") {
      return "채널 코드명를 입력해 주세요";
    }
    if (description === "") {
      return "채널에 대한 설명을 입력해 주세요";
    }
    return "완료";
  };

  const handleUsableSelect = e => {
    setUsable(e.currentTarget.value);
  };

  useEffect(() => {
    getCommList(selectCategory, usable);
    //eslint-disable-next-line
  }, [usable]);

  return (
    <div className="mx-4 flex flex-row justify-start gap-3">
      {user.admin ? (
        <div
          className="w-[480px] h-[300px] grid grid-cols-1 gap-y-2 p-4 bg-white rounded-lg drop-shadow"
          data={title}
        >
          <h2 className="text-2xl font-bold">추가하기</h2>
          <div className="grid grid-cols-4 gap-x-2">
            <div className="font-bold p-2">카테고리</div>
            {category && category.length > 0 ? (
              <>
                <select
                  className="p-2 border font-medium col-span-3"
                  onChange={handleCategorySelect}
                  value={selectCategory}
                >
                  <option value="">카테고리 선택</option>
                  {category.map((cat, idx) => (
                    <option key={idx} value={cat.category}>
                      {cat.value}
                    </option>
                  ))}
                </select>
              </>
            ) : null}
          </div>
          <div className="grid grid-cols-4 gap-x-2">
            <div className="font-bold p-2">코드명</div>
            <input
              type="text"
              ref={chnRef}
              value={channelCode}
              className="p-1 border bg-white focus:border-gray-500 col-span-3"
              placeholder="코드 입력"
              onChange={e => setChannelCode(e.currentTarget.value)}
            />
          </div>
          <div className="grid grid-cols-4 gap-x-2">
            <div className="font-bold p-2">설명</div>
            <input
              type="text"
              value={description}
              className="p-1 border bg-white focus:border-gray-500 col-span-3"
              placeholder="채널 설명 입력"
              onChange={e => setDescription(e.currentTarget.value)}
            />
          </div>
          <button
            className="bg-green-600 hover:bg-green-700 p-2 text-white mt-2"
            onClick={() => submit()}
          >
            등록하기
          </button>
        </div>
      ) : null}

      <div className="min-w-[768px] max-h-[768px] bg-white p-4 rounded-lg drop-shadow">
        <div className="flex flex-row justify-between mb-2">
          <h2 className="text-2xl font-bold">채널리스트</h2>
          <select
            className="px-2 py-1 border font-medium items-center"
            onChange={handleUsableSelect}
            value={usable}
          >
            <option value="Y">사용</option>
            <option value="N">미사용</option>
          </select>
        </div>
        <div className="h-[700px]  overflow-y-auto">
          {commList.length > 0 ? (
            <>
              <table className="w-full text-center border">
                <thead>
                  <tr className="bg-green-600 text-white">
                    <td className="p-2">카테고리</td>
                    <td className="p-2">코드명</td>
                    <td className="p-2">설명</td>
                    <td className="p-2">등록일</td>
                    <td className="p-2">삭제{usable === "N" && "/복구"}</td>
                  </tr>
                </thead>
                <tbody>
                  {commList.map((com, idx) => (
                    <tr
                      className={`${
                        idx % 2 === 1 ? "bg-green-100" : "bg-white"
                      }`}
                      key={idx}
                    >
                      <ChnList
                        com={com}
                        accessToken={user.accessToken}
                        setUsable={setUsable}
                        getCommList={getCommList}
                        selectCategory={selectCategory}
                      />
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <>
              {loadFail ? (
                <div className="text-2xl text-bold text-center">
                  <img
                    src={sorry}
                    className="mx-auto w-[240px] h-auto mb-5 mt-20"
                    alt="오류"
                  />
                  조회 된 내용이 없습니다
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Channel;
