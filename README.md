# k6 Performance Testing Project

## Quick Start

Start Docker services (Grafana and InfluxDB):
```
docker-compose up -d
```

Wait 10 seconds for services to start, then verify:
```
docker-compose ps
```

Start the backend application locally:
```
cd backend
npm install
npm run dev
```

The backend will run on http://localhost:5000

## Access Points

Backend API: http://localhost:5000 (runs locally)
Form UI: http://localhost:5000/form
Login Page: http://localhost:5000/login
Grafana: http://localhost:3000 (admin/admin123)
InfluxDB: http://localhost:8086 (admin/admin123)

## Setup Grafana

1. Open http://localhost:3000
2. Login with admin/admin123
3. Go to Configuration > Data Sources
4. Click Add data source
5. Select InfluxDB
6. Set URL to http://influxdb:8086
7. Set Database to k6
8. Set User to admin
9. Set Password to admin123
10. Click Save & Test

## Run k6 Tests

Use the `./k6` wrapper script to run k6 commands like a local CLI.

Run REST API test with InfluxDB output:
```
./k6 run --out influxdb=http://influxdb:8086/k6 /scripts/rest.js
```

Run SOAP API test with InfluxDB output:
```
./k6 run --out influxdb=http://influxdb:8086/k6 /scripts/soap.js
```

Run Form submission test with InfluxDB output:
```
./k6 run --out influxdb=http://influxdb:8086/k6 /scripts/form.js
```

Run Login test with InfluxDB output:
```
./k6 run --out influxdb=http://influxdb:8086/k6 /scripts/login.js
```

Run Smoke test (1 user, 30 seconds) with InfluxDB output:
```
./k6 run --out influxdb=http://influxdb:8086/k6 /scripts/smoke.js
```

Run Load test (5 users, 1 minute) with InfluxDB output:
```
./k6 run --out influxdb=http://influxdb:8086/k6 /scripts/load.js
```

Run Stress test (ramp up to 10 users) with InfluxDB output:
```
./k6 run --out influxdb=http://influxdb:8086/k6 /scripts/stress.js
```

Run Spike test (sudden load spike) with InfluxDB output:
```
./k6 run --out influxdb=http://influxdb:8086/k6 /scripts/spike.js
```

Run Soak test (3 users, 2 minutes) with InfluxDB output:
```
./k6 run --out influxdb=http://influxdb:8086/k6 /scripts/soak.js
```

Run without InfluxDB output:
```
./k6 run /scripts/rest.js
```

## View Backend Logs

Backend logs appear in the terminal where you ran `npm run dev`. All requests are logged with timestamps and request details.

## Stop Services

Stop all services:
```
docker-compose down
```

Stop and remove all data:
```
docker-compose down -v
```

## QA Verification Checklist

### REST CRUD Operations
- [ ] Start backend: cd backend && npm run dev
- [ ] Open http://localhost:5000/api/items in browser (should return empty array)
- [ ] Run: ./k6 run /scripts/rest.js
- [ ] Check backend logs in terminal (should show GET, POST, PUT, DELETE requests)
- [ ] Open http://localhost:5000/api/items again (should show created items)

### Form Submissions
- [ ] Open http://localhost:5000/form in browser
- [ ] Fill form with name, email, message and submit
- [ ] Verify success message appears
- [ ] Check backend logs in terminal (should show POST /form with form data)
- [ ] Run: ./k6 run /scripts/form.js
- [ ] Check backend logs again (should show more form submissions)

### Login Validation
- [ ] Open http://localhost:5000/login in browser
- [ ] Try valid credentials: admin/admin123 (should succeed)
- [ ] Try invalid credentials: wrong/wrong (should fail)
- [ ] Verify validation: try username < 3 chars (should show error)
- [ ] Verify validation: try password < 3 chars (should show error)
- [ ] Check backend logs in terminal (should show login attempts)
- [ ] Run: ./k6 run /scripts/login.js
- [ ] Check backend logs again (should show more login attempts)

### SOAP Requests
- [ ] Run: ./k6 run /scripts/soap.js
- [ ] Check backend logs in terminal (should show POST /soap with XML body)
- [ ] Verify response contains SOAP envelope with Success status

### k6 Test Runs
- [ ] Run smoke.js and verify output shows checks passing
- [ ] Run load.js and verify metrics appear (requests, duration, checks)
- [ ] Run stress.js and verify gradual load increase
- [ ] Run spike.js and verify sudden load spike
- [ ] Run soak.js and verify sustained load

### Grafana Dashboards
- [ ] Login to Grafana at http://localhost:3000
- [ ] Setup InfluxDB data source (see Setup Grafana section above)
- [ ] Go to Explore and select InfluxDB data source
- [ ] Run any k6 test with --out influxdb flag: ./k6 run --out influxdb=http://influxdb:8086/k6 /scripts/rest.js
- [ ] In Grafana Explore, query: SELECT * FROM http_req_duration LIMIT 10
- [ ] Verify you can see request rates, response times, and check results

## Manual API Testing

Test GET:
```
curl http://localhost:5000/api/items
```

Test POST:
```
curl -X POST http://localhost:5000/api/items -H "Content-Type: application/json" -d '{"name":"test","value":123}'
```

Test PUT:
```
curl -X PUT http://localhost:5000/api/items/0 -H "Content-Type: application/json" -d '{"name":"updated","value":456}'
```

Test DELETE:
```
curl -X DELETE http://localhost:5000/api/items/0
```

Test SOAP:
```
curl -X POST http://localhost:5000/soap -H "Content-Type: text/xml" -d '<?xml version="1.0"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><Test>QA</Test></soap:Body></soap:Envelope>'
```
