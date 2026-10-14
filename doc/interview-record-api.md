# 입금 기록 API (hddpg / interview_record)

고객사 입금 기록을 등록·조회·수정·삭제합니다. 한 건에 고객사를 여러 곳 넣을 수 있습니다.

입금 금액·날짜는 `interview_record`에 두고, 고객사 배열은 `interview_record_com`에 둡니다. 두 행은 `ir_code`로 연결됩니다. `interview_record_com.ir_code`는 UNIQUE라 입금 한 건에 고객사 행이 하나입니다.

- **라우트 파일**: `routes/interviewRecordRoutes.js`
- **DB 풀**: `db/hddpg.js` (`PG*` 환경 변수)
- **고객사 조회**: `db/mysql3.js` (mysqlSub `company_tm`)
- **등록**: `server.js` → `app.use("/", require("./routes/interviewRecordRoutes"));`

인증: 별도 JWT/토큰 검증 없음

요청에는 `com_name_alias`, `inc_cash`, `inc_date`만 넣습니다. `com_name_alias`는 `"1706, 1802"`처럼 콤마로 구분한 문자열입니다. 서버가 콤마로 나누고 각 값의 앞뒤 공백을 뺀 뒤, 그 순서대로 `company_tm`을 조회합니다.

같은 index에 아래 네 배열이 맞습니다.

| index | 저장 컬럼        | 값                                      |
| ----- | ---------------- | --------------------------------------- |
| 0     | `com_name_alias` | 요청에서 나눈 별칭                      |
| 0     | `com_code`       | 그 별칭의 `company_tm.com_code`         |
| 0     | `company_name`   | `{com_name}{com_category} - {com_area}` |
| 0     | `manager`        | `company_tm.com_manager`                |

본문에 `com_code`, `company_name`, `manager`를 넣어도 무시합니다. `ir_id`가 있으면 그 값과 같은 `interview_record.id` 행의 입금액·입금일·`ir_code`를 고칩니다. `create_at`은 유지됩니다. `ir_id`가 없고 `ir_code`가 있으면 그 코드로 입금 행을 추가합니다. 이 테이블은 같은 `ir_code`를 여러 행에 넣을 수 있습니다. 둘 다 없으면 서버가 새 코드를 발급합니다.

`interview_record_com`은 `ir_code`당 한 행입니다. 요청에 `ir_code`가 있고 그 행이 있으면, `com_name_alias`에 아직 없는 별칭만 `com_code`, `company_name`, `manager`와 함께 배열 뒤에 붙입니다. 이미 있는 별칭은 바꾸지 않습니다. 그 코드의 고객사 행이 없으면 새로 만듭니다.

`ir_code`를 빼면 입금일 연도로 새 코드를 만들고 두 테이블을 새로 넣습니다. 입금일 연도별로 번호가 따로 올라갑니다. 이후 입금일을 바꿔도 이미 발급된 코드는 유지됩니다.

```text
ko_intv_2026_00000001
ko_intv_ + 연도 4자리 + _ + 8자리 순번
```

그 연도의 첫 번호는 `00000001`입니다. 다음 건은 `00000002`처럼 1씩 증가하고, 8자리가 되도록 앞에 0을 채웁니다. 연도가 바뀌면 다시 `00000001`부터입니다.

발급되는 코드는 21자이고, 두 테이블의 `ir_code` 컬럼은 `VARCHAR(50)`입니다. 서버는 저장 전에 21자로 자르거나 거절하지 않습니다.

`interview_record.create_at`(작성시간)은 등록할 때 서버가 `NOW()`로 넣습니다. `interview_record_com.created_at`도 등록 시 `NOW()`이고, `updated_at`은 등록할 때와 고객사 배열을 수정할 때 `NOW()`로 바뀝니다. 시각 응답은 UTC ISO 문자열이고, 화면에는 한국 시간으로 바꿔 표시합니다. `inc_date` 응답은 `YYYY-MM-DD`입니다.

---

## 테이블

### `interview_record`

| 컬럼        | 타입          | NULL     | 설명                                                                                                     |
| ----------- | ------------- | -------- | -------------------------------------------------------------------------------------------------------- |
| `id`        | `SERIAL`      | NOT NULL | 기본키. 경로의 `:id`는 이 값                                                                             |
| `ir_code`   | `VARCHAR(50)` | NULL     | 면접비코드. 등록 시 서버 발급. 예: `ko_intv_2026_00000001` (21자). `interview_record_com.ir_code`와 같음 |
| `inc_cash`  | `INT`         | NULL     | 입금액. `-2147483648` ~ `2147483647`                                                                     |
| `inc_date`  | `DATE`        | NULL     | 입금일. `YYYY-MM-DD`. `ir_code` 연도에 사용                                                              |
| `create_at` | `TIMESTAMPTZ` | NULL     | 작성시간. 등록 시 서버 시각. 이후 변경 없음                                                              |

### `interview_record_com`

| 컬럼             | 타입                 | NULL     | 설명                                                      |
| ---------------- | -------------------- | -------- | --------------------------------------------------------- |
| `id`             | `SERIAL`             | NOT NULL | 고객사 행 기본키. API 경로에는 쓰지 않음                  |
| `ir_code`        | `VARCHAR(50)` UNIQUE | NULL     | 면접비코드. 입금 행과 연결                                |
| `com_code`       | `VARCHAR(20)[]`      | NULL     | 고객사코드 배열. `company_tm`에서 채움                    |
| `com_name_alias` | `VARCHAR(10)[]`      | NULL     | 고객사코드(숫자만) 배열. 요청 문자열을 나눈 값            |
| `company_name`   | `VARCHAR(20)[]`      | NULL     | 고객사명 배열. `{com_name}{com_category} - {com_area}`    |
| `manager`        | `VARCHAR(10)[]`      | NULL     | 담당자명 배열. `com_manager`                              |
| `created_at`     | `TIMESTAMPTZ`        | NULL     | 생성시간. 등록 시 서버 시각                               |
| `updated_at`     | `TIMESTAMPTZ`        | NULL     | 수정시간. 등록 시, 그리고 고객사 배열을 바꿀 때 서버 시각 |

배열 원소 하나의 길이 제한입니다. `company_name`이 20자를 넘거나 `manager`가 10자를 넘으면 그 별칭을 포함해 `400`입니다. 이름이 더 길면 컬럼 길이를 늘린 뒤, 라우트의 `MAX_LEN`도 같이 맞춰야 합니다.

같은 별칭에 서로 다른 `com_code`가 있으면 저장하지 않습니다. 코드가 하나이고 행이 여러 개면 `updated_at`이 최신인 행의 이름·담당자를 씁니다.

빈 토큰(`"1706,,1802"`의 가운데)은 버립니다. 별칭을 중복해서 보내면 그 순서대로 같은 고객사가 배열에 두 번 들어갑니다.

---

## 엔드포인트

| 메서드   | 경로                           | 설명                                                   |
| -------- | ------------------------------ | ------------------------------------------------------ |
| `POST`   | `/api/interview-record`        | 생성. `ir_code` 발급                                   |
| `GET`    | `/api/interview-record/list`   | 목록 (페이징·검색·정렬)                                |
| `GET`    | `/api/interview-record/lookup` | `ir_code`와 `inc_date`가 같은 기존 행. 수정·신규 판단  |
| `GET`    | `/api/interview-record/:id`    | 단건 조회. `:id`는 행 번호                             |
| `PATCH`  | `/api/interview-record/:id`    | 부분 수정. `ir_code`는 유지                            |
| `PUT`    | `/api/interview-record/:id`    | 전체 교체. `ir_code`는 유지                            |
| `DELETE` | `/api/interview-record/:id`    | 입금 행 한 건만 삭제. 고객사 행은 유지                 |
| `DELETE` | `/api/interview-record/com`    | `ir_code`의 고객사 행과, 그 코드의 입금 행을 모두 삭제 |

글 본문은 `Content-Type: application/json` 입니다.

---

## 1. 생성 — `POST /api/interview-record`

| 필드             | 필수   | 타입    | 설명                                                                                        |
| ---------------- | ------ | ------- | ------------------------------------------------------------------------------------------- |
| `com_name_alias` | 예     | string  | 콤마로 구분한 숫자 별칭. 각 값은 최대 10자. 한 번에 100개 이하                              |
| `inc_cash`       | 예     | integer | 입금액                                                                                      |
| `inc_date`       | 예     | string  | 입금일. `YYYY-MM-DD`. `ir_code`를 빼면 이 연도로 코드를 만듦                                |
| `ir_code`        | 아니오 | string  | 면접비코드. 최대 50자. `ir_id`가 없으면 이 코드로 행을 추가하고, 있으면 그 행의 코드로 저장 |
| `ir_id`          | 아니오 | integer | `interview_record.id`. 있으면 그 행을 수정. 1 이상의 정수                                   |

`ir_code` 없이 등록하면 새 코드가 발급됩니다.

```bash
curl -s -X POST "http://127.0.0.1:1106/api/interview-record" \
  -H "Content-Type: application/json" \
  -d "{\"com_name_alias\":\"1706, 1802\",\"inc_cash\":500000,\"inc_date\":\"2026-10-12\"}"
```

이미 있는 코드로 입금 행을 추가하고, 고객사 배열에는 없는 별칭만 붙입니다.

```bash
curl -s -X POST "http://127.0.0.1:1106/api/interview-record" \
  -H "Content-Type: application/json" \
  -d "{\"ir_code\":\"ko_intv_2026_00000001\",\"com_name_alias\":\"1775, 1335\",\"inc_cash\":300000,\"inc_date\":\"2026-04-08\"}"
```

이미 있는 입금 행을 고칩니다. `ir_id`는 `interview_record.id`입니다.

```bash
curl -s -X POST "http://127.0.0.1:1106/api/interview-record" \
  -H "Content-Type: application/json" \
  -d "{\"ir_id\":1,\"ir_code\":\"ko_intv_2026_00000001\",\"com_name_alias\":\"1775, 1335\",\"inc_cash\":300000,\"inc_date\":\"2026-04-08\"}"
```

이때 상태는 `200`이고 `message`는 `입금 기록이 수정되었습니다.`입니다. 새 `interview_record` 행은 만들지 않습니다. `interview_record_com`은 `ir_code`가 같은 행에서 아직 없는 별칭만 붙입니다.

**성공** `201`

```json
{
  "success": true,
  "message": "입금 기록이 등록되었습니다.",
  "added_aliases": ["1706", "1802"],
  "data": {
    "id": 1,
    "ir_code": "ko_intv_2026_00000001",
    "com_code": ["c10052100", "c10052200"],
    "com_name_alias": ["1706", "1802"],
    "company_name": ["예시TM - 강남", "다른TM - 수원"],
    "manager": ["홍길동", "김철수"],
    "inc_cash": 500000,
    "inc_date": "2026-10-12",
    "create_at": "2026-10-12T02:59:00.000Z",
    "created_at": "2026-10-12T02:59:00.000Z",
    "updated_at": "2026-10-12T02:59:00.000Z"
  }
}
```

`added_aliases`는 이번에 `interview_record_com`에 새로 넣은 별칭입니다. `ir_code`를 지정했는데 그 별칭이 이미 배열에 있으면 여기 들어오지 않고, 고객사 행의 `updated_at`도 바꾸지 않습니다. 응답 `data`의 고객사 배열은 기존 값 뒤에 새 별칭을 붙인 전체입니다. `data.id`는 `ir_id`로 수정한 행이거나, `ir_id`가 없으면 방금 추가한 `interview_record` 행입니다.

`com_code[0]`, `com_name_alias[0]`, `company_name[0]`, `manager[0]`이 첫 번째 별칭의 값입니다. 담당자나 고객사명이 없으면 그 칸은 `null`이고, 배열 길이는 별칭 개수와 같습니다.

| 상태  | 조건                                        | message                                                               |
| ----- | ------------------------------------------- | --------------------------------------------------------------------- |
| `400` | `ir_id`가 1 이상의 정수가 아님              | `ir_id는 1 이상의 정수여야 합니다.`                                   |
| `400` | `ir_code`가 문자열이 아님                   | `ir_code는 문자열이어야 합니다.`                                      |
| `404` | `ir_id`에 해당하는 입금 행이 없음           | `해당 입금 기록을 찾을 수 없습니다.`                                  |
| `400` | `ir_code`가 50자 초과                       | `ir_code는 50자 이하여야 합니다.`                                     |
| `400` | 문자열이 아님                               | `com_name_alias는 콤마로 구분한 문자열이어야 합니다.`                 |
| `400` | 별칭에 숫자가 아닌 문자가 있음              | `com_name_alias는 숫자만 입력할 수 있습니다.`                         |
| `400` | 별칭이 10자 초과                            | `com_name_alias는 10자 이하여야 합니다.`                              |
| `400` | 별칭이 100개 초과                           | `com_name_alias는 한 번에 100개 이하여야 합니다.`                     |
| `400` | 한 별칭에 `com_code`가 둘 이상              | `com_name_alias 1706에 고객사코드가 여러 개입니다.`                   |
| `400` | 조회한 `com_code`가 20자 초과               | `조회한 com_code는 20자 이하여야 합니다. (1706)`                      |
| `400` | 만든 고객사명이 20자 초과                   | `company_name은 20자 이하여야 합니다. (com_name_alias 1706)`          |
| `400` | 담당자명이 10자 초과                        | `manager는 10자 이하여야 합니다. (com_name_alias 1706)`               |
| `400` | `inc_cash`가 없음, 정수가 아님, INT 범위 밖 | `inc_cash는 필수입니다.` 등                                           |
| `400` | `inc_date`가 없거나 날짜가 아님             | `inc_date는 필수입니다.` / `inc_date는 YYYY-MM-DD 형식이어야 합니다.` |
| `400` | 그 연도 순번이 8자리를 넘음                 | `해당 연도의 면접비코드가 최대치를 넘었습니다.`                       |
| `409` | 같은 `ir_code`가 이미 있음                  | `이미 같은 면접비코드가 있습니다.`                                    |
| `400` | 다른 컬럼이 DB 길이를 초과                  | `저장값이 컬럼 길이를 초과했습니다.`                                  |
| `404` | 그 별칭의 고객사가 없음                     | `com_name_alias 1706의 고객사를 찾을 수 없습니다.`                    |
| `500` | DB 오류                                     | `입금 기록을 저장하는 중 오류가 발생했습니다.`                        |

---

## 2. 목록 — `GET /api/interview-record/list`

**쿼리스트링**

| 파라미터         | 기본값    | 설명                                                        |
| ---------------- | --------- | ----------------------------------------------------------- |
| `page`           | `1`       | 페이지. 1부터                                               |
| `size`           | `20`      | 페이지당 개수. 최대 100                                     |
| `com_code`       | —         | 배열 원소 부분 일치 (`ILIKE`)                               |
| `com_name_alias` | —         | 배열 원소 정확 일치. 별칭 하나. 콤마 목록은 생성 본문에서만 |
| `company_name`   | —         | 배열 원소 부분 일치 (`ILIKE`)                               |
| `manager`        | —         | 배열 원소 부분 일치 (`ILIKE`)                               |
| `ir_code`        | —         | 면접비코드 정확 일치. 최대 50자                             |
| `inc_cash`       | —         | 입금액 정확 일치                                            |
| `inc_date_from`  | —         | 입금일 시작. `YYYY-MM-DD`. 이 날을 포함                     |
| `inc_date_to`    | —         | 입금일 끝. `YYYY-MM-DD`. 이 날을 포함                       |
| `sort`           | `id_desc` | 아래 표                                                     |

**`sort` 값**

| 값               | 설명                 |
| ---------------- | -------------------- |
| `id_desc`        | 최근 등록순 (기본값) |
| `id_asc`         | 오래된 등록순        |
| `ir_code_desc`   | 면접비코드 내림차순  |
| `ir_code_asc`    | 면접비코드 오름차순  |
| `inc_date_desc`  | 입금일 늦은 순       |
| `inc_date_asc`   | 입금일 이른 순       |
| `inc_cash_desc`  | 입금액 큰 순         |
| `inc_cash_asc`   | 입금액 작은 순       |
| `create_at_desc` | 작성시간 늦은 순     |
| `create_at_asc`  | 작성시간 이른 순     |

```bash
curl -s "http://127.0.0.1:1106/api/interview-record/list?com_name_alias=1706&inc_date_from=2026-10-01&inc_date_to=2026-10-31&sort=inc_date_desc"
```

**성공** `200`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "ir_code": "ko_intv_2026_00000001",
      "com_code": ["c10052100", "c10052200"],
      "com_name_alias": ["1706", "1802"],
      "company_name": ["예시TM - 강남", "다른TM - 수원"],
      "manager": ["홍길동", "김철수"],
      "inc_cash": 500000,
      "inc_date": "2026-10-12",
      "create_at": "2026-10-12T02:59:00.000Z",
      "created_at": "2026-10-12T02:59:00.000Z",
      "updated_at": "2026-10-12T02:59:00.000Z"
    }
  ],
  "page": 1,
  "size": 20,
  "total": 1,
  "sort": "inc_date_desc"
}
```

조건에 맞는 행이 없으면 `data`는 `[]`이고 `total`은 `0`입니다.

| 상태  | 조건                                | message                                             |
| ----- | ----------------------------------- | --------------------------------------------------- |
| `400` | `sort`가 표에 없음                  | `sort 값이 올바르지 않습니다. (...)`                |
| `400` | `com_name_alias`가 숫자 하나가 아님 | `com_name_alias는 숫자만 입력할 수 있습니다.`       |
| `400` | `ir_code`가 50자 초과               | `ir_code는 50자 이하여야 합니다.`                   |
| `400` | `inc_cash`가 정수가 아님            | `inc_cash는 정수여야 합니다.`                       |
| `400` | 기간이 날짜가 아님                  | `inc_date_from는 YYYY-MM-DD 형식이어야 합니다.`     |
| `400` | 시작일이 종료일보다 늦음            | `inc_date_from은 inc_date_to보다 늦을 수 없습니다.` |
| `500` | DB 오류                             | `목록을 조회하는 중 오류가 발생했습니다.`           |

---

## 3. 기존 행 확인 — `GET /api/interview-record/lookup`

`interview_record`에서 `ir_code`와 `inc_date`가 둘 다 같은 행을 찾습니다. 수정 화면을 열기 전에 호출합니다.

- `count`가 1 이상이면 이미 있는 행입니다. `data[].id`로 `PATCH` 또는 `PUT`을 호출합니다.
- `count`가 0이면 그 코드·입금일의 행이 없습니다. `POST /api/interview-record`로 새로 등록합니다.

고객사 배열은 `interview_record_com`을 `ir_code`로 붙여 같이 내려줍니다. 없는 행은 `404`가 아니라 `count: 0`, `data: []`입니다.

| 파라미터   | 필수 | 설명                                                |
| ---------- | ---- | --------------------------------------------------- |
| `ir_code`  | 예   | 면접비코드. 앞뒤 공백은 빼고 정확히 비교. 최대 50자 |
| `inc_date` | 예   | 입금일. `YYYY-MM-DD`. 이 날과 같은 행만             |

```bash
curl -s "http://127.0.0.1:1106/api/interview-record/lookup?ir_code=ko_intv_2026_00000001&inc_date=2026-10-12"
```

**있음** `200`

```json
{
  "success": true,
  "ir_code": "ko_intv_2026_00000001",
  "inc_date": "2026-10-12",
  "count": 1,
  "data": [
    {
      "id": 1,
      "ir_code": "ko_intv_2026_00000001",
      "com_code": ["c10052100", "c10052200"],
      "com_name_alias": ["1706", "1802"],
      "company_name": ["예시TM - 강남", "다른TM - 수원"],
      "manager": ["홍길동", "김철수"],
      "inc_cash": 500000,
      "inc_date": "2026-10-12",
      "create_at": "2026-10-12T02:59:00.000Z",
      "created_at": "2026-10-12T02:59:00.000Z",
      "updated_at": "2026-10-12T02:59:00.000Z"
    }
  ]
}
```

**없음** `200`

```json
{
  "success": true,
  "ir_code": "ko_intv_2026_00000099",
  "inc_date": "2026-10-12",
  "count": 0,
  "data": []
}
```

| 상태  | 조건                                         | message                                        |
| ----- | -------------------------------------------- | ---------------------------------------------- |
| `400` | `ir_code` 또는 `inc_date`가 없음             | `ir_code와 inc_date는 필수입니다.`             |
| `400` | `ir_code`가 50자 초과                        | `ir_code는 50자 이하여야 합니다.`              |
| `400` | `inc_date`가 `YYYY-MM-DD`가 아니거나 없는 날 | `inc_date는 YYYY-MM-DD 형식이어야 합니다.`     |
| `500` | DB 오류                                      | `입금 기록을 조회하는 중 오류가 발생했습니다.` |

---

## 4. 단건 조회 — `GET /api/interview-record/:id`

`:id`는 `com_code`나 `com_name_alias`가 아닙니다. 등록 응답의 `id`입니다.

```bash
curl -s "http://127.0.0.1:1106/api/interview-record/1"
```

**성공** `200` 본문은 생성 응답의 `data`와 같은 모양이고, `message`는 없습니다.

| 상태  | 조건                        | message                                        |
| ----- | --------------------------- | ---------------------------------------------- |
| `400` | `id`가 1 이상의 정수가 아님 | `id는 1 이상의 정수여야 합니다.`               |
| `404` | 해당 행이 없음              | `해당 입금 기록을 찾을 수 없습니다.`           |
| `500` | DB 오류                     | `입금 기록을 조회하는 중 오류가 발생했습니다.` |

---

## 5. 부분 수정 — `PATCH /api/interview-record/:id`

본문에 넣은 키만 저장합니다. `ir_code`와 `create_at`, `created_at`은 바꾸지 않습니다. 고객사 배열을 바꾸면 `updated_at`만 `NOW()`로 갱신합니다.

`com_name_alias`를 넣으면 `com_code`, `company_name`, `manager`를 그 순서대로 다시 조회해 네 배열을 같이 바꿉니다. `""`나 `null`이면 네 배열을 모두 `NULL`로 둡니다. 별칭을 빼면 네 배열은 그대로입니다.

| 필드             | 필수   | 설명                                             |
| ---------------- | ------ | ------------------------------------------------ |
| `com_name_alias` | 아니오 | 콤마 문자열. 넣으면 고객사 배열 전체를 다시 채움 |
| `inc_cash`       | 아니오 | 정수. 빈 값이면 `NULL`                           |
| `inc_date`       | 아니오 | `YYYY-MM-DD`. 바꿔도 `ir_code`는 유지            |

세 키를 모두 빼면 `400`입니다.

```bash
curl -s -X PATCH "http://127.0.0.1:1106/api/interview-record/1" \
  -H "Content-Type: application/json" \
  -d "{\"inc_cash\":450000}"
```

**성공** `200`

```json
{
  "success": true,
  "message": "입금 기록이 수정되었습니다.",
  "data": {
    "id": 1,
    "ir_code": "ko_intv_2026_00000001",
    "com_code": ["c10052100", "c10052200"],
    "com_name_alias": ["1706", "1802"],
    "company_name": ["예시TM - 강남", "다른TM - 수원"],
    "manager": ["홍길동", "김철수"],
    "inc_cash": 450000,
    "inc_date": "2026-10-12",
    "create_at": "2026-10-12T02:59:00.000Z",
    "created_at": "2026-10-12T02:59:00.000Z",
    "updated_at": "2026-10-12T02:59:00.000Z"
  }
}
```

| 상태  | 조건                              | message                                            |
| ----- | --------------------------------- | -------------------------------------------------- |
| `400` | `id`가 1 이상의 정수가 아님       | `id는 1 이상의 정수여야 합니다.`                   |
| `400` | 수정할 키가 없음                  | `수정할 필드를 하나 이상 전달해야 합니다.`         |
| `400` | 생성과 같은 형식·길이·고객사 오류 | 생성 표와 같은 message                             |
| `404` | 별칭에 해당하는 고객사가 없음     | `com_name_alias 1706의 고객사를 찾을 수 없습니다.` |
| `404` | 해당 입금 행이 없음               | `해당 입금 기록을 찾을 수 없습니다.`               |
| `500` | DB 오류                           | `입금 기록을 수정하는 중 오류가 발생했습니다.`     |

---

## 6. 전체 교체 — `PUT /api/interview-record/:id`

`com_name_alias`, `inc_cash`, `inc_date`는 생성과 같이 필수입니다. 고객사 배열은 별칭으로 다시 조회해 `interview_record_com`에 저장합니다. `ir_code`, `create_at`, `created_at`은 그대로 두고 `updated_at`만 갱신합니다.

```bash
curl -s -X PUT "http://127.0.0.1:1106/api/interview-record/1" \
  -H "Content-Type: application/json" \
  -d "{\"com_name_alias\":\"1706\",\"inc_cash\":450000,\"inc_date\":\"2026-10-13\"}"
```

**성공** `200` 의 `message`는 `입금 기록이 전체 교체되었습니다.` 입니다. 별칭이 하나면 배열 길이도 1입니다. `ir_code`는 등록 때 값이 유지됩니다.

실패 조건은 생성과 같습니다. 입금 행이 없으면 `404` (`해당 입금 기록을 찾을 수 없습니다.`), DB 오류는 `500` (`입금 기록을 교체하는 중 오류가 발생했습니다.`)입니다.

---

## 7. 입금 행만 삭제 — `DELETE /api/interview-record/:id`

`:id`는 `interview_record.id`입니다. 그 입금 행만 지웁니다. 같은 `ir_code`의 다른 입금 행과 `interview_record_com` 행은 그대로 둡니다.

```bash
curl -s -X DELETE "http://127.0.0.1:1106/api/interview-record/1"
```

**성공** `200`

```json
{
  "success": true,
  "message": "입금 기록이 삭제되었습니다.",
  "deletedId": 1
}
```

| 상태  | 조건                        | message                                        |
| ----- | --------------------------- | ---------------------------------------------- |
| `400` | `id`가 1 이상의 정수가 아님 | `id는 1 이상의 정수여야 합니다.`               |
| `404` | 해당 행이 없음              | `해당 입금 기록을 찾을 수 없습니다.`           |
| `500` | DB 오류                     | `입금 기록을 삭제하는 중 오류가 발생했습니다.` |

---

## 8. 고객사 행과 같은 코드의 입금 전부 삭제 — `DELETE /api/interview-record/com`

`ir_code`로 `interview_record_com` 행을 찾습니다. 그 행을 지우고, `interview_record`에서 같은 `ir_code`인 입금 행을 모두 지웁니다. 고객사 행이 없으면 입금 행은 지우지 않고 `404`입니다.

| 파라미터  | 필수 | 설명                                                |
| --------- | ---- | --------------------------------------------------- |
| `ir_code` | 예   | 면접비코드. 앞뒤 공백은 빼고 정확히 비교. 최대 50자 |

```bash
curl -s -X DELETE "http://127.0.0.1:1106/api/interview-record/com?ir_code=ko_intv_2026_00000001"
```

**성공** `200`

```json
{
  "success": true,
  "message": "고객사 기록과 같은 면접비코드의 입금 기록이 삭제되었습니다.",
  "ir_code": "ko_intv_2026_00000001",
  "deletedCount": 2
}
```

`deletedCount`는 같이 지운 `interview_record` 행 수입니다. 고객사 행만 있고 입금 행이 없으면 `0`입니다.

| 상태  | 조건                       | message                                          |
| ----- | -------------------------- | ------------------------------------------------ |
| `400` | `ir_code`가 없음           | `ir_code는 필수입니다.`                          |
| `400` | `ir_code`가 문자열이 아님  | `ir_code는 문자열이어야 합니다.`                 |
| `400` | `ir_code`가 50자 초과      | `ir_code는 50자 이하여야 합니다.`                |
| `404` | 그 코드의 고객사 행이 없음 | `해당 고객사 기록을 찾을 수 없습니다.`           |
| `500` | DB 오류                    | `고객사 기록을 삭제하는 중 오류가 발생했습니다.` |

---

## 반영

라우트는 서버 기동 시 한 번 로드됩니다. 파일을 수정한 뒤에는 실행 중인 프로세스를 다시 띄워야 이 API가 적용됩니다.

```bash
pm2 reload <앱이름>
```
