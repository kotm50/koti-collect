import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import InputCompanyList from "./InputCompanyList";
import axios from "axios";
import { clearUser } from "../../../Reducer/userSlice";
import ReactQuill from "react-quill";
import { modules } from "../../Layout/QuillModule";
import "react-quill/dist/quill.snow.css";

function InputCharge(props) {
  const navi = useNavigate();
  const thisLocation = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [commCode, setCommCode] = useState(null);
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

  const [realUnpaidAd, setRealUnpaidAd] = useState("");
  const [realUnpaidComm, setRealUnpaidComm] = useState("");
  const [realUnpaidIntvCare, setRealUnpaidIntvCare] = useState("");
  const [realUnpaidCommCare, setRealUnpaidCommCare] = useState("");

  const [paidAdYn, setPaidAdYn] = useState(null);
  const [paidCommCareYn, setPaidCommCareYn] = useState(null);
  const [paidCommYn, setPaidCommYn] = useState(null);
  const [paidIntvCareYn, setPaidIntvCareYn] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentDueDate, setPaymentDueDate] = useState("");
  const [week, setWeek] = useState("");
  const [day, setDay] = useState("");
  const [memo, setMemo] = useState("");
  const [tax, setTax] = useState("N");
  const [taxDate, setTaxDate] = useState("");

  const comNameRef = useRef(null);

  const handleTax = e => {
    const value = e.target.value;
    if (value === "N") {
      setTaxDate("");
    }
    setTax(value);
  };

  useEffect(() => {
    if (props.commCode !== null && props.commCode !== undefined) {
      getCharge(props.commCode);
    } else {
      setSearchKeyword("");
      setCommCode(null);
      setCompanyName("");
      setCompanyCode("");
      setCompanyListOn(false);

      getDualTypeList();
      setDualEtcOn(false);
      setDualEtc("");
      setDualType("");
      setAdNumber("");
      setWeek("");
      setDay("");

      setUnpaidAd("0");
      setUnpaidComm("0");
      setUnpaidIntvCare("0");
      setUnpaidCommCare("0");

      setPaidAdYn(null);
      setPaidCommCareYn(null);
      setPaidCommYn(null);
      setPaidIntvCareYn(null);

      setStartDate("");
      setEndDate("");
      setPaymentDueDate("");
      setMemo("");
      setTax("N");
      setTaxDate("");
    }
    //eslint-disable-next-line
  }, [props.commCode]);

  const getCharge = async cCode => {
    const data = {
      commCode: cCode,
    };
    await axios
      .post("/api/v1/comp/ad/data", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          logout();
          return false;
        }

        const commission = res.data.commission;
        console.log(commission);
        console.log(commission.taxBillIssueDate);
        setCommCode(commission.commCode);
        setCompanyName(commission.companyBranch);
        setCompanyCode(commission.companyCode);
        setDualType(commission.dualType);
        setDualEtc(commission.dualEtc);
        setAdNumber(commission.adId);
        setStartDate(commission.hireStartDate || "");
        setEndDate(commission.hireEndDate || "");
        setTax(commission.taxBillYn);
        setTaxDate(commission.taxBillIssueDate || "");
        setEndDate(commission.hireEndDate || "");
        setPaymentDueDate(commission.paymentDueDate || "");
        if (
          commission.hireStartDate !== null &&
          commission.hireEndDate !== null
        ) {
          getWeek(commission.hireStartDate, commission.hireEndDate);
        }
        setMemo(commission.memo ? unescapeHTML(commission.memo) : "");
        setPaidAdYn(commission.paidAdYn);
        setPaidCommCareYn(commission.paidCommCareYn);
        setPaidCommYn(commission.paidCommYn);
        setPaidIntvCareYn(commission.paidIntvCareYn);
        editPaidNumber(commission.unpaidAd, "unpaidAd");
        editPaidNumber(commission.unpaidComm, "unpaidComm");
        editPaidNumber(commission.unpaidIntvCare, "unpaidIntvCare");
        editPaidNumber(commission.unpaidCommCare, "unpaidCommCare");
      })
      .catch(e => console.log(e));
  };

  useEffect(() => {
    getDualTypeList();
    //eslint-disable-next-line
  }, [thisLocation, props.month, props.searchKeyword, props.isUnpaid]);

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
    // 숫자와 쉼표를 제외한 모든 문자 제거
    const numericValue = e.target.value.replace(/[^0-9]/g, "");

    // 숫자만 입력받기 위한 정규식 검사
    if (/^\d*$/.test(numericValue)) {
      // 천 단위마다 쉼표 추가
      const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      switch (id) {
        case "adNum":
          setAdNumber(numericValue);
          break;
        case "unpaidAd":
          setRealUnpaidAd(numericValue);
          setUnpaidAd(formattedValue);
          break;
        case "unpaidComm":
          setRealUnpaidComm(numericValue);
          setUnpaidComm(formattedValue);
          break;
        case "unpaidIntvCare":
          setRealUnpaidIntvCare(numericValue);
          setUnpaidIntvCare(formattedValue);
          break;
        case "unpaidCommCare":
          setRealUnpaidCommCare(numericValue);
          setUnpaidCommCare(formattedValue);
          break;
        // 기타 필요한 case 추가
        default:
        // 기본 동작 처리 (옵션)
      }
    }
  };

  const editPaidNumber = (num, divId) => {
    const id = divId;
    // 숫자와 쉼표를 제외한 모든 문자 제거
    const numericValue = String(num);

    // 천 단위마다 쉼표 추가
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    switch (id) {
      case "adNum":
        setAdNumber(numericValue);
        break;
      case "unpaidAd":
        setRealUnpaidAd(numericValue);
        setUnpaidAd(formattedValue);
        break;
      case "unpaidComm":
        setRealUnpaidComm(numericValue);
        setUnpaidComm(formattedValue);
        break;
      case "unpaidIntvCare":
        setRealUnpaidIntvCare(numericValue);
        setUnpaidIntvCare(formattedValue);
        break;
      case "unpaidCommCare":
        setRealUnpaidCommCare(numericValue);
        setUnpaidCommCare(formattedValue);
        break;
      // 기타 필요한 case 추가
      default:
      // 기본 동작 처리 (옵션)
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
      setCommCode(null);
      setCompanyName("");
      setCompanyCode("");
      setCompanyListOn(false);

      getDualTypeList();
      setDualEtcOn(false);
      setDualEtc("");
      setDualType("");
      setAdNumber("");
      setWeek("");
      setDay("");

      setRealUnpaidAd("");
      setRealUnpaidComm("");
      setRealUnpaidIntvCare("");
      setRealUnpaidCommCare("");

      setUnpaidAd("0");
      setUnpaidComm("0");
      setUnpaidIntvCare("0");
      setUnpaidCommCare("0");

      setPaidAdYn(null);
      setPaidCommCareYn(null);
      setPaidCommYn(null);
      setPaidIntvCareYn(null);

      setStartDate("");
      setEndDate("");
      setPaymentDueDate("");
      setMemo("");
      setTax("N");
      setTaxDate("");
    } else {
      return false;
    }
  };

  const deleteIt = async () => {
    const confirm = window.confirm("수수료 내역을 삭제하시겠습니까?");
    if (confirm) {
      const data = {
        commCode: commCode,
      };
      await axios
        .delete("/api/v1/comp/del/ad", {
          headers: { Authorization: user.accessToken },
          data: data,
        })
        .then(res => {
          alert(res.data.message);
          setSearchKeyword("");
          setCommCode(null);
          setCompanyName("");
          setCompanyCode("");
          setCompanyListOn(false);

          getDualTypeList();
          setDualEtcOn(false);
          setDualEtc("");
          setDualType("");
          setAdNumber("");
          setWeek("");
          setDay("");
          setUnpaidAd("0");
          setUnpaidComm("0");
          setUnpaidIntvCare("0");
          setUnpaidCommCare("0");

          setPaidAdYn(null);
          setPaidCommCareYn(null);
          setPaidCommYn(null);
          setPaidIntvCareYn(null);

          setStartDate("");
          setEndDate("");
          setMemo("");
          setTax("N");
          setTaxDate("");

          props.getFeeList(props.month, props.year, props.searchKeyword);
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      return false;
    }
  };
  const escapeHTML = text => {
    return text
      .replace(/</g, "_여는꺾쇠_")
      .replace(/>/g, "_닫는꺾쇠_")
      .replace(/=/g, "_등호_")
      .replace(/\(/g, "_여는괄호_")
      .replace(/\)/g, "_닫는괄호_")
      .replace(/,/g, "_쉼표_")
      .replace(/"/g, "_마침표_")
      .replace(/:/g, "_콜론_")
      .replace(/;/g, "_세미콜론_")
      .replace(/\//g, "_슬래시_");
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

  const saveIt = async () => {
    const result = await test();
    if (result !== "완료") {
      return alert(result);
    } else {
      let dual;
      let adYn;
      let commCareYn;
      let commYn;
      let intvCareYn;

      const escapeMemo = await escapeHTML(memo);

      if (paidAdYn === null) {
        if (Number(realUnpaidAd) > 0) {
          adYn = "N";
        }
      } else {
        adYn = paidAdYn;
      }

      if (paidCommCareYn === null) {
        if (Number(realUnpaidCommCare) > 0) {
          commCareYn = "N";
        }
      } else {
        commCareYn = paidCommCareYn;
      }

      if (paidCommYn === null) {
        if (Number(realUnpaidComm) > 0) {
          commYn = "N";
        }
      } else {
        commYn = paidCommYn;
      }

      if (paidIntvCareYn === null) {
        if (Number(realUnpaidIntvCare) > 0) {
          intvCareYn = "N";
        }
      } else {
        intvCareYn = paidIntvCareYn;
      }

      if (dualType === "etc") {
        dual = dualEtc;
      } else {
        dual = dualType;
      }

      let start = null;
      let end = null;
      if (startDate !== "") {
        start = startDate;
      }
      if (endDate !== "") {
        end = endDate;
      }
      const data = {
        commCode: commCode === "" ? null : commCode,
        companyCode: companyCode === "" ? null : companyCode,
        adId: adNumber === "" ? null : adNumber,
        unpaidAd: realUnpaidAd === "" ? null : Number(realUnpaidAd),
        unpaidComm: realUnpaidComm === "" ? null : Number(realUnpaidComm),
        unpaidIntvCare:
          realUnpaidIntvCare === "" ? null : Number(realUnpaidIntvCare),
        unpaidCommCare:
          realUnpaidCommCare === "" ? null : Number(realUnpaidCommCare),
        paidAdYn: adYn === "" ? null : adYn,
        paidCommCareYn: commCareYn === "" ? null : commCareYn,
        paidCommYn: commYn === "" ? null : commYn,
        paidIntvCareYn: intvCareYn === "" ? null : intvCareYn,
        hireStartDate: start === "" ? null : start,
        hireEndDate: end === "" ? null : end,
        paymentDueDate: paymentDueDate === "" ? null : paymentDueDate,
        dualType: dual === "" ? null : dual,
        week: week === "" ? null : week,
        day: day === "" ? null : day,
        memo: escapeMemo === "" ? null : escapeMemo,
        taxBillYn: tax === "" ? null : tax,
        taxBillIssueDate: taxDate === "" ? null : taxDate,
      };
      console.log(data);
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
            setWeek("");
            setDay("");

            setRealUnpaidAd("");
            setRealUnpaidComm("");
            setRealUnpaidIntvCare("");
            setRealUnpaidCommCare("");

            setUnpaidAd("0");
            setUnpaidComm("0");
            setUnpaidIntvCare("0");
            setUnpaidCommCare("0");

            setPaidAdYn(null);
            setPaidCommCareYn(null);
            setPaidCommYn(null);
            setPaidIntvCareYn(null);

            setStartDate("");
            setEndDate("");
            setMemo("");
            setTax("N");
            setTaxDate("");
            getCharge(props.commCode);
            props.getFeeList(props.month, props.year, props.searchKeyword);
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
    if (startDate === "" && endDate === "" && paymentDueDate === "") {
      if (paymentDueDate === "") {
        if (startDate === "" || endDate === "") {
          return "채용 시작/종료일 또는 입금예정일을 선택하세요";
        }
      }
    }
    if (dualType === "etc" && dualEtc === "") {
      return "듀얼타입을 선택하세요";
    }
    return "완료";
  };

  useEffect(() => {
    if (startDate === "" && endDate === "") {
      setWeek("");
      setDay("");
    } else {
      getWeek(startDate, endDate);
    }
  }, [startDate, endDate]);

  const getWeek = (s, e) => {
    // 시작일과 종료일을 Date 객체로 변환
    var start = new Date();
    var end = new Date();

    if (s !== "") {
      start = new Date(s);
    }

    if (e !== "") {
      end = new Date(e);
    }

    if (s === "" && e === "") {
      setWeek("");
      setDay("");
      return true;
    }

    var weekCount = 0;
    var dayCount = 0;

    // 날짜를 하루씩 증가시키면서 주말을 제외한 날짜 수 계산
    for (var d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      var dayOfWeek = d.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // 주말(토요일=6, 일요일=0)이 아니면
        dayCount++;
      }
    }

    // 영업일을 기준으로 주와 일 계산
    weekCount = Math.floor(dayCount / 5);
    dayCount = dayCount % 5;
    setWeek(weekCount);
    setDay(dayCount);
  };
  return (
    <div className="flex flex-col justify-between h-[400px] text-sm">
      <div className="grid grid-cols-2 gap-y-2 gap-x-3">
        <div className="flex justify-start gap-2">
          <div className="py-1 w-[128px]">
            고객사 지점명<span className="text-rose-500">*</span>
          </div>
          <div className="w-full relative">
            <input
              type="text"
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              ref={comNameRef}
              value={companyName}
              placeholder="지점명/담당자명을 입력하세요"
              onChange={e => setCompanyName(e.currentTarget.value)}
              onKeyUp={handleDelay}
              data-comcode={companyCode}
              onFocus={() => {
                setCompanyListOn(true);
              }}
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
        <div className="flex justify-start gap-2">
          <div className="py-1 w-[128px]">광고 번호</div>
          <div className="w-full relative">
            <input
              type="text"
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              id="adNum"
              value={adNumber}
              placeholder="광고 번호를 입력하세요(숫자만)"
              onChange={handleNumber}
            />
          </div>
        </div>
        <div className="flex justify-start gap-2">
          <div className="py-1 w-[128px]">
            채용 시작일<span className="text-rose-500 hidden">*</span>
          </div>
          <div className="w-full relative">
            <input
              type="date"
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              id="startDate"
              value={startDate}
              onChange={e => setStartDate(e.currentTarget.value)}
            />
          </div>
        </div>
        <div className="flex justify-start gap-2">
          <div className="py-1 w-[128px]">
            채용 종료일<span className="text-rose-500 hidden">*</span>
          </div>
          <div className="w-full relative">
            <input
              type="date"
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              id="endDate"
              value={endDate}
              onChange={e => setEndDate(e.currentTarget.value)}
            />
          </div>
        </div>
        <div className="flex justify-start gap-2">
          <div className="py-1 w-[128px]">
            <label htmlFor="exp">진행기간</label>
          </div>
          <div className="w-full grid grid-cols-11 gap-0">
            <div className="w-full relative col-span-5">
              <input
                type="text"
                className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full "
                id="exp"
                value={week}
                placeholder="채용기간 주"
                onChange={e => setWeek(e.currentTarget.value)}
                maxLength={2}
              />
              {week !== "" && !isNaN(week) && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm">
                  주
                </div>
              )}
            </div>
            <span className="py-1 text-center">/</span>
            <div className="w-full relative col-span-5">
              <input
                type="text"
                className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full "
                id="day"
                value={day}
                placeholder="채용기간 일"
                onChange={e => setDay(e.currentTarget.value)}
                maxLength={2}
              />
              {day !== "" && !isNaN(day) && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm">
                  일
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-start gap-2">
          <div className="py-1 w-[128px]">입금 예정일</div>
          <div className="w-full relative">
            <input
              type="date"
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              id="paymentDueDate"
              value={paymentDueDate}
              onChange={e => setPaymentDueDate(e.currentTarget.value)}
            />
          </div>
        </div>
        <div className="flex justify-start gap-2">
          <div className="py-1 w-[128px]">광고비 미수금</div>
          <div className="w-full relative">
            <input
              type="text"
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              id="unpaidAd"
              value={unpaidAd}
              placeholder="광고비 미수금을 입력하세요(숫자만)"
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
            {unpaidAd !== "" && unpaidAd !== "0" && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm">
                원
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-start gap-2">
          <div className="py-1 w-[128px]">위촉비 미수금</div>
          <div className="w-full relative">
            <input
              type="text"
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
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
            {unpaidComm !== "" && unpaidComm !== "0" && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm">
                원
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-start gap-2">
          <div className="py-1 w-[128px]">면접케어 미수금</div>
          <div className="w-full relative">
            <input
              type="text"
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
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
            {unpaidIntvCare !== "" && unpaidIntvCare !== "0" && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm">
                원
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-start gap-2">
          <div className="py-1 w-[128px]">위촉케어 미수금</div>
          <div className="w-full relative">
            <input
              type="text"
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
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
            {unpaidCommCare !== "" && unpaidCommCare !== "0" && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm">
                원
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-start gap-2">
          <div className="py-1 w-[128px]">세금계산서</div>
          <div className="w-full relative">
            <select
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              value={tax}
              onChange={handleTax}
            >
              <option value="N">미발행</option>
              <option value="Y">발행</option>
            </select>
          </div>
        </div>
        {tax === "Y" ? (
          <div className="flex justify-start gap-2">
            <div className="py-1 w-[128px]">발행일</div>
            <div className="w-full relative">
              <input
                type="date"
                className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
                value={taxDate}
                onChange={e => setTaxDate(e.currentTarget.value)}
              />
            </div>
          </div>
        ) : (
          <div className="py-1">세금계산서를 발행하지 않습니다</div>
        )}
        <div
          className={`grid ${
            dualEtcOn ? "grid-cols-2 gap-x-1" : "grid-cols-1"
          }`}
        >
          <div className="flex justify-start gap-2">
            <div className="py-1 w-[128px]">
              듀얼 타입{dualEtcOn && <span className="text-rose-500">*</span>}
            </div>
            <div className="w-full relative">
              <select
                className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
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
            <div className="flex justify-start gap-2">
              <div className="w-full relative">
                <input
                  type="text"
                  className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
                  value={dualEtc}
                  placeholder="듀얼 타입을 직접 입력해 주세요"
                  onChange={e => setDualEtc(e.currentTarget.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div>
        <div className="w-full py-1">
          <ReactQuill
            modules={modules}
            theme="snow"
            value={memo}
            onChange={setMemo}
            className="p-0 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 top-0 left-0 w-full bg-white h-full quillCustomB"
            placeholder="기타 메모할 내용을 입력하세요"
          />
        </div>
        <div className="flex justify-center gap-x-2 p-1">
          <button
            className="w-[100px] transition-all duration-300 p-1 bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-white rounded-lg"
            onClick={() => saveIt()}
          >
            {commCode ? "수정하기" : "저장하기"}
          </button>
          <button
            className="w-[100px] transition-all duration-300 p-1 border border-gray-700 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 text-gray-700 hover:text-gray-500 rounded-lg"
            onClick={() => cancelInput()}
          >
            초기화
          </button>
          {commCode && (
            <button
              className="w-[100px] transition-all duration-300 p-1 bg-rose-500 hover:bg-rose-700 border-rose-500 hover:border-rose-700 text-white rounded-lg"
              onClick={() => deleteIt()}
            >
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default InputCharge;
