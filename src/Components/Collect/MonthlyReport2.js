import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import ExcelJS from "exceljs";
import axiosInstance from "../../Api/axiosInstance";
import MonthButton from "./Monthly/MonthButton";

/**
 * 월간보고(테이블)
 * MonthlyReport의 div 그리드를 YearTotal2와 같은 HTML 테이블 + 엑셀 다운로드로 옮긴 화면입니다.
 * - 보고양식 1: 고객사 행 × 주차별 요일/항목 열
 * - 보고양식 2: 주차·채널·고객사·결제방식·카드 비율 표
 */

const PAY_FIELDS = [
  { key: "paidAd", label: "광고비" },
  { key: "paidComm", label: "위촉비" },
  { key: "paidIntvCare", label: "면접케어" },
  { key: "paidCommCare", label: "위촉케어" },
  { key: "prepayment", label: "선입금" },
];

const DAY_KEYS = [
  { key: "mon", label: "월" },
  { key: "tue", label: "화" },
  { key: "wed", label: "수" },
  { key: "thu", label: "목" },
  { key: "fri", label: "금" },
];

const WEEK_NUMS = [1, 2, 3, 4, 5];

// 왼쪽 고정 열. left는 가로 스크롤 시 sticky 위치입니다.
const LEFT_COLS = [
  { label: "채널", width: 72 },
  { label: "보험사", width: 120 },
  { label: "지점", width: 120 },
  { label: "월 총액", width: 96 },
  { label: "광고비", width: 88 },
  { label: "위촉비", width: 88 },
  { label: "면접케어", width: 88 },
  { label: "위촉케어", width: 88 },
  { label: "선입금", width: 88 },
];

LEFT_COLS.reduce((acc, col) => {
  col.left = acc;
  return acc + col.width;
}, 0);

const PAY_COL_W = 84;
const DAY_COL_W = 72;

const THIN_BORDER = {
  top: { style: "thin", color: { argb: "FF000000" } },
  left: { style: "thin", color: { argb: "FF000000" } },
  bottom: { style: "thin", color: { argb: "FF000000" } },
  right: { style: "thin", color: { argb: "FF000000" } },
};

const cellBorder =
  "border border-black border-l-0 border-t-0 align-middle text-center whitespace-nowrap";

function emptyPay() {
  return {
    paidAd: 0,
    paidComm: 0,
    paidIntvCare: 0,
    paidCommCare: 0,
    prepayment: 0,
  };
}

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function money(value) {
  return toNumber(value).toLocaleString();
}

function rowAmount(item) {
  return PAY_FIELDS.reduce((sum, field) => sum + toNumber(item[field.key]), 0);
}

// 일요일/공휴일 코드는 기존 보고양식 1과 같이 월요일로 묶습니다.
function convertNumberToDay(dayNumber) {
  let dNum = String(dayNumber);
  if (dNum === "1" || dNum === "0" || dNum === "7") {
    dNum = "2";
  }
  const numberMap = { 2: "mon", 3: "tue", 4: "wed", 5: "thu", 6: "fri" };
  return numberMap[dNum] || null;
}

function getPayTitle(payType) {
  if (payType === "CA") return "현금(개인)";
  if (payType === "CO") return "현금(법인)";
  if (payType === "PG") return "카드(PG)";
  if (payType === "MO") return "카드(몬)";
  if (payType === "HE") return "카드(천국)";
  if (payType === "PE") return "카드(펄맥)";
  if (payType === "PR") return "선입금";
  return "오류";
}

function buildReportA(list) {
  const weeks = {};
  const totals = {};
  WEEK_NUMS.forEach(weekNo => {
    weeks[`week${weekNo}`] = {
      mon: [],
      tue: [],
      wed: [],
      thu: [],
      fri: [],
    };
    totals[`week${weekNo}`] = {
      mon: emptyPay(),
      tue: emptyPay(),
      wed: emptyPay(),
      thu: emptyPay(),
      fri: emptyPay(),
    };
  });

  const allTotal = { total: 0, ...emptyPay() };
  (Array.isArray(list) ? list : []).forEach(item => {
    const weekKey = `week${item.weekOfMonth}`;
    const dayOfWeek = convertNumberToDay(item.dayOfWeek);
    if (!weeks[weekKey] || !dayOfWeek) return;

    weeks[weekKey][dayOfWeek].push(item);
    PAY_FIELDS.forEach(field => {
      const amount = toNumber(item[field.key]);
      totals[weekKey][dayOfWeek][field.key] += amount;
      allTotal[field.key] += amount;
    });
  });

  allTotal.total = PAY_FIELDS.reduce(
    (sum, field) => sum + allTotal[field.key],
    0
  );
  return { weeks, totals, allTotal };
}

// 해당 주에 같은 고객사가 있으면 결제수단명을 보여 줍니다. (기존 WeekReport와 동일)
function getPayTypeLabel(week, companyCode, payType) {
  const paidThisWeek = DAY_KEYS.some(day =>
    week[day.key].some(doc => doc.companyCode === companyCode)
  );
  return paidThisWeek ? getPayTitle(payType) : "";
}

// 그 요일에 고객사 결제가 있을 때만 행의 금액을 표시합니다.
function getCost(dayItems, companyCode, pay) {
  const isPaid = dayItems.some(doc => doc.companyCode === companyCode);
  if (!isPaid) return 0;
  const amount = toNumber(pay);
  return amount > 0 ? amount : 0;
}

function buildWeekSummary(weekList) {
  const summary = {
    first: 0,
    second: 0,
    third: 0,
    fourth: 0,
    fifth: 0,
    total: 0,
  };
  (Array.isArray(weekList) ? weekList : []).forEach(doc => {
    const amount = toNumber(doc.totalPayment);
    summary.total += amount;
    if (doc.weekOfMonth === "1") summary.first = amount;
    else if (doc.weekOfMonth === "2") summary.second = amount;
    else if (doc.weekOfMonth === "3") summary.third = amount;
    else if (doc.weekOfMonth === "4") summary.fourth = amount;
    else if (doc.weekOfMonth === "5") summary.fifth = amount;
  });
  return summary;
}

function sumGubun(doc) {
  return PAY_FIELDS.reduce((sum, field) => sum + toNumber(doc[field.key]), 0);
}

function buildGubunSummary(gubunList) {
  const summary = { im: 0, tm: 0, total: 0 };
  (Array.isArray(gubunList) ? gubunList : []).forEach(doc => {
    const amount = sumGubun(doc);
    summary.total += amount;
    if (doc.gubun === "IM") summary.im += amount;
    if (doc.gubun === "TM") summary.tm += amount;
  });
  return summary;
}

function buildCompNmSummary(compNmList) {
  const summary = { ...emptyPay(), total: 0 };
  (Array.isArray(compNmList) ? compNmList : []).forEach(doc => {
    PAY_FIELDS.forEach(field => {
      summary[field.key] += toNumber(doc[field.key]);
    });
  });
  summary.total = PAY_FIELDS.reduce((sum, field) => sum + summary[field.key], 0);
  return summary;
}

function buildCompSumSummary(compSumList) {
  const summary = { cashPayment: 0, billPayment: 0, cardPayment: 0, total: 0 };
  (Array.isArray(compSumList) ? compSumList : []).forEach(doc => {
    summary.cashPayment += toNumber(doc.cashPayment);
    summary.billPayment += toNumber(doc.billPayment);
    summary.cardPayment += toNumber(doc.cardPayment);
  });
  summary.total =
    summary.cashPayment + summary.billPayment + summary.cardPayment;
  return summary;
}

// 왼쪽 열만 가로로 고정합니다. 세로 고정은 thead 전체에 맡깁니다.
function stickyStyle(colIndex, zIndex = 20) {
  const col = LEFT_COLS[colIndex];
  return {
    position: "sticky",
    left: col.left,
    minWidth: col.width,
    width: col.width,
    zIndex,
  };
}

function paintCell(cell, options) {
  const {
    fill,
    color = "FF000000",
    bold = false,
    align = "center",
    numFmt,
  } = options;
  if (fill) {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: fill },
    };
  }
  cell.font = { bold, color: { argb: color }, size: 10, name: "맑은 고딕" };
  cell.alignment = { vertical: "middle", horizontal: align, wrapText: true };
  cell.border = THIN_BORDER;
  if (numFmt) cell.numFmt = numFmt;
}

// 병합 범위의 모든 칸에 테두리를 넣습니다. 마스터 셀에만 값을 둡니다.
function paintRange(worksheet, r1, c1, r2, c2, style, value) {
  if (r1 !== r2 || c1 !== c2) {
    worksheet.mergeCells(r1, c1, r2, c2);
  }
  for (let r = r1; r <= r2; r += 1) {
    for (let c = c1; c <= c2; c += 1) {
      const cell = worksheet.getRow(r).getCell(c);
      if (r === r1 && c === c1 && value !== undefined) {
        cell.value = value;
      }
      paintCell(cell, style);
    }
  }
}

function downloadWorkbook(workbook, fileName) {
  return workbook.xlsx.writeBuffer().then(buffer => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  });
}

function appendSheetTable(worksheet, startRow, title, headers, bodyRows, headerFill) {
  let rowNo = startRow;
  paintRange(
    worksheet,
    rowNo,
    1,
    rowNo,
    headers.length,
    {
      fill: "FF1D4ED8",
      color: "FFFFFFFF",
      bold: true,
      align: "left",
    },
    title
  );
  worksheet.getRow(rowNo).height = 22;
  rowNo += 1;

  headers.forEach((header, index) => {
    paintRange(
      worksheet,
      rowNo,
      index + 1,
      rowNo,
      index + 1,
      { fill: headerFill, bold: true },
      header
    );
  });
  worksheet.getRow(rowNo).height = 20;
  rowNo += 1;

  bodyRows.forEach(row => {
    row.forEach((value, index) => {
      const isNumber = typeof value === "number";
      paintRange(
        worksheet,
        rowNo,
        index + 1,
        rowNo,
        index + 1,
        {
          fill: row.footer ? "FFDBEAFE" : "FFFFFFFF",
          bold: Boolean(row.footer) || index === 0,
          numFmt: isNumber ? "#,##0" : undefined,
        },
        value
      );
    });
    worksheet.getRow(rowNo).height = 20;
    rowNo += 1;
  });

  return rowNo + 1;
}

async function exportReportA(year, month, list) {
  const { weeks, totals, allTotal } = buildReportA(list);
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("보고양식1");
  const weekSpan = 1 + DAY_KEYS.length * PAY_FIELDS.length;

  LEFT_COLS.forEach((col, index) => {
    paintRange(
      worksheet,
      1,
      index + 1,
      3,
      index + 1,
      { fill: "FF2563EB", color: "FFFFFFFF", bold: true },
      col.label
    );
    worksheet.getColumn(index + 1).width = Math.max(12, Math.round(col.width / 8));
  });

  WEEK_NUMS.forEach((weekNo, weekIndex) => {
    const startCol = LEFT_COLS.length + 1 + weekIndex * weekSpan;
    paintRange(
      worksheet,
      1,
      startCol,
      1,
      startCol + weekSpan - 1,
      { fill: "FF2563EB", color: "FFFFFFFF", bold: true },
      `${weekNo}주차`
    );
    paintRange(
      worksheet,
      2,
      startCol,
      3,
      startCol,
      { fill: "FFFDE047", bold: true },
      "결제방법"
    );
    worksheet.getColumn(startCol).width = 14;

    DAY_KEYS.forEach((day, dayIndex) => {
      const dayStart = startCol + 1 + dayIndex * PAY_FIELDS.length;
      paintRange(
        worksheet,
        2,
        dayStart,
        2,
        dayStart + PAY_FIELDS.length - 1,
        { fill: "FF2563EB", color: "FFFFFFFF", bold: true },
        day.label
      );
      PAY_FIELDS.forEach((field, fieldIndex) => {
        const col = dayStart + fieldIndex;
        paintRange(
          worksheet,
          3,
          col,
          3,
          col,
          { fill: "FFFFFFFF", bold: true },
          field.label
        );
        worksheet.getColumn(col).width = 12;
      });
    });
  });

  [1, 2, 3].forEach(rowNo => {
    worksheet.getRow(rowNo).height = 22;
  });

  const totalValues = [
    allTotal.total,
    allTotal.paidAd,
    allTotal.paidComm,
    allTotal.paidIntvCare,
    allTotal.paidCommCare,
    allTotal.prepayment,
  ];
  paintRange(
    worksheet,
    4,
    1,
    4,
    3,
    { fill: "FF16A34A", color: "FFFFFFFF", bold: true },
    "전체 총액"
  );
  totalValues.forEach((value, index) => {
    paintRange(
      worksheet,
      4,
      4 + index,
      4,
      4 + index,
      { fill: "FFE5E7EB", bold: true, numFmt: "#,##0" },
      value
    );
  });

  WEEK_NUMS.forEach((weekNo, weekIndex) => {
    const startCol = LEFT_COLS.length + 1 + weekIndex * weekSpan;
    const weekTotal = totals[`week${weekNo}`];
    paintRange(
      worksheet,
      4,
      startCol,
      4,
      startCol,
      { fill: "FFFDE047", bold: true },
      "합계"
    );
    DAY_KEYS.forEach((day, dayIndex) => {
      PAY_FIELDS.forEach((field, fieldIndex) => {
        const col = startCol + 1 + dayIndex * PAY_FIELDS.length + fieldIndex;
        paintRange(
          worksheet,
          4,
          col,
          4,
          col,
          { fill: "FFDCFCE7", bold: true, numFmt: "#,##0" },
          weekTotal[day.key][field.key]
        );
      });
    });
  });
  worksheet.getRow(4).height = 22;

  (Array.isArray(list) ? list : []).forEach((item, itemIndex) => {
    const rowNo = 5 + itemIndex;
    const leftValues = [
      item.channel || "",
      item.companyName || "",
      item.companyBranch || "",
      rowAmount(item),
      toNumber(item.paidAd),
      toNumber(item.paidComm),
      toNumber(item.paidIntvCare),
      toNumber(item.paidCommCare),
      toNumber(item.prepayment),
    ];
    leftValues.forEach((value, index) => {
      paintRange(
        worksheet,
        rowNo,
        index + 1,
        rowNo,
        index + 1,
        {
          fill: "FFF3F4F6",
          numFmt: typeof value === "number" ? "#,##0" : undefined,
        },
        value
      );
    });

    WEEK_NUMS.forEach((weekNo, weekIndex) => {
      const week = weeks[`week${weekNo}`];
      const startCol = LEFT_COLS.length + 1 + weekIndex * weekSpan;
      paintRange(
        worksheet,
        rowNo,
        startCol,
        rowNo,
        startCol,
        { fill: "FFFDE047" },
        getPayTypeLabel(week, item.companyCode, item.payType)
      );
      DAY_KEYS.forEach((day, dayIndex) => {
        PAY_FIELDS.forEach((field, fieldIndex) => {
          const col = startCol + 1 + dayIndex * PAY_FIELDS.length + fieldIndex;
          paintRange(
            worksheet,
            rowNo,
            col,
            rowNo,
            col,
            { fill: "FFFFFFFF", numFmt: "#,##0" },
            getCost(week[day.key], item.companyCode, item[field.key])
          );
        });
      });
    });
    worksheet.getRow(rowNo).height = 18;
  });

  worksheet.views = [{ state: "frozen", xSplit: LEFT_COLS.length, ySplit: 4 }];

  const fileName = `${year}년_${month}월_월간보고_양식1_${dayjs().format(
    "YYYYMMDD_HHmmss"
  )}.xlsx`;
  await downloadWorkbook(workbook, fileName);
}

async function exportReportB(year, month, model) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("보고양식2");
  const {
    weekSummary,
    gubunList,
    gubunTotal,
    compNmList,
    compNmTotal,
    compSumList,
    compSumTotal,
    stat,
    statisticsTotal,
  } = model;

  let rowNo = 1;
  rowNo = appendSheetTable(
    worksheet,
    rowNo,
    "주차별 수수료 결제",
    ["1주차", "2주차", "3주차", "4주차", "5주차"],
    [
      [
        weekSummary.first,
        weekSummary.second,
        weekSummary.third,
        weekSummary.fourth,
        weekSummary.fifth,
      ],
      Object.assign(["", "", "", "합계", weekSummary.total], { footer: true }),
    ],
    "FFBFDBFE"
  );

  const gubunRows =
    gubunList.length > 0
      ? gubunList
      : [
          { gubun: "IM", ...emptyPay() },
          { gubun: "TM", ...emptyPay() },
        ];
  rowNo = appendSheetTable(
    worksheet,
    rowNo,
    "채널별 결제 수수료",
    ["채널", "광고비", "위촉비", "면접케어", "위촉케어", "선입금", "합계"],
    [
      ...gubunRows.map(gubun => [
        gubun.gubun,
        toNumber(gubun.paidAd),
        toNumber(gubun.paidComm),
        toNumber(gubun.paidIntvCare),
        toNumber(gubun.paidCommCare),
        toNumber(gubun.prepayment),
        gubun.gubun === "IM" ? gubunTotal.im : gubunTotal.tm,
      ]),
      Object.assign(["", "", "", "", "", "합계", gubunTotal.total], {
        footer: true,
      }),
    ],
    "FFBFDBFE"
  );

  rowNo = appendSheetTable(
    worksheet,
    rowNo,
    "고객사별 결제 수수료",
    ["고객사별", "광고비", "위촉비", "면접케어", "위촉케어", "선입금", "합계"],
    [
      ...compNmList.map(comp => [
        comp.companyName,
        toNumber(comp.paidAd),
        toNumber(comp.paidComm),
        toNumber(comp.paidIntvCare),
        toNumber(comp.paidCommCare),
        toNumber(comp.prepayment),
        rowAmount(comp),
      ]),
      Object.assign(
        [
          "합계",
          compNmTotal.paidAd,
          compNmTotal.paidComm,
          compNmTotal.paidIntvCare,
          compNmTotal.paidCommCare,
          compNmTotal.prepayment,
          compNmTotal.total,
        ],
        { footer: true }
      ),
    ],
    "FFBFDBFE"
  );

  rowNo = appendSheetTable(
    worksheet,
    rowNo,
    "고객사 결제 방식별 수수료",
    ["고객사별", "현금", "카드", "세금계산서", "합계"],
    [
      ...compSumList.map(comp => [
        comp.companyName,
        toNumber(comp.cashPayment),
        toNumber(comp.cardPayment),
        toNumber(comp.billPayment),
        toNumber(comp.cashPayment) +
          toNumber(comp.cardPayment) +
          toNumber(comp.billPayment),
      ]),
      Object.assign(
        [
          "합계",
          compSumTotal.cashPayment,
          compSumTotal.cardPayment,
          compSumTotal.billPayment,
          compSumTotal.total,
        ],
        { footer: true }
      ),
    ],
    "FFBFDBFE"
  );

  const ratioText = (ratio) => `${ratio && !Number.isNaN(Number(ratio)) ? ratio : "0"}%`;
  rowNo = appendSheetTable(
    worksheet,
    rowNo,
    "결제방식별 결제 비율",
    ["구분", "금액", "비율"],
    [
      ["현금", toNumber(stat.cashPayment), ratioText(stat.cashRatio)],
      ["법인", toNumber(stat.billPayment), ratioText(stat.billRatio)],
      ["카드", toNumber(stat.cardPayment), ratioText(stat.cardRatio)],
      Object.assign(["합계", statisticsTotal, ""], { footer: true }),
    ],
    "FFBBF7D0"
  );

  appendSheetTable(
    worksheet,
    rowNo,
    "카드종류별 결제 비율",
    ["구분", "금액", "비율"],
    [
      ["카드(몬)", toNumber(stat.moCardPayment), ratioText(stat.moCardRatio)],
      ["카드(천국)", toNumber(stat.heCardPayment), ratioText(stat.heCardRatio)],
      ["카드(펄스맥)", toNumber(stat.peCardPayment), ratioText(stat.peCardRatio)],
      ["카드(PG)", toNumber(stat.pgCardPayment), ratioText(stat.pgCardRatio)],
      Object.assign(["카드 합계", toNumber(stat.cardPayment), ""], {
        footer: true,
      }),
    ],
    "FFBBF7D0"
  );

  [18, 14, 14, 14, 14, 14, 14].forEach((width, index) => {
    worksheet.getColumn(index + 1).width = width;
  });

  const fileName = `${year}년_${month}월_월간보고_양식2_${dayjs().format(
    "YYYYMMDD_HHmmss"
  )}.xlsx`;
  await downloadWorkbook(workbook, fileName);
}

function AmountCell({ value, hideZero, className, style }) {
  const amount = toNumber(value);
  const hidden = hideZero && amount === 0;
  return (
    <td
      className={`${cellBorder} ${className || "bg-white"} ${
        hidden ? "text-white" : ""
      }`}
      style={style}
    >
      {money(amount)}
    </td>
  );
}

function ReportATable({ list }) {
  const safeList = Array.isArray(list) ? list : [];
  const { weeks, totals, allTotal } = useMemo(
    () => buildReportA(safeList),
    // list가 바뀔 때만 주차/요일 합계를 다시 계산합니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [list]
  );

  return (
    <div className="relative max-h-[700px] overflow-auto">
      <table className="border-separate border-spacing-0 text-xs">
        <thead className="sticky top-0 z-30">
          <tr>
            {LEFT_COLS.map((col, index) => (
              <th
                key={col.label}
                rowSpan={3}
                className={`${cellBorder} border-t border-l-0 bg-blue-600 text-white font-bold ${
                  index === 0 ? "border-l" : ""
                }`}
                style={stickyStyle(index, 40)}
              >
                {col.label}
              </th>
            ))}
            {WEEK_NUMS.map(weekNo => (
              <th
                key={weekNo}
                colSpan={1 + DAY_KEYS.length * PAY_FIELDS.length}
                className={`${cellBorder} border-t bg-blue-600 text-white font-bold text-left pl-3 h-8`}
              >
                {weekNo}주차
              </th>
            ))}
          </tr>
          <tr>
            {WEEK_NUMS.map(weekNo => (
              <React.Fragment key={weekNo}>
                <th
                  rowSpan={2}
                  className={`${cellBorder} bg-yellow-300 font-bold`}
                  style={{ minWidth: PAY_COL_W }}
                >
                  결제방법
                </th>
                {DAY_KEYS.map(day => (
                  <th
                    key={day.key}
                    colSpan={PAY_FIELDS.length}
                    className={`${cellBorder} bg-blue-600 text-white font-bold h-8`}
                  >
                    {day.label}
                  </th>
                ))}
              </React.Fragment>
            ))}
          </tr>
          <tr>
            {WEEK_NUMS.map(weekNo => (
              <React.Fragment key={weekNo}>
                {DAY_KEYS.map(day =>
                  PAY_FIELDS.map(field => (
                    <th
                      key={`${weekNo}-${day.key}-${field.key}`}
                      className={`${cellBorder} bg-white font-bold h-8`}
                      style={{ minWidth: DAY_COL_W }}
                    >
                      {field.label}
                    </th>
                  ))
                )}
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              colSpan={3}
              className={`${cellBorder} bg-green-600 text-white font-bold`}
              style={{
                position: "sticky",
                left: 0,
                zIndex: 20,
                minWidth: LEFT_COLS[0].width + LEFT_COLS[1].width + LEFT_COLS[2].width,
              }}
            >
              전체 총액
            </td>
            {[
              allTotal.total,
              allTotal.paidAd,
              allTotal.paidComm,
              allTotal.paidIntvCare,
              allTotal.paidCommCare,
              allTotal.prepayment,
            ].map((value, index) => (
              <td
                key={LEFT_COLS[index + 3].label}
                className={`${cellBorder} bg-gray-200 font-bold`}
                style={stickyStyle(index + 3)}
              >
                {money(value)}
              </td>
            ))}
            {WEEK_NUMS.map(weekNo => (
              <React.Fragment key={weekNo}>
                <td className={`${cellBorder} bg-yellow-300 font-bold`}>합계</td>
                {DAY_KEYS.map(day =>
                  PAY_FIELDS.map(field => (
                    <td
                      key={`${weekNo}-${day.key}-${field.key}`}
                      className={`${cellBorder} bg-green-100 font-bold`}
                    >
                      {money(totals[`week${weekNo}`][day.key][field.key])}
                    </td>
                  ))
                )}
              </React.Fragment>
            ))}
          </tr>
          {safeList.map((item, index) => (
            <tr key={`${item.companyCode || "row"}-${index}`}>
              <td
                className={`${cellBorder} bg-gray-100`}
                style={stickyStyle(0)}
              >
                {item.channel}
              </td>
              <td
                className={`${cellBorder} bg-gray-100`}
                style={stickyStyle(1)}
              >
                {item.companyName}
              </td>
              <td
                className={`${cellBorder} bg-gray-100`}
                style={stickyStyle(2)}
                title={item.companyBranch}
              >
                {item.companyBranch}
              </td>
              <td
                className={`${cellBorder} bg-gray-100`}
                style={stickyStyle(3)}
              >
                {money(rowAmount(item))}
              </td>
              {PAY_FIELDS.map((field, fieldIndex) => (
                <td
                  key={field.key}
                  className={`${cellBorder} bg-gray-100`}
                  style={stickyStyle(fieldIndex + 4)}
                >
                  {money(item[field.key])}
                </td>
              ))}
              {WEEK_NUMS.map(weekNo => {
                const week = weeks[`week${weekNo}`];
                return (
                  <React.Fragment key={weekNo}>
                    <td className={`${cellBorder} bg-yellow-300`}>
                      {getPayTypeLabel(week, item.companyCode, item.payType)}
                    </td>
                    {DAY_KEYS.map(day =>
                      PAY_FIELDS.map(field => (
                        <AmountCell
                          key={`${weekNo}-${day.key}-${field.key}`}
                          value={getCost(
                            week[day.key],
                            item.companyCode,
                            item[field.key]
                          )}
                          hideZero
                        />
                      ))
                    )}
                  </React.Fragment>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SimpleTable({ title, headers, rows, headerClassName }) {
  return (
    <div className="bg-white p-4 rounded-lg drop-shadow">
      <h3 className="text-lg mb-2 font-bold">{title}</h3>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {headers.map(header => (
              <th
                key={header}
                className={`border border-black py-1 text-center font-medium ${
                  headerClassName || "bg-blue-200"
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.cells.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  colSpan={cell.colSpan || 1}
                  className={`py-1 text-center ${
                    cell.bare ? "" : "border border-black"
                  } ${cell.className || "bg-white"}`}
                >
                  {cell.text}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReportBTable({
  weekSummary,
  gubunList,
  gubunTotal,
  compNmList,
  compNmTotal,
  compSumList,
  compSumTotal,
  stat,
  statisticsTotal,
}) {
  const gubunRows =
    gubunList.length > 0
      ? gubunList
      : [
          { gubun: "IM", ...emptyPay() },
          { gubun: "TM", ...emptyPay() },
        ];

  const ratio = value =>
    value !== undefined && value !== null && !Number.isNaN(Number(value))
      ? value
      : "0";

  return (
    <div className="grid grid-cols-1 gap-y-4 w-full">
      <SimpleTable
        title="주차별 수수료 결제"
        headers={["1주차", "2주차", "3주차", "4주차", "5주차"]}
        rows={[
          {
            cells: ["first", "second", "third", "fourth", "fifth"].map(key => ({
              text: weekSummary[key] > 0 ? money(weekSummary[key]) : 0,
            })),
          },
            {
            cells: [
              { text: "", colSpan: 3, bare: true, className: "bg-transparent" },
              { text: "합계", className: "bg-blue-200 font-bold" },
              {
                text: weekSummary.total > 0 ? money(weekSummary.total) : 0,
                className: "bg-white font-bold",
              },
            ],
          },
        ]}
      />
      <SimpleTable
        title="채널별 결제 수수료"
        headers={["채널", "광고비", "위촉비", "면접케어", "위촉케어", "선입금", "합계"]}
        rows={[
          ...gubunRows.map(gubun => ({
            cells: [
              { text: gubun.gubun },
              { text: money(gubun.paidAd) },
              { text: money(gubun.paidComm) },
              { text: money(gubun.paidIntvCare) },
              { text: money(gubun.paidCommCare) },
              { text: money(gubun.prepayment) },
              {
                text: money(gubun.gubun === "IM" ? gubunTotal.im : gubunTotal.tm),
              },
            ],
          })),
          {
            cells: [
              { text: "", colSpan: 5, bare: true, className: "bg-transparent" },
              { text: "합계", className: "bg-blue-200 font-bold" },
              {
                text: gubunTotal.total > 0 ? money(gubunTotal.total) : 0,
                className: "bg-white font-bold",
              },
            ],
          },
        ]}
      />
      <SimpleTable
        title="고객사별 결제 수수료"
        headers={["고객사별", "광고비", "위촉비", "면접케어", "위촉케어", "선입금", "합계"]}
        rows={[
          ...compNmList.map(comp => ({
            cells: [
              { text: comp.companyName },
              { text: money(comp.paidAd) },
              { text: money(comp.paidComm) },
              { text: money(comp.paidIntvCare) },
              { text: money(comp.paidCommCare) },
              { text: money(comp.prepayment) },
              { text: money(rowAmount(comp)) },
            ],
          })),
          {
            cells: [
              { text: "합계", className: "bg-blue-200 font-bold" },
              { text: money(compNmTotal.paidAd) },
              { text: money(compNmTotal.paidComm) },
              { text: money(compNmTotal.paidIntvCare) },
              { text: money(compNmTotal.paidCommCare) },
              { text: money(compNmTotal.prepayment) },
              { text: money(compNmTotal.total), className: "bg-white font-bold" },
            ],
          },
        ]}
      />
      <SimpleTable
        title="고객사 결제 방식별 수수료"
        headers={["고객사별", "현금", "카드", "세금계산서", "합계"]}
        rows={[
          ...compSumList.map(comp => ({
            cells: [
              { text: comp.companyName },
              { text: money(comp.cashPayment) },
              { text: money(comp.cardPayment) },
              { text: money(comp.billPayment) },
              {
                text: money(
                  toNumber(comp.cashPayment) +
                    toNumber(comp.cardPayment) +
                    toNumber(comp.billPayment)
                ),
              },
            ],
          })),
          {
            cells: [
              { text: "합계", className: "bg-blue-200 font-bold" },
              { text: money(compSumTotal.cashPayment) },
              { text: money(compSumTotal.cardPayment) },
              { text: money(compSumTotal.billPayment) },
              { text: money(compSumTotal.total), className: "bg-white font-bold" },
            ],
          },
        ]}
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <SimpleTable
          title="결제방식별 결제 비율"
          headerClassName="bg-green-200"
          headers={["구분", "금액", "비율"]}
          rows={[
            {
              cells: [
                { text: "현금" },
                { text: money(stat.cashPayment) },
                { text: `${ratio(stat.cashRatio)}%` },
              ],
            },
            {
              cells: [
                { text: "법인" },
                { text: money(stat.billPayment) },
                { text: `${ratio(stat.billRatio)}%` },
              ],
            },
            {
              cells: [
                { text: "카드" },
                { text: money(stat.cardPayment) },
                { text: `${ratio(stat.cardRatio)}%` },
              ],
            },
            {
              cells: [
                { text: "합계", className: "bg-green-200 font-bold" },
                {
                  text: money(statisticsTotal),
                  colSpan: 2,
                  className: "bg-white font-bold",
                },
              ],
            },
          ]}
        />
        <SimpleTable
          title="카드종류별 결제 비율"
          headerClassName="bg-green-200"
          headers={["구분", "금액", "비율"]}
          rows={[
            {
              cells: [
                { text: "카드(몬)" },
                { text: money(stat.moCardPayment) },
                { text: `${ratio(stat.moCardRatio)}%` },
              ],
            },
            {
              cells: [
                { text: "카드(천국)" },
                { text: money(stat.heCardPayment) },
                { text: `${ratio(stat.heCardRatio)}%` },
              ],
            },
            {
              cells: [
                { text: "카드(펄스맥)" },
                { text: money(stat.peCardPayment) },
                { text: `${ratio(stat.peCardRatio)}%` },
              ],
            },
            {
              cells: [
                { text: "카드(PG)" },
                { text: money(stat.pgCardPayment) },
                { text: `${ratio(stat.pgCardRatio)}%` },
              ],
            },
            {
              cells: [
                { text: "카드 합계", className: "bg-green-200 font-bold" },
                {
                  text: money(stat.cardPayment),
                  colSpan: 2,
                  className: "bg-white font-bold",
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
}

function MonthlyReport2() {
  const navi = useNavigate();
  const user = useSelector(state => state.user);
  const thisLocation = useLocation();
  const [, setTitle] = useOutletContext();

  const [tabMenu, setTabMenu] = useState(0);
  const [listA, setListA] = useState([]);
  const [weekList, setWeekList] = useState([]);
  const [compNmList, setCompNmList] = useState([]);
  const [compSumList, setCompSumList] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [gubunList, setGubunList] = useState([]);
  const [year, setYear] = useState(dayjs(new Date()).format("YYYY"));
  const [month, setMonth] = useState(dayjs(new Date()).format("MM"));

  useEffect(() => {
    setTitle("월간보고(테이블)");
    if (tabMenu === 0) {
      getMonthlyReport(year, month);
      setWeekList([]);
      setCompNmList([]);
      setCompSumList([]);
      setGubunList([]);
    } else {
      setListA([]);
      getMonthlyStatisticReport(year, month);
    }
    // 기존 MonthlyReport와 같이 화면 진입, 탭, 연월이 바뀔 때 다시 조회합니다.
    // eslint-disable-next-line
  }, [thisLocation, tabMenu, year, month]);

  const getMonthlyReport = async (searchYear, searchMonth) => {
    const data = { searchYear, searchMonth };
    await axiosInstance
      .post("/api/v1/comp/month/pay/list", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          navi("/");
          return false;
        }
        setListA(res.data.statisticsList || []);
      })
      .catch(e => console.log(e));
  };

  const getMonthlyStatisticReport = async (searchYear, searchMonth) => {
    const data = { searchYear, searchMonth };
    await axiosInstance
      .post("/api/v1/comp/month/statistics", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.data.code === "E999" || res.data.code === "E403") {
          navi("/");
          return false;
        }
        setWeekList(res.data.weekList || []);
        setCompNmList(res.data.compNmList || []);
        setCompSumList(res.data.compSumList || []);
        setGubunList(res.data.gubunList || []);
        setStatistics(res.data.statistics || {});
      })
      .catch(e => console.log(e));
  };

  const weekSummary = useMemo(() => buildWeekSummary(weekList), [weekList]);
  const gubunTotal = useMemo(() => buildGubunSummary(gubunList), [gubunList]);
  const compNmTotal = useMemo(() => buildCompNmSummary(compNmList), [compNmList]);
  const compSumTotal = useMemo(
    () => buildCompSumSummary(compSumList),
    [compSumList]
  );
  const stat =
    statistics && !Array.isArray(statistics) ? statistics : {};
  const statisticsTotal =
    toNumber(stat.cashPayment) +
    toNumber(stat.billPayment) +
    toNumber(stat.cardPayment);

  const canExport =
    tabMenu === 0
      ? listA.length > 0
      : weekList.length > 0 ||
        compNmList.length > 0 ||
        compSumList.length > 0 ||
        gubunList.length > 0;

  const exportToExcel = async () => {
    if (!canExport) {
      alert("데이터가 없습니다.");
      return;
    }
    if (tabMenu === 0) {
      await exportReportA(year, month, listA);
      return;
    }
    await exportReportB(year, month, {
      weekSummary,
      gubunList,
      gubunTotal,
      compNmList,
      compNmTotal,
      compSumList,
      compSumTotal,
      stat,
      statisticsTotal,
    });
  };

  return (
    <div className="mx-4 gap-x-4 text-sm">
      <div className="py-2 px-4 bg-white flex flex-row flex-wrap justify-between items-center w-full h-fit rounded drop-shadow gap-3">
        <div className="flex flex-row justify-start gap-x-2">
          <button
            className={`${
              tabMenu === 0
                ? "bg-green-500 text-white"
                : "bg-white hover:bg-green-700 hover:text-white text-green-700"
            } transition-all duration-300 border border-green-500 rounded p-2`}
            onClick={() => setTabMenu(0)}
            disabled={tabMenu === 0}
          >
            보고양식 1
          </button>
          <button
            className={`${
              tabMenu === 1
                ? "bg-green-500 text-white"
                : "bg-white hover:bg-green-700 hover:text-white text-green-700"
            } transition-all duration-300 border border-green-500 rounded p-2`}
            onClick={() => setTabMenu(1)}
            disabled={tabMenu === 1}
          >
            보고양식 2
          </button>
        </div>
        <div className="flex justify-start gap-x-3">
          <span className="font-bold whitespace-nowrap py-2">연도별 보기</span>
          <select
            className="p-2 border border-gray-300 hover:border-gray-500 focus:bg-gray-50 focus:border-gray-600 w-28 shrink-0"
            value={year}
            onChange={e => setYear(e.currentTarget.value)}
          >
            <option value="">연도 선택</option>
            <option value="2023">2023년</option>
            <option value="2024">2024년</option>
            <option value="2025">2025년</option>
            <option value="2026">2026년</option>
          </select>
        </div>
        <div className="flex justify-start gap-x-3 items-center">
          <span className="font-bold whitespace-nowrap py-2">월별 보기</span>
          <MonthButton month={month} setMonth={setMonth} />
          <button
            type="button"
            onClick={exportToExcel}
            disabled={!canExport}
            className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors whitespace-nowrap disabled:bg-gray-300"
          >
            엑셀 다운로드
          </button>
        </div>
      </div>
      <div className="mt-4">
        {tabMenu === 0 ? (
          <ReportATable list={listA} />
        ) : (
          <ReportBTable
            weekSummary={weekSummary}
            gubunList={gubunList}
            gubunTotal={gubunTotal}
            compNmList={compNmList}
            compNmTotal={compNmTotal}
            compSumList={compSumList}
            compSumTotal={compSumTotal}
            stat={stat}
            statisticsTotal={statisticsTotal}
          />
        )}
      </div>
    </div>
  );
}

export default MonthlyReport2;
