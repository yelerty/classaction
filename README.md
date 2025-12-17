# 집단소송 정보센터

대한민국에서 참여 가능한 모든 집단소송 정보를 제공하는 정적 웹사이트입니다.

## 기능

- 📋 집단소송 목록 및 상세 정보 제공
- 🔍 검색 및 필터링 기능
- 📱 반응형 디자인 (모바일 최적화)
- 💰 Google AdSense 광고 연동
- ⚡ Vercel 무료 호스팅

## 기술 스택

- HTML5
- CSS3
- Vanilla JavaScript
- Vercel (호스팅)
- Google AdSense

## 배포 방법

### Vercel 배포

1. Vercel 계정 생성 (https://vercel.com)
2. GitHub 저장소 연동
3. 프로젝트 import
4. 자동 배포 완료!

또는 Vercel CLI 사용:

```bash
npm i -g vercel
vercel --prod
```

## Google AdSense 설정

1. Google AdSense 계정 생성 (https://www.google.com/adsense)
2. 사이트 추가 및 승인 대기
3. `index.html`에서 다음 부분을 본인의 AdSense 코드로 교체:
   - `ca-pub-XXXXXXXXXXXXXXXX` → 본인의 게시자 ID
   - `data-ad-slot="XXXXXXXXXX"` → 광고 단위 ID

### AdSense 코드 위치

```html
<!-- 1. Head 태그 내 -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>

<!-- 2. 광고 단위 (3군데) -->
<ins class="adsbygoogle"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX">
</ins>
```

## 소송 데이터 업데이트

### 방법 1: Google Sheets 연동 (추천) 🌟

**코딩 없이 Google Sheets에서 데이터를 관리할 수 있습니다!**

#### 설정 방법 (5분 소요)

1. **Google Sheets 생성**
   - [Google Sheets](https://sheets.google.com) 접속
   - 새 스프레드시트 만들기
   - 시트 이름을 정확히 **"lawsuits"**로 변경

2. **컬럼 구조 설정**

   첫 번째 행에 다음 컬럼 입력:
   ```
   id | title | company | status | description | date | victims | compensation | category | link
   ```

3. **시트 공개 설정**
   - 우측 상단 "공유" 버튼 클릭
   - "일반 액세스" → "링크가 있는 모든 사용자" 선택
   - 권한: "뷰어"로 설정

4. **Sheet ID 복사**

   URL에서 Sheet ID를 복사:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
                                            ↑ 여기를 복사
   ```

5. **config.js 파일 수정**
   ```javascript
   const SHEETS_CONFIG = {
       SHEET_ID: 'YOUR_SHEET_ID_HERE',  // 복사한 Sheet ID 입력
       // ...
   };
   ```

6. **배포**
   ```bash
   git add config.js
   git commit -m "Google Sheets ID 설정"
   git push
   ```

**📝 자세한 가이드는 `SHEETS_TEMPLATE.md` 파일을 참고하세요!**

#### 데이터 업데이트

Google Sheets에서 데이터를 수정하면 **자동으로 웹사이트에 반영됩니다!**
- 캐시 때문에 최대 5분 정도 걸릴 수 있습니다
- 새로고침하면 즉시 최신 데이터 확인 가능

### 방법 2: 직접 코드 수정

`script.js` 파일의 `getBackupData()` 함수 내 배열을 수정하여 소송 정보를 추가/수정할 수 있습니다.

### 데이터 출처 (2024년 12월 기준)

현재 웹사이트의 집단소송 정보는 다음 출처를 기반으로 수집되었습니다:
- 대법원 집단소송 공고 (https://www.scourt.go.kr/portal/notice/securities/securities.jsp)
- 언론 보도 (한국경제, 파이낸셜뉴스, 서울신문 등)
- 법무법인 공식 발표
- 정부 발표 자료 (금융감독원, 공정거래위원회 등)

**중요**: 정보는 정기적으로 업데이트되지 않을 수 있으므로, 최신 정보는 반드시 공식 출처를 확인하시기 바랍니다.

## 라이선스

MIT License

## 주의사항

- 본 사이트는 정보 제공 목적으로만 운영됩니다
- 법률 자문을 제공하지 않습니다
- 실제 소송 참여 전 법률 전문가와 상담하시기 바랍니다

## 문의

이슈 및 문의사항은 GitHub Issues를 통해 제출해주세요.
