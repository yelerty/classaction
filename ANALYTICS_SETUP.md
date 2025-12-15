# Google Analytics 4 설정 가이드

## 1단계: Google Analytics 계정 만들기

1. **Google Analytics 접속**
   - https://analytics.google.com/ 방문
   - Google 계정으로 로그인

2. **계정 만들기**
   - 좌측 하단 "관리" (톱니바퀴 아이콘) 클릭
   - "계정 만들기" 클릭
   - 계정 이름 입력 (예: "집단소송 정보센터")

3. **속성 만들기**
   - 속성 이름: "집단소송 웹사이트"
   - 보고 시간대: "대한민국"
   - 통화: "대한민국 원 (₩)"

4. **비즈니스 정보 입력**
   - 업종: "법률 및 정부"
   - 비즈니스 규모 선택
   - 사용 목적: "웹사이트 트래픽 측정"

5. **데이터 스트림 설정**
   - "웹" 선택
   - 웹사이트 URL: `https://zipdansosong.com`
   - 스트림 이름: "집단소송 웹사이트"
   - "스트림 만들기" 클릭

## 2단계: 측정 ID 받기

1. 데이터 스트림 생성 후 **측정 ID**가 표시됩니다
   - 형식: `G-XXXXXXXXXX` (예: G-ABC1234567)
   - 이 ID를 복사하세요

## 3단계: 웹사이트에 측정 ID 적용

1. `index.html` 파일을 엽니다
2. **37번째 줄과 42번째 줄**에 있는 `G-XXXXXXXXXX`를 찾습니다
3. 복사한 측정 ID로 **두 곳 모두** 교체합니다

**변경 전:**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');  <!-- 여기도 교체 -->
</script>
```

**변경 후 (예시):**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC1234567"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-ABC1234567');  <!-- 동일한 ID -->
</script>
```

4. 파일 저장
5. Vercel에 배포 (git push)

## 4단계: 통계 확인하기

### 실시간 방문자 확인
1. Google Analytics (https://analytics.google.com/) 접속
2. 좌측 메뉴에서 "보고서" → "실시간" 클릭
3. **지금 이 순간** 사이트를 보고 있는 사람 수 확인

### 오늘 하루 방문자 확인
1. 좌측 메뉴에서 "보고서" → "생애 주기" → "참여도" → "개요" 클릭
2. 우측 상단 날짜 선택기에서 "오늘" 선택
3. 주요 지표 확인:
   - **사용자**: 오늘 방문한 순 방문자 수
   - **세션**: 총 방문 횟수
   - **조회수**: 페이지 조회 수
   - **평균 참여 시간**: 사용자가 머문 평균 시간

### 상세 통계 보기
- **사용자 속성** → **개요**: 방문자의 국가, 도시, 기기, 브라우저
- **생애 주기** → **획득**: 방문자가 어디서 왔는지 (검색, 소셜미디어, 직접 방문 등)
- **탐색**: 커스텀 보고서 생성 가능

### 모바일에서 확인하기
1. 앱스토어/플레이스토어에서 "Google Analytics" 앱 다운로드
2. 로그인 후 언제 어디서나 통계 확인 가능

## 주요 지표 설명

| 지표 | 의미 |
|------|------|
| **사용자(Users)** | 고유 방문자 수 (동일인이 여러 번 방문해도 1명) |
| **신규 사용자** | 처음 방문한 사람 수 |
| **세션(Sessions)** | 총 방문 횟수 (한 사람이 2번 방문하면 2 세션) |
| **참여 세션** | 10초 이상 머물거나 2페이지 이상 본 방문 |
| **조회수(Views)** | 페이지가 로드된 총 횟수 |
| **이벤트 수** | 클릭, 스크롤 등 사용자 행동 횟수 |

## 팁

### 데이터가 안 보일 때
- 측정 ID가 올바르게 입력되었는지 확인
- 배포가 완료되었는지 확인
- 브라우저에서 광고 차단기(AdBlock) 비활성화
- 24시간 기다려보기 (초기 데이터 수집 시간)

### 내 방문 제외하기
1. Google Analytics 관리 → 데이터 스트림 → 스트림 선택
2. "태그 설정 구성" → "내부 트래픽 정의"
3. 내 IP 주소 추가하여 제외

### 알림 설정
1. "관리" → "알림" → "새 알림"
2. 조건 설정 (예: 일일 방문자 100명 이상)
3. 이메일로 알림 받기

## 데이터 보존 기간
- 무료 버전: 최대 14개월
- 원하는 기간으로 조정 가능 (관리 → 데이터 설정 → 데이터 보존)

## 개인정보 보호
Google Analytics 4는 자동으로:
- IP 익명화 처리
- 쿠키 사용 최소화
- GDPR 준수

---

**문제가 있으신가요?**
- Google Analytics 고객센터: https://support.google.com/analytics
- YouTube에서 "GA4 설정" 검색하면 많은 한글 튜토리얼 있음
