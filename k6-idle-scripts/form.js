import http from 'k6/http';
import { check } from 'k6';

// Form Submission Test - Tests HTML form submission

const BASE_URL = 'http://host.docker.internal:5000';

export default function () {
  const formData = {
    name: `QA User ${Math.random().toString(36).substring(7)}`,
    email: `qa${Math.random().toString(36).substring(7)}@example.com`,
    message: `Test message from k6 at ${new Date().toISOString()}`
  };

  const res = http.post(`${BASE_URL}/form`, formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  check(res, {
    'Form submission OK': r => r.status === 200,
    'Form response contains name': r => r.body.includes(formData.name)
  });
}
