# company_info API (빌링 DB / MariaDB)

`BILLING_*` 환경 변수로 연결되는 빌링 DB의 `company_info` 테이블 API입니다.

- **라우트 파일**: `routes/companyInfoRoutes.js`
- **DB 풀**: `db/kotibilldb.js` (빌링), `db/mysql3.js` (`company_tm.bill_code` 반영)
- **등록**: `server.js` → `app.use("/", require("./routes/companyInfoRoutes"));`

> NAS의 기존 회사 목록(`GET /api/company/list`)과는 다른 API입니다.
>
> 정산일 순 잔액 목록은 `docs/company-info-balance-api.md`의 `GET /api/billing/company-info/balance`입니다.
>
> NAS `company_tm`의 담당자 검색과 `bill_code` 저장은 `docs/company-tm-api.md`에 있습니다.

인증: 별도 JWT/토큰 검증 없음

---

## 테이블 스키마

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `company_code` | `VARCHAR(40)` | 회사 코드. `koti_2026_0001242` 형식. 등록 시 서버가 발급 |
| `gubun` | `VARCHAR(10)` | 구분 |
| `company_name` | `VARCHAR(30)` | 회사명 |
| `company_branch` | `VARCHAR(20)` | 지점 |
| `channel` | `VARCHAR(10)` | 채널 |
| `manager_1` | `VARCHAR(10)` | 담당자 1 |
| `manager_2` | `VARCHAR(10)` | 담당자 2 |
| `reg_date` | `TIMESTAMP` | 등록일시. 등록 시 `NOW()` |
| `upt_date` | `TIMESTAMP` | 수정일시. 등록·수정 시 `NOW()` |
| `com_contact` | `VARCHAR(15)` | 연락처. 15자 이하 |
| `alias_list` | 문자열 | 별칭. 요청 문자열을 그대로 저장 |

> 응답의 `reg_date`, `upt_date`는 `YYYY-MM-DD HH:mm:ss` 문자열입니다.

`company_code`는 `koti_` + 한국시간 기준 올해 + `_` + 7자리 일련번호입니다. 일련번호는 기존 코드의 마지막 숫자 중 가장 큰 값에 1을 더한 뒤, 7자리가 되도록 앞에 0을 채웁니다.

---

## 엔드포인트 요약

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `GET` | `/api/billing/company-info` | `reg_date` 최신 10건 |
| `GET` | `/api/billing/company-info/list` | `company_code` 내림차순 목록. `page`, `size`(기본 20) |
| `GET` | `/api/billing/company-info/search` | 회사명·지점·담당자·별칭 포함 검색. `company_code` 내림차순 |
| `POST` | `/api/billing/company-info` | 등록. `company_code` 자동 발급 |
| `POST` | `/api/billing/company-info/update` | `company_code`가 같은 행 수정 |

---

## 1. 목록 — `GET /api/billing/company-info/list`

`company_info` 전체를 `company_code` 내림차순으로 나눕니다. 코드 문자열이 큰 행이 먼저입니다. `koti_2026_0001242`가 `koti_2026_0001241`보다 앞입니다.

**쿼리**

| 필드 | 필수 | 기본값 | 설명 |
|------|------|--------|------|
| `page` | 아니오 | `1` | 1 이상의 정수 |
| `size` | 아니오 | `20` | 한 페이지 건수. 1 이상 200 이하 |

**요청 예시**

```bash
curl -s "https://백엔드도메인/api/billing/company-info/list?page=1&size=20"
```

`size`를 빼면 20건입니다.

```bash
curl -s "https://백엔드도메인/api/billing/company-info/list"
```

**성공** `200`

```json
{
  "success": true,
  "page": 1,
  "size": 20,
  "total": 1242,
  "totalCount": 1242,
  "totalPage": 63,
  "count": 20,
  "data": [
    {
      "company_code": "koti_2026_0001242",
      "gubun": "광고",
      "company_name": "한국티엠",
      "company_branch": "강남",
      "channel": "온라인",
      "manager_1": "홍길동",
      "manager_2": "김철수",
      "reg_date": "2026-10-07 11:30:00",
      "upt_date": "2026-10-07 11:30:00",
      "com_contact": "01012345678",
      "alias_list": "1234, 5678 , 2232"
    }
  ]
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `page` | number | 요청한 페이지 |
| `size` | number | 요청한 페이지 크기 |
| `total`, `totalCount` | number | 조건에 맞는 전체 건수. 같은 값 |
| `totalPage` | number | 전체 페이지 수. 데이터가 없으면 `0` |
| `count` | number | 이번 응답 `data` 길이 |
| `data` | array | 회사 행. `alias_list`는 저장된 문자열 그대로 |

페이지가 마지막을 넘으면 `success`는 `true`이고 `data`는 빈 배열입니다.

**실패**

| 상태 | 조건 | message |
|------|------|---------|
| `400` | `page`가 1 이상의 정수가 아님 | `page는 1 이상의 정수여야 합니다.` |
| `400` | `size`가 1~200 정수가 아님 | `size는 1 이상 200 이하의 정수여야 합니다.` |
| `500` | DB 오류 | `DB 조회 중 오류가 발생했습니다.` |

---

## 2. 검색 — `GET /api/billing/company-info/search`

`keyword`가 아래 컬럼 중 하나에 포함되면 그 행을 반환합니다.

- `company_name`
- `company_branch`
- `manager_1`
- `manager_2`
- `alias_list`

여러 컬럼에 같이 맞아도 회사 행은 한 번만 나옵니다. 정렬은 목록과 같이 `company_code` 내림차순입니다.

`%`, `_`, `\`는 와일드카드로 쓰지 않고 글자 그대로 찾습니다. `keyword`의 앞뒤 공백은 제거합니다. 컬럼 안의 부분 문자열이면 됩니다. `alias_list`가 `1234, 5678`이면 `5678`로 찾을 수 있습니다.

**쿼리**

| 필드 | 필수 | 기본값 | 설명 |
|------|------|--------|------|
| `keyword` | 예 |  | 찾을 문자열 |
| `page` | 아니오 | `1` | 1 이상의 정수 |
| `size` | 아니오 | `20` | 한 페이지 건수. 1 이상 200 이하 |

**요청 예시**

```bash
curl -s "https://백엔드도메인/api/billing/company-info/search?keyword=한국티엠&page=1&size=20"
```

**성공** `200`

목록과 같은 페이지 필드에 `keyword`가 더해집니다.

```json
{
  "success": true,
  "keyword": "한국티엠",
  "page": 1,
  "size": 20,
  "total": 1,
  "totalCount": 1,
  "totalPage": 1,
  "count": 1,
  "data": [
    {
      "company_code": "koti_2026_0001242",
      "gubun": "광고",
      "company_name": "한국티엠",
      "company_branch": "강남",
      "channel": "온라인",
      "manager_1": "홍길동",
      "manager_2": "김철수",
      "reg_date": "2026-10-07 11:30:00",
      "upt_date": "2026-10-07 11:30:00",
      "com_contact": "01012345678",
      "alias_list": "1234, 5678 , 2232"
    }
  ]
}
```

**실패**

| 상태 | 조건 | message |
|------|------|---------|
| `400` | `keyword`가 없거나 공백 | `keyword는 필수입니다.` |
| `400` | `page`, `size` 형식 오류 | 목록과 같음 |
| `500` | DB 오류 | `DB 조회 중 오류가 발생했습니다.` |

---

## 3. 최신 10건 — `GET /api/billing/company-info`

`reg_date` 내림차순 10건입니다. `reg_date`가 같으면 `company_code` 오름차순입니다. 쿼리스트링은 무시됩니다. 이 응답에는 `alias_list`가 없습니다. 별칭이 필요하면 목록 또는 검색을 사용합니다.

```bash
curl -s "https://백엔드도메인/api/billing/company-info"
```

**성공** `200`

```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "company_code": "koti_2026_0001239",
      "gubun": "IM",
      "company_name": "농협손해",
      "company_branch": "수원시청(농손/최선미)",
      "channel": "HB",
      "manager_1": "최선미",
      "manager_2": "",
      "reg_date": "2026-09-30 17:49:07",
      "upt_date": "2026-09-30 17:49:07",
      "com_contact": null
    }
  ]
}
```

---

## 4. 등록 — `POST /api/billing/company-info`

필수 항목은 없습니다. 보낸 필드만 저장합니다. 없거나 공백인 필드는 컬럼을 넣지 않습니다.

`company_code`와 연도는 요청으로 받지 않습니다. 서버가 한국시간 기준 올해로 코드를 만듭니다.

`reg_date`, `upt_date`는 `NOW()`입니다.

`alias_list`는 받은 문자열 그대로 `company_info`에 저장합니다. `"1234, 5678 , 2232"`이면 DB에도 그 문자열입니다.

`company_tm.bill_code`를 맞출 때만 쉼표로 나누고, 각 조각의 앞뒤 공백을 제거합니다. `com_name_alias`가 `1234`, `5678`, `2232`인 행을 찾습니다. `bill_code`가 비어 있거나 이번 `company_code`와 다를 때만 이번 코드로 바꿉니다.

**요청**

```json
{
  "gubun": "광고",
  "company_name": "한국티엠",
  "company_branch": "강남",
  "channel": "온라인",
  "manager_1": "홍길동",
  "manager_2": "김철수",
  "com_contact": "01012345678",
  "alias_list": "1234, 5678 , 2232"
}
```

```bash
curl -s -X POST "https://백엔드도메인/api/billing/company-info" \
  -H "Content-Type: application/json" \
  -d "{\"company_name\":\"한국티엠\",\"alias_list\":\"1234, 5678 , 2232\"}"
```

**성공** `201`

`alias_list`를 보냈으면 `company_tm`이 함께 옵니다. `matched`는 별칭이 맞은 `company_tm` 행이고, `missing_aliases`는 맞는 행이 없는 별칭입니다.

```json
{
  "success": true,
  "data": {
    "company_code": "koti_2026_0001242",
    "company_name": "한국티엠",
    "alias_list": "1234, 5678 , 2232",
    "reg_date": "2026-10-07 13:30:00",
    "upt_date": "2026-10-07 13:30:00"
  },
  "company_tm": {
    "updated_count": 2,
    "matched": [
      {
        "com_code": "c10103972",
        "com_name_alias": "1234",
        "bill_code": "koti_2026_0001242"
      }
    ],
    "missing_aliases": ["2232"]
  }
}
```

**실패**

| 상태 | 조건 |
|------|------|
| `400` | `alias_list`가 문자열이 아님, `com_contact`가 15자를 넘음, 컬럼 길이 초과 |
| `409` | 같은 회사코드가 이미 있음, 또는 일련번호가 7자리를 넘음 |
| `503` | 회사코드 발급 대기가 10초를 넘음 |
| `500` | DB 오류. `company_info`만 저장되고 `bill_code` 반영이 실패하면 `company_code`를 함께 반환 |

---

## 5. 수정 — `POST /api/billing/company-info/update`

`company_code`가 같은 행만 고칩니다. 보낸 항목만 바꾸고, 빠뜨린 항목은 그대로 둡니다. `upt_date`는 `NOW()`로 갱신하고 `reg_date`는 바꾸지 않습니다.

`alias_list`를 보내면 그 문자열을 그대로 저장한 뒤, 등록과 같이 쉼표로 나눠 trim한 값으로 `company_tm.com_name_alias`를 찾습니다. `bill_code`가 비어 있거나 이 `company_code`와 다르면 이 코드로 고칩니다.

**요청**

```json
{
  "company_code": "koti_2026_0001242",
  "company_name": "한국티엠",
  "alias_list": "1234, 5678 , 2232"
}
```

```bash
curl -s -X POST "https://백엔드도메인/api/billing/company-info/update" \
  -H "Content-Type: application/json" \
  -d "{\"company_code\":\"koti_2026_0001242\",\"alias_list\":\"1843\"}"
```

**성공** `200`

등록과 같은 `data` 형식입니다. `alias_list`를 보낸 경우에만 `company_tm`이 있습니다.

**실패**

| 상태 | 조건 |
|------|------|
| `400` | `company_code` 없음, 50자 초과, 수정할 값이 없음, `alias_list` 형식 오류, `com_contact` 15자 초과 |
| `404` | 해당 `company_code`가 없음 |
| `500` | DB 오류 |

---

## 반영

라우트는 서버 기동 시 한 번 로드됩니다. 파일을 수정한 뒤에는 실행 중인 프로세스를 다시 띄워야 합니다.

```bash
pm2 restart <앱이름>
```
