// Vercel serverless function for sending emails
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { companyName, contactName, email, phone, website, fundingAmount } = req.body;

    // Log the request for debugging
    console.log('Email request received:', { companyName, contactName, email, phone, website, fundingAmount });

    // Validate required fields
    if (!companyName || !contactName || !email || !phone) {
      console.log('Validation failed: missing required fields');
      res.status(400).json({ error: '필수 정보가 누락되었습니다.' });
      return;
    }

    // Normalize website URL
    const normalizeUrl = (url) => {
      if (!url) return '미입력';
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      return `https://${url}`;
    };

    const normalizedWebsite = normalizeUrl(website);

    // Email content
    const subject = `[성장 파트너십 신청] - ${companyName}`;
    const emailBody = `새로운 파트너십 신청서가 도착했습니다.

- 업체명: ${companyName}
- 담당자명: ${contactName}
- 이메일 주소: ${email}
- 연락처: ${phone}
- 쇼핑몰 주소: ${normalizedWebsite}
- 필요 자금 규모: ${fundingAmount || '미입력'}

신청 시간: ${new Date().toLocaleString('ko-KR')}`;

    // Use Formspree service (free tier)
    console.log('Attempting to send email via Formspree...');

    const formspreeResponse = await fetch('https://formspree.io/f/mjkbqpzr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        name: contactName,
        phone: phone,
        subject: subject,
        message: emailBody,
        company: companyName,
        website: normalizedWebsite,
        funding: fundingAmount || '미입력',
        _replyto: email,
        _subject: subject
      })
    });

    console.log('Formspree response status:', formspreeResponse.status);
    const responseData = await formspreeResponse.json();
    console.log('Formspree response data:', responseData);

    if (formspreeResponse.ok) {
      console.log('Email sent successfully via Formspree');
      res.status(200).json({
        success: true,
        message: '신청이 완료되었습니다. 1영업일 안에 연락드리겠습니다.'
      });
    } else {
      console.error('Formspree error:', responseData);
      throw new Error('Formspree service failed: ' + JSON.stringify(responseData));
    }

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      error: '이메일 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' 
    });
  }
}
