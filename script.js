// 현재 사용중인 소송 데이터
let lawsuits = [];
let currentFilter = 'all';
let currentSearch = '';

// 페이지 로드시 초기화
document.addEventListener('DOMContentLoaded', async function() {
    // Google Sheets에서 데이터 로드 시도
    try {
        if (typeof loadLawsuitsFromSheets === 'function') {
            showLoadingState();
            lawsuits = await loadLawsuitsFromSheets();
            hideLoadingState();

            if (!lawsuits || lawsuits.length === 0) {
                showErrorState('데이터를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.');
            }
        } else {
            showErrorState('데이터 로더를 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error('데이터 로딩 오류:', error);
        hideLoadingState();
        showErrorState('데이터 로딩 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }

    updateStats();
    renderLawsuits(lawsuits);
    setupEventListeners();
    updateCurrentDate();
    fetchVisitorLocation();
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

    // 이메일 구독 폼
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
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

    container.innerHTML = lawsuitsToRender.map((lawsuit, index) => {
        const isCompleted = lawsuit.status === '완료';
        const isRecruiting = lawsuit.status === '모집중';
        const cardId = `lawsuit-card-${index}`;

        // 로펌 링크 HTML 생성 (완료된 소송은 제외)
        const lawFirmLinksHtml = isCompleted ? '' : getLawFirmLinksHtml(lawsuit, isRecruiting);

        return `
        <div class="lawsuit-card ${isCompleted ? 'completed-card collapsed' : ''}" id="${cardId}">
            <div class="card-header">
                <h3>${lawsuit.title}</h3>
                <span class="lawsuit-status ${lawsuit.status}">${lawsuit.status}</span>
            </div>
            <div class="card-category">
                <span class="category-badge">${lawsuit.category}</span>
            </div>
            <div class="card-details ${isCompleted ? 'collapsible-content' : ''}">
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
                ${lawFirmLinksHtml}
            </div>
            ${isCompleted ? `
                <button class="toggle-details-btn" onclick="toggleCardDetails('${cardId}')">
                    <span class="toggle-text">더보기</span>
                    <span class="toggle-icon">▼</span>
                </button>
            ` : ''}
        </div>
        `;
    }).join('');

    // 완료된 카드에 이벤트 리스너 추가
    attachToggleListeners();
}

// 로펌 링크 HTML 생성 함수
function getLawFirmLinksHtml(lawsuit, isRecruiting) {
    // lawFirms 배열이 있는 경우
    if (lawsuit.lawFirms && Array.isArray(lawsuit.lawFirms) && lawsuit.lawFirms.length > 0) {
        if (lawsuit.lawFirms.length === 1) {
            // 단일 로펌인 경우 기존 스타일로 표시
            return `
                <a href="${lawsuit.lawFirms[0].link}" target="_blank" rel="noopener noreferrer" class="lawsuit-link">
                    자세히 보기 →
                </a>
            `;
        } else {
            // 여러 로펌인 경우 로펌별 버튼 표시
            const firmButtonsHtml = lawsuit.lawFirms.map(firm => `
                <a href="${firm.link}" target="_blank" rel="noopener noreferrer" class="law-firm-link">
                    <span class="firm-icon">⚖️</span>
                    <div class="firm-info">
                        <span class="firm-name">${firm.name}</span>
                        ${firm.compensation ? `<span class="firm-compensation">${firm.compensation}</span>` : ''}
                    </div>
                    <span class="firm-arrow">→</span>
                </a>
            `).join('');

            return `
                <div class="law-firms-section ${isRecruiting ? 'recruiting' : ''}">
                    <div class="law-firms-header">
                        <span class="firms-label">참여 가능한 로펌</span>
                        <span class="firms-count">${lawsuit.lawFirms.length}곳</span>
                    </div>
                    <div class="law-firms-list">
                        ${firmButtonsHtml}
                    </div>
                </div>
            `;
        }
    }

    // 기존 link 필드가 있는 경우 (하위 호환성)
    if (lawsuit.link) {
        return `
            <a href="${lawsuit.link}" target="_blank" rel="noopener noreferrer" class="lawsuit-link">
                자세히 보기 →
            </a>
        `;
    }

    // 링크가 없는 경우
    return '<p class="no-link">링크 정보가 없습니다</p>';
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

// 현재 날짜 업데이트
function updateCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    // 현재 연도 업데이트
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = year;
    }

    // 최종 업데이트 날짜 업데이트
    const updateElement = document.getElementById('lastUpdate');
    if (updateElement) {
        updateElement.textContent = `${year}년 ${month}월`;
    }
}

// 방문자 위치 정보 가져오기
async function fetchVisitorLocation() {
    const locationElement = document.getElementById('locationInfo');

    try {
        // ipapi.co API 사용 (무료, 하루 1000 요청)
        const response = await fetch('https://ipapi.co/json/');

        if (!response.ok) {
            throw new Error('위치 정보를 가져올 수 없습니다');
        }

        const data = await response.json();

        // 국가명, 지역(도/주), 도시 정보 표시
        const country = data.country_name || '알 수 없음';
        const region = data.region || '';
        const city = data.city || '';

        // 한국어로 된 국가명 매핑
        const countryKorean = {
            'South Korea': '대한민국',
            'Korea, Republic of': '대한민국',
            'United States': '미국',
            'Japan': '일본',
            'China': '중국',
            'United Kingdom': '영국',
            'Canada': '캐나다',
            'Australia': '호주',
            'Germany': '독일',
            'France': '프랑스'
        };

        const displayCountry = countryKorean[country] || country;

        // 위치 정보 텍스트 생성
        let locationText = `📍 접속 위치: ${displayCountry}`;
        if (region) {
            locationText += `, ${region}`;
        }
        if (city && city !== region) {
            locationText += ` (${city})`;
        }

        locationElement.textContent = locationText;

    } catch (error) {
        console.error('위치 정보 조회 실패:', error);
        locationElement.textContent = '📍 위치 정보를 불러올 수 없습니다';
    }
}

// 이메일 구독 처리
async function handleNewsletterSubmit(e) {
    e.preventDefault();

    const emailInput = document.getElementById('emailInput');
    const subscribeBtn = document.getElementById('subscribeBtn');
    const messageElement = document.getElementById('subscribeMessage');
    const email = emailInput.value.trim();

    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('올바른 이메일 주소를 입력해주세요.', 'error');
        return;
    }

    // 버튼 비활성화
    subscribeBtn.disabled = true;
    subscribeBtn.textContent = '처리중...';

    try {
        // Vercel Serverless Function 호출
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('✅ 구독이 완료되었습니다! 새로운 집단소송 정보를 이메일로 받아보실 수 있습니다.', 'success');
            emailInput.value = '';
        } else {
            showMessage(data.message || '구독 처리 중 오류가 발생했습니다.', 'error');
        }
    } catch (error) {
        console.error('구독 오류:', error);
        showMessage('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
    } finally {
        // 버튼 활성화
        subscribeBtn.disabled = false;
        subscribeBtn.textContent = '구독하기';
    }
}

// 메시지 표시
function showMessage(message, type) {
    const messageElement = document.getElementById('subscribeMessage');
    messageElement.textContent = message;
    messageElement.className = `subscribe-message show ${type}`;

    // 5초 후 메시지 숨김
    setTimeout(() => {
        messageElement.className = 'subscribe-message';
    }, 5000);
}

// 로딩 상태 표시
function showLoadingState() {
    const container = document.getElementById('lawsuitsList');
    if (container) {
        container.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>집단소송 데이터를 불러오는 중...</p>
            </div>
        `;
    }
}

// 로딩 상태 숨김
function hideLoadingState() {
    // renderLawsuits()가 자동으로 로딩 상태를 대체함
}

// 에러 상태 표시
function showErrorState(message) {
    const container = document.getElementById('lawsuitsList');
    if (container) {
        container.innerHTML = `
            <div class="error-state">
                <div class="error-icon">⚠️</div>
                <h3>데이터 로딩 실패</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="reload-btn">새로고침</button>
            </div>
        `;
    }
}

// 완료된 소송 카드 펼치기/접기
function toggleCardDetails(cardId) {
    const card = document.getElementById(cardId);
    if (!card) return;

    const isCollapsed = card.classList.contains('collapsed');
    const toggleBtn = card.querySelector('.toggle-details-btn');
    const toggleText = toggleBtn.querySelector('.toggle-text');
    const toggleIcon = toggleBtn.querySelector('.toggle-icon');

    if (isCollapsed) {
        // 펼치기
        card.classList.remove('collapsed');
        card.classList.add('expanded');
        toggleText.textContent = '접기';
        toggleIcon.textContent = '▲';
    } else {
        // 접기
        card.classList.remove('expanded');
        card.classList.add('collapsed');
        toggleText.textContent = '더보기';
        toggleIcon.textContent = '▼';
    }
}

// 이벤트 리스너 연결
function attachToggleListeners() {
    // 이미 onclick으로 처리되므로 추가 작업 불필요
    // 필요시 여기에 추가 이벤트 리스너 등록 가능
}

// 전역 함수로 등록 (onclick에서 사용)
window.toggleCardDetails = toggleCardDetails;
