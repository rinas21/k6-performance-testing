import http from 'k6/http';
import { check } from 'k6';

// Load Test - Normal expected load
// 5 users for 1 minute

const BASE_URL = 'http://host.docker.internal:5000';

export let options = {
  vus: 5,
  duration: '1m',
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
