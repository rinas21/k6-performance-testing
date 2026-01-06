import http from 'k6/http';
import { check } from 'k6';
import { restTest } from './rest.js';
import { soapTest } from './soap.js';
import { formTest } from './form.js';
import { loginTest } from './login.js';

export let options = {
  vus: 1,
  duration: '30s',
};

export default function () {
  // Health check
  let res = http.get('http://host.docker.internal:5000/');
  check(res, { 'Health check 200': (r) => r.status === 200 });

  // REST API test
  restTest();

  // SOAP API test
  soapTest();

  // Form submission test
  formTest();

  // Login test
  loginTest();
}
