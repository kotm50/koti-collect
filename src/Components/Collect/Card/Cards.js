import React from "react";

function Cards(props) {
  const formatDate = date => {
    const currentDate = new Date(date);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // 월을 2자리 숫자로 표현하고, 1을 01로 변경
    const day = String(currentDate.getDate()).padStart(2, "0"); // 일을 2자리 숫자로 표현하고, 1을 01로 변경
    return `${year}-${month}-${day}`;
  };
  return (
    <>
      <table id="mainTable" className="w-full">
        <thead>
          <tr className="bg-orange-700 text-center text-white">
            <td className="border p-1">고객사</td>
            <td className="border p-1">카드사</td>
            <td className="border p-1">소유주</td>
            <td className="border p-1">카드번호</td>
            <td className="border p-1">비밀번호</td>
            <td className="border p-1">생년월일(개인)</td>
            <td className="border p-1">사업자번호(법인)</td>
            <td className="border p-1">등록일</td>
          </tr>
        </thead>
        <tbody>
          {props.cardList.map((card, idx) => (
            <tr
              key={idx}
              className="bg-white text-center hover:cursor-pointer"
              onClick={() => props.setEdit(card)}
            >
              <td className="border p-1">
                {card.companyName} {card.companyBranch}지점
              </td>
              <td className="border p-1">{card.cardComp}</td>
              <td className="border p-1">{card.cardOwner}</td>
              <td className="border p-1">{card.cardNum}</td>
              <td className="border p-1">{card.cardPwd}</td>
              <td className="border p-1">{card.individual}</td>
              <td className="border p-1">{card.corporation}</td>
              <td className="border p-1">{formatDate(card.regDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Cards;
