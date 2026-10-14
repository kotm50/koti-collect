import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import ReactQuill from "react-quill";
import { modules } from "../../Layout/QuillModule";
import "react-quill/dist/quill.snow.css";
import { clearUser } from "../../../Reducer/userSlice";
import axiosInstance from "../../../Api/axiosInstance";
import axios from "axios";

// 입금 기록 API. axiosInstance는 오류 시 로그아웃하므로 이 도메인은 axios로 호출한다.
const INTERVIEW_RECORD_URL = "https://adimg.ikoreatm.com/api/interview-record";

function InputDeposit(props) {
  const navi = useNavigate();
  const dispatch = useDispatch();
  const [companyCode, setCompanyCode] = useState("");
  const [commCode, setCommCode] = useState(null);
  const [payCode, setPayCode] = useState(null);

  const [isTax, setIsTax] = useState(0);

  const [transactionType, setTransactionType] = useState("P");

  const [bigo, setBigo] = useState("");

  const [resNo, setResNo] = useState("");
  const [authNo, setAuthNo] = useState("");

  const [payerName, setPayerName] = useState("");
  const [paidAd, setPaidAd] = useState("0");
  const [paidComm, setPaidComm] = useState("0");
  const [paidIntvCare, setPaidIntvCare] = useState("0");
  const [paidCommCare, setPaidCommCare] = useState("0");

  const [installment, setInstallment] = useState("N");

  const [realPaidAd, setRealPaidAd] = useState("");
  const [realPaidComm, setRealPaidComm] = useState("");
  const [realPaidIntvCare, setRealPaidIntvCare] = useState("");
  const [realPaidCommCare, setRealPaidCommCare] = useState("");

  const [payType, setPayType] = useState("");
  const [cardCode, setCardCode] = useState("");

  const [paidDate, setPaidDate] = useState("");

  const [cardList, setCardList] = useState([]);

  const [prePayType, setPrePayType] = useState("");

  const [prePaidResult, setPrePaidResult] = useState("");
  const [prePaidTotal, setPrePaidTotal] = useState(0);
  const [prePaidCard, setPrePaidCard] = useState(0);
  const [prePaidCash, setPrePaidCash] = useState(0);
  const [prePaidCorp, setPrePaidCorp] = useState(0);

  // 위케 고객사(숫자 별칭). 위촉케어 결제액이 있을 때 수금 저장 전 필수다.
  const [wikeAlias, setWikeAlias] = useState("");
  // 목록에서 고른 면접비코드. 비어 있으면 생성 요청에서 ir_code를 뺀다.
  const [selectedIrCode, setSelectedIrCode] = useState("");
  // 항목을 골랐거나, 결과 없음에서 '새로 추가하기'를 눌렀으면 true.
  const [wikeResolved, setWikeResolved] = useState(false);
  const [wikeSearchOpen, setWikeSearchOpen] = useState(false);
  const [wikeSearchLoading, setWikeSearchLoading] = useState(false);
  const [wikeSearchList, setWikeSearchList] = useState([]);

  // 위케 고객사 입력과 검색에서 고른 면접비코드를 비운다.
  const resetWikeCustomer = () => {
    setWikeAlias("");
    setSelectedIrCode("");
    setWikeResolved(false);
    setWikeSearchOpen(false);
    setWikeSearchList([]);
  };

  useEffect(() => {
    setCommCode(null);
    setCardCode("");
    setTransactionType("P");
    setPayType("");
    setRealPaidAd("");
    setRealPaidComm("");
    setRealPaidIntvCare("");
    setRealPaidCommCare("");
    setPaidAd("");
    setPaidComm("");
    setPaidIntvCare("");
    setPaidCommCare("");
    setPaidDate("");
    setResNo("");
    setAuthNo("");
    setPayerName("");
    setBigo("");

    setPrePaidTotal(0);
    setPrePaidCard(0);
    setPrePaidCash(0);
    setPrePaidCorp(0);
    setPayCode(null);
    setInstallment("N");
    resetWikeCustomer();
    if (props.commCode !== null) {
      setCommCode(props.commCode);
      getCompanyCode(props.commCode);
    }
    //eslint-disable-next-line
  }, [props.commCode]);

  useEffect(() => {
    if (props.payCode !== null) {
      setPayCode(props.payCode);
      resetWikeCustomer();
      getPayed(props.payCode);
    } else {
      setInstallment("N");
      setCommCode(null);
      setCardCode("");
      setTransactionType("P");
      setPayType("");
      setRealPaidAd("");
      setRealPaidComm("");
      setRealPaidIntvCare("");
      setRealPaidCommCare("");
      setPaidAd("");
      setPaidComm("");
      setPaidIntvCare("");
      setPaidCommCare("");
      setPaidDate("");
      setResNo("");
      setAuthNo("");
      setPayerName("");
      setBigo("");

      setPrePaidTotal(0);
      setPrePaidCard(0);
      setPrePaidCash(0);
      setPrePaidCorp(0);
      setPayCode(null);
      resetWikeCustomer();
    }
    //eslint-disable-next-line
  }, [props.payCode]);

  const getCompanyCode = async cCode => {
    const data = {
      commCode: cCode,
    };
    await axiosInstance
      .post("/api/v1/comp/ad/data", data, {
        headers: { Authorization: props.user.accessToken },
      })
      .then(res => {
        if (res.data.code === "C000") {
          setCompanyCode(res.data.commission.companyCode);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const getPayed = async pCode => {
    const data = {
      payCode: pCode,
    };

    await axiosInstance
      .post("/api/v1/comp/get/detail/pay", data, {
        headers: { Authorization: props.user.accessToken },
      })
      .then(async res => {
        if (res.data.code === "E999") {
          logout();
          return false;
        }
        if (res.data.code === "E403") {
          return alert(res.data.message);
        }
        const pay = res.data.pay;
        setCommCode(pay.commCode || null);
        getCompanyCode(pay.commCode);
        setCardCode(pay.cardCode || "");
        setTransactionType(pay.transactionType || "");
        setPayType(pay.payType || "");
        setRealPaidAd(pay.paidAd || "");
        setRealPaidComm(pay.paidComm || "");
        setRealPaidIntvCare(pay.paidIntvCare || "");
        setRealPaidCommCare(pay.paidCommCare || "");
        setPaidAd(await getPaid(pay.paidAd));
        setPaidComm(await getPaid(pay.paidComm));
        setPaidIntvCare(await getPaid(pay.paidIntvCare));
        setPaidCommCare(await getPaid(pay.paidCommCare));
        setPaidDate(pay.paidDate || "");
        setResNo(pay.resNo || "");
        setAuthNo(pay.authNo || "");
        setPayerName(pay.companyCode || "");
        setBigo(pay.bigo ? unescapeHTML(pay.bigo) : "");
        setPayerName(pay.payerName || "");
        setPrePayType(pay.prepayType || "");
        setInstallment(pay.installment || "");
      })
      .catch(e => console.log(e));
  };

  const logout = async () => {
    await axiosInstance
      .post("/api/v1/user/logout", null, {
        headers: { Authorization: props.user.accessToken },
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

  const cancelInput = () => {
    const confirm = window.confirm("내용을 초기화 하시겠습니까?");
    if (!confirm) {
      return false;
    }
    setCardCode("");
    setTransactionType("P");
    setPayType("");
    setRealPaidAd("");
    setRealPaidComm("");
    setRealPaidIntvCare("");
    setRealPaidCommCare("");
    setPaidAd("");
    setPaidComm("");
    setPaidIntvCare("");
    setPaidCommCare("");
    setPaidDate("");
    setResNo("");
    setAuthNo("");
    setPayerName("");
    setBigo("");
    setInstallment("N");
    setPayCode(null);
    resetWikeCustomer();
    props.setPayCode(null);
  };

  const getPaid = num => {
    if (String(num).length > 3) {
      const formattedValue = String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return formattedValue;
    } else {
      return String(num);
    }
  };

  const escapeHTML = text => {
    return text
      .replace(/</g, "＜")
      .replace(/>/g, "＞")
      .replace(/=/g, "＝")
      .replace(/\(/g, "（")
      .replace(/\)/g, "）")
      .replace(/,/g, "，")
      .replace(/"/g, "＂")
      .replace(/:/g, "：")
      .replace(/;/g, "；")
      .replace(/\//g, "／");
  };

  const unescapeHTML = text => {
    return text
      .replace(/＜/g, "<")
      .replace(/＞/g, ">")
      .replace(/＝/g, "=")
      .replace(/（/g, "(")
      .replace(/）/g, ")")
      .replace(/，/g, ",")
      .replace(/＂/g, '"')
      .replace(/：/g, ":")
      .replace(/；/g, ";")
      .replace(/／/g, "/");
  };

  const submit = async () => {
    const result = await tester();
    if (result !== "완료") {
      alert(result);
      return false;
    } else {
      const escapeBigo = await escapeHTML(bigo);
      let data = {
        companyCode: companyCode === "" ? null : companyCode,
        commCode: commCode === "" ? null : commCode,
        cardCode: cardCode === "" ? null : cardCode,
        transactionType: transactionType === "" ? null : transactionType,
        payType: payType === "" ? null : payType,
        paidAd: realPaidAd === "" ? null : realPaidAd,
        paidComm: realPaidComm === "" ? null : realPaidComm,
        paidIntvCare: realPaidIntvCare === "" ? null : realPaidIntvCare,
        paidCommCare: realPaidCommCare === "" ? null : realPaidCommCare,
        paidDate: paidDate === "" ? null : paidDate,
        resNo: resNo === "" ? null : resNo,
        authNo: authNo === "" ? null : authNo,
        payerName: payerName === "" ? null : payerName,
        bigo: bigo === "" ? null : escapeBigo,
        installment: installment === "" ? null : installment,
      };
      if (payType === "CA" || payType === "CO") {
        data.cardCode = null;
        data.resNo = null;
        data.authNo = null;
      } else if (
        payType === "PG" ||
        payType === "MO" ||
        payType === "HE" ||
        payType === "PE"
      ) {
        data.payerName = null;
      } else if (payType === "PR") {
        data.payerName = null;
        data.cardCode = null;
        data.resNo = null;
        data.authNo = null;
        data.prepayType = prePayType;
      }
      await axiosInstance
        .post("/api/v1/comp/add/pay", data, {
          headers: { Authorization: props.user.accessToken },
        })
        .then(async res => {
          if (res.data.code === "E999") {
            props.logout();
            return false;
          }
          if (res.data.code === "E403") {
            return alert(res.data.message);
          }
          alert(res.data.message);
          if (res.data.code === "C000") {
            // 수금 저장이 끝난 뒤에만 위케 입금 기록을 만든다.
            // 위촉케어 결제액이 있을 때만 호출하고, 실패해도 이미 저장된 수금은 유지한다.
            if (Number(realPaidCommCare) > 0) {
              await saveInterviewRecord();
            }
            setBigo("");
            props.resetCharge();
            props.getFeeList(props.month, props.year, props.searchKeyword);
            await codeReset();
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  };

  const modify = async () => {
    const result = await tester();
    if (result !== "완료") {
      return alert(result);
    } else {
      const escapeBigo = await escapeHTML(bigo);
      let data = {
        companyCode: companyCode === "" ? null : companyCode,
        commCode: commCode === "" ? null : commCode,
        cardCode: cardCode === "" ? null : cardCode,
        transactionType: transactionType === "" ? null : transactionType,
        payType: payType === "" ? null : payType,
        paidAd: realPaidAd === "" ? null : realPaidAd,
        paidComm: realPaidComm === "" ? null : realPaidComm,
        paidIntvCare: realPaidIntvCare === "" ? null : realPaidIntvCare,
        paidCommCare: realPaidCommCare === "" ? null : realPaidCommCare,
        paidDate: paidDate === "" ? null : paidDate,
        resNo: resNo === "" ? null : resNo,
        authNo: authNo === "" ? null : authNo,
        payerName: payerName === "" ? null : payerName,
        bigo: bigo === "" ? null : escapeBigo,
        payCode: payCode === "" ? null : payCode,
        installment: installment === "" ? null : installment,
      };
      if (payType === "CA" || payType === "CO") {
        data.cardCode = null;
        data.resNo = null;
        data.authNo = null;
      } else if (
        payType === "PG" ||
        payType === "MO" ||
        payType === "HE" ||
        payType === "PE"
      ) {
        data.payerName = null;
      } else if (payType === "PR") {
        data.payerName = null;
        data.cardCode = null;
        data.resNo = null;
        data.authNo = null;
        data.prepayType = prePayType;
      }
      await axiosInstance
        .patch("/api/v1/comp/upt/pay", data, {
          headers: { Authorization: props.user.accessToken },
        })
        .then(async res => {
          if (res.data.code === "E999") {
            props.logout();
            return false;
          }
          if (res.data.code === "E403") {
            return alert(res.data.message);
          }
          alert(res.data.message);
          if (res.data.code === "C000") {
            setBigo("");
            props.resetCharge();
            props.setCommCode(null);
            props.getFeeList(props.month, props.year, props.searchKeyword);
            await codeReset();
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  };

  const handleInstallment = e => {
    setInstallment(e.target.value);
  };

  const codeReset = () => {
    props.setCommCode(null);
    setCardCode("");
    setTransactionType("P");
    setPayType("");
    setRealPaidAd("");
    setRealPaidComm("");
    setRealPaidIntvCare("");
    setRealPaidCommCare("");
    setPaidAd("");
    setPaidComm("");
    setPaidIntvCare("");
    setPaidCommCare("");
    setPaidDate("");
    setResNo("");
    setAuthNo("");
    setPayerName("");
    setBigo("");
    setInstallment("N");
    setPayCode(null);
    resetWikeCustomer();
  };

  // 위촉케어 결제액이 0보다 큰 신규 수금인지. 수정은 입금 기록을 다시 만들지 않는다.
  const needsWikeCustomer = () => !payCode && Number(realPaidCommCare) > 0;

  // 오늘 날짜. 브라우저 로컬 기준 YYYY-MM-DD.
  const getToday = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
  };

  // 별칭은 숫자만, 최대 10자. 값이 바뀌면 이전 검색 선택은 무효다.
  const handleWikeAlias = e => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
    setWikeAlias(numericValue);
    setSelectedIrCode("");
    setWikeResolved(false);
  };

  // 목록 API. com_name_alias는 별칭 하나와 정확히 일치하는 행만 돌려준다.
  const searchWikeCustomer = async () => {
    if (wikeAlias === "") {
      alert("위케 고객사를 입력하세요");
      return;
    }
    setWikeSearchLoading(true);
    try {
      const res = await axios.get(`${INTERVIEW_RECORD_URL}/list`, {
        params: {
          com_name_alias: wikeAlias,
          size: 100,
        },
      });
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setWikeSearchList(list);
      setWikeSearchOpen(true);
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "위케 고객사 검색 중 오류가 발생했습니다"
      );
    } finally {
      setWikeSearchLoading(false);
    }
  };

  // 검색 행의 ir_code를 저장하고 모달을 닫는다.
  const selectWikeRecord = item => {
    setSelectedIrCode(item?.ir_code || "");
    setWikeResolved(true);
    setWikeSearchOpen(false);
  };

  // 결과가 없을 때. ir_code 없이 새로 등록하므로 선택값은 비운다.
  const addNewWikeCustomer = () => {
    setSelectedIrCode("");
    setWikeResolved(true);
    setWikeSearchOpen(false);
  };

  // 생성 API. '새로 추가하기'이거나 선택한 코드가 없으면 ir_code를 보내지 않는다.
  const saveInterviewRecord = async () => {
    const body = {
      com_name_alias: wikeAlias,
      inc_cash: Number(realPaidCommCare),
      inc_date: getToday(),
    };
    if (selectedIrCode) {
      body.ir_code = selectedIrCode;
    }
    try {
      const res = await axios.post(INTERVIEW_RECORD_URL, body);
      alert(res.data?.message || "입금 기록이 등록되었습니다.");
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "위케 입금 기록 등록 중 오류가 발생했습니다. 수금 입력은 저장되었습니다."
      );
    }
  };

  const tester = () => {
    if (commCode === null) {
      return "미수금 등록 또는 선택 후 작성 가능합니다";
    }
    if (paidDate === "") {
      return "결제일을 입력하세요";
    }
    if (payType === "") {
      return "결제 방식을 선택하세요";
    }
    if (payType === "CA" || payType === "CO") {
      if (payerName === "") {
        return "입금자명을 입력하세요";
      }
    }
    if (
      payType === "PG" ||
      payType === "MO" ||
      payType === "HE" ||
      payType === "PE"
    ) {
      if (cardCode === "") {
        return "결제 카드를 선택하세요";
      }
    }
    if (payType === "PR") {
      if (prePayType === "") {
        return "선입금 결제 방식을 선택하세요";
      }
    }
    // 백엔드는 위케 고객사를 검사하지 않는다. 위촉케어 금액이 있으면 화면에서만 막는다.
    if (needsWikeCustomer()) {
      if (wikeAlias === "") {
        return "위케 고객사를 입력하세요";
      }
      if (!wikeResolved) {
        return "위케 고객사를 검색해 주세요. 결과가 없으면 새로 추가하기를 눌러 주세요";
      }
    }
    return "완료";
  };

  useEffect(() => {
    if (companyCode !== "") {
      getCardList(companyCode);
    } else {
      setCardList([]);
    }
    //eslint-disable-next-line
  }, [companyCode]);

  useEffect(() => {
    if (
      payType === "PG" ||
      payType === "MO" ||
      payType === "HE" ||
      payType === "PE"
    ) {
      getCardList(companyCode);
    } else {
      if (payType === "PR") {
        getPrePaid();
      } else {
        setPrePaidTotal(0);
        setPrePaidCard(0);
        setPrePaidCash(0);
        setPrePaidCorp(0);
      }
      setCardList([]);
    }
    //eslint-disable-next-line
  }, [payType]);

  const getCardList = async cCode => {
    setCardList([]);
    const data = {
      companyCode: cCode,
    };

    await axiosInstance
      .post("/api/v1/comp/card/list", data, {
        headers: { Authorization: props.user.accessToken },
      })
      .then(res => {
        if (res.data.code === "E999") {
          logout();
          return false;
        }
        if (res.data.code === "E403") {
          return alert(res.data.message);
        }
        setCardList(res.data.cardList);
      })
      .catch(e => {
        console.log(e);
      });
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
        case "paidAd":
          setRealPaidAd(numericValue);
          setPaidAd(formattedValue);
          break;
        case "paidComm":
          setRealPaidComm(numericValue);
          setPaidComm(formattedValue);
          break;
        case "paidIntvCare":
          setRealPaidIntvCare(numericValue);
          setPaidIntvCare(formattedValue);
          break;
        case "paidCommCare":
          setRealPaidCommCare(numericValue);
          setPaidCommCare(formattedValue);
          break;
        // 기타 필요한 case 추가
        default:
        // 기본 동작 처리 (옵션)
      }
    }
  };

  const deleteIt = async () => {
    const confirm = window.confirm("입출금 내역을 삭제하시겠습니까?");
    if (confirm) {
      const data = {
        payCode: payCode,
      };
      await axiosInstance
        .delete("/api/v1/comp/del/pay", {
          headers: { Authorization: props.user.accessToken },
          data: data,
        })
        .then(async res => {
          alert(res.data.message);
          props.getFeeList(props.month, props.year, props.searchKeyword);
          props.getPayList(commCode);
          await codeReset();
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      return false;
    }
  };

  const handlePayType = e => {
    const value = e.target.value;
    if (value !== "PR") setPrePaidTotal(0);
    setPayType(value);
  };

  useEffect(() => {
    if (payType === "CA" || payType === "CO") {
      setIsTax(1);
    } else if (
      payType === "PG" ||
      payType === "MO" ||
      payType === "HE" ||
      payType === "PE"
    ) {
      setIsTax(2);
    } else if (payType === "PR") {
      setIsTax(3);
    } else {
      setIsTax(0);
    }
  }, [payType]);

  const getPrePaid = async () => {
    const data = {
      companyCode: companyCode,
    };

    await axiosInstance
      .post("/api/v1/comp/prepay/balance", data, {
        headers: { Authorization: props.user.accessToken },
      })
      .then(res => {
        if (res.data.code === "C000") {
          setPrePaidTotal(Number(res.data.prepay.prepayment));
          setPrePaidCard(Number(res.data.prepay.cardPrepayment));
          setPrePaidCash(Number(res.data.prepay.cashPrepayment));
          setPrePaidCorp(Number(res.data.prepay.corporatePrepayment));
          setPrePaidResult("결제방식을 선택하세요");
        } else {
          setPrePaidResult("선입금 내역이 없습니다");
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  return (
    <div className="flex flex-col justify-between min-h-[540px] text-sm">
      <div
        className="grid grid-cols-2 gap-y-2 gap-x-3"
        data-realpaid1={realPaidAd}
        data-realpaid2={realPaidComm}
        data-realpaid3={realPaidIntvCare}
        data-realpaid4={realPaidCommCare}
        data-company={companyCode}
      >
        <div className="flex justify-start gap-2">
          <div className="py-1 w-[128px]">
            결제일<span className="text-rose-500">*</span>
          </div>
          <div className="w-full relative">
            <input
              type="date"
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              id="paidDate"
              value={paidDate}
              onChange={e => setPaidDate(e.currentTarget.value)}
            />
          </div>
        </div>
        <div className="flex justify-start gap-2">
          <div className="py-1 w-[128px]">입금/환급</div>
          <div className="w-full relative">
            <select
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              value={transactionType}
              onChange={e => setTransactionType(e.currentTarget.value)}
              disabled={payCode}
            >
              <option value="P">입금</option>
              <option value="D">환급</option>
            </select>
          </div>
        </div>
        <div className="flex justify-start gap-2">
          <div className="py-1 w-[128px]">
            결제방식<span className="text-rose-500">*</span>
          </div>
          <div className="w-full relative">
            <select
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              value={payType}
              onChange={handlePayType}
            >
              <option value="">결제방식 선택</option>
              <option value="CA">현금</option>
              <option value="CO">법인</option>
              <option value="PG">PG카드</option>
              <option value="MO">몬카드</option>
              <option value="HE">천국카드</option>
              <option value="PE">펄스맥</option>
              <option value="PR">
                선입금
                {prePaidTotal > 0 &&
                  ` 잔액 : ${Number(prePaidTotal).toLocaleString()} 원`}
              </option>
            </select>
          </div>
        </div>
        {payType === "" ? (
          <div className="py-1">결제방식을 선택해 주세요</div>
        ) : payType !== "CA" && payType !== "CO" && payType !== "PR" ? (
          <>
            {cardList.length > 0 ? (
              <div className="flex justify-start gap-2">
                <div className="py-1 w-[128px]">
                  결제카드<span className="text-rose-500">*</span>
                </div>
                <div className="w-full relative">
                  <select
                    className="py-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
                    value={cardCode}
                    onChange={e => setCardCode(e.currentTarget.value)}
                  >
                    <option value="">결제카드 선택</option>
                    {cardList.map((card, idx) => (
                      <option value={card.cardCode} key={idx}>
                        {card.cardComp} | {card.cardOwner} | {card.cardNum}{" "}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="py-1">
                <Link
                  to="/collect/card"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  카드가 없습니다. 여길 눌러 카드를 등록해 주세요
                </Link>
              </div>
            )}
            <div className="flex justify-start gap-2">
              <div className="py-1 w-[128px]">일시불/할부</div>
              <div className="w-full relative">
                <select
                  className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
                  value={installment}
                  onChange={handleInstallment}
                >
                  <option value="N">일시불</option>
                  <option value="2개월">2개월</option>
                  <option value="3개월">3개월</option>
                  <option value="4개월">4개월</option>
                  <option value="5개월">5개월</option>
                  <option value="6개월">6개월</option>
                  <option value="7개월">7개월</option>
                  <option value="8개월">8개월</option>
                  <option value="9개월">9개월</option>
                  <option value="10개월">10개월</option>
                  <option value="11개월">11개월</option>
                  <option value="12개월">12개월</option>
                </select>
              </div>
            </div>
            {installment === "N" ? (
              <div className="py-1">
                <span className="font-bold">일시불</span>로 결제합니다
              </div>
            ) : (
              <div className="py-1">
                <span className="font-bold">{installment}</span> 할부로
                결제합니다
              </div>
            )}
          </>
        ) : payType === "PR" ? (
          <div className="flex justify-start gap-2">
            <div className="w-[160px]">
              <select
                className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
                value={prePayType}
                onChange={e => {
                  setPrePayType(e.currentTarget.value);
                }}
              >
                <option value="">결제방식 선택</option>
                <option value="CA">현금</option>
                <option value="CD">카드</option>
                <option value="CO">법인</option>
              </select>
            </div>
            <div className="w-full relative py-1">
              {prePayType === "CA"
                ? `${prePaidCash.toLocaleString()}원`
                : prePayType === "CD"
                ? `${prePaidCard.toLocaleString()}원`
                : prePayType === "CO"
                ? `${prePaidCorp.toLocaleString()}원`
                : prePaidResult}
            </div>
          </div>
        ) : (
          <div className="flex justify-start gap-2">
            <div className="py-1 w-[128px]">
              입금자명<span className="text-rose-500">*</span>
            </div>
            <div className="w-full relative">
              <input
                type="text"
                className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
                id="payerName"
                value={payerName}
                placeholder="입금자명을 입력하세요"
                onChange={e => setPayerName(e.currentTarget.value)}
              />
            </div>
          </div>
        )}
        <div className="flex justify-start gap-2">
          <div className="py-1 w-[128px]">광고비 결제액</div>
          <div className="w-full relative">
            <input
              type="text"
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              id="paidAd"
              value={paidAd}
              placeholder="광고비 결제금액을 입력하세요(숫자만)"
              onChange={handleNumber}
              onFocus={() => {
                if (paidAd === "0") {
                  setPaidAd("");
                }
              }}
              onBlur={e => {
                if (e.currentTarget.value === "") {
                  setPaidAd("0");
                }
              }}
            />
            {paidAd !== "" && paidAd !== "0" && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm">
                원
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-start gap-2">
          <div className="py-1 w-[128px]">면접케어 결제액</div>
          <div className="w-full relative">
            <input
              type="text"
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              id="paidIntvCare"
              value={paidIntvCare}
              placeholder="면접케어 결제금액을 입력하세요(숫자만)"
              onChange={handleNumber}
              onFocus={() => {
                if (paidIntvCare === "0") {
                  setPaidIntvCare("");
                }
              }}
              onBlur={e => {
                if (e.currentTarget.value === "") {
                  setPaidIntvCare("0");
                }
              }}
            />
            {paidIntvCare !== "" && paidIntvCare !== "0" && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm">
                원
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-start gap-2">
          <div className="py-1 w-[128px]">위촉케어 결제액</div>
          <div className="w-full relative">
            <input
              type="text"
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              id="paidCommCare"
              value={paidCommCare}
              placeholder="위촉케어 결제금액을 입력하세요(숫자만)"
              onChange={handleNumber}
              onFocus={() => {
                if (paidCommCare === "0") {
                  setPaidCommCare("");
                }
              }}
              onBlur={e => {
                if (e.currentTarget.value === "") {
                  setPaidCommCare("0");
                }
              }}
            />
            {paidCommCare !== "" && paidCommCare !== "0" && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm">
                원
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-start gap-2">
          <div className="py-1 w-[128px]">위촉비 결제액</div>
          <div className="w-full relative">
            <input
              type="text"
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              id="paidComm"
              value={paidComm}
              placeholder="위촉비 결제금액을 입력하세요(숫자만)"
              onChange={handleNumber}
              onFocus={() => {
                if (paidComm === "0") {
                  setPaidComm("");
                }
              }}
              onBlur={e => {
                if (e.currentTarget.value === "") {
                  setPaidComm("0");
                }
              }}
            />
            {paidComm !== "" && paidComm !== "0" && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm">
                원
              </div>
            )}
          </div>
        </div>
        <div className="col-span-2 flex justify-start gap-2 items-start">
          <div className="py-1 w-[128px]">
            위케 고객사
            {needsWikeCustomer() && <span className="text-rose-500">*</span>}
          </div>
          <div className="w-full">
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
                id="wikeAlias"
                value={wikeAlias}
                maxLength={10}
                placeholder="고객사 별칭을 입력하세요(숫자만)"
                onChange={handleWikeAlias}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    searchWikeCustomer();
                  }
                }}
              />
              <button
                type="button"
                className="shrink-0 px-3 bg-teal-500 hover:bg-teal-700 text-white rounded disabled:bg-teal-300"
                onClick={searchWikeCustomer}
                disabled={wikeSearchLoading}
              >
                {wikeSearchLoading ? "검색중" : "검색"}
              </button>
            </div>
            {selectedIrCode && (
              <div className="text-xs text-teal-700 mt-1">
                선택된 면접비코드: {selectedIrCode}
              </div>
            )}
            {wikeResolved && !selectedIrCode && (
              <div className="text-xs text-gray-500 mt-1">
                검색 결과가 없어 신규로 등록됩니다
              </div>
            )}
          </div>
        </div>
        {isTax === 0 && (
          <div className="col-span-2 text-center py-2">
            할부개월수(카드결제시)를 확인하려면 결제방식을 선택하세요
          </div>
        )}
        {isTax === 2 && (
          <>
            <div className="flex justify-start gap-2">
              <div className="py-1 w-[128px]">예약 번호</div>
              <div className="w-full relative">
                <input
                  type="text"
                  className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
                  id="resNo"
                  value={resNo}
                  placeholder="예약번호를 입력하세요"
                  onChange={e => setResNo(e.currentTarget.value)}
                  maxLength={10}
                />
              </div>
            </div>
            <div className="flex justify-start gap-2">
              <div className="py-1 w-[128px]">승인 번호</div>
              <div className="w-full relative">
                <input
                  type="text"
                  className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
                  id="authNo"
                  value={authNo}
                  placeholder="승인번호를 입력하세요"
                  onChange={e => setAuthNo(e.currentTarget.value)}
                  maxLength={15}
                />
              </div>
            </div>
          </>
        )}
        {isTax === 3 && (
          <div className="col-span-2 text-center py-2">
            선입금에서 차감됩니다
          </div>
        )}
      </div>
      <div>
        <div className="w-full py-1">
          <ReactQuill
            modules={modules}
            theme="snow"
            value={bigo}
            onChange={setBigo}
            className={`p-0 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 top-0 left-0 w-full bg-white h-full ${
              payType === "PG" ||
              payType === "MO" ||
              payType === "HE" ||
              payType === "PE"
                ? ""
                : "quillCustom"
            }`}
            placeholder="기타 메모할 내용을 입력하세요"
          />
        </div>
        <div className="flex justify-center gap-x-2 p-1">
          {payCode ? (
            <button
              className="w-[100px] transition-all duration-300 p-1 bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-white rounded-lg"
              onClick={() => modify()}
            >
              수정하기
            </button>
          ) : (
            <button
              className="w-[100px] transition-all duration-300 p-1 bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-white rounded-lg"
              onClick={() => submit()}
            >
              저장하기
            </button>
          )}
          <button
            className="w-[100px] transition-all duration-300 p-1 border border-gray-700 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 text-gray-700 hover:text-gray-500 rounded-lg"
            onClick={() => cancelInput()}
          >
            초기화
          </button>
          {payCode && (
            <button
              className="w-[100px] transition-all duration-300 p-1 bg-rose-500 hover:bg-rose-700 border-rose-500 hover:border-rose-700 text-white rounded-lg"
              onClick={() => deleteIt()}
            >
              삭제
            </button>
          )}
        </div>
      </div>
      {wikeSearchOpen && (
        <>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 py-3 px-4 w-[min(640px,calc(100vw-32px))] max-h-[70vh] overflow-hidden bg-white rounded-lg drop-shadow-xl modalWrap flex flex-col gap-3">
            <h3 className="text-lg font-bold">위케 고객사 검색</h3>
            <p className="text-sm text-gray-600">
              별칭 {wikeAlias} 검색 결과 {wikeSearchList.length}건
            </p>
            {wikeSearchList.length > 0 ? (
              <div className="min-h-0 flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
                {wikeSearchList.map(item => (
                  <button
                    type="button"
                    key={`${item.id}-${item.ir_code}`}
                    className="w-full text-left border border-gray-200 hover:border-teal-500 hover:bg-teal-50 rounded p-2"
                    onClick={() => selectWikeRecord(item)}
                  >
                    <div className="font-bold">{item.ir_code || "-"}</div>
                    <div>
                      {(Array.isArray(item.company_name)
                        ? item.company_name.filter(Boolean).join(", ")
                        : "") || "-"}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      별칭{" "}
                      {Array.isArray(item.com_name_alias)
                        ? item.com_name_alias.join(", ")
                        : "-"}
                      {" · "}
                      {item.inc_date || "-"}
                      {" · "}
                      {Number(item.inc_cash || 0).toLocaleString()}원
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-gray-600">
                <p className="mb-3">검색 결과가 없습니다.</p>
                <button
                  type="button"
                  className="px-3 py-2 bg-teal-500 hover:bg-teal-700 text-white rounded"
                  onClick={addNewWikeCustomer}
                >
                  새로 추가하기
                </button>
              </div>
            )}
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-700 text-white p-2 rounded-lg"
              onClick={() => setWikeSearchOpen(false)}
            >
              창닫기
            </button>
          </div>
          <div
            className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen overflow-hidden modalBg bg-black bg-opacity-50"
            onClick={() => setWikeSearchOpen(false)}
          />
        </>
      )}
    </div>
  );
}

export default InputDeposit;
