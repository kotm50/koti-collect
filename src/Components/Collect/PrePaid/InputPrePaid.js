import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import InputCompanyList from "./InputCompanyList";
import axios from "axios";
import { clearUser } from "../../../Reducer/userSlice";

function InputPrePaid(props) {
  const navi = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [companyListOn, setCompanyListOn] = useState(false);
  const [bigo, setBigo] = useState("");
  const [payType, setPayType] = useState("");
  const [cost, setCost] = useState("0");
  const [realCost, setRealCost] = useState("");

  const [tax, setTax] = useState("N");
  const [taxDate, setTaxDate] = useState("");

  const [resNo, setResNo] = useState("");
  const [authNo, setAuthNo] = useState("");

  const [transactionType, setTransactionType] = useState("");

  const [paidDate, setPaidDate] = useState("");
  const [cardCode, setCardCode] = useState("");
  const [cardList, setCardList] = useState([]);
  const comNameRef = useRef(null);

  const handleTax = e => {
    const value = e.target.value;
    if (value === "N") {
      setTaxDate("");
    }
    setTax(value);
  };

  useEffect(() => {
    if (companyCode !== "") {
      getCardList(companyCode);
    } else {
      setCardList([]);
    }
    //eslint-disable-next-line
  }, [companyCode]);

  const getCardList = async cCode => {
    console.log(cCode);
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

  const handlePayType = e => {
    console.log(companyCode);
    setPayType(e.target.value);
    if (payType === "PG" || payType === "MO" || payType === "HE") {
      getCardList(companyCode);
    }
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
        case "prePaidCost":
          setRealCost(numericValue);
          setCost(formattedValue);
          break;
        // 기타 필요한 case 추가
        default:
        // 기본 동작 처리 (옵션)
      }
    }
  };

  const saveIt = async () => {
    const result = await test();
    if (result !== "완료") {
      return alert(result);
    } else {
      let data = {
        companyCode: companyCode,
        prepayment: realCost,
        payType: payType,
        transactionType: transactionType,
        paidDate: paidDate,
      };
      if (payType === "CA" || payType === "CO") {
        data.bigo = bigo;
        data.taxBillYn = tax;
        if (tax === "Y") {
          data.taxBillIssueDate = taxDate;
        }
      } else {
        data.cardCode = cardCode;
      }
      console.log(data);
      await axios
        .post("/api/v1/comp/add/prepay", data, {
          headers: { Authorization: user.accessToken },
        })
        .then(res => {
          console.log(res);
          alert(res.data.message);
          if (res.data.code === "E999" || res.data.code === "E403") {
            logout();
            return false;
          }
          if (res.data.code === "C000") {
            props.getCompanyPrepayList(companyCode, null);
            props.getPrepayList(props.keyword);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  };

  const test = () => {
    if (transactionType === "") {
      return "입금/환급 여부를 선택하세요";
    }
    if (paidDate === "") {
      return "결제일을 입력하세요";
    }
    if (companyCode === "") {
      return "고객사 지점을 선택하세요";
    }
    if (payType === "") {
      return "결제방식을 선택하세요";
    }
    if (cost === "0") {
      return "입금 금액을 입력하세요";
    }
    return "완료";
  };

  useEffect(() => {
    if (props.prepayCode) {
      getPrepaid(props.prepayCode);
    } else {
      setSearchKeyword("");
      setCompanyName("");
      setCompanyCode("");
      setCompanyListOn(false);

      setTax("N");
      setTaxDate("");
      setTransactionType("");

      setPayType("");
      setPaidDate("");
      setCost("0");
      setRealCost("");
      setCardCode("");
      setCardList([]);
    }
    //eslint-disable-next-line
  }, [props.prepayCode]);

  useEffect(() => {
    if (props.companyCode !== null && props.companyName !== null) {
      setCompanyCode(props.companyCode);
      setCompanyName(props.companyName);
    } else {
      setCompanyCode("");
      setCompanyName("");
    }
  }, [props.companyCode, props.companyName]);

  const getPrepaid = async ppCode => {
    const data = {
      prepayCode: ppCode,
    };

    await axios
      .post("/api/v1/comp/prepay/detail", data, {
        headers: { Authorization: props.user.accessToken },
      })
      .then(async res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          navi("/");
          return false;
        }
        if (res.data.code === "C000") {
          console.log(res);
          const prepay = res.data.prepay;
          setCompanyName(`${prepay.companyName} ${prepay.companyBranch}`);
          setCompanyCode(prepay.companyCode);
          setRealCost(prepay.prepayment);
          getFormatCost(prepay.prepayment);
          setPaidDate(prepay.paidDate.split(" ")[0]);
          setPayType(prepay.payType || "");
          setBigo(prepay.bigo);
          setCardCode(prepay.cardCode || "");
          setTransactionType(prepay.transactionType || "");
          setTax(prepay.taxBillYn || "N");
          setTaxDate(prepay.taxBillIssueDate || "");
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const getFormatCost = cost => {
    // 숫자와 쉼표를 제외한 모든 문자 제거
    const numericValue = String(cost).replace(/[^0-9]/g, "");

    // 숫자만 입력받기 위한 정규식 검사
    if (/^\d*$/.test(numericValue)) {
      // 천 단위마다 쉼표 추가
      const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setCost(formattedValue);
    }
  };

  const cancelInput = () => {
    const confirm = window.confirm("입력한 내용을 초기화 할까요?");
    if (!confirm) {
      return false;
    } else {
      setSearchKeyword("");
      setCompanyName("");
      setCompanyCode("");
      setCompanyListOn(false);

      setTax("N");
      setTaxDate("");

      setPayType("");
      setTransactionType("");
      setCost("0");
      setRealCost("");
      setCardCode("");
      setCardList([]);
      setPaidDate("");
      props.setPrepayCode(null);
    }
  };

  const deleteIt = async () => {
    const confirm = window.confirm("수수료 내역을 삭제하시겠습니까?");
    if (confirm) {
      const data = {
        prepayCode: props.prepayCode,
      };
      await axios
        .delete("/api/v1/comp/del/prepay", {
          headers: { Authorization: user.accessToken },
          data: data,
        })
        .then(res => {
          alert(res.data.message);
          if (res.data.code === "C000") {
            setSearchKeyword("");
            setCompanyName("");
            setCompanyCode("");
            setCompanyListOn(false);

            setTax("N");
            setTaxDate("");

            setPayType("");
            setTransactionType("");
            setCost("0");
            setRealCost("");
            setCardCode("");
            setCardList([]);
            setPaidDate("");
            props.setPrepayCode(null);

            props.getCompanyPrepayList(companyCode, null);
            props.getPrepayList(props.keyword);
          }
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      return false;
    }
  };
  const modifyIt = async () => {
    const result = await test();
    if (result !== "완료") {
      return alert(result);
    } else {
      let data = {
        prepayCode: props.prepayCode,
        companyCode: companyCode,
        prepayment: realCost,
        payType: payType,
        transactionType: transactionType,
        paidDate: paidDate,
      };
      if (payType === "CA" || payType === "CO") {
        data.bigo = bigo;
        data.taxBillYn = tax;
        if (tax === "Y") {
          data.taxBillIssueDate = taxDate;
        }
      } else {
        data.cardCode = cardCode;
      }
      console.log(data);
      await axios
        .patch("/api/v1/comp/upt/prepay", data, {
          headers: { Authorization: user.accessToken },
        })
        .then(res => {
          console.log(res);
          alert(res.data.message);
          if (res.data.code === "E999" || res.data.code === "E403") {
            logout();
            return false;
          }
          if (res.data.code === "C000") {
            props.getCompanyPrepayList(companyCode, null);
            props.getPrepayList(props.keyword);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  };

  return (
    <div className="flex flex-col justify-between h-fit px-4 text-sm">
      <div className="grid grid-cols-4 gap-y-2 gap-x-3">
        <div className="flex justify-start gap-2">
          <div className="py-1 w-[144px] text-right">
            구분<span className="text-rose-500">*</span>
          </div>
          <div className="w-full relative">
            <select
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              value={transactionType}
              onChange={e => setTransactionType(e.currentTarget.value)}
            >
              <option value="">구분</option>
              <option value="P">선입금</option>
              <option value="D">환급</option>
            </select>
          </div>
        </div>
        <div className="flex justify-start gap-2">
          <div className="py-1 w-[144px] text-right">
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
          <div className="py-1 w-[144px] text-right">
            입금액<span className="text-rose-500">*</span>
          </div>
          <div className="w-full relative">
            <input
              type="text"
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              id="prePaidCost"
              value={cost}
              placeholder="위촉비 결제금액을 입력하세요(숫자만)"
              onChange={handleNumber}
              onFocus={() => {
                if (cost === "0") {
                  setCost("");
                }
              }}
              onBlur={e => {
                if (e.currentTarget.value === "") {
                  setCost("0");
                }
              }}
            />
            {cost !== "" && cost !== "0" && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                원
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-start gap-2">
          <div className="py-1 w-[144px] text-right">
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
          <div className="py-1 w-[144px] text-right">
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
            </select>
          </div>
        </div>
        {payType === "" ? (
          <div className="py-1">결제방식을 선택해 주세요</div>
        ) : payType !== "CA" && payType !== "CO" ? (
          <>
            {cardList.length > 0 ? (
              <>
                <div className="flex justify-start gap-2">
                  <div className="py-1 w-[144px] text-right">
                    결제카드<span className="text-rose-500">*</span>
                  </div>
                  <div className="w-full relative">
                    <select
                      className="py-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full text-[8pt]"
                      value={cardCode}
                      onChange={e => setCardCode(e.currentTarget.value)}
                    >
                      <option value="">결제카드 선택</option>
                      {cardList.map((card, idx) => (
                        <option value={card.cardCode} key={idx}>
                          {card.cardComp} | {card.cardOwner} | {card.cardNum}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-start gap-2">
                  <div className="py-1 w-[144px] text-right">예약 번호</div>
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
                  <div className="py-1 w-[144px] text-right">승인 번호</div>
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
            ) : (
              <div className="p-1">
                <Link
                  to="/collect/card"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  카드가 없습니다. 여길 눌러 카드를 등록해 주세요
                </Link>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex justify-start gap-2">
              <div className="py-1 w-[144px] text-right">
                입금자명<span className="text-rose-500">*</span>
              </div>
              <div className="w-full relative">
                <input
                  type="text"
                  className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
                  id="bigo"
                  value={bigo}
                  placeholder="입금자명을 입력하세요"
                  onChange={e => setBigo(e.currentTarget.value)}
                />
              </div>
            </div>

            <div className="flex justify-start gap-2">
              <div className="py-1 w-[144px] text-right">세금계산서</div>
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
                <div className="py-1 w-[144px] text-right">발행일</div>
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
      </div>

      <div className="flex justify-center gap-x-2 p-1">
        {props.prepayCode ? (
          <button
            className="w-[100px] transition-all duration-300 p-1 bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-white rounded-lg"
            onClick={() => modifyIt()}
          >
            수정하기
          </button>
        ) : (
          <button
            className="w-[100px] transition-all duration-300 p-1 bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-white rounded-lg"
            onClick={() => saveIt()}
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
        {props.prepayCode && (
          <button
            className="w-[100px] transition-all duration-300 p-1 bg-rose-500 hover:bg-rose-700 border-rose-500 hover:border-rose-700 text-white rounded-lg"
            onClick={() => deleteIt()}
          >
            삭제
          </button>
        )}
      </div>
    </div>
  );
}

export default InputPrePaid;
