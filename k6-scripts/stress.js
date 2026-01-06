import http from 'k6/http';
import { check } from 'k6';
import { restTest } from './rest.js';
import { soapTest } from './soap.js';
import { formTest } from './form.js';
import { loginTest } from './login.js';

export let options = {
  stages: [
    { duration: '30s', target: 2 },
    { duration: '30s', target: 5 },
    { duration: '30s', target: 10 },
  ],
};

export default function () {
  // REST API test
  restTest();

  // SOAP API test
  soapTest();

  // Form submission test
  formTest();

  // Login test
  loginTest();
}
