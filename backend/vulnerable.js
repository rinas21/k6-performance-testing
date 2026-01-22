// vulnerable.js - intentionally risky Node.js code

const _ = require('lodash');
const axios = require('axios');
const fs = require('fs');

// Prototype pollution (lodash)
let obj = {};
_.merge(obj, JSON.parse('{"__proto__": {"isAdmin": true}}'));
console.log('Is admin?', obj.isAdmin);

// Unsafe file read
console.log('Contents of /etc/passwd:');
console.log(fs.readFileSync('/etc/passwd', 'utf8'));

// Vulnerable HTTP request (for testing outdated axios)
axios.get('http://example.com')
    .then(res => console.log('Request success'))
    .catch(err => console.error('Request failed'));

