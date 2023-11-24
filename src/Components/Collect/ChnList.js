import axios from "axios";
import React from "react";

function ChnList(props) {
  const deleteIt = async () => {
    let confirmIt;
    if (props.com.useYn === "Y") {
      confirmIt = window.confirm("미사용 상태로 전환합니다. 진행할까요?");
    } else {
      confirmIt = window.confirm(
        "완전 삭제시 복구가 불가능 합니다. 진행할까요?"
      );
    }
    if (!confirmIt) {
      return false;
    } else {
      const data = {
        commId: props.com.commId,
      };
      if (props.com.useYn === "Y") {
        await axios
          .patch("/api/v1/comp/usen/comm", data, {
            headers: { Authorization: props.accessToken },
          })
          .then(res => {
            if (res.data.code === "E999" || res.data.code === "E403") {
              alert(res.data.message);
              props.logout();
              return false;
            }
            alert(res.data.message);
            props.setUsable("N");
          })
          .catch(e => {
            console.log(e);
          });
      } else if (props.com.useYn === "N") {
        await axios
          .delete("/api/v1/comp/del/comm", {
            headers: { Authorization: props.accessToken },
            data: data,
          })
          .then(res => {
            alert(res.data.message);
            props.getCommList(props.selectCategory, "N");
          })
          .catch(e => {
            console.log(e);
          });
      }
    }
  };

  const formatDate = date => {
    const currentDate = new Date(date);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // 월을 2자리 숫자로 표현하고, 1을 01로 변경
    const day = String(currentDate.getDate()).padStart(2, "0"); // 일을 2자리 숫자로 표현하고, 1을 01로 변경
    return `${year}-${month}-${day}`;
  };

  const restoreIt = async () => {
    const confirmIt = window.confirm("선택한 채널을 다시 사용하시겠습니까?");
    if (!confirmIt) {
      return false;
    } else {
      const data = {
        commId: props.com.commId,
      };
      await axios
        .patch("/api/v1/comp/usey/comm", data, {
          headers: { Authorization: props.accessToken },
        })
        .then(res => {
          alert(res.data.message);
          props.setUsable("Y");
        })
        .catch(e => {
          console.log(e);
        });
    }
  };
  return (
    <>
      <td className="p-2">{props.com.value}</td>
      <td className="p-2">{props.com.useValue}</td>
      <td className="p-2">{props.com.description}</td>
      <td className="p-2">{formatDate(props.com.regDate)}</td>
      <td className="p-1 grid grid-cols-2 gap-x-1">
        {props.com.useYn === "N" && (
          <button
            className="py-1 px-2 rounded bg-indigo-500 hover:bg-indigo-700 text-white"
            onClick={() => restoreIt()}
          >
            복구
          </button>
        )}
        <button
          className={`py-1 px-2 rounded bg-rose-500 hover:bg-rose-700 text-white ${
            props.com.useYn === "Y" ? "col-span-2" : ""
          }`}
          onClick={() => deleteIt()}
        >
          삭제
        </button>
      </td>
    </>
  );
}

export default ChnList;
