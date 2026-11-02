# 수금 정산 최근 채용기간 API

요청 배열의 `company_code`로 kotibilldb `company_commission`을 읽고, 채용 시작일·종료일이 있는 행 중 `reg_date`가 가장 최근인 한 건의 날짜를 돌려줍니다.

- **라우트 파일**: `routes/companyCommissionLatestHireRoutes.js`
- **DB 풀**: `db/kotibilldb.js` (빌링 `company_commission`)
- **등록**: `server.js` → `app.use("/", require("./routes/companyCommissionLatestHireRoutes"));`

`index`는 조회에 쓰지 않습니다. 프론트가 요청 줄을 구분하려고 넣은 값이라, 응답에 그대로 붙입니다.

인증: 별도 JWT/토큰 검증 없음  
캐시: `Cache-Control: no-cache`

---

## 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `POST` | `/api/billing/company-commission/latest-hire` | `company_code`별 최근 채용 시작일·종료일 |

공통 헤더: `Content-Type: application/json`

본문은 객체가 아니라 **배열**입니다. 한 번에 500건 이하입니다.

| 필드 | 필수 | 타입 | 설명 |
|------|------|------|------|
| `index` | 예 | number | 응답에 그대로 돌려주는 값. 조회에는 쓰지 않음 |
| `company_code` | 예 | string | `company_commission.company_code`. 앞뒤 공백은 제거. 최대 40자 |

```bash
curl -s -X POST "https://백엔드도메인/api/billing/company-commission/latest-hire" \
  -H "Content-Type: application/json" \
  -d '[
    { "index": 0, "company_code": "aaaabbbb" },
    { "index": 1, "company_code": "ccccdddd" }
  ]'
```

NAS에서 서버가 `1106` 포트로 떠 있다면:

```bash
curl -s -X POST "http://127.0.0.1:1106/api/billing/company-commission/latest-hire" \
  -H "Content-Type: application/json" \
  -d '[
    { "index": 0, "company_code": "aaaabbbb" },
    { "index": 1, "company_code": "ccccdddd" }
  ]'
```

---

## 처리 순서

요청에 들어온 순서를 유지합니다. 같은 `company_code`가 여러 번 있어도 조회는 한 번이고, 각 줄에 같은 날짜를 붙입니다.

1. `company_code`가 같은 `company_commission` 행을 찾습니다.
2. `hire_start_date`와 `hire_end_date`가 둘 다 비어 있지 않은 행만 남깁니다. `NULL`, 빈 문자열, `0000-00-00`은 없는 날짜로 봅니다.
3. 그중 `reg_date`가 가장 최근인 행 하나를 고릅니다. `reg_date`가 같으면 `comm_code`가 큰 행을 씁니다.
4. 두 날짜는 `YYYY-MM-DD`로 내려줍니다. 시각은 뺍니다.
5. 조건에 맞는 행이 없으면 그 줄의 두 날짜는 `null`입니다. 줄 자체는 빼지 않습니다.

같은 회사의 정산 행이 `reg_date` `2025-01-01`과 `2025-01-03`이면 `2025-01-03` 행의 채용 기간을 줍니다.

---

## 응답

성공 `200`

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "index": 0,
      "company_code": "aaaabbbb",
      "hire_start_date": "2025-01-03",
      "hire_end_date": "2025-01-31"
    },
    {
      "index": 1,
      "company_code": "ccccdddd",
      "hire_start_date": null,
      "hire_end_date": null
    }
  ]
}
```

| 필드 | 설명 |
|------|------|
| `index` | 요청에 넣은 숫자 |
| `company_code` | 공백을 뺀 회사 코드 |
| `hire_start_date` | 최근 정산 행의 채용 시작일. 없으면 `null` |
| `hire_end_date` | 최근 정산 행의 채용 종료일. 없으면 `null` |

실패 `400`. 본문이 배열이 아니거나, `index`가 숫자가 아니거나, `company_code`가 비었거나 40자를 넘을 때입니다.

```json
{
  "success": false,
  "message": "0번째 항목의 company_code는 필수입니다."
}
```

실패 `500`. 빌링 DB 조회가 실패한 경우입니다.

```json
{
  "success": false,
  "message": "DB 조회 중 오류가 발생했습니다."
}
```
