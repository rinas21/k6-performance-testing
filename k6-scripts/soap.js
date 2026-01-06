import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = 'http://host.docker.internal:5000';

export function soapTest() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <TestRequest>
      <Message>QA Test Message</Message>
      <Timestamp>${new Date().toISOString()}</Timestamp>
    </TestRequest>
  </soap:Body>
</soap:Envelope>`;
  
  const res = http.post(`${BASE_URL}/soap`, xml, {
    headers: { 'Content-Type': 'text/xml; charset=utf-8' }
  });
  
  check(res, {
    'SOAP 200': r => r.status === 200,
    'SOAP response contains Status': r => r.body.includes('Status'),
    'SOAP response contains Success': r => r.body.includes('Success')
  });
}

export default function () {
  soapTest();
}
