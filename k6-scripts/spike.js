import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '10s', target: 1 },
    { duration: '10s', target: 20 },
    { duration: '20s', target: 1 },
  ],
};

export default function () {
  let res = http.get('http://host.docker.internal:5000/');
  check(res, { 'status 200': r => r.status === 200 });
}
