import http from 'k6/http';
import { check } from 'k6';

export const options = {
  iterations: 20,   // Number of times the function will run
};

export default function () {
  const res = http.post('http://host.docker.internal:5000/login', {
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
