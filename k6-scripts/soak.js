import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 3,
  duration: '2m', // shorten for demo
};

export default function () {
  let res = http.get('http://host.docker.internal:5000/');
  check(res, { 'status 200': r => r.status === 200 });
}
