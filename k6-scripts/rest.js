import http from 'k6/http';
import { check } from 'k6';

export default function () {
  let res = http.get('http://host.docker.internal:5000/api/items');
  check(res, { 'GET 200': r => r.status === 200 });

  res = http.post('http://host.docker.internal:5000/api/items', JSON.stringify({ name: 'item1' }), { headers: { 'Content-Type': 'application/json' } });
  check(res, { 'POST 200': r => r.status === 200 });

  res = http.put('http://host.docker.internal:5000/api/items/0', JSON.stringify({ name: 'updated' }), { headers: { 'Content-Type': 'application/json' } });
  check(res, { 'PUT 200': r => r.status === 200 });

  res = http.del('http://host.docker.internal:5000/api/items/0');
  check(res, { 'DELETE 200': r => r.status === 200 });
}
