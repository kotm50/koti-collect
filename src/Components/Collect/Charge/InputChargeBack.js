import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import InputCompanyList from "./InputCompanyList";
import axios from "axios";
import { clearUser } from "../../../Reducer/userSlice";

function InputChargeBack(props) {
  const navi = useNavigate();
  const thisLocation = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [companyListOn, setCompanyListOn] = useState(false);

  const [dualTypeList, setDualTypeList] = useState("");
  const [dualEtcOn, setDualEtcOn] = useState(false);
  const [dualEtc, setDualEtc] = useState("");
  const [dualType, setDualType] = useState("");
  const [adNumber, setAdNumber] = useState("");

  const [unpaidAd, setUnpaidAd] = useState("0");
  const [unpaidComm, setUnpaidComm] = useState("0");
  const [unpaidIntvCare, setUnpaidIntvCare] = useState("0");
  const [unpaidCommCare, setUnpaidCommCare] = useState("0");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [memo, setMemo] = useState("");

  const comNameRef = useRef(null);

  useEffect(() => {
    getDualTypeList();
    //eslint-disable-next-line
  }, [thisLocation]);

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

  const getDualTypeList = async () => {
    const data = {
      category: "DU",
      useYn: "Y",
    };
    await axios
      .post("/api/v1/comp/get/comlist", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          logout();
          return false;
        }
        setDualTypeList(res.data.commList);
        setDualType(res.data.commList[0].useValue);
      })
      .catch(e => console.log(e));
  };

  // State to keep track of the timeout ID
  const [delayTimeout, setDelayTimeout] = useState(null);

  const handleDelay = e => {
    // If there's an existing timeout, clear it
    if (delayTimeout) {
      clearTimeout(delayTimeout);
    }

    // Create a new timeout
    const newTimeout = setTimeout(() => {
      setSearchKeyword(comNameRef.current.value);
    }, 500); // 500 ms delay, adjust as needed

    // Set the new timeout ID
    setDelayTimeout(newTimeout);
  };

  const handleNumber = e => {
    const id = e.target.id;
    const value = e.target.value;
    // Regular expression to check if the string is numeric
    if (/^\d*$/.test(value)) {
      if (id === "adNum") {
        setAdNumber(value);
      } else if (id === "unpaidAd") {
        setUnpaidAd(value);
      } else if (id === "unpaidComm") {
        setUnpaidComm(value);
      } else if (id === "unpaidIntvCare") {
        setUnpaidIntvCare(value);
      } else if (id === "unpaidCommCare") {
        setUnpaidCommCare(value);
      }
    }
  };

  const handleSelect = e => {
    const value = e.target.value;
    setDualType(value);
  };

  useEffect(() => {
    if (dualType === "etc") {
      setDualEtcOn(true);
    } else {
      setDualEtcOn(false);
      setDualEtc("");
    }
  }, [dualType]);

  const cancelInput = () => {
    const confirm = window.confirm("입력한 모든 내용을 초기화 합니다");
    if (confirm) {
      setSearchKeyword("");
      setCompanyName("");
      setCompanyCode("");
      setCompanyListOn(false);

      getDualTypeList();
      setDualEtcOn(false);
      setDualEtc("");
      setDualType("");
      setAdNumber("");

      setUnpaidAd("0");
      setUnpaidComm("0");
      setUnpaidIntvCare("0");
      setUnpaidCommCare("0");
      setStartDate("");
      setEndDate("");
      setMemo("");
    } else {
      return false;
    }
  };

  const saveIt = async () => {
    const result = await test();
    if (result !== "완료") {
      return alert(result);
    } else {
      const data = {
        companyCode: companyCode,
        adId: adNumber,
        unpaidAd: Number(unpaidAd),
        unpaidComm: Number(unpaidComm),
        unpaidIntvCare: Number(unpaidIntvCare),
        unpaidCommCare: Number(unpaidCommCare),
        hireStartDate: startDate,
        hireEndDate: endDate,
        dualType: endDate,
        memo: memo,
      };
      await axios
        .post("/api/v1/comp/ist/ad", data, {
          headers: { Authorization: user.accessToken },
        })
        .then(res => {
          alert(res.data.message);
          if (res.data.code === "E999" || res.data.code === "E403") {
            logout();
            return false;
          }
          if (res.data.code === "C000") {
            setSearchKeyword("");
            setCompanyName("");
            setCompanyCode("");
            setCompanyListOn(false);

            getDualTypeList();
            setDualEtcOn(false);
            setDualEtc("");
            setDualType("");
            setAdNumber("");

            setUnpaidAd("0");
            setUnpaidComm("0");
            setUnpaidIntvCare("0");
            setUnpaidCommCare("0");
            setStartDate("");
            setEndDate("");
            setMemo("");
            props.getFeeList();
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  };
  const test = () => {
    if (companyName === "" || companyCode === "") {
      return "고객사를 입력하세요";
    }
    if (dualType === "etc" && dualEtc === "") {
      return "듀얼타입을 선택하세요";
    }
    if (startDate === "") {
      return "채용 시작일을 선택하세요";
    }
    if (endDate === "") {
      return "채용 종료일을 선택하세요";
    }
    return "완료";
  };
  return (
    <>
      <div className="flex justify-start gap-2 p-2">
        <div className="p-2 w-[180px]">
          고객사 지점명<span className="text-rose-500">*</span>
        </div>
        <div className="w-full relative">
          <input
            type="text"
            className="p-2 border w-full"
            ref={comNameRef}
            value={companyName}
            placeholder="지점명/담당자명을 입력하세요"
            onChange={e => setCompanyName(e.currentTarget.value)}
            onKeyUp={handleDelay}
            data-comcode={companyCode}
            onFocus={() => setCompanyListOn(true)}
          />
          {companyListOn && (
            <InputCompanyList
              searchKeyword={searchKeyword}
              setCompanyCode={setCompanyCode}
              setCompanyName={setCompanyName}
              setCompanyListOn={setCompanyListOn}
            />
          )}
        </div>
      </div>
      <div className="flex justify-start gap-2 p-2">
        <div className="p-2 w-[180px]">듀얼 타입</div>
        <div className="w-full relative">
          <select
            className="p-2 border w-full"
            value={dualType}
            onChange={handleSelect}
          >
            {dualTypeList && dualTypeList.length > 0 ? (
              <>
                {dualTypeList.map((cat, idx) => (
                  <option key={idx} value={cat.useValue}>
                    {cat.useValue}
                  </option>
                ))}
                <option value="etc">직접 입력</option>
              </>
            ) : (
              <option value="">선택</option>
            )}
          </select>
        </div>
      </div>
      {dualEtcOn && (
        <div className="flex justify-start gap-2 p-2">
          <div className="p-2 w-[180px]">
            듀얼 타입 입력<span className="text-rose-500">*</span>
          </div>
          <div className="w-full relative">
            <input
              type="text"
              className="p-2 border w-full"
              value={dualEtc}
              placeholder="듀얼 타입을 직접 입력해 주세요"
              onChange={e => setDualEtc(e.currentTarget.value)}
            />
          </div>
        </div>
      )}
      <div className="flex justify-start gap-2 p-2">
        <div className="p-2 w-[180px]">광고 번호</div>
        <div className="w-full relative">
          <input
            type="text"
            className="p-2 border w-full"
            id="adNum"
            value={adNumber}
            placeholder="광고 번호를 입력하세요(숫자만)"
            onChange={handleNumber}
          />
        </div>
      </div>
      <div className="flex justify-start gap-2 p-2">
        <div className="p-2 w-[180px]">광고비 미수</div>
        <div className="w-full relative">
          <input
            type="text"
            className="p-2 border w-full"
            id="unpaidAd"
            value={unpaidAd}
            placeholder="광고비 미수금을 입력하세요(숫자만"
            onChange={handleNumber}
            onFocus={() => {
              if (unpaidAd === "0") {
                setUnpaidAd("");
              }
            }}
            onBlur={e => {
              if (e.currentTarget.value === "") {
                setUnpaidAd("0");
              }
            }}
          />
        </div>
      </div>
      <div className="flex justify-start gap-2 p-2">
        <div className="p-2 w-[180px]">위촉비 미수</div>
        <div className="w-full relative">
          <input
            type="text"
            className="p-2 border w-full"
            id="unpaidComm"
            value={unpaidComm}
            placeholder="위촉비 미수금을 입력하세요(숫자만)"
            onChange={handleNumber}
            onFocus={() => {
              if (unpaidComm === "0") {
                setUnpaidComm("");
              }
            }}
            onBlur={e => {
              if (e.currentTarget.value === "") {
                setUnpaidComm("0");
              }
            }}
          />
        </div>
      </div>
      <div className="flex justify-start gap-2 p-2">
        <div className="p-2 w-[180px]">면접케어 미수</div>
        <div className="w-full relative">
          <input
            type="text"
            className="p-2 border w-full"
            id="unpaidIntvCare"
            value={unpaidIntvCare}
            placeholder="면접케어 미수금을 입력하세요(숫자만)"
            onChange={handleNumber}
            onFocus={() => {
              if (unpaidIntvCare === "0") {
                setUnpaidIntvCare("");
              }
            }}
            onBlur={e => {
              if (e.currentTarget.value === "") {
                setUnpaidIntvCare("0");
              }
            }}
          />
        </div>
      </div>
      <div className="flex justify-start gap-2 p-2">
        <div className="p-2 w-[180px]">위촉케어 미수</div>
        <div className="w-full relative">
          <input
            type="text"
            className="p-2 border w-full"
            id="unpaidCommCare"
            value={unpaidCommCare}
            placeholder="위촉케어 미수금을 입력하세요(숫자만)"
            onChange={handleNumber}
            onFocus={() => {
              if (unpaidCommCare === "0") {
                setUnpaidCommCare("");
              }
            }}
            onBlur={e => {
              if (e.currentTarget.value === "") {
                setUnpaidCommCare("0");
              }
            }}
          />
        </div>
      </div>
      <div className="flex justify-start gap-2 p-2">
        <div className="p-2 w-[180px]">
          채용 시작일<span className="text-rose-500">*</span>
        </div>
        <div className="w-full relative">
          <input
            type="date"
            className="p-2 border w-full"
            id="startDate"
            value={startDate}
            onChange={e => setStartDate(e.currentTarget.value)}
          />
        </div>
      </div>
      <div className="flex justify-start gap-2 p-2">
        <div className="p-2 w-[180px]">
          채용 종료일<span className="text-rose-500">*</span>
        </div>
        <div className="w-full relative">
          <input
            type="date"
            className="p-2 border w-full"
            id="endDate"
            value={endDate}
            onChange={e => setEndDate(e.currentTarget.value)}
          />
        </div>
      </div>
      <div className="flex justify-start gap-2 p-2">
        <div className="p-2 w-[180px]">기타 메모</div>
        <div className="w-full relative">
          <textarea
            className="p-2 border w-full"
            id="memo"
            value={memo}
            placeholder="기타 메모할 내용을 입력하세요"
            onChange={e => setMemo(e.currentTarget.value)}
            rows="4"
          />
        </div>
      </div>
      <div className="flex justify-center gap-x-2 p-2">
        <button
          className="transition-all duration-300 p-2 bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-white rounded-lg"
          onClick={() => saveIt()}
        >
          저장하기
        </button>
        <button
          className="transition-all duration-300 p-2 border border-gray-700 hover:border-gray-500 text-gray-700 hover:text-gray-500 rounded-lg"
          onClick={() => cancelInput()}
        >
          초기화
        </button>
      </div>
    </>
  );
}

export default InputChargeBack;
