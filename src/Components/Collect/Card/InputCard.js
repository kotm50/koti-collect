import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../../Reducer/userSlice";

function InputCard(props) {
  const navi = useNavigate();
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [cardCode, setCardCode] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardCom, setCardCom] = useState("");
  const [expM, setExpM] = useState("");
  const [expY, setExpY] = useState("");
  const [owner, setOwner] = useState("");
  const [pwd, setPwd] = useState("");
  const [cardType, setCardType] = useState("");
  const [individual, setIndividual] = useState("");
  const [corporation, setCorporation] = useState("");

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

  const monthChk = event => {
    const value = event.target.value;
    if (Number(value) > 12 || value === "00") {
      setExpM("");
      monthRef.current.focus();
      return alert("유효기간 입력이 잘못되었습니다. 다시 입력하세요");
    }
  };

  // 입력값 변경 핸들러
  const handleCardNum = event => {
    const value = event.target.value;
    /*
    // 숫자와 하이픈(-)만 허용
    const filteredValue = value.replace(/[^0-9-]/g, "");
    */
    setCardNum(value);
  };

  // 입력값 변경 핸들러
  const handleCorp = event => {
    const value = event.target.value;
    // 숫자와 하이픈(-)만 허용
    //const filteredValue = value.replace(/[^0-9-]/g, "");
    setCorporation(value);
  };

  const handleIndi = event => {
    const value = event.target.value;
    // 숫자만 허용
    //const filteredValue = value.replace(/[^0-9]/g, "");
    setIndividual(value);
  };

  const handleExp = e => {
    const id = e.target.id;
    // 숫자와 쉼표를 제외한 모든 문자 제거
    const numericValue = e.target.value.replace(/[^0-9]/g, "");

    // 숫자만 입력받기 위한 정규식 검사
    if (/^\d*$/.test(numericValue)) {
      switch (id) {
        case "exp1":
          setExpY(numericValue);
          break;
        case "exp":
          setExpM(numericValue);
          if (numericValue.length === 2) {
            yearRef.current.focus();
          }
          break;
        case "password":
          setPwd(numericValue);
          break;
        // 기타 필요한 case 추가
        default:
        // 기본 동작 처리 (옵션)
      }
    }
  };

  // 입력값이 숫자만 포함하고 15자리 또는 16자리인지 확인하고, 형식에 맞게 하이픈 추가
  /*
  const formatCardNumber = value => {
    // 숫자만 있는지 확인
    if (/^\d+$/.test(value)) {
      if (value.length > 16) {
        // 숫자가 16자리를 초과하는 경우
        alert("번호가 잘못되었습니다. 확인 후 다시 입력해 주세요");
        return ""; // 입력값을 변경하지 않고 반환
      } else if (value.length === 15) {
        // 15자리 숫자 형식
        return value.replace(/(\d{4})(\d{6})(\d{5})/, "$1-$2-$3");
      } else if (value.length === 16) {
        // 16자리 숫자 형식
        return value.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1-$2-$3-$4");
      }
    }
    return value; // 조건에 맞지 않는 경우 원래 값 반환
  };
  */

  // 포커스가 입력창에서 벗어났을 때 핸들러

  const handleBlur = e => {
    setCardNum(e.target.value.trim());
    //setCardNum(formatCardNumber(cardNum));
  };

  const handleCardType = event => {
    setCardType(event.target.value);
    setIndividual("");
    setCorporation("");
  };

  useEffect(() => {
    if (props.edit === null) {
      setCompanyName(props.companyName);
      setCompanyCode(props.companyCode);
    }
    if (props.companyCode === "" && props.companyName === "") {
      setCardCom("");
      setCardCode("");
      setCardNum("");
      setExpM("");
      setExpY("");
      setOwner("");
      setPwd("");
      setCardType("");
      setIndividual("");
      setCorporation("");
      setCompanyCode("");
      setCompanyName("");
    }
    //eslint-disable-next-line
  }, [props.companyName, props.companyCode]);

  useEffect(() => {
    if (props.edit !== null) {
      const exp = props.edit.cardExp.split("/");
      exp.forEach(element => {
        if (13 > Number(element) > 0) {
          setExpM(element);
        } else {
          setExpY(element);
        }
      });
      setCompanyCode(props.edit.companyCode || "");
      setCompanyName(props.edit.companyBranch || "");
      setCardCom(props.edit.cardComp || "");
      setCardCode(props.edit.cardCode || "");
      setCardNum(props.edit.cardNum || "");
      setOwner(props.edit.cardOwner || "");
      setPwd(props.edit.cardPwd || "");
      setCardType(props.edit.cardType || "");
      setIndividual(props.edit.individual || "");
      setCorporation(props.edit.corporation || "");
      props.setInputOn(true);
    }
    //eslint-disable-next-line
  }, [props.edit]);

  const testIt = () => {
    if (companyName === "") {
      return "고객사 지점명을 입력하세요";
    }
    if (cardNum === "") {
      return "카드번호를 입력하세요";
    }
    if (cardCom === "") {
      return "카드사를 입력하세요";
    }
    if (expM === "" || expY === "") {
      return "유효기간을 입력하세요";
    }
    if (owner === "") {
      return "카드 소유주를 입력하세요";
    }
    if (cardType === "") {
      return "개인/법인카드 여부를 선택하세요";
    }
    return "완료";
  };

  const saveIt = async () => {
    const result = await testIt();
    if (result !== "완료") {
      return alert(result);
    }
    const cardExp = `${expY}/${expM}`;
    let data = {
      companyCode: companyCode === "" ? null : companyCode.trim(),
      cardComp: cardCom === "" ? null : cardCom.trim(),
      cardNum: cardNum === "" ? null : cardNum.trim(),
      cardExp: cardExp === "" ? null : cardExp.trim(),
      individual: individual === "" ? null : individual,
      corporation: corporation === "" ? null : corporation,
      cardOwner: owner === "" ? null : owner.trim(),
      cardPwd: pwd === "" ? null : pwd.trim(),
      cardType: cardType === "" ? null : cardType,
    };
    if (cardCode !== "") {
      data.cardCode = cardCode.trim();
    }
    if (cardCode === "") {
      await axios
        .post("/api/v1/comp/add/card", data, {
          headers: { Authorization: user.accessToken },
        })
        .then(res => {
          alert(res.data.message);
          if (res.data.code === "E999" || res.data.code === "E403") {
            logout();
            return false;
          }
          if (res.data.code === "C000") {
            props.setEdit(null);
            props.getCardList(companyCode);
            setCardCom("");
            setCardCode("");
            setCardNum("");
            setExpM("");
            setExpY("");
            setOwner("");
            setPwd("");
            setCardType("");
            setIndividual("");
            setCorporation("");
            setCompanyName("");
            setCompanyCode("");
          }
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      await axios
        .patch("/api/v1/comp/upt/card", data, {
          headers: { Authorization: user.accessToken },
        })
        .then(res => {
          alert(res.data.message);
          if (res.data.code === "E999" || res.data.code === "E403") {
            logout();
            return false;
          }
          if (res.data.code === "C000") {
            props.setEdit(null);
            props.getCardList(companyCode);
            setCardCom("");
            setCardCode("");
            setCardNum("");
            setExpM("");
            setExpY("");
            setOwner("");
            setPwd("");
            setCardType("");
            setIndividual("");
            setCorporation("");
            setCompanyName("");
            setCompanyCode("");
            props.setCompanyCode("");
            props.setCompanyName("");
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  };

  const cancelInput = () => {
    const confirm = window.confirm("입력한 모든 내용을 초기화 합니다");
    if (!confirm) {
      return false;
    }
    props.setEdit(null);
    props.cancelSearch();
    setCardCom("");
    setCardCode("");
    setCardNum("");
    setExpM("");
    setExpY("");
    setOwner("");
    setPwd("");
    setCardType("");
    setIndividual("");
    setCorporation("");
    setCompanyName("");
    setCompanyCode("");
    props.setCompanyCode("");
    props.setCompanyName("");
  };

  const deleteIt = async () => {
    const confirm = window.confirm("카드를 완전히 삭제할까요?");
    if (!confirm) {
      return false;
    }
    const data = { cardCode: cardCode };
    await axios
      .delete("/api/v1/comp/del/card", {
        headers: { Authorization: user.accessToken },
        data: data,
      })
      .then(res => {
        alert(res.data.message);
        props.setEdit(null);
        setCardCom("");
        setCardCode("");
        setCardNum("");
        setExpM("");
        setExpY("");
        setOwner("");
        setPwd("");
        setCardType("");
        setIndividual("");
        setCorporation("");
        setCompanyName("");
        setCompanyCode("");
        props.setCompanyCode("");
        props.setCompanyName("");
        props.getCardList(companyCode);
      })
      .catch(e => console.log(e));
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-y-2 gap-x-1 pr-4">
        <div className="flex justify-start gap-2">
          <div className="py-1 w-[144px] text-right">
            <label htmlFor="companyName">고객사 지점명</label>
          </div>
          <div className="w-full">
            <input
              type="text"
              id="companyName"
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              value={companyName}
              placeholder="상단창에서 고객사 지점명을 입력하세요"
              data-comcode={companyCode}
              disabled
            />
          </div>
        </div>
        <div className="flex justify-start gap-2">
          <div className="py-1 w-[144px] text-right">
            <label htmlFor="cardNum">카드번호</label>
          </div>
          <div className="w-full">
            <input
              type="text"
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              id="cardNum"
              value={cardNum}
              placeholder="(숫자, 하이픈(-)만 입력가능)"
              onChange={handleCardNum}
              onBlur={handleBlur}
            />
          </div>
        </div>
        <div className="flex justify-start gap-2">
          <div className="py-1 w-[144px] text-right">
            <label htmlFor="cardCom">카드사</label>
          </div>
          <div className="w-full">
            <input
              type="text"
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              id="cardCom"
              value={cardCom}
              placeholder="카드사를 입력해 주세요"
              maxLength={8}
              onChange={e => setCardCom(e.currentTarget.value)}
            />
          </div>
        </div>
        <div className="flex justify-start gap-2">
          <div className="py-1 w-[144px] text-right">
            <label htmlFor="exp">유효기간</label>
          </div>
          <div className="w-full grid grid-cols-11 gap-0">
            {" "}
            <div className="w-full relative col-span-5">
              <input
                type="text"
                className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full "
                id="exp1"
                ref={yearRef}
                value={expY}
                placeholder="유효기간 연"
                onChange={handleExp}
                maxLength={2}
              />
              {expY !== "" && !isNaN(expY) && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm">
                  년
                </div>
              )}
            </div>
            <span className="py-1 text-center">/</span>
            <div className="w-full relative col-span-5">
              <input
                type="text"
                className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full "
                id="exp"
                ref={monthRef}
                value={expM}
                placeholder="유효기간 월"
                onChange={handleExp}
                onBlur={monthChk}
                maxLength={2}
              />
              {expM !== "" && !isNaN(expM) && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm">
                  월
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-start gap-2">
          <div className="py-1 w-[144px] text-right">
            <label htmlFor="owner">카드 소유주</label>
          </div>
          <div className="w-full">
            <input
              type="text"
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              id="owner"
              value={owner}
              placeholder="명의자 이름을 입력하세요"
              onChange={e => setOwner(e.currentTarget.value)}
            />
          </div>
        </div>
        <div className="flex justify-start gap-2">
          <div className="py-1 w-[144px] text-right">
            <label htmlFor="password">카드 비밀번호</label>
          </div>
          <div className="w-full">
            <input
              type="text"
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              id="password"
              value={pwd}
              placeholder="비밀번호 앞 2자리"
              onChange={handleExp}
              maxLength={2}
            />
          </div>
        </div>
        <div className="flex justify-start gap-2">
          <div className="py-1 w-[144px] text-right">
            <label htmlFor="cardType">개인/법인</label>
          </div>
          <div className="w-full">
            <select
              className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
              id="cardType"
              value={cardType}
              placeholder="비밀번호 앞 2자리"
              onChange={handleCardType}
              maxLength={2}
            >
              <option value="">-선택-</option>
              <option value="I">개인</option>
              <option value="C">법인</option>
            </select>
          </div>
        </div>
        {cardType === "C" ? (
          <div className="flex justify-start gap-2">
            <div className="py-1 w-[144px] text-right">
              <label htmlFor="corp">사업자 번호</label>
            </div>
            <div className="w-full">
              <input
                type="text"
                className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
                id="corp"
                value={corporation}
                placeholder="법인 업체 사업자번호"
                onChange={handleCorp}
              />
            </div>
          </div>
        ) : cardType === "I" ? (
          <div className="flex justify-start gap-2">
            <div className="py-1 w-[144px] text-right">
              <label htmlFor="indi">생년월일</label>
            </div>
            <div className="w-full">
              <input
                type="text"
                className="p-1 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
                id="indi"
                value={individual}
                placeholder="카드 소유주 생년월일 6자리"
                onChange={handleIndi}
              />
            </div>
          </div>
        ) : (
          <div className="p-1">개인카드/법인카드 여부를 선택하세요</div>
        )}
      </div>
      <div className="flex justify-center gap-x-2 p-1 mt-2">
        <button
          className="w-[100px] transition-all duration-300 p-1 bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-white rounded-lg"
          onClick={() => saveIt()}
        >
          저장하기
        </button>
        <button
          className="w-[100px] transition-all duration-300 p-1 border border-gray-700 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 text-gray-700 hover:text-gray-500 rounded-lg"
          onClick={() => cancelInput()}
        >
          초기화
        </button>
        {cardCode !== "" && (
          <button
            className="w-[100px] transition-all duration-300 p-1 bg-rose-500 hover:bg-rose-700 border-rose-500 hover:border-rose-700 text-white rounded-lg"
            onClick={() => deleteIt()}
          >
            삭제
          </button>
        )}
      </div>
    </>
  );
}

export default InputCard;
