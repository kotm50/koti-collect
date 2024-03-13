import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import queryString from "query-string";
import sorry from "../../../Asset/sorry.png";
import { FaRegTrashAlt } from "react-icons/fa";

import dayjs from "dayjs";
import "dayjs/locale/ko"; //한국어
import Pagenate from "../../Layout/Pagenate";
import axiosInstance from "../../../Api/axiosInstance";

function List() {
  dayjs.locale("ko");
  const user = useSelector(state => state.user);
  const navi = useNavigate();
  const thisLocation = useLocation();
  const pathName = thisLocation.pathname;
  const { bid } = useParams();
  const parsed = queryString.parse(thisLocation.search);
  const page = parsed.page || 1;
  const searchKeyword = parsed.searchKeyword || null;
  const delYn = parsed.delYn || "N";
  const [postList, setPostList] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [pagenate, setPagenate] = useState([]);

  useEffect(() => {
    setTotalPage(1);
    setPagenate([]);
    if (bid === null || bid === undefined || bid === "") {
      alert("잘못된 경로로 접근하셨습니다");
      navi("/");
    }
    getList(bid, page, searchKeyword, delYn);
    //eslint-disable-next-line
  }, [thisLocation]);

  const loadReset = () => {
    setPostList([]);
    setLoaded(false);
  };

  const getList = async (bid, page, searchKeyword, delYn) => {
    await loadReset();
    let pageNum = 1;
    if (page) {
      pageNum = Number(page);
    }
    let data = {
      boardId: bid,
      page: pageNum,
      size: 5,
      delYn: delYn,
    };
    if (searchKeyword) {
      data.searchKeyword = searchKeyword;
    }
    await axiosInstance
      .post("/api/v1/board/admin/post/list", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          navi("/");
          return false;
        }
        if (res.data.code === "C000") {
          setPostList(res.data.postList);
          const totalP = res.data.totalPages;
          setTotalPage(res.data.totalPages);
          const pagenate = generatePaginationArray(page, totalP);
          setPagenate(pagenate);
        }
        setLoaded(true);
      })
      .catch(e => {
        console.log(e);
      });

    function generatePaginationArray(currentPage, totalPage) {
      let paginationArray = [];

      // 최대 페이지가 4 이하인 경우
      if (Number(totalPage) <= 4) {
        for (let i = 1; i <= totalPage; i++) {
          paginationArray.push(i);
        }
        return paginationArray;
      }

      // 현재 페이지가 1 ~ 3인 경우
      if (Number(currentPage) <= 3) {
        return [1, 2, 3, 4, 5];
      }

      // 현재 페이지가 totalPage ~ totalPage - 2인 경우
      if (Number(currentPage) >= Number(totalPage) - 2) {
        return [
          Number(totalPage) - 4,
          Number(totalPage) - 3,
          Number(totalPage) - 2,
          Number(totalPage) - 1,
          Number(totalPage),
        ];
      }

      // 그 외의 경우
      return [
        Number(currentPage) - 2,
        Number(currentPage) - 1,
        Number(currentPage),
        Number(currentPage) + 1,
        Number(currentPage) + 2,
      ];
    }
  };

  const getDate = date => {
    return dayjs(new Date(date)).format("YYYY-MM-DD");
  };

  const getPostNum = num => {
    return num + (Number(page) - 1) * 20 + 1;
  };

  return (
    <div className="mx-4">
      {loaded ? (
        <>
          <div className="flex flex-row justify-between py-2">
            <h3 className="text-center font-bold text-xl">
              회의록 게시판{delYn === "Y" && " - 휴지통"}
            </h3>
          </div>
          <div className="border-y border-black bg-blue-100 flex justify-between gap-x-2 p-2">
            <div className="w-[64px] text-center">번호</div>
            <div className="w-full text-center">제목</div>
            <div className="w-[200px] text-center">작성자</div>
            <div className="w-[200px] text-center">등록일</div>
          </div>
          {postList.length > 0 ? (
            <div className="border-b border-black">
              {postList.map((post, idx) => (
                <Link to={`/board/detail/${bid}/${post.postId}`} key={idx}>
                  <div
                    className={`border-y flex justify-between gap-x-2 p-2 ${
                      idx % 2 === 0 ? "bg-blue-50" : "bg-white"
                    } hover:bg-blue-100 hover:text-rose-500`}
                  >
                    <div className="w-[64px] text-center">
                      {getPostNum(idx)}
                    </div>
                    <div className="w-full text-center">{post.title}</div>
                    <div className="w-[200px] text-center">{post.userName}</div>
                    <div className="w-[200px] text-center">
                      {getDate(post.regDate)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-2xl text-bold text-center py-10  bg-white border-b border-black">
              <img
                src={sorry}
                className="mx-auto w-[240px] h-auto mb-10"
                alt="오류"
              />
              조회 된 내용이 없습니다
            </div>
          )}

          <div className="flex justify-between py-2">
            <div className="flex justify-start">
              {delYn === "N" ? (
                <Link
                  to={`/board/write/${bid}`}
                  className="py-2 px-4 bg-green-500 hover:bg-green-700 text-center text-white rounded drop-shadow hover:drop-shadow-lg"
                >
                  글쓰기
                </Link>
              ) : null}
            </div>
            {user.admin ? (
              <Link
                to={`/board/list/${bid}?delYn=${delYn === "N" ? "Y" : "N"}`}
                className={`py-2 px-4 hover:bg-gray-100 rounded drop-shadow hover:drop-shadow-lg ${
                  delYn === "N"
                    ? "bg-white"
                    : "bg-rose-500 text-white hover:text-black"
                }`}
                title={delYn === "N" ? "삭제예정 글 보기" : "전체 글 보기"}
              >
                <FaRegTrashAlt className="inline mb-[1px]" />
              </Link>
            ) : null}
          </div>
          <Pagenate
            page={Number(page)}
            keyword={searchKeyword}
            delYn={delYn}
            totalPage={Number(totalPage)}
            pagenate={pagenate}
            pathName={pathName}
          />
        </>
      ) : (
        <div>목록을 불러오고 있습니다</div>
      )}
    </div>
  );
}

export default List;
