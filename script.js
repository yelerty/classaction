// 집단소송 데이터 (2024년 12월 기준 실제 정보)
const lawsuits = [
    {
        id: 1,
        title: "쿠팡 개인정보 유출 집단소송",
        company: "쿠팡",
        status: "모집중",
        description: "2024년 대규모 해킹으로 3,370만명의 개인정보가 유출된 사건. 국내 최대 규모 개인정보 유출 사고",
        date: "2024.11",
        victims: "약 3,370만명",
        compensation: "1인당 약 10만원 예상",
        category: "소비자",
        link: "https://www.daeryunlaw.com/notice/5915"
    },
    {
        id: 2,
        title: "티몬·위메프 정산지연 집단소송",
        company: "티몬·위메프",
        status: "진행중",
        description: "큐텐 계열사의 판매자 정산 지연 및 미지급 사태. 약 1조 7,000억원 규모의 피해",
        date: "2024.07",
        victims: "소상공인 다수",
        compensation: "약 1조 7,000억원 규모",
        category: "소비자",
        link: "https://www.scourt.go.kr/"
    },
    {
        id: 3,
        title: "BMW 화재 결함 집단소송",
        company: "BMW 코리아",
        status: "진행중",
        description: "2018년부터 발생한 BMW 디젤차량 연쇄 화재 사고. EGR 쿨러 결함이 원인으로 밝혀짐. 한국 최초 소비자 집단소송",
        date: "2018.08",
        victims: "약 10만대 이상",
        compensation: "진행중",
        category: "자동차",
        link: "https://www.scourt.go.kr/"
    },
    {
        id: 4,
        title: "라임자산운용 펀드 사기 집단소송",
        company: "라임자산운용",
        status: "진행중",
        description: "라임펀드 환매 중단 사태. 2024년 프랑스에서 이인광 에스모 회장 검거. 피해액 1조원 이상",
        date: "2020.07",
        victims: "투자자 다수",
        compensation: "피해액 1조원 이상",
        category: "금융",
        link: "https://www.scourt.go.kr/"
    },
    {
        id: 5,
        title: "옵티머스 사모펀드 집단소송",
        company: "옵티머스자산운용",
        status: "진행중",
        description: "옵티머스 펀드 돌려막기 사기 사건. 김재현 전 대표 징역 40년 확정. 5,000억원 횡령",
        date: "2020.09",
        victims: "투자자 다수",
        compensation: "피해액 5,000억원",
        category: "금융",
        link: "https://www.scourt.go.kr/"
    },
    {
        id: 6,
        title: "가습기살균제 피해 집단소송",
        company: "옥시레킷벤키저·SK케미칼·애경 외",
        status: "진행중",
        description: "2024년 2월 국가배상책임 첫 인정. 사망자 1,843명, 인정 피해자 6,048명. 2024년 대법원 재심리 진행 중",
        date: "2016.05",
        victims: "사망자 1,843명, 피해자 6,048명",
        compensation: "국가배상 300~500만원",
        category: "소비자",
        link: "https://healthrelief.or.kr/"
    },
    {
        id: 7,
        title: "테라·루나 코인 투자자 집단소송",
        company: "테라폼랩스",
        status: "진행중",
        description: "2022년 테라·루나 코인 폭락 사태. 권도형 대표 2024년 미국 송환. 한국 피해액 3,000억원",
        date: "2022.06",
        victims: "약 20만명",
        compensation: "피해액 3,000억원",
        category: "가상자산",
        link: "https://www.scourt.go.kr/"
    },
    {
        id: 8,
        title: "카카오 먹통 사태 소송",
        company: "카카오",
        status: "완료",
        description: "2022년 10월 카카오 데이터센터 화재로 인한 서비스 장애. 2023년 집단소송 1심 기각",
        date: "2022.10",
        victims: "전 국민",
        compensation: "소송 기각",
        category: "IT·서비스",
        link: "https://www.scourt.go.kr/"
    },
    {
        id: 9,
        title: "폭스바겐 배출가스 조작 집단소송",
        company: "폭스바겐 코리아",
        status: "완료",
        description: "디젤 차량 배출가스 조작 '디젤게이트' 사건. 2020년 합의로 종결",
        date: "2015.11",
        victims: "약 12만대",
        compensation: "1인당 평균 150만원",
        category: "자동차",
        link: "https://www.scourt.go.kr/"
    },
    {
        id: 10,
        title: "삼성바이오로직스 회계 부정 집단소송",
        company: "삼성바이오로직스",
        status: "진행중",
        description: "2015년 회계처리 부정 의혹 관련 주주 손해배상 소송. 장기간 법정 공방 중",
        date: "2021.04",
        victims: "소액주주 다수",
        compensation: "진행중",
        category: "증권",
        link: "https://www.scourt.go.kr/portal/notice/securities/securities.jsp"
    }
];

let currentFilter = 'all';
let currentSearch = '';

// 페이지 로드시 초기화
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    renderLawsuits(lawsuits);
    setupEventListeners();
});

// 통계 업데이트
function updateStats() {
    const total = lawsuits.length;
    const active = lawsuits.filter(l => l.status === '진행중').length;
    const recruiting = lawsuits.filter(l => l.status === '모집중').length;
    const completed = lawsuits.filter(l => l.status === '완료').length;

    document.getElementById('totalCount').textContent = total;
    document.getElementById('activeCount').textContent = active;
    document.getElementById('recruitingCount').textContent = recruiting;
    document.getElementById('completedCount').textContent = completed;
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 검색 기능
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function(e) {
        currentSearch = e.target.value.toLowerCase();
        filterLawsuits();
    });

    // 필터 버튼
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 활성 버튼 변경
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            currentFilter = this.dataset.category;
            filterLawsuits();
        });
    });
}

// 소송 목록 필터링
function filterLawsuits() {
    let filtered = lawsuits;

    // 카테고리 필터
    if (currentFilter !== 'all') {
        filtered = filtered.filter(lawsuit => lawsuit.status === currentFilter);
    }

    // 검색 필터
    if (currentSearch) {
        filtered = filtered.filter(lawsuit =>
            lawsuit.title.toLowerCase().includes(currentSearch) ||
            lawsuit.company.toLowerCase().includes(currentSearch) ||
            lawsuit.description.toLowerCase().includes(currentSearch)
        );
    }

    renderLawsuits(filtered);
}

// 소송 목록 렌더링
function renderLawsuits(lawsuitsToRender) {
    const container = document.getElementById('lawsuitsList');

    if (lawsuitsToRender.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>검색 결과가 없습니다</h3>
                <p>다른 검색어로 시도해보세요</p>
            </div>
        `;
        return;
    }

    container.innerHTML = lawsuitsToRender.map(lawsuit => `
        <div class="lawsuit-card">
            <div class="card-header">
                <h3>${lawsuit.title}</h3>
                <span class="lawsuit-status ${lawsuit.status}">${lawsuit.status}</span>
            </div>
            <div class="card-category">
                <span class="category-badge">${lawsuit.category}</span>
            </div>
            <p class="company">🏢 대상 기업: <strong>${lawsuit.company}</strong></p>
            <p class="description">${lawsuit.description}</p>
            <div class="lawsuit-info">
                <div class="info-item">
                    <span class="info-icon">👥</span>
                    <div class="info-content">
                        <div class="info-label">피해 규모</div>
                        <div class="info-value">${lawsuit.victims}</div>
                    </div>
                </div>
                <div class="info-item">
                    <span class="info-icon">💰</span>
                    <div class="info-content">
                        <div class="info-label">배상금</div>
                        <div class="info-value">${lawsuit.compensation}</div>
                    </div>
                </div>
            </div>
            <p class="date">📅 제기일: ${lawsuit.date}</p>
            <a href="${lawsuit.link}" target="_blank" rel="noopener noreferrer" class="lawsuit-link">
                자세히 보기 →
            </a>
        </div>
    `).join('');
}

// 스크롤 애니메이션 (선택사항)
window.addEventListener('scroll', function() {
    const cards = document.querySelectorAll('.lawsuit-card');
    cards.forEach(card => {
        const cardPosition = card.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (cardPosition < screenPosition) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
});
