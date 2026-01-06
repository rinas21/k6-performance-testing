import http from 'k6/http';
import { check } from 'k6';

export default function () {
  let xml = `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body><Test>QA</Test></soap:Body>
  </soap:Envelope>`;
  
  let res = http.post('http://host.docker.internal:5000/soap', xml, { headers: { 'Content-Type': 'text/xml' } });
  check(res, { 'SOAP 200': r => r.status === 200 });
}
