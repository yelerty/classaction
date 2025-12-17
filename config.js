// Google Sheets 설정
const SHEETS_CONFIG = {
    // Google Sheets ID (스프레드시트 URL의 /d/ 와 /edit 사이 부분)
    // 예: https://docs.google.com/spreadsheets/d/1ABC-DEF_GHI/edit
    //                                              ↑ 이 부분
    SHEET_ID: 'YOUR_GOOGLE_SHEET_ID_HERE',

    // API 키 (선택사항 - 공개 시트는 API 키 없이도 가능)
    // Google Cloud Console에서 발급: https://console.cloud.google.com/
    API_KEY: '',

    // Sheet 이름
    SHEET_NAME: 'lawsuits',

    // 데이터 범위 (A1:J100 = A열부터 J열까지, 최대 100행)
    RANGE: 'A1:J100',

    // 캐시 시간 (밀리초, 기본 5분)
    CACHE_TIME: 5 * 60 * 1000,

    // 백업 데이터 사용 여부 (Sheets 로딩 실패시)
    USE_BACKUP: true
};

// 환경 감지
const IS_PRODUCTION = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// 설정 검증
function validateConfig() {
    if (SHEETS_CONFIG.SHEET_ID === 'YOUR_GOOGLE_SHEET_ID_HERE') {
        console.warn('⚠️ Google Sheets ID가 설정되지 않았습니다.');
        console.warn('📝 SHEETS_TEMPLATE.md 파일을 참고하여 설정하세요.');
        return false;
    }
    return true;
}
