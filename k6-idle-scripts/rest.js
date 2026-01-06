import http from 'k6/http';
import { check } from 'k6';

// REST API Test - Tests all CRUD operations
// GET, POST, PUT, DELETE

const BASE_URL = 'http://host.docker.internal:5000';

export default function () {
  // GET - Read all items
  let res = http.get(`${BASE_URL}/api/items`);
  check(res, { 'GET 200': r => r.status === 200 });

  // POST - Create item
  res = http.post(`${BASE_URL}/api/items`, JSON.stringify({ name: 'k6-item', value: Math.random() }), {
    headers: { 'Content-Type': 'application/json' }
  });
  check(res, { 'POST 200': r => r.status === 200 });
  const itemId = res.json('id');

  // PUT - Update item
  if (itemId !== undefined) {
    res = http.put(`${BASE_URL}/api/items/${itemId}`, JSON.stringify({ name: 'updated-item', value: Math.random() }), {
      headers: { 'Content-Type': 'application/json' }
    });
    check(res, { 'PUT 200': r => r.status === 200 });
  }

  // DELETE - Delete item
  if (itemId !== undefined) {
    res = http.del(`${BASE_URL}/api/items/${itemId}`);
    check(res, { 'DELETE 200': r => r.status === 200 });
  }
}
