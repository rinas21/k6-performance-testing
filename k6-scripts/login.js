import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = 'http://host.docker.internal:5000';

export function loginTest() {
  const res = http.post(`${BASE_URL}/login`, {
    username: 'admin',
    password: 'admin123'
  }, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  check(res, {
    'Login successful': r => r.status === 200,
    'Response contains welcome': r => r.body.includes('Welcome')
  });
}

export default function () {
  loginTest();
}
