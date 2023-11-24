import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";

function Pagenate(props) {
  const [isSearching, setIsSearching] = useState(false);
  const [isGubun, setIsGubun] = useState(false);
  const [isChannel, setIsChannel] = useState(false);
  const [isSelect, setIsSelect] = useState(false);
  const [isAgree, setIsAgree] = useState(false);
  const [isUsable, setIsUsable] = useState(false);
  const [isSearchType, setIsSearchType] = useState(false);
  useEffect(() => {
    if (props.keyword && props.keyword !== "") {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }

    if (props.usable && props.usable !== "") {
      setIsUsable(true);
    } else {
      setIsUsable(false);
    }
    if (props.gubun && props.gubun !== "") {
      setIsGubun(true);
    } else {
      setIsGubun(false);
    }
    if (props.channel && props.channel !== "") {
      setIsChannel(true);
    } else {
      setIsChannel(false);
    }
    if (props.select && props.select !== "") {
      setIsSelect(true);
    } else {
      setIsSelect(false);
    }
    if (props.agree && props.agree !== "") {
      setIsAgree(true);
    } else {
      setIsAgree(false);
    }
    if (props.sType && props.sType !== "") {
      setIsSearchType(true);
    } else {
      setIsSearchType(false);
    }

    //eslint-disable-next-line
  }, [props.page]);
  return (
    <>
      {props.pagenate.length > 1 && (
        <div className="flex flex-row justify-center gap-3 my-5">
          {props.page > 2 && (
            <Link
              to={`${props.pathName}?page=1${
                isSearching ? `&keyword=${props.keyword}` : ""
              }${isSelect ? `&select=${props.select}` : ""}${
                isGubun ? `&gubun=${props.gubun}` : ""
              }${isChannel ? `&channel=${props.channel}` : ""}${
                isAgree ? `&agree=${props.agree}` : ""
              }${isSearchType ? `&sType=${props.sType}` : ""}${
                isUsable ? `&usable=${props.usable}` : ""
              }`}
              state={{ log: props.log }}
              className="transition duration-300 ease-in-out pageButton hover:scale-110 hidden xl:block"
            >
              <FaAngleDoubleLeft size={20} />
            </Link>
          )}

          {props.page > 1 && (
            <Link
              to={`${props.pathName}?page=${props.page - 1}${
                isSearching ? `&keyword=${props.keyword}` : ""
              }${isSelect ? `&select=${props.select}` : ""}${
                isGubun ? `&gubun=${props.gubun}` : ""
              }${isChannel ? `&endDate=${props.endDate}` : ""}${
                isAgree ? `&agree=${props.agree}` : ""
              }${isSearchType ? `&sType=${props.sType}` : ""}${
                isUsable ? `&usable=${props.usable}` : ""
              }`}
              state={{ log: props.log }}
              className="transition duration-300 ease-in-out pageButton hover:scale-110"
            >
              <FaAngleLeft size={20} />
            </Link>
          )}
          <div className="flex justify-center gap-3">
            {props.pagenate.map((pageNum, idx) => (
              <Link
                to={`${props.pathName}?page=${pageNum}${
                  isSearching ? `&keyword=${props.keyword}` : ""
                }${isSelect ? `&select=${props.select}` : ""}${
                  isGubun ? `&gubun=${props.gubun}` : ""
                }${isChannel ? `&endDate=${props.endDate}` : ""}${
                  isAgree ? `&agree=${props.agree}` : ""
                }${isSearchType ? `&sType=${props.sType}` : ""}${
                  isUsable ? `&usable=${props.usable}` : ""
                }`}
                state={{ log: props.log }}
                key={idx}
                className={`transition duration-300 ease-in-out pageButton hover:scale-110 ${
                  props.page === pageNum ? "selectedPage" : null
                }`}
              >
                <span>{pageNum}</span>
              </Link>
            ))}
          </div>
          {props.page < props.totalPage && (
            <Link
              to={`${props.pathName}?page=${props.page + 1}${
                isSearching ? `&keyword=${props.keyword}` : ""
              }${isSelect ? `&select=${props.select}` : ""}${
                isGubun ? `&gubun=${props.gubun}` : ""
              }${isChannel ? `&endDate=${props.endDate}` : ""}${
                isAgree ? `&agree=${props.agree}` : ""
              }${isSearchType ? `&sType=${props.sType}` : ""}${
                isUsable ? `&usable=${props.usable}` : ""
              }`}
              state={{ log: props.log }}
              className="transition duration-300 ease-in-out pageButton hover:scale-110"
            >
              <FaAngleRight size={20} />
            </Link>
          )}
          {props.page < props.totalPage && (
            <Link
              to={`${props.pathName}?page=${props.totalPage}${
                isSearching ? `&keyword=${props.keyword}` : ""
              }${isSelect ? `&select=${props.select}` : ""}${
                isGubun ? `&gubun=${props.gubun}` : ""
              }${isChannel ? `&endDate=${props.endDate}` : ""}${
                isAgree ? `&agree=${props.agree}` : ""
              }${isSearchType ? `&sType=${props.sType}` : ""}${
                isUsable ? `&usable=${props.usable}` : ""
              }`}
              state={{ log: props.log }}
              className="transition duration-300 ease-in-out pageButton hover:scale-110 hidden xl:block"
            >
              <FaAngleDoubleRight size={20} />
            </Link>
          )}
        </div>
      )}
    </>
  );
}

export default Pagenate;
