import http from 'k6/http';
import { check } from 'k6';

// Login Iteration Test - Runs login 20 times
// Tests login endpoint with multiple iterations

const BASE_URL = 'http://host.docker.internal:5000';

export const options = {
  iterations: 20,
};

export default function () {
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
