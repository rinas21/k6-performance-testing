import http from 'k6/http';
import { check } from 'k6';
import { restTest } from './rest.js';
import { soapTest } from './soap.js';
import { formTest } from './form.js';

export let options = {
  vus: 3,
  duration: '2m',
};

export default function () {
  // REST API test
  restTest();

  // SOAP API test
  soapTest();

  // Form submission test
  formTest();
}
