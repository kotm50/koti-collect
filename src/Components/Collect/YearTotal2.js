import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import ExcelJS from "exceljs";
import axiosInstance from "../../Api/axiosInstance";
import MonthlySales2 from "./YearTotal/MonthlySales2";

function YearTotal2() {
  const navi = useNavigate();
  const user = useSelector(state => state.user);
  const thisLocation = useLocation();
  const [totalList, setTotalList] = useState([]);
  const [year, setYear] = useState("");
  const [title, setTitle] = useOutletContext();
  const [jan, setJan] = useState([]);
  const [feb, setFeb] = useState([]);
  const [mar, setMar] = useState([]);
  const [apr, setApr] = useState([]);
  const [may, setMay] = useState([]);
  const [jun, setJun] = useState([]);
  const [jul, setJul] = useState([]);
  const [aug, setAug] = useState([]);
  const [sep, setSep] = useState([]);
  const [oct, setOct] = useState([]);
  const [nov, setNov] = useState([]);
  const [dec, setDec] = useState([]);
  const [countTotal, setCountTotal] = useState(0);
  const [costTotal, setCostTotal] = useState(0);

  const [janTotal, setJanTotal] = useState({
    ad: 0,
    comm: 0,
    care: 0,
    prepay: 0,
    total: 0,
  });
  const [febTotal, setFebTotal] = useState({
    ad: 0,
    comm: 0,
    care: 0,
    prepay: 0,
    total: 0,
  });
  const [marTotal, setMarTotal] = useState({
    ad: 0,
    comm: 0,
    care: 0,
    prepay: 0,
    total: 0,
  });
  const [aprTotal, setAprTotal] = useState({
    ad: 0,
    comm: 0,
    care: 0,
    prepay: 0,
    total: 0,
  });
  const [mayTotal, setMayTotal] = useState({
    ad: 0,
    comm: 0,
    care: 0,
    prepay: 0,
    total: 0,
  });
  const [junTotal, setJunTotal] = useState({
    ad: 0,
    comm: 0,
    care: 0,
    prepay: 0,
    total: 0,
  });
  const [julTotal, setJulTotal] = useState({
    ad: 0,
    comm: 0,
    care: 0,
    prepay: 0,
    total: 0,
  });
  const [augTotal, setAugTotal] = useState({
    ad: 0,
    comm: 0,
    care: 0,
    prepay: 0,
    total: 0,
  });
  const [sepTotal, setSepTotal] = useState({
    ad: 0,
    comm: 0,
    care: 0,
    prepay: 0,
    total: 0,
  });
  const [octTotal, setOctTotal] = useState({
    ad: 0,
    comm: 0,
    care: 0,
    prepay: 0,
    total: 0,
  });
  const [novTotal, setNovTotal] = useState({
    ad: 0,
    comm: 0,
    care: 0,
    prepay: 0,
    total: 0,
  });
  const [decTotal, setDecTotal] = useState({
    ad: 0,
    comm: 0,
    care: 0,
    prepay: 0,
    total: 0,
  });
  useEffect(() => {
    setYear(dayjs(new Date()).format("YYYY"));
    //eslint-disable-next-line
  }, [thisLocation]);

  useEffect(() => {
    if (year !== "") {
      setTitle(`${year}년 코티 고객사별 총 정리`);
      getTotal(year);
    }
    //eslint-disable-next-line
  }, [year]);

  const resetIt = () => {
    setCostTotal(0);
    setCountTotal(0);
    setJanTotal({
      ad: 0,
      comm: 0,
      care: 0,
      prepay: 0,
      total: 0,
    });
    setFebTotal({
      ad: 0,
      comm: 0,
      care: 0,
      prepay: 0,
      total: 0,
    });
    setMarTotal({
      ad: 0,
      comm: 0,
      care: 0,
      prepay: 0,
      total: 0,
    });
    setAprTotal({
      ad: 0,
      comm: 0,
      care: 0,
      prepay: 0,
      total: 0,
    });
    setMayTotal({
      ad: 0,
      comm: 0,
      care: 0,
      prepay: 0,
      total: 0,
    });
    setJunTotal({
      ad: 0,
      comm: 0,
      care: 0,
      prepay: 0,
      total: 0,
    });
    setJulTotal({
      ad: 0,
      comm: 0,
      care: 0,
      prepay: 0,
      total: 0,
    });
    setAugTotal({
      ad: 0,
      comm: 0,
      care: 0,
      prepay: 0,
      total: 0,
    });
    setSepTotal({
      ad: 0,
      comm: 0,
      care: 0,
      prepay: 0,
      total: 0,
    });
    setOctTotal({
      ad: 0,
      comm: 0,
      care: 0,
      prepay: 0,
      total: 0,
    });
    setNovTotal({
      ad: 0,
      comm: 0,
      care: 0,
      prepay: 0,
      total: 0,
    });
    setDecTotal({
      ad: 0,
      comm: 0,
      care: 0,
      prepay: 0,
      total: 0,
    });
    setJan([]);
    setFeb([]);
    setMar([]);
    setApr([]);
    setMay([]);
    setJun([]);
    setJul([]);
    setAug([]);
    setSep([]);
    setOct([]);
    setNov([]);
    setDec([]);
    setTotalList([]);
  };

  const getPercentage = (a, b) => {
    if (b === 0) {
      return "0.00%";
    }

    return ((a / b) * 100).toFixed(2) + "%";
  };

  // 월별 데이터를 가져오는 헬퍼 함수
  const getMonthlyData = (monthArray, companyCode) => {
    const data = monthArray.find(doc => doc.companyCode === companyCode);
    if (data) {
      return {
        ad: Number(data.compMonthPaidAd) || 0,
        comm: Number(data.compMonthPaidComm) || 0,
        care: Number(data.compMonthCare) || 0,
        prepay: Number(data.compMonthPrepayment) || 0,
      };
    }
    return { ad: 0, comm: 0, care: 0, prepay: 0 };
  };

  // 엑셀 파일로 다운로드하는 함수 (ExcelJS 사용)
  const exportToExcel = async () => {
    if (!year || totalList.length === 0) {
      alert("데이터가 없습니다.");
      return;
    }

    // 워크북 생성
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${year}년 총정리`);

    // 헬퍼 함수: 셀 스타일 설정
    const setCellStyle = (cell, options) => {
      const { fill, font, alignment, border, numFmt } = options;

      if (fill) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: fill },
        };
      }

      if (font) {
        cell.font = font;
      }

      if (alignment) {
        cell.alignment = alignment;
      }

      if (border) {
        cell.border = border;
      }

      if (numFmt) {
        cell.numFmt = numFmt;
      }
    };

    // 테두리 스타일 정의
    const thinBorder = {
      top: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } },
    };

    // 첫 번째 행: 제목 및 헤더 (HTML thead 구조와 최대한 동일하게 구성)
    const row1 = worksheet.addRow([]);

    // 제목 (colSpan 5, rowSpan 3) → A1:E3
    row1.getCell(1).value = `${year}년 고객사별 총정리`;
    worksheet.mergeCells(1, 1, 3, 5);
    setCellStyle(row1.getCell(1), {
      fill: "FF000000", // 검정
      font: { bold: true, size: 16, color: { argb: "FFFFFFFF" } },
      alignment: { vertical: "middle", horizontal: "center" },
      border: thinBorder,
    });

    // 횟수 (rowSpan 3) → F1:F3
    row1.getCell(6).value = "횟수";
    worksheet.mergeCells(1, 6, 3, 6);
    setCellStyle(row1.getCell(6), {
      fill: "FFFDE047", // 노란색
      font: { bold: true, color: { argb: "FF000000" } },
      alignment: { vertical: "middle", horizontal: "center" },
      border: thinBorder,
    });

    // 총 매출 (rowSpan 3, 단일 컬럼) → G1:G3
    row1.getCell(7).value = "총 매출";
    worksheet.mergeCells(1, 7, 3, 7);
    setCellStyle(row1.getCell(7), {
      fill: "FFFDE047", // 노란색
      font: { bold: true, color: { argb: "FF000000" } },
      alignment: { vertical: "middle", horizontal: "center" },
      border: thinBorder,
    });

    // 매출 비중 (rowSpan 3) → H1:H3 (HTML과 동일하게 바로 오른쪽 컬럼에 위치)
    row1.getCell(8).value = "매출\n비중";
    worksheet.mergeCells(1, 8, 3, 8);
    setCellStyle(row1.getCell(8), {
      fill: "FFCA8A04", // 진한 노란색
      font: { bold: true, color: { argb: "FF000000" } },
      alignment: { vertical: "middle", horizontal: "center", wrapText: true },
      border: thinBorder,
    });

    // 12개월 헤더 (각 colSpan 4)
    const months = [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ];
    const monthColors = [
      "FF166534", // 초록
      "FF1E40AF", // 파랑
      "FF166534", // 초록
      "FF1E40AF", // 파랑
      "FF166534", // 초록
      "FF1E40AF", // 파랑
      "FF166534", // 초록
      "FF1E40AF", // 파랑
      "FF166534", // 초록
      "FF1E40AF", // 파랑
      "FF166534", // 초록
      "FF1E40AF", // 파랑
    ];
    // 월 헤더: I열(9번 컬럼)부터 시작, 각 4컬럼(colSpan=4)
    months.forEach((month, idx) => {
      const startCol = 9 + idx * 4;
      row1.getCell(startCol).value = month;
      worksheet.mergeCells(1, startCol, 1, startCol + 3);
      setCellStyle(row1.getCell(startCol), {
        fill: monthColors[idx],
        font: { bold: true, size: 12, color: { argb: "FFFFFFFF" } },
        alignment: { vertical: "middle", horizontal: "center" },
        border: thinBorder,
      });
    });

    // 두 번째 행: 월별 합계
    const row2 = worksheet.addRow([]);
    const monthTotals = [
      janTotal.total,
      febTotal.total,
      marTotal.total,
      aprTotal.total,
      mayTotal.total,
      junTotal.total,
      julTotal.total,
      augTotal.total,
      sepTotal.total,
      octTotal.total,
      novTotal.total,
      decTotal.total,
    ];
    monthTotals.forEach((total, idx) => {
      const startCol = 9 + idx * 4;
      row2.getCell(startCol).value = total.toLocaleString();
      worksheet.mergeCells(2, startCol, 2, startCol + 3);
      setCellStyle(row2.getCell(startCol), {
        fill: "FFFFFFFF", // 흰색
        font: { bold: true, color: { argb: "FF000000" } },
        alignment: { vertical: "middle", horizontal: "center" },
        border: thinBorder,
      });
    });

    // 세 번째 행: 월별 세부 헤더
    const row3 = worksheet.addRow([]);
    const detailHeaders = ["광고비", "위촉비", "케어", "선입금"];
    months.forEach((month, monthIdx) => {
      const startCol = 9 + monthIdx * 4;
      detailHeaders.forEach((header, headerIdx) => {
        row3.getCell(startCol + headerIdx).value = header;
        setCellStyle(row3.getCell(startCol + headerIdx), {
          fill: monthColors[monthIdx],
          font: { bold: true, color: { argb: "FFFFFFFF" } },
          alignment: { vertical: "middle", horizontal: "center" },
          border: thinBorder,
        });
      });
    });

    // 네 번째 행: 컬럼명 및 월별 합계 데이터
    const row4 = worksheet.addRow([]);
    // 왼쪽 고정 컬럼
    row4.getCell(1).value = "채널";
    setCellStyle(row4.getCell(1), {
      fill: "FFF3F4F6", // 회색
      font: { bold: true, color: { argb: "FF000000" } },
      alignment: { vertical: "middle", horizontal: "center" },
      border: thinBorder,
    });
    row4.getCell(2).value = "보험사";
    setCellStyle(row4.getCell(2), {
      fill: "FFF3F4F6", // 회색
      font: { bold: true, color: { argb: "FF000000" } },
      alignment: { vertical: "middle", horizontal: "center" },
      border: thinBorder,
    });
    row4.getCell(3).value = "지점";
    setCellStyle(row4.getCell(3), {
      fill: "FFF3F4F6", // 회색
      font: { bold: true, color: { argb: "FF000000" } },
      alignment: { vertical: "middle", horizontal: "center" },
      border: thinBorder,
    });
    row4.getCell(4).value = "담당1";
    setCellStyle(row4.getCell(4), {
      fill: "FFF3F4F6", // 회색
      font: { bold: true, color: { argb: "FF000000" } },
      alignment: { vertical: "middle", horizontal: "center" },
      border: thinBorder,
    });
    row4.getCell(5).value = "담당2";
    setCellStyle(row4.getCell(5), {
      fill: "FFFEF3C7", // 연한 노란색
      font: { bold: true, color: { argb: "FF000000" } },
      alignment: { vertical: "middle", horizontal: "center" },
      border: thinBorder,
    });
    row4.getCell(6).value = countTotal;
    setCellStyle(row4.getCell(6), {
      fill: "FFFDE68A", // 노란색
      font: { bold: true, color: { argb: "FF000000" } },
      alignment: { vertical: "middle", horizontal: "center" },
      border: thinBorder,
    });
    row4.getCell(7).value = costTotal.toLocaleString();
    setCellStyle(row4.getCell(7), {
      fill: "FFFDE68A", // 노란색
      font: { bold: true, color: { argb: "FF000000" } },
      alignment: { vertical: "middle", horizontal: "center" },
      border: thinBorder,
    });
    // 매출 비중 %는 H열(8번 컬럼)에 위치
    row4.getCell(8).value = "100%";
    setCellStyle(row4.getCell(8), {
      fill: "FFFDE68A", // 노란색
      font: { bold: true, color: { argb: "FF000000" } },
      alignment: { vertical: "middle", horizontal: "center" },
      border: thinBorder,
    });

    // 월별 합계 데이터
    const allMonthTotals = [
      janTotal,
      febTotal,
      marTotal,
      aprTotal,
      mayTotal,
      junTotal,
      julTotal,
      augTotal,
      sepTotal,
      octTotal,
      novTotal,
      decTotal,
    ];
    allMonthTotals.forEach((monthTotal, monthIdx) => {
      const startCol = 9 + monthIdx * 4;
      row4.getCell(startCol).value = monthTotal.ad.toLocaleString();
      setCellStyle(row4.getCell(startCol), {
        fill: "FFFFFFFF", // 흰색
        font: { bold: true, color: { argb: "FF000000" } },
        alignment: { vertical: "middle", horizontal: "center" },
        border: thinBorder,
      });
      row4.getCell(startCol + 1).value = monthTotal.comm.toLocaleString();
      setCellStyle(row4.getCell(startCol + 1), {
        fill: "FFFFFFFF", // 흰색
        font: { bold: true, color: { argb: "FF000000" } },
        alignment: { vertical: "middle", horizontal: "center" },
        border: thinBorder,
      });
      row4.getCell(startCol + 2).value = monthTotal.care.toLocaleString();
      setCellStyle(row4.getCell(startCol + 2), {
        fill: "FFFFFFFF", // 흰색
        font: { bold: true, color: { argb: "FF000000" } },
        alignment: { vertical: "middle", horizontal: "center" },
        border: thinBorder,
      });
      row4.getCell(startCol + 3).value = monthTotal.prepay.toLocaleString();
      setCellStyle(row4.getCell(startCol + 3), {
        fill: "FFFFFFFF", // 흰색
        font: { bold: true, color: { argb: "FF000000" } },
        alignment: { vertical: "middle", horizontal: "center" },
        border: thinBorder,
      });
    });

    // 데이터 행들
    totalList.forEach(total => {
      const dataRow = worksheet.addRow([]);

      // 왼쪽 고정 컬럼 데이터
      dataRow.getCell(1).value = total.channel || "";
      setCellStyle(dataRow.getCell(1), {
        fill: "FFF3F4F6", // 회색
        alignment: { vertical: "middle", horizontal: "center" },
        border: thinBorder,
      });
      dataRow.getCell(2).value = total.companyName || "";
      setCellStyle(dataRow.getCell(2), {
        fill: "FFF3F4F6", // 회색
        alignment: { vertical: "middle", horizontal: "center" },
        border: thinBorder,
      });
      dataRow.getCell(3).value = total.companyBranch || "";
      setCellStyle(dataRow.getCell(3), {
        fill: "FFF3F4F6", // 회색
        alignment: { vertical: "middle", horizontal: "center" },
        border: thinBorder,
      });
      dataRow.getCell(4).value = total.manager1 || "";
      setCellStyle(dataRow.getCell(4), {
        fill: "FFF3F4F6", // 회색
        alignment: { vertical: "middle", horizontal: "center" },
        border: thinBorder,
      });
      dataRow.getCell(5).value = total.manager2 || "";
      setCellStyle(dataRow.getCell(5), {
        fill: "FFFEF3C7", // 연한 노란색
        alignment: { vertical: "middle", horizontal: "center" },
        border: thinBorder,
      });
      dataRow.getCell(6).value = total.counter + 1;
      setCellStyle(dataRow.getCell(6), {
        fill: "FFFDE68A", // 노란색
        alignment: { vertical: "middle", horizontal: "center" },
        border: thinBorder,
      });
      dataRow.getCell(7).value = total.costTotal.toLocaleString();
      setCellStyle(dataRow.getCell(7), {
        fill: "FFFDE68A", // 노란색
        alignment: { vertical: "middle", horizontal: "center" },
        border: thinBorder,
      });
      // 매출 비중은 8번 컬럼(H열)에 위치
      dataRow.getCell(8).value = getPercentage(total.costTotal, costTotal);
      setCellStyle(dataRow.getCell(8), {
        fill: "FFFDE68A", // 노란색
        alignment: { vertical: "middle", horizontal: "center" },
        border: thinBorder,
      });

      // 12개월 데이터
      const monthArrays = [
        jan,
        feb,
        mar,
        apr,
        may,
        jun,
        jul,
        aug,
        sep,
        oct,
        nov,
        dec,
      ];
      monthArrays.forEach((monthArray, monthIdx) => {
        const monthData = getMonthlyData(monthArray, total.companyCode);
        const startCol = 9 + monthIdx * 4;
        dataRow.getCell(startCol).value = monthData.ad.toLocaleString();
        setCellStyle(dataRow.getCell(startCol), {
          fill: "FFFFFFFF", // 흰색
          alignment: { vertical: "middle", horizontal: "center" },
          border: thinBorder,
        });
        dataRow.getCell(startCol + 1).value = monthData.comm.toLocaleString();
        setCellStyle(dataRow.getCell(startCol + 1), {
          fill: "FFFFFFFF", // 흰색
          alignment: { vertical: "middle", horizontal: "center" },
          border: thinBorder,
        });
        dataRow.getCell(startCol + 2).value = monthData.care.toLocaleString();
        setCellStyle(dataRow.getCell(startCol + 2), {
          fill: "FFFFFFFF", // 흰색
          alignment: { vertical: "middle", horizontal: "center" },
          border: thinBorder,
        });
        dataRow.getCell(startCol + 3).value = monthData.prepay.toLocaleString();
        setCellStyle(dataRow.getCell(startCol + 3), {
          fill: "FFFFFFFF", // 흰색
          alignment: { vertical: "middle", horizontal: "center" },
          border: thinBorder,
        });
      });
    });

    // 컬럼 너비 설정
    // 1~8열: 채널, 보험사, 지점, 담당1, 담당2, 횟수, 총 매출, 매출 비중
    const columnWidths = [
      10, // 1: 채널
      15, // 2: 보험사
      15, // 3: 지점
      10, // 4: 담당1
      10, // 5: 담당2
      8, // 6: 횟수
      15, // 7: 총 매출
      10, // 8: 매출 비중
    ];
    // 12개월 * 4개 컬럼 (광고비, 위촉비, 케어, 선입금) → 9열부터 56열까지
    for (let i = 0; i < 48; i++) {
      columnWidths.push(12);
    }
    // 각 컬럼 너비 설정
    columnWidths.forEach((width, index) => {
      worksheet.getColumn(index + 1).width = width;
    });

    // 행 높이 설정
    worksheet.getRow(1).height = 30;
    worksheet.getRow(2).height = 30;
    worksheet.getRow(3).height = 30;
    worksheet.getRow(4).height = 30;

    // 파일명 생성 및 다운로드
    const fileName = `${year}년_고객사별_총정리_${dayjs().format(
      "YYYYMMDD_HHmmss"
    )}.xlsx`;
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const getTotal = async year => {
    await resetIt();
    const data = {
      searchYear: year,
    };
    await axiosInstance
      .post("/api/v1/comp/year/total/list", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(async res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          navi("/");
          return false;
        }
        let list = res.data.revSummaryList ? res.data.revSummaryList : [];
        let listB = [];
        let listC = [];

        let jan = [];
        let feb = [];
        let mar = [];
        let apr = [];
        let may = [];
        let jun = [];
        let jul = [];
        let aug = [];
        let sep = [];
        let oct = [];
        let nov = [];
        let dec = [];
        let janPaidAd = 0;
        let febPaidAd = 0;
        let marPaidAd = 0;
        let aprPaidAd = 0;
        let mayPaidAd = 0;
        let junPaidAd = 0;
        let julPaidAd = 0;
        let augPaidAd = 0;
        let sepPaidAd = 0;
        let octPaidAd = 0;
        let novPaidAd = 0;
        let decPaidAd = 0;
        let janPaidComm = 0;
        let febPaidComm = 0;
        let marPaidComm = 0;
        let aprPaidComm = 0;
        let mayPaidComm = 0;
        let junPaidComm = 0;
        let julPaidComm = 0;
        let augPaidComm = 0;
        let sepPaidComm = 0;
        let octPaidComm = 0;
        let novPaidComm = 0;
        let decPaidComm = 0;
        let janPaidCare = 0;
        let febPaidCare = 0;
        let marPaidCare = 0;
        let aprPaidCare = 0;
        let mayPaidCare = 0;
        let junPaidCare = 0;
        let julPaidCare = 0;
        let augPaidCare = 0;
        let sepPaidCare = 0;
        let octPaidCare = 0;
        let novPaidCare = 0;
        let decPaidCare = 0;
        let janPaidPrepayment = 0;
        let febPaidPrepayment = 0;
        let marPaidPrepayment = 0;
        let aprPaidPrepayment = 0;
        let mayPaidPrepayment = 0;
        let junPaidPrepayment = 0;
        let julPaidPrepayment = 0;
        let augPaidPrepayment = 0;
        let sepPaidPrepayment = 0;
        let octPaidPrepayment = 0;
        let novPaidPrepayment = 0;
        let decPaidPrepayment = 0;
        let countTotal = 0;
        let costTotal = 0;
        list.forEach(doc => {
          countTotal = countTotal + 1;
          doc.costTotal =
            doc.compMonthPaidAd +
            doc.compMonthPaidComm +
            doc.compMonthCare +
            doc.compMonthPrepayment;
          costTotal = costTotal + doc.costTotal;
          doc.counter = 0;
          listB.push(doc);
          // month 값에 따라 해당 월 배열에 데이터 추가
          switch (doc.month) {
            case 1:
              jan.push(doc);
              janPaidAd = janPaidAd + doc.compMonthPaidAd;
              janPaidComm = janPaidComm + doc.compMonthPaidComm;
              janPaidCare = janPaidCare + doc.compMonthCare;
              janPaidPrepayment = janPaidPrepayment + doc.compMonthPrepayment;
              break;
            case 2:
              feb.push(doc);
              febPaidAd = febPaidAd + doc.compMonthPaidAd;
              febPaidComm = febPaidComm + doc.compMonthPaidComm;
              febPaidCare = febPaidCare + doc.compMonthCare;
              febPaidPrepayment = febPaidPrepayment + doc.compMonthPrepayment;
              break;
            case 3:
              mar.push(doc);
              marPaidAd = marPaidAd + doc.compMonthPaidAd;
              marPaidComm = marPaidComm + doc.compMonthPaidComm;
              marPaidCare = marPaidCare + doc.compMonthCare;
              marPaidPrepayment = marPaidPrepayment + doc.compMonthPrepayment;
              break;
            case 4:
              apr.push(doc);
              aprPaidAd = aprPaidAd + doc.compMonthPaidAd;
              aprPaidComm = aprPaidComm + doc.compMonthPaidComm;
              aprPaidCare = aprPaidCare + doc.compMonthCare;
              aprPaidPrepayment = aprPaidPrepayment + doc.compMonthPrepayment;
              break;
            case 5:
              may.push(doc);
              mayPaidAd = mayPaidAd + doc.compMonthPaidAd;
              mayPaidComm = mayPaidComm + doc.compMonthPaidComm;
              mayPaidCare = mayPaidCare + doc.compMonthCare;
              mayPaidPrepayment = mayPaidPrepayment + doc.compMonthPrepayment;
              break;
            case 6:
              jun.push(doc);
              junPaidAd = junPaidAd + doc.compMonthPaidAd;
              junPaidComm = junPaidComm + doc.compMonthPaidComm;
              junPaidCare = junPaidCare + doc.compMonthCare;
              junPaidPrepayment = junPaidPrepayment + doc.compMonthPrepayment;
              break;
            case 7:
              jul.push(doc);
              julPaidAd = julPaidAd + doc.compMonthPaidAd;
              julPaidComm = julPaidComm + doc.compMonthPaidComm;
              julPaidCare = julPaidCare + doc.compMonthCare;
              julPaidPrepayment = julPaidPrepayment + doc.compMonthPrepayment;
              break;
            case 8:
              aug.push(doc);
              augPaidAd = augPaidAd + doc.compMonthPaidAd;
              augPaidComm = augPaidComm + doc.compMonthPaidComm;
              augPaidCare = augPaidCare + doc.compMonthCare;
              augPaidPrepayment = augPaidPrepayment + doc.compMonthPrepayment;
              break;
            case 9:
              sep.push(doc);
              sepPaidAd = sepPaidAd + doc.compMonthPaidAd;
              sepPaidComm = sepPaidComm + doc.compMonthPaidComm;
              sepPaidCare = sepPaidCare + doc.compMonthCare;
              sepPaidPrepayment = sepPaidPrepayment + doc.compMonthPrepayment;
              break;
            case 10:
              oct.push(doc);
              octPaidAd = octPaidAd + doc.compMonthPaidAd;
              octPaidComm = octPaidComm + doc.compMonthPaidComm;
              octPaidCare = octPaidCare + doc.compMonthCare;
              octPaidPrepayment = octPaidPrepayment + doc.compMonthPrepayment;
              break;
            case 11:
              nov.push(doc);
              novPaidAd = novPaidAd + doc.compMonthPaidAd;
              novPaidComm = novPaidComm + doc.compMonthPaidComm;
              novPaidCare = novPaidCare + doc.compMonthCare;
              novPaidPrepayment = novPaidPrepayment + doc.compMonthPrepayment;
              break;
            case 12:
              dec.push(doc);
              decPaidAd = decPaidAd + doc.compMonthPaidAd;
              decPaidComm = decPaidComm + doc.compMonthPaidComm;
              decPaidCare = decPaidCare + doc.compMonthCare;
              decPaidPrepayment = decPaidPrepayment + doc.compMonthPrepayment;
              break;
            default:
              // 유효하지 않은 월 값이면 무시
              break;
          }
        });
        listB.forEach(item => {
          // 배열 B에서 현재 item의 companyCode를 가진 요소를 찾습니다.
          let found = listC.find(
            bItem => bItem.companyCode === item.companyCode
          );

          if (found) {
            // 중복된 companyCode가 있는 경우, counter를 1 증가시킵니다.
            found.counter += 1;
            found.costTotal += item.costTotal;
          } else {
            // 중복되지 않은 경우, 새로운 요소를 배열 B에 추가합니다.
            // 객체를 복사하여 추가하는 것이 중요합니다(예: {...item}).
            listC.push({ ...item, counter: 0 });
          }
        });
        setCostTotal(costTotal);
        setCountTotal(countTotal);
        setJanTotal({
          ad: janPaidAd,
          comm: janPaidComm,
          care: janPaidCare,
          prepay: janPaidPrepayment,
          total: janPaidAd + janPaidComm + janPaidCare + janPaidPrepayment,
        });
        setFebTotal({
          ad: febPaidAd,
          comm: febPaidComm,
          care: febPaidCare,
          prepay: febPaidPrepayment,
          total: febPaidAd + febPaidComm + febPaidCare + febPaidPrepayment,
        });
        setMarTotal({
          ad: marPaidAd,
          comm: marPaidComm,
          care: marPaidCare,
          prepay: marPaidPrepayment,
          total: marPaidAd + marPaidComm + marPaidCare + marPaidPrepayment,
        });

        setAprTotal({
          ad: aprPaidAd,
          comm: aprPaidComm,
          care: aprPaidCare,
          prepay: aprPaidPrepayment,
          total: aprPaidAd + aprPaidComm + aprPaidCare + aprPaidPrepayment,
        });
        setMayTotal({
          ad: mayPaidAd,
          comm: mayPaidComm,
          care: mayPaidCare,
          prepay: mayPaidPrepayment,
          total: mayPaidAd + mayPaidComm + mayPaidCare + mayPaidPrepayment,
        });
        setJunTotal({
          ad: junPaidAd,
          comm: junPaidComm,
          care: junPaidCare,
          prepay: junPaidPrepayment,
          total: junPaidAd + junPaidComm + junPaidCare + junPaidPrepayment,
        });
        setJulTotal({
          ad: julPaidAd,
          comm: julPaidComm,
          care: julPaidCare,
          prepay: julPaidPrepayment,
          total: julPaidAd + julPaidComm + julPaidCare + julPaidPrepayment,
        });
        setAugTotal({
          ad: augPaidAd,
          comm: augPaidComm,
          care: augPaidCare,
          prepay: augPaidPrepayment,
          total: augPaidAd + augPaidComm + augPaidCare + augPaidPrepayment,
        });
        setSepTotal({
          ad: sepPaidAd,
          comm: sepPaidComm,
          care: sepPaidCare,
          prepay: sepPaidPrepayment,
          total: sepPaidAd + sepPaidComm + sepPaidCare + sepPaidPrepayment,
        });
        setOctTotal({
          ad: octPaidAd,
          comm: octPaidComm,
          care: octPaidCare,
          prepay: octPaidPrepayment,
          total: octPaidAd + octPaidComm + octPaidCare + octPaidPrepayment,
        });
        setNovTotal({
          ad: novPaidAd,
          comm: novPaidComm,
          care: novPaidCare,
          prepay: novPaidPrepayment,
          total: novPaidAd + novPaidComm + novPaidCare + novPaidPrepayment,
        });
        setDecTotal({
          ad: decPaidAd,
          comm: decPaidComm,
          care: decPaidCare,
          prepay: decPaidPrepayment,
          total: decPaidAd + decPaidComm + decPaidCare + decPaidPrepayment,
        });
        setJan(jan);
        setFeb(feb);
        setMar(mar);
        setApr(apr);
        setMay(may);
        setJun(jun);
        setJul(jul);
        setAug(aug);
        setSep(sep);
        setOct(oct);
        setNov(nov);
        setDec(dec);
        const listD = listC.sort((a, b) => {
          return b.costTotal - a.costTotal;
        });
        setTotalList(listD);
        let listE = [];
        let listF = [];
        let totalE = 0;
        let totalF = 0;
        listD.forEach(doc => {
          if (doc.companyName === "교보생명") {
            const object = {
              name: doc.companyName,
              branch: doc.companyBranch,
              total: doc.costTotal,
            };
            totalE = totalE + doc.costTotal;
            listE.push(object);
          } else if (doc.companyName === "미래에셋") {
            const object = {
              name: doc.companyName,
              branch: doc.companyBranch,
              total: doc.costTotal,
            };
            totalF = totalF + doc.costTotal;
            listF.push(object);
          }
        });
      })
      .catch(e => console.log(e));
  };

  return (
    <div className="mx-4 text-sm" data={title}>
      {/* 연도 선택 컨트롤 */}
      <div className="bg-white p-4 w-fit h-fit drop-shadow-lg mb-4 rounded-lg">
        <div className="flex justify-start gap-x-3 items-center">
          <span className="font-bold whitespace-nowrap py-2">연도별 보기</span>
          <select
            className="p-2 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-full"
            value={year}
            onChange={e => setYear(e.currentTarget.value)}
          >
            <option value="">연도 선택</option>
            <option value="2023">2023년</option>
            <option value="2024">2024년</option>
            <option value="2025">2025년</option>
            <option value="2026">2026년</option>
          </select>
          {totalList.length > 0 && (
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              엑셀 다운로드
            </button>
          )}
        </div>
      </div>

      {/* 테이블 컨테이너 */}
      <div className="relative max-h-[700px] h-fit overflow-auto">
        <div className="inline-block min-w-full">
          <table className="w-[5350px] border-collapse">
            <thead className="sticky top-0 z-50">
              {/* 첫 번째 헤더 행: 제목 및 합계 행 */}
              <tr>
                {/* 왼쪽 고정 컬럼 헤더 */}
                <th
                  colSpan="5"
                  rowSpan="3"
                  className="align-middle text-center text-white h-[90px] bg-black text-xl font-bold border border-r border-black"
                >
                  {year}년 고객사별 총정리
                </th>
                <th
                  rowSpan="3"
                  className="align-middle text-center bg-yellow-300 text-black font-bold border border-r border-black"
                >
                  횟수
                </th>
                <th
                  rowSpan="3"
                  className="align-middle text-center bg-yellow-300 text-black font-bold border border-r border-black"
                >
                  총 매출
                </th>
                <th
                  rowSpan="3"
                  className="align-middle text-center bg-yellow-600 text-black font-bold border border-r border-black"
                >
                  매출
                  <br />
                  비중
                </th>
                {/* 12개월 헤더 */}
                <th
                  colSpan="4"
                  className="align-middle text-center bg-green-800 text-white h-[90px] font-bold border border-l-0 border-black"
                >
                  1월
                </th>
                <th
                  colSpan="4"
                  className="align-middle text-center bg-blue-800 text-white font-bold border border-l-0 border-black"
                >
                  2월
                </th>
                <th
                  colSpan="4"
                  className="align-middle text-center bg-green-800 text-white font-bold border border-l-0 border-black"
                >
                  3월
                </th>
                <th
                  colSpan="4"
                  className="align-middle text-center bg-blue-800 text-white font-bold border border-l-0 border-black"
                >
                  4월
                </th>
                <th
                  colSpan="4"
                  className="align-middle text-center bg-green-800 text-white font-bold border border-l-0 border-black"
                >
                  5월
                </th>
                <th
                  colSpan="4"
                  className="align-middle text-center bg-blue-800 text-white font-bold border border-l-0 border-black"
                >
                  6월
                </th>
                <th
                  colSpan="4"
                  className="align-middle text-center bg-green-800 text-white font-bold border border-l-0 border-black"
                >
                  7월
                </th>
                <th
                  colSpan="4"
                  className="align-middle text-center bg-blue-800 text-white font-bold border border-l-0 border-black"
                >
                  8월
                </th>
                <th
                  colSpan="4"
                  className="align-middle text-center bg-green-800 text-white font-bold border border-l-0 border-black"
                >
                  9월
                </th>
                <th
                  colSpan="4"
                  className="align-middle text-center bg-blue-800 text-white font-bold border border-l-0 border-black"
                >
                  10월
                </th>
                <th
                  colSpan="4"
                  className="align-middle text-center bg-green-800 text-white font-bold border border-l-0 border-black"
                >
                  11월
                </th>
                <th
                  colSpan="4"
                  className="align-middle text-center bg-blue-800 text-white font-bold border border-l-0 border-black"
                >
                  12월
                </th>
              </tr>
              {/* 두 번째 헤더 행: 월별 합계 */}
              <tr>
                {/* 12개월 합계 */}
                <th
                  colSpan="4"
                  className="align-middle text-center bg-white text-black h-[30px] font-bold border border-t-0 border-l-0 border-black"
                >
                  {janTotal.total.toLocaleString()}
                </th>
                <th
                  colSpan="4"
                  className="align-middle text-center bg-white text-black font-bold border border-t-0 border-l-0 border-black"
                >
                  {febTotal.total.toLocaleString()}
                </th>
                <th
                  colSpan="4"
                  className="align-middle text-center bg-white text-black font-bold border border-t-0 border-l-0 border-black"
                >
                  {marTotal.total.toLocaleString()}
                </th>
                <th
                  colSpan="4"
                  className="align-middle text-center bg-white text-black font-bold border border-t-0 border-l-0 border-black"
                >
                  {aprTotal.total.toLocaleString()}
                </th>
                <th
                  colSpan="4"
                  className="align-middle text-center bg-white text-black font-bold border border-t-0 border-l-0 border-black"
                >
                  {mayTotal.total.toLocaleString()}
                </th>
                <th
                  colSpan="4"
                  className="align-middle text-center bg-white text-black font-bold border border-t-0 border-l-0 border-black"
                >
                  {junTotal.total.toLocaleString()}
                </th>
                <th
                  colSpan="4"
                  className="align-middle text-center bg-white text-black font-bold border border-t-0 border-l-0 border-black"
                >
                  {julTotal.total.toLocaleString()}
                </th>
                <th
                  colSpan="4"
                  className="align-middle text-center bg-white text-black font-bold border border-t-0 border-l-0 border-black"
                >
                  {augTotal.total.toLocaleString()}
                </th>
                <th
                  colSpan="4"
                  className="align-middle text-center bg-white text-black font-bold border border-t-0 border-l-0 border-black"
                >
                  {sepTotal.total.toLocaleString()}
                </th>
                <th
                  colSpan="4"
                  className="align-middle text-center bg-white text-black font-bold border border-t-0 border-l-0 border-black"
                >
                  {octTotal.total.toLocaleString()}
                </th>
                <th
                  colSpan="4"
                  className="align-middle text-center bg-white text-black font-bold border border-t-0 border-l-0 border-black"
                >
                  {novTotal.total.toLocaleString()}
                </th>
                <th
                  colSpan="4"
                  className="align-middle text-center bg-white text-black font-bold border border-t-0 border-l-0 border-black"
                >
                  {decTotal.total.toLocaleString()}
                </th>
              </tr>

              {/* 세 번째 헤더 행: 월별 세부 항목 헤더 */}
              <tr>
                {/* 1월 세부 헤더 */}
                <th className="align-middle text-center h-[30px] bg-green-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  광고비
                </th>
                <th className="align-middle text-center h-[30px] bg-green-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  위촉비
                </th>
                <th className="align-middle text-center h-[30px] bg-green-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  케어
                </th>
                <th className="align-middle text-center h-[30px] bg-green-800 text-white font-bold border border-t-0 border-l-0 border-black">
                  선입금
                </th>
                {/* 2월 세부 헤더 */}
                <th className="align-middle text-center h-[30px] bg-blue-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  광고비
                </th>
                <th className="align-middle text-center h-[30px] bg-blue-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  위촉비
                </th>
                <th className="align-middle text-center h-[30px] bg-blue-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  케어
                </th>
                <th className="align-middle text-center h-[30px] bg-blue-800 text-white font-bold border border-t-0 border-l-0 border-black">
                  선입금
                </th>
                {/* 3월 세부 헤더 */}
                <th className="align-middle text-center h-[30px] bg-green-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  광고비
                </th>
                <th className="align-middle text-center h-[30px] bg-green-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  위촉비
                </th>
                <th className="align-middle text-center h-[30px] bg-green-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  케어
                </th>
                <th className="align-middle text-center h-[30px] bg-green-800 text-white font-bold border border-t-0 border-l-0 border-black">
                  선입금
                </th>
                {/* 4월 세부 헤더 */}
                <th className="align-middle text-center h-[30px] bg-blue-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  광고비
                </th>
                <th className="align-middle text-center h-[30px] bg-blue-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  위촉비
                </th>
                <th className="align-middle text-center h-[30px] bg-blue-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  케어
                </th>
                <th className="align-middle text-center h-[30px] bg-blue-800 text-white font-bold border border-t-0 border-l-0 border-black">
                  선입금
                </th>
                {/* 5월 세부 헤더 */}
                <th className="align-middle text-center h-[30px] bg-green-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  광고비
                </th>
                <th className="align-middle text-center h-[30px] bg-green-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  위촉비
                </th>
                <th className="align-middle text-center h-[30px] bg-green-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  케어
                </th>
                <th className="align-middle text-center h-[30px] bg-green-800 text-white font-bold border border-t-0 border-l-0 border-black">
                  선입금
                </th>
                {/* 6월 세부 헤더 */}
                <th className="align-middle text-center h-[30px] bg-blue-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  광고비
                </th>
                <th className="align-middle text-center h-[30px] bg-blue-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  위촉비
                </th>
                <th className="align-middle text-center h-[30px] bg-blue-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  케어
                </th>
                <th className="align-middle text-center h-[30px] bg-blue-800 text-white font-bold border border-t-0 border-l-0 border-black">
                  선입금
                </th>
                {/* 7월 세부 헤더 */}
                <th className="align-middle text-center h-[30px] bg-green-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  광고비
                </th>
                <th className="align-middle text-center h-[30px] bg-green-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  위촉비
                </th>
                <th className="align-middle text-center h-[30px] bg-green-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  케어
                </th>
                <th className="align-middle text-center h-[30px] bg-green-800 text-white font-bold border border-t-0 border-l-0 border-black">
                  선입금
                </th>
                {/* 8월 세부 헤더 */}
                <th className="align-middle text-center h-[30px] bg-blue-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  광고비
                </th>
                <th className="align-middle text-center h-[30px] bg-blue-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  위촉비
                </th>
                <th className="align-middle text-center h-[30px] bg-blue-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  케어
                </th>
                <th className="align-middle text-center h-[30px] bg-blue-800 text-white font-bold border border-t-0 border-l-0 border-black">
                  선입금
                </th>
                {/* 9월 세부 헤더 */}
                <th className="align-middle text-center h-[30px] bg-green-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  광고비
                </th>
                <th className="align-middle text-center h-[30px] bg-green-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  위촉비
                </th>
                <th className="align-middle text-center h-[30px] bg-green-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  케어
                </th>
                <th className="align-middle text-center h-[30px] bg-green-800 text-white font-bold border border-t-0 border-l-0 border-black">
                  선입금
                </th>
                {/* 10월 세부 헤더 */}
                <th className="align-middle text-center h-[30px] bg-blue-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  광고비
                </th>
                <th className="align-middle text-center h-[30px] bg-blue-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  위촉비
                </th>
                <th className="align-middle text-center h-[30px] bg-blue-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  케어
                </th>
                <th className="align-middle text-center h-[30px] bg-blue-800 text-white font-bold border border-t-0 border-l-0 border-black">
                  선입금
                </th>
                {/* 11월 세부 헤더 */}
                <th className="align-middle text-center h-[30px] bg-green-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  광고비
                </th>
                <th className="align-middle text-center h-[30px] bg-green-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  위촉비
                </th>
                <th className="align-middle text-center h-[30px] bg-green-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  케어
                </th>
                <th className="align-middle text-center h-[30px] bg-green-800 text-white font-bold border border-t-0 border-l-0 border-black">
                  선입금
                </th>
                {/* 12월 세부 헤더 */}
                <th className="align-middle text-center h-[30px] bg-blue-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  광고비
                </th>
                <th className="align-middle text-center h-[30px] bg-blue-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  위촉비
                </th>
                <th className="align-middle text-center h-[30px] bg-blue-800 text-white font-bold border border-t-0 border-l-0 border-black border-r">
                  케어
                </th>
                <th className="align-middle text-center h-[30px] bg-blue-800 text-white font-bold border border-t-0 border-l-0 border-black">
                  선입금
                </th>
              </tr>

              {/* 두 번째 헤더 행: 컬럼명 및 월별 합계 */}
              <tr className="sticky left-0 z-40">
                {/* 왼쪽 고정 컬럼 서브헤더 */}
                <th className="align-middle h-[30px] text-center bg-gray-100 font-bold border border-r border-t-0 border-black">
                  채널
                </th>
                <th className="align-middle text-center bg-gray-100 font-bold border border-r border-t-0 border-black">
                  보험사
                </th>
                <th className="align-middle text-center bg-gray-100 font-bold border border-r border-t-0 border-black">
                  지점
                </th>
                <th className="align-middle text-center bg-gray-100 font-bold border border-r border-t-0 border-black">
                  담당1
                </th>
                <th className="align-middle text-center bg-yellow-100 font-bold border border-r border-t-0 border-black">
                  담당2
                </th>
                <th className="align-middle text-center bg-yellow-200 font-bold border border-r border-t-0 border-black">
                  {countTotal}
                </th>
                <th className="align-middle text-center bg-yellow-200 font-bold border border-r border-t-0 border-black">
                  {costTotal.toLocaleString()}
                </th>
                <th className="align-middle text-center bg-yellow-200 font-bold border border-r border-t-0 border-black">
                  100%
                </th>
                {/* 1월 합계 데이터 */}
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {janTotal.ad.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {janTotal.comm.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {janTotal.care.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black">
                  {janTotal.prepay.toLocaleString()}
                </td>
                {/* 2월 합계 데이터 */}
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {febTotal.ad.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {febTotal.comm.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {febTotal.care.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black">
                  {febTotal.prepay.toLocaleString()}
                </td>
                {/* 3월 합계 데이터 */}
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {marTotal.ad.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {marTotal.comm.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {marTotal.care.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black">
                  {marTotal.prepay.toLocaleString()}
                </td>
                {/* 4월 합계 데이터 */}
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {aprTotal.ad.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {aprTotal.comm.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {aprTotal.care.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black">
                  {aprTotal.prepay.toLocaleString()}
                </td>
                {/* 5월 합계 데이터 */}
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {mayTotal.ad.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {mayTotal.comm.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {mayTotal.care.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black">
                  {mayTotal.prepay.toLocaleString()}
                </td>
                {/* 6월 합계 데이터 */}
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {junTotal.ad.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {junTotal.comm.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {junTotal.care.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black">
                  {junTotal.prepay.toLocaleString()}
                </td>
                {/* 7월 합계 데이터 */}
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {julTotal.ad.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {julTotal.comm.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {julTotal.care.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black">
                  {julTotal.prepay.toLocaleString()}
                </td>
                {/* 8월 합계 데이터 */}
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {augTotal.ad.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {augTotal.comm.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {augTotal.care.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black">
                  {augTotal.prepay.toLocaleString()}
                </td>
                {/* 9월 합계 데이터 */}
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {sepTotal.ad.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {sepTotal.comm.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {sepTotal.care.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black">
                  {sepTotal.prepay.toLocaleString()}
                </td>
                {/* 10월 합계 데이터 */}
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {octTotal.ad.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {octTotal.comm.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {octTotal.care.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black">
                  {octTotal.prepay.toLocaleString()}
                </td>
                {/* 11월 합계 데이터 */}
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {novTotal.ad.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {novTotal.comm.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {novTotal.care.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black">
                  {novTotal.prepay.toLocaleString()}
                </td>
                {/* 12월 합계 데이터 */}
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {decTotal.ad.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {decTotal.comm.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black border-r">
                  {decTotal.care.toLocaleString()}
                </td>
                <td className="align-middle text-center h-[30px] bg-white text-black font-bold border border-t-0 border-l-0 border-black">
                  {decTotal.prepay.toLocaleString()}
                </td>
              </tr>
            </thead>

            {/* 테이블 본문 */}
            <tbody>
              {totalList.length > 0
                ? totalList.map((total, idx) => (
                    <tr key={idx} className="sticky left-0 z-30">
                      {/* 왼쪽 고정 컬럼 데이터 */}
                      <td
                        className={`align-middle h-[30px] text-center bg-gray-100 border ${
                          idx === 0 && "border-t-0"
                        } ${
                          idx !== totalList.length - 1 && "border-b-0"
                        } border-r border-black`}
                      >
                        {total.channel}
                      </td>
                      <td
                        className={`align-middle text-center bg-gray-100 border ${
                          idx === 0 && "border-t-0"
                        } ${
                          idx !== totalList.length - 1 && "border-b-0"
                        } border-r border-black truncate whitespace-nowrap`}
                      >
                        {total.companyName}
                      </td>
                      <td
                        className={`align-middle text-center bg-gray-100 border ${
                          idx === 0 && "border-t-0"
                        } ${
                          idx !== totalList.length - 1 && "border-b-0"
                        } border-r border-black text-sm truncate whitespace-nowrap`}
                      >
                        {total.companyBranch}
                      </td>
                      <td
                        className={`align-middle text-center bg-gray-100 border truncate overflow-hidden ${
                          idx === 0 && "border-t-0"
                        } ${
                          idx !== totalList.length - 1 && "border-b-0"
                        } border-r border-black`}
                      >
                        {total.manager1}
                      </td>
                      <td
                        className={`align-middle text-center bg-yellow-100 border truncate overflow-hidden ${
                          idx === 0 && "border-t-0"
                        } ${
                          idx !== totalList.length - 1 && "border-b-0"
                        } border-r border-black`}
                      >
                        {total.manager2}
                      </td>
                      <td
                        className={`align-middle text-center bg-yellow-200 border ${
                          idx === 0 && "border-t-0"
                        } ${
                          idx !== totalList.length - 1 && "border-b-0"
                        } border-r border-black`}
                      >
                        {total.counter + 1}
                      </td>
                      <td
                        className={`align-middle text-center bg-yellow-200 border ${
                          idx === 0 && "border-t-0"
                        } ${
                          idx !== totalList.length - 1 && "border-b-0"
                        } border-r border-black`}
                      >
                        {total.costTotal.toLocaleString()}
                      </td>
                      <td
                        className={`align-middle text-center bg-yellow-200 border ${
                          idx === 0 && "border-t-0"
                        } ${
                          idx !== totalList.length - 1 && "border-b-0"
                        } border-r border-black`}
                      >
                        {getPercentage(total.costTotal, costTotal)}
                      </td>
                      {/* 12개월 데이터 */}
                      <MonthlySales2
                        companyCode={total.companyCode}
                        month={jan}
                        monthNum={1}
                      />
                      <MonthlySales2
                        companyCode={total.companyCode}
                        month={feb}
                        monthNum={2}
                      />
                      <MonthlySales2
                        companyCode={total.companyCode}
                        month={mar}
                        monthNum={3}
                      />
                      <MonthlySales2
                        companyCode={total.companyCode}
                        month={apr}
                        monthNum={4}
                      />
                      <MonthlySales2
                        companyCode={total.companyCode}
                        month={may}
                        monthNum={5}
                      />
                      <MonthlySales2
                        companyCode={total.companyCode}
                        month={jun}
                        monthNum={6}
                      />
                      <MonthlySales2
                        companyCode={total.companyCode}
                        month={jul}
                        monthNum={7}
                      />
                      <MonthlySales2
                        companyCode={total.companyCode}
                        month={aug}
                        monthNum={8}
                      />
                      <MonthlySales2
                        companyCode={total.companyCode}
                        month={sep}
                        monthNum={9}
                      />
                      <MonthlySales2
                        companyCode={total.companyCode}
                        month={oct}
                        monthNum={10}
                      />
                      <MonthlySales2
                        companyCode={total.companyCode}
                        month={nov}
                        monthNum={11}
                      />
                      <MonthlySales2
                        companyCode={total.companyCode}
                        month={dec}
                        monthNum={12}
                      />
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default YearTotal2;
