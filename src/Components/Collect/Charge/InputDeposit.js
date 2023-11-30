import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ReactQuill from "react-quill";
import { modules } from "../../Layout/QuillModule";
import "react-quill/dist/quill.snow.css";

function InputDeposit(props) {
  const navi = useNavigate();
  const [companyCode, setCompanyCode] = useState("");
  const [commCode, setCommCode] = useState(null);
  const [payCode, setPayCode] = useState(null);

  const [payType, setPayType] = useState("D");

  const [memo, setMemo] = useState("");

  const [resNo, setResNo] = useState("");
  const [authNo, setAuthNo] = useState("");

  const [payerName, setPayerName] = useState("");
  const [paidAd, setPaidAd] = useState("0");
  const [paidComm, setPaidComm] = useState("0");
  const [paidIntvCare, setPaidIntvCare] = useState("0");
  const [paidCommCare, setPaidCommCare] = useState("0");

  const [realPaidAd, setRealPaidAd] = useState("");
  const [realPaidComm, setRealPaidComm] = useState("");
  const [realPaidIntvCare, setRealPaidIntvCare] = useState("");
  const [realPaidCommCare, setRealPaidCommCare] = useState("");

  const [depositType, setDepositType] = useState("");
  const [cardCode, setCardCode] = useState("");

  const [paidDate, setPaidDate] = useState("");

  const [cardList, setCardList] = useState([]);

  const submit = async () => {
    const result = await tester();
    if (result !== "완료") {
      return alert(result);
    } else {
      const data = {
        commCode: commCode,
        cardCode: cardCode,
        payType: depositType,
        paidAd: realPaidAd,
        paidComm: realPaidComm,
        paidIntvCare: realPaidIntvCare,
        paidCommCare: realPaidCommCare,
        paidDate: paidDate,
        resNo: resNo,
        authNo: authNo,
        payerName: payerName,
        bigo: memo,
      };
      await axios
        .post("/api/v1/comp/add/pay", data, {
          headers: { Authorization: props.user.accessToken },
        })
        .then(res => {
          alert(res.data.message);
          if (res.data.code === "E999" || res.data.code === "E403") {
            props.logout();
            return false;
          }
          if (res.data.code === "C000") {
            setMemo("");
            props.getFeeList(props.month, props.searchKeyword);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  };
  const tester = () => {
    if (paidDate === "") {
      return "결제일을 입력하세요";
    }
    if (depositType === "") {
      return "결제 방식을 선택하세요";
    }
    if (depositType === "CA" || depositType === "CO") {
      if (payerName === "") {
        return "입금자명을 입력하세요";
      }
    }
    if (depositType === "PG" || depositType === "MO" || depositType === "HE") {
      if (cardCode === "") {
        return "결제 카드를 선택하세요";
      }
    }
    return "완료";
  };

  useEffect(() => {
    if (props.edit !== null) {
      setCompanyCode(props.edit.companyCode || "");
      setCommCode(props.edit.commCode || "");
    }
    setPayCode("");
    //eslint-disable-next-line
  }, [props.edit]);

  useEffect(() => {
    if (companyCode !== "") {
      getCardList();
    } else {
      setCardList([]);
    }
    //eslint-disable-next-line
  }, [companyCode]);

  const getCardList = async () => {
    setCardList([]);
    const data = {
      companyCode: companyCode,
    };
    console.log(data);

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
          console.log(res.data.cardList);
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
          <div className="py-1 w-[128px]">입금/출금</div>
          <div className="w-full relative">
            <select
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              value={payType}
              onChange={e => setPayType(e.currentTarget.value)}
            >
              <option value="D">입금</option>
              <option value="W">출금</option>
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
              value={depositType}
              onChange={e => setDepositType(e.currentTarget.value)}
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
        {depositType === "" ? (
          <div className="p-1">결제방식을 선택해 주세요</div>
        ) : depositType !== "CA" && depositType !== "CO" ? (
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
                      <option value={card.cardCode}>
                        {" "}
                        {card.cardComp} | {card.cardOwner} | {card.cardNum}{" "}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
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
      </div>
      <div>
        <div className="w-full py-1">
          <ReactQuill
            id="quillCustom"
            modules={modules}
            theme="snow"
            value={memo}
            onChange={setMemo}
            className="p-0 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 top-0 left-0 w-full bg-white h-full"
            placeholder="기타 메모할 내용을 입력하세요"
          />
        </div>
        <div className="flex justify-center gap-x-2 p-1">
          <button
            className="w-[100px] transition-all duration-300 p-1 bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-white rounded-lg"
            onClick={() => submit()}
          >
            저장하기
          </button>
          <button
            className="w-[100px] transition-all duration-300 p-1 border border-gray-700 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 text-gray-700 hover:text-gray-500 rounded-lg"
            onClick={() => console.log("초기화")}
          >
            초기화
          </button>
          {payCode && (
            <button
              className="w-[100px] transition-all duration-300 p-1 bg-rose-500 hover:bg-rose-700 border-rose-500 hover:border-rose-700 text-white rounded-lg"
              onClick={() => console.log("삭제")}
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
