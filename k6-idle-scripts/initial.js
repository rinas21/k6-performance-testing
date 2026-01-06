import http from 'k6/http';
import { sleep } from 'k6';

// Initial Test - Simple test with fixed iterations
// Runs 10 times with 1 second sleep between requests

export const options = {
  iterations: 10,
};

export default function () {
  http.get('http://host.docker.internal:5000/form');
  sleep(1);
}
