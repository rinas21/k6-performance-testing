import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  iterations: 10,
};
export default function () {
  http.get('http://host.docker.internal:5000/form');

  sleep(1);
}