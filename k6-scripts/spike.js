import http from 'k6/http';
import { check } from 'k6';
import { restTest } from './rest.js';
import { soapTest } from './soap.js';
import { formTest } from './form.js';

export let options = {
  stages: [
    { duration: '10s', target: 1 },
    { duration: '10s', target: 20 },
    { duration: '20s', target: 1 },
  ],
};

export default function () {
  // REST API test
  restTest();

  // SOAP API test
  soapTest();

  // Form submission test
  formTest();
}
