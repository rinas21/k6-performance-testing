import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 2 },
    { duration: '30s', target: 5 },
    { duration: '30s', target: 10 },
  ],
};

export default function () {
  let res = http.get('http://host.docker.internal:5000/');
  check(res, { 'status 200': r => r.status === 200 });
}
