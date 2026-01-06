import http from 'k6/http';
import { check } from 'k6';

// Spike Test - Sudden increase in load
// Spikes from 1 to 20 users then back down

const BASE_URL = 'http://host.docker.internal:5000';

export let options = {
  stages: [
    { duration: '10s', target: 1 },
    { duration: '10s', target: 20 },
    { duration: '20s', target: 1 },
  ],
};

export default function () {
  // REST API - GET
  let res = http.get(`${BASE_URL}/api/items`);
  check(res, { 'GET 200': r => r.status === 200 });

  // REST API - POST
  res = http.post(`${BASE_URL}/api/items`, JSON.stringify({ name: 'test', value: Math.random() }), {
    headers: { 'Content-Type': 'application/json' }
  });
  check(res, { 'POST 200': r => r.status === 200 });

  // SOAP API
  const xml = `<?xml version="1.0"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><Test>QA</Test></soap:Body></soap:Envelope>`;
  res = http.post(`${BASE_URL}/soap`, xml, {
    headers: { 'Content-Type': 'text/xml' }
  });
  check(res, { 'SOAP 200': r => r.status === 200 });

  // Form submission
  res = http.post(`${BASE_URL}/form`, {
    name: `User ${Math.random().toString(36).substring(7)}`,
    email: `test${Math.random().toString(36).substring(7)}@example.com`,
    message: 'Test message'
  }, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  check(res, { 'Form 200': r => r.status === 200 });

  // Login
  res = http.post(`${BASE_URL}/login`, {
    username: 'admin',
    password: 'admin123'
  }, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  check(res, { 'Login 200': r => r.status === 200 });
}
