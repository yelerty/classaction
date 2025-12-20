/**
 * Google Sheets 데이터 로더
 * Google Sheets에서 집단소송 데이터를 가져옵니다
 */

class SheetsLoader {
    constructor(config) {
        this.config = config;
        this.cache = null;
        this.cacheTime = null;
    }

    /**
     * Google Sheets에서 데이터 가져오기
     */
    async loadData() {
        // 캐시 확인
        if (this.isCacheValid()) {
            console.log('📦 캐시된 데이터 사용');
            return this.cache;
        }

        try {
            console.log('🔄 Google Sheets에서 데이터 로딩 중...');
            const data = await this.fetchFromSheets();

            // 캐시 저장
            this.cache = data;
            this.cacheTime = Date.now();

            console.log(`✅ ${data.length}개의 소송 데이터 로드 완료`);
            return data;
        } catch (error) {
            console.error('❌ Google Sheets 로딩 실패:', error);
            throw error;
        }
    }

    /**
     * Google Sheets API 호출
     */
    async fetchFromSheets() {
        const { SHEET_ID, API_KEY, SHEET_NAME, RANGE } = this.config;

        // 방법 1: API 키 사용 (권장)
        if (API_KEY) {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!${RANGE}?key=${API_KEY}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Google Sheets API 오류: ${response.status}`);
            }

            const json = await response.json();
            return this.parseSheetData(json.values);
        }

        // 방법 2: 공개 CSV 사용 (API 키 없이)
        else {
            const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;
            const response = await fetch(csvUrl);

            if (!response.ok) {
                throw new Error(`CSV 로딩 오류: ${response.status}`);
            }

            const csvText = await response.text();
            return this.parseCSV(csvText);
        }
    }

    /**
     * Google Sheets API 응답 파싱
     */
    parseSheetData(rows) {
        if (!rows || rows.length < 2) {
            throw new Error('시트에 데이터가 없습니다');
        }

        // 첫 번째 행은 헤더
        const headers = rows[0];
        const data = [];

        // 나머지 행은 데이터
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];

            // 빈 행 건너뛰기
            if (!row || row.length === 0 || !row[0]) {
                continue;
            }

            // lawFirms 데이터 파싱 (JSON 문자열 또는 빈 값)
            let lawFirms = null;
            if (row[10]) {
                try {
                    lawFirms = JSON.parse(row[10]);
                } catch (error) {
                    console.warn(`행 ${i}: lawFirms JSON 파싱 실패`, error);
                }
            }

            const lawsuit = {
                id: parseInt(row[0]) || i,
                title: row[1] || '',
                company: row[2] || '',
                status: row[3] || '진행중',
                description: row[4] || '',
                date: row[5] || '',
                victims: row[6] || '',
                compensation: row[7] || '',
                category: row[8] || '기타',
                link: row[9] || '#'
            };

            // lawFirms가 있으면 추가, 없으면 link 사용
            if (lawFirms && Array.isArray(lawFirms) && lawFirms.length > 0) {
                lawsuit.lawFirms = lawFirms;
            }

            data.push(lawsuit);
        }

        return data;
    }

    /**
     * CSV 파싱 (RFC 4180 호환)
     */
    parseCSV(csvText) {
        const rows = [];
        let currentRow = [];
        let currentField = '';
        let inQuotes = false;

        for (let i = 0; i < csvText.length; i++) {
            const char = csvText[i];
            const nextChar = csvText[i + 1];

            if (inQuotes) {
                // 따옴표 안에 있을 때
                if (char === '"' && nextChar === '"') {
                    // 이중 따옴표 = 이스케이프된 따옴표
                    currentField += '"';
                    i++; // 다음 따옴표 건너뛰기
                } else if (char === '"') {
                    // 따옴표 종료
                    inQuotes = false;
                } else {
                    // 일반 문자 (개행 포함)
                    currentField += char;
                }
            } else {
                // 따옴표 밖에 있을 때
                if (char === '"') {
                    // 따옴표 시작
                    inQuotes = true;
                } else if (char === ',') {
                    // 필드 구분자
                    currentRow.push(currentField);
                    currentField = '';
                } else if (char === '\n') {
                    // 행 구분자
                    currentRow.push(currentField);
                    if (currentRow.some(field => field.trim() !== '')) {
                        rows.push(currentRow);
                    }
                    currentRow = [];
                    currentField = '';
                } else if (char === '\r') {
                    // Windows 스타일 개행(\r\n)의 \r은 무시
                    if (nextChar !== '\n') {
                        // Mac 스타일 개행(\r)
                        currentRow.push(currentField);
                        if (currentRow.some(field => field.trim() !== '')) {
                            rows.push(currentRow);
                        }
                        currentRow = [];
                        currentField = '';
                    }
                } else {
                    currentField += char;
                }
            }
        }

        // 마지막 필드와 행 처리
        if (currentField || currentRow.length > 0) {
            currentRow.push(currentField);
            if (currentRow.some(field => field.trim() !== '')) {
                rows.push(currentRow);
            }
        }

        return this.parseSheetData(rows);
    }

    /**
     * 캐시 유효성 확인
     */
    isCacheValid() {
        if (!this.cache || !this.cacheTime) {
            return false;
        }

        const elapsed = Date.now() - this.cacheTime;
        return elapsed < this.config.CACHE_TIME;
    }

    /**
     * 캐시 초기화
     */
    clearCache() {
        this.cache = null;
        this.cacheTime = null;
        console.log('🗑️ 캐시 초기화됨');
    }
}

// 전역 인스턴스 생성
let sheetsLoader = null;

/**
 * 집단소송 데이터 로드 (메인 함수)
 */
async function loadLawsuitsFromSheets() {
    // config.js가 로드되었는지 확인
    if (typeof SHEETS_CONFIG === 'undefined') {
        throw new Error('config.js를 먼저 로드하세요');
    }

    // 설정 검증
    if (!validateConfig()) {
        throw new Error('Google Sheets 설정이 올바르지 않습니다');
    }

    // 로더 인스턴스 생성
    if (!sheetsLoader) {
        sheetsLoader = new SheetsLoader(SHEETS_CONFIG);
    }

    return await sheetsLoader.loadData();
}

/**
 * 캐시 강제 새로고침
 */
function refreshSheetsData() {
    if (sheetsLoader) {
        sheetsLoader.clearCache();
    }
    return loadLawsuitsFromSheets();
}
