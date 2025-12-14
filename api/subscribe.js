// Vercel Serverless Function - 이메일 구독 처리
// 이 함수는 /api/subscribe 엔드포인트로 호출됩니다

module.exports = async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // OPTIONS 요청 처리 (CORS preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // POST 요청만 허용
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        const { email } = req.body;

        // 이메일 유효성 검사
        if (!email || typeof email !== 'string') {
            return res.status(400).json({
                success: false,
                message: '이메일 주소를 입력해주세요.'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: '올바른 이메일 주소 형식이 아닙니다.'
            });
        }

        // 환경 변수에서 Resend API 키 가져오기
        const resendApiKey = process.env.RESEND_API_KEY;

        if (!resendApiKey) {
            // Resend API 키가 설정되지 않은 경우, 콘솔에만 로그 출력
            console.log(`[구독 요청] 이메일: ${email}, 시간: ${new Date().toISOString()}`);

            return res.status(200).json({
                success: true,
                message: '구독이 완료되었습니다! (임시 모드: 관리자에게 수동으로 전달됩니다)'
            });
        }

        // Resend API를 사용하여 관리자에게 알림 전송
        const adminEmail = process.env.ADMIN_EMAIL || 'your-email@example.com';

        const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'onboarding@resend.dev', // Resend 기본 발신 이메일
                to: adminEmail,
                subject: '새로운 이메일 구독 요청 - 집단소송 정보센터',
                html: `
                    <h2>새로운 이메일 구독 요청</h2>
                    <p><strong>이메일:</strong> ${email}</p>
                    <p><strong>구독 시간:</strong> ${new Date().toLocaleString('ko-KR')}</p>
                    <hr>
                    <p>이 구독자에게 새로운 집단소송 정보를 이메일로 발송해주세요.</p>
                `
            })
        });

        if (!resendResponse.ok) {
            const errorData = await resendResponse.json();
            console.error('Resend API 오류:', errorData);

            // 실패해도 사용자에게는 성공 메시지 반환 (로그는 남김)
            console.log(`[구독 요청 - Resend 실패] 이메일: ${email}`);
            return res.status(200).json({
                success: true,
                message: '구독이 완료되었습니다!'
            });
        }

        // 성공
        return res.status(200).json({
            success: true,
            message: '구독이 완료되었습니다!'
        });

    } catch (error) {
        console.error('구독 처리 오류:', error);

        return res.status(500).json({
            success: false,
            message: '구독 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
        });
    }
}
