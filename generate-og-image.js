// OG 이미지 생성 스크립트
// 필요 패키지: npm install puppeteer

const puppeteer = require('puppeteer');
const path = require('path');

async function generateOGImage() {
    console.log('OG 이미지 생성 중...');

    const browser = await puppeteer.launch({
        headless: 'new'
    });

    try {
        const page = await browser.newPage();

        // 뷰포트 설정 (OG 이미지 크기)
        await page.setViewport({
            width: 1200,
            height: 630,
            deviceScaleFactor: 2 // 고해상도
        });

        // HTML 파일 로드
        const htmlPath = path.join(__dirname, 'og-image.html');
        await page.goto(`file://${htmlPath}`, {
            waitUntil: 'networkidle0'
        });

        // .og-image 요소 찾기
        const element = await page.$('.og-image');

        if (!element) {
            throw new Error('.og-image 요소를 찾을 수 없습니다');
        }

        // 스크린샷 촬영
        await element.screenshot({
            path: 'og-image.png',
            type: 'png',
            omitBackground: false
        });

        console.log('✅ og-image.png 생성 완료!');
        console.log('크기: 1200x630px (Retina 2x)');

    } catch (error) {
        console.error('❌ 오류 발생:', error.message);
        throw error;
    } finally {
        await browser.close();
    }
}

// 스크립트 실행
if (require.main === module) {
    generateOGImage().catch(error => {
        console.error('스크립트 실행 실패:', error);
        process.exit(1);
    });
}

module.exports = { generateOGImage };
