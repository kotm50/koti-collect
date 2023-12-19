import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import ReactQuill from "react-quill";
import { modules } from "../../Layout/QuillModule";
import "react-quill/dist/quill.snow.css";
import { clearUser } from "../../../Reducer/userSlice";

function InputDeposit(props) {
  const navi = useNavigate();
  const dispatch = useDispatch();
  const [companyCode, setCompanyCode] = useState("");
  const [commCode, setCommCode] = useState(null);
  const [payCode, setPayCode] = useState(null);

  const [isTax, setIsTax] = useState(0);

  const [prePaid, setPrePaid] = useState("");

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
  const [tax, setTax] = useState("N");
  const [taxDate, setTaxDate] = useState("");

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
    setPrePaid("");
    setPayCode(null);
    setInstallment("N");
    setTax("N");
    setTaxDate("");
    if (props.commCode !== null) {
      setCommCode(props.commCode);
      getCompanyCode(props.commCode);
    }
    //eslint-disable-next-line
  }, [props.commCode]);

  useEffect(() => {
    if (props.payCode !== null) {
      setPayCode(props.payCode);
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
      setPrePaid("");
      setPayCode(null);
      setTax("N");
      setTaxDate("");
    }
    //eslint-disable-next-line
  }, [props.payCode]);

  const getCompanyCode = async cCode => {
    const data = {
      commCode: cCode,
    };
    await axios
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

  const handleTax = e => {
    const value = e.target.value;
    if (value === "N") {
      setTaxDate("");
    }
    setTax(value);
  };

  const getPayed = async pCode => {
    const data = {
      payCode: pCode,
    };

    await axios
      .post("/api/v1/comp/get/detail/pay", data, {
        headers: { Authorization: props.user.accessToken },
      })
      .then(async res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          logout();
          return false;
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
        setBigo(bigo ? unescapeHTML(pay.bigo) : "");
        setPayerName(pay.payerName || "");

        setInstallment(pay.installment || "");
        setTax(pay.taxBillYn);
        setTaxDate(pay.taxBillIssueDate || "");
      })
      .catch(e => console.log(e));
  };

  const logout = async () => {
    await axios
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
    setTax("N");
    setTaxDate("");
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

  const submit = async () => {
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
        taxBillYn: tax === "" ? null : tax,
        taxBillIssueDate: taxDate === "" ? null : taxDate,
      };
      if (payType === "CA" || payType === "CO") {
        data.cardCode = null;
        data.resNo = null;
        data.authNo = null;
      } else if (payType === "PG" || payType === "MO" || payType === "HE") {
        data.payerName = null;
        data.taxBillYn = "N";
        data.taxBillIssueDate = null;
      } else if (payType === "PR") {
        data.payerName = null;
        data.taxBillYn = "N";
        data.taxBillIssueDate = null;
        data.cardCode = null;
        data.resNo = null;
        data.authNo = null;
      }
      await axios
        .post("/api/v1/comp/add/pay", data, {
          headers: { Authorization: props.user.accessToken },
        })
        .then(async res => {
          alert(res.data.message);
          if (res.data.code === "E999" || res.data.code === "E403") {
            props.logout();
            return false;
          }
          if (res.data.code === "C000") {
            setBigo("");

            props.getFeeList(props.month, props.year, props.searchKeyword);
            props.getPayList(commCode);
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
        taxBillYn: tax === "" ? null : tax,
        taxBillIssueDate: taxDate === "" ? null : taxDate,
      };
      if (payType === "CA" || payType === "CO") {
        data.cardCode = null;
        data.resNo = null;
        data.authNo = null;
      } else if (payType === "PG" || payType === "MO" || payType === "HE") {
        data.payerName = null;
        data.taxBillYn = "N";
        data.taxBillIssueDate = null;
      } else if (payType === "PR") {
        data.payerName = null;
        data.taxBillYn = "N";
        data.taxBillIssueDate = null;
        data.cardCode = null;
        data.resNo = null;
        data.authNo = null;
      }
      await axios
        .patch("/api/v1/comp/upt/pay", data, {
          headers: { Authorization: props.user.accessToken },
        })
        .then(async res => {
          alert(res.data.message);
          if (res.data.code === "E999" || res.data.code === "E403") {
            props.logout();
            return false;
          }
          if (res.data.code === "C000") {
            setBigo("");
            props.setCommCode(null);
            props.getFeeList(props.month, props.year, props.searchKeyword);
            props.getPayList(commCode);
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
    setTax("N");
    setTaxDate("");
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
    if (payType === "PG" || payType === "MO" || payType === "HE") {
      if (cardCode === "") {
        return "결제 카드를 선택하세요";
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
    if (payType === "PG" || payType === "MO" || payType === "HE") {
      getCardList(companyCode);
    } else {
      if (payType === "PR") {
        getPrePaid();
      } else {
        setPrePaid("");
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

    await axios
      .post("/api/v1/comp/card/list", data, {
        headers: { Authorization: props.user.accessToken },
      })
      .then(res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          navi("/");
          return false;
        }
        if (res.data.code === "C000") {
          setCardList(res.data.cardList);
        }
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
      await axios
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
    setPayType(value);
  };

  useEffect(() => {
    if (payType === "CA" || payType === "CO") {
      setIsTax(1);
    } else if (payType === "PG" || payType === "MO" || payType === "HE") {
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

    await axios
      .post("/api/v1/comp/prepay/balance", data, {
        headers: { Authorization: props.user.accessToken },
      })
      .then(res => {
        console.log(res);
        if (res.data.code === "C000") {
          setPrePaid(
            Number(res.data.prepay.actualPrepayment).toLocaleString() + " 원"
          );
        } else {
          setPrePaid("선입금 내역이 없습니다");
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  return (
    <div className="flex flex-col justify-between h-[400px] text-sm">
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
              <option value="PR">선입금</option>
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
            <div className="py-1 w-[128px]">선입금 잔액</div>
            <div className="w-full relative py-1">{prePaid}</div>
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
        {isTax === 0 && (
          <div className="col-span-2 text-center py-2">
            세금계산서(현금결제시)/할부개월수(카드결제시)를 확인하려면
            결제방식을 선택하세요
          </div>
        )}
        {isTax === 1 && (
          <>
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
              <div></div>
            )}
          </>
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
              payType === "PG" || payType === "MO" || payType === "HE"
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
    </div>
  );
}

export default InputDeposit;
