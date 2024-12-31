import * as XLSX from "xlsx";
// 테이블 데이터를 엑셀 파일로 저장하는 함수
export const exportTableToExcel = (fileType, tableRef, name) => {
  const table = tableRef.current; // 자식 컴포넌트의 테이블 참조
  if (!table) {
    alert("테이블을 찾을 수 없습니다.");
    return;
  }
  const workbook = XLSX.utils.table_to_book(table); // 테이블 데이터를 워크북으로 변환
  const fileName = `${name}.${fileType}`; // 저장할 파일 이름
  XLSX.writeFile(workbook, fileName);
};
