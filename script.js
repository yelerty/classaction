// 집단소송 데이터 (예시)
const lawsuits = [
    {
        id: 1,
        title: "카카오 먹통 사태 집단소송",
        company: "카카오",
        status: "진행중",
        description: "2022년 10월 카카오 데이터센터 화재로 인한 서비스 장애 피해 배상 소송",
        date: "2023.03",
        victims: "약 5,300만명",
        compensation: "미정",
        category: "IT·서비스",
        link: "https://www.scourt.go.kr/"
    },
    {
        id: 2,
        title: "머지포인트 환불 집단소송",
        company: "머지플러스",
        status: "모집중",
        description: "머지포인트 서비스 종료에 따른 미환급 포인트 배상 소송",
        date: "2024.01",
        victims: "약 100만명",
        compensation: "1인당 최대 50만원",
        category: "소비자",
        link: "https://www.scourt.go.kr/"
    },
    {
        id: 3,
        title: "BMW 화재 결함 집단소송",
        company: "BMW 코리아",
        status: "진행중",
        description: "BMW 차량 화재 사고 관련 결함 인정 및 손해배상 소송",
        date: "2022.08",
        victims: "약 10만대",
        compensation: "차량가 일부 환급",
        category: "자동차",
        link: "https://www.scourt.go.kr/"
    },
    {
        id: 4,
        title: "라임자산운용 펀드 사기 집단소송",
        company: "라임자산운용",
        status: "진행중",
        description: "라임펀드 환매 중단 사태 관련 투자자 손해배상 청구 소송",
        date: "2020.07",
        victims: "약 15,000명",
        compensation: "약 1조 6,000억원 규모",
        category: "금융",
        link: "https://www.scourt.go.kr/"
    },
    {
        id: 5,
        title: "옵티머스 사모펀드 집단소송",
        company: "옵티머스자산운용",
        status: "진행중",
        description: "옵티머스 펀드 사기 사건 관련 투자자 손해배상 소송",
        date: "2020.09",
        victims: "약 2,000명",
        compensation: "약 5,000억원 규모",
        category: "금융",
        link: "https://www.scourt.go.kr/"
    },
    {
        id: 6,
        title: "가습기살균제 피해 집단소송",
        company: "옥시레킷벤키저 외",
        status: "완료",
        description: "가습기살균제로 인한 건강 피해 손해배상 소송 (일부 승소)",
        date: "2016.05",
        victims: "약 7,000명",
        compensation: "1인당 최대 2억원",
        category: "소비자",
        link: "https://www.scourt.go.kr/"
    },
    {
        id: 7,
        title: "폭스바겐 배출가스 조작 집단소송",
        company: "폭스바겐 코리아",
        status: "완료",
        description: "디젤 차량 배출가스 조작 관련 손해배상 소송 (합의)",
        date: "2015.11",
        victims: "약 12만대",
        compensation: "1인당 평균 150만원",
        category: "자동차",
        link: "https://www.scourt.go.kr/"
    },
    {
        id: 8,
        title: "웅진코웨이 방문판매 피해 집단소송",
        company: "코웨이",
        status: "모집중",
        description: "과도한 방문판매 계약 및 위약금 관련 소비자 피해 소송",
        date: "2023.11",
        victims: "미정",
        compensation: "미정",
        category: "소비자",
        link: "https://www.scourt.go.kr/"
    },
    {
        id: 9,
        title: "휴맥스 분식회계 집단소송",
        company: "휴맥스",
        status: "진행중",
        description: "분식회계로 인한 주주 손해배상 청구 소송",
        date: "2023.06",
        victims: "약 3,000명",
        compensation: "미정",
        category: "증권",
        link: "https://www.scourt.go.kr/"
    },
    {
        id: 10,
        title: "삼성바이오로직스 회계 부정 집단소송",
        company: "삼성바이오로직스",
        status: "진행중",
        description: "회계처리 부정 관련 주주 손해배상 소송",
        date: "2021.04",
        victims: "약 40,000명",
        compensation: "약 8,600억원 규모",
        category: "증권",
        link: "https://www.scourt.go.kr/"
    },
    {
        id: 11,
        title: "대한항공·아시아나 항공권 가격 담합 소송",
        company: "대한항공, 아시아나항공",
        status: "모집중",
        description: "항공권 가격 담합 혐의 관련 소비자 손해배상 소송",
        date: "2024.02",
        victims: "미정",
        compensation: "미정",
        category: "소비자",
        link: "https://www.scourt.go.kr/"
    },
    {
        id: 12,
        title: "테라·루나 코인 투자자 집단소송",
        company: "테라폼랩스",
        status: "진행중",
        description: "테라·루나 코인 폭락으로 인한 투자자 손해배상 소송",
        date: "2022.06",
        victims: "약 28만명",
        compensation: "약 40조원 규모",
        category: "가상자산",
        link: "https://www.scourt.go.kr/"
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
