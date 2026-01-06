import http from 'k6/http';
import { check } from 'k6';

export default function () {
  let res = http.post('http://host.docker.internal:5000/form', { name: 'QA User', email: 'qa@example.com' });
  check(res, { 'Form submission OK': r => r.status === 200 });
}
