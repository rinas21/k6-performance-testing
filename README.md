# k6 Performance Testing Project

## Quick Start

Start all services:
```
docker-compose up -d
```

Wait 10 seconds for services to start, then verify:
```
docker-compose ps
```

All services should show "Up" status.

## Access Points

Backend API: http://localhost:5000
Form UI: http://localhost:5000/form
Grafana: http://localhost:3000 (admin/admin123)
InfluxDB: http://localhost:8086 (admin/admin123)

## Get InfluxDB Token

1. Open http://localhost:8086
2. Login with admin/admin123
3. Go to Load Data > API Tokens
4. Copy the admin token (or create a new token)
5. Use this token in k6 commands below

## Setup Grafana

1. Open http://localhost:3000
2. Login with admin/admin123
3. Go to Configuration > Data Sources
4. Click Add data source
5. Select InfluxDB
6. Set URL to http://influxdb:8086
7. Set Organization to qaorg
8. Set Token (get from InfluxDB UI as above)
9. Set Bucket to k6
10. Click Save & Test

## Run k6 Tests

Replace TOKEN with your InfluxDB token from above.

Run REST API test:
```
docker exec -it k6 k6 run --out influxdb=http://influxdb:8086/k6?org=qaorg&token=TOKEN /scripts/rest.js
```

Run SOAP API test:
```
docker exec -it k6 k6 run --out influxdb=http://influxdb:8086/k6?org=qaorg&token=TOKEN /scripts/soap.js
```

Run Form submission test:
```
docker exec -it k6 k6 run --out influxdb=http://influxdb:8086/k6?org=qaorg&token=TOKEN /scripts/form.js
```

Run Smoke test (1 user, 30 seconds):
```
docker exec -it k6 k6 run --out influxdb=http://influxdb:8086/k6?org=qaorg&token=TOKEN /scripts/smoke.js
```

Run Load test (5 users, 1 minute):
```
docker exec -it k6 k6 run --out influxdb=http://influxdb:8086/k6?org=qaorg&token=TOKEN /scripts/load.js
```

Run Stress test (ramp up to 10 users):
```
docker exec -it k6 k6 run --out influxdb=http://influxdb:8086/k6?org=qaorg&token=TOKEN /scripts/stress.js
```

Run Spike test (sudden load spike):
```
docker exec -it k6 k6 run --out influxdb=http://influxdb:8086/k6?org=qaorg&token=TOKEN /scripts/spike.js
```

Run Soak test (3 users, 2 minutes):
```
docker exec -it k6 k6 run --out influxdb=http://influxdb:8086/k6?org=qaorg&token=TOKEN /scripts/soak.js
```

Note: You can run tests without InfluxDB output by removing the --out flag:
```
docker exec -it k6 k6 run /scripts/rest.js
```

## View Backend Logs

Watch all requests:
```
docker logs -f backend
```

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
- [ ] Open http://localhost:5000/api/items in browser (should return empty array)
- [ ] Run: docker exec -it k6 k6 run /scripts/rest.js
- [ ] Check backend logs: docker logs backend (should show GET, POST, PUT, DELETE requests)
- [ ] Open http://localhost:5000/api/items again (should show created items)

### Form Submissions
- [ ] Open http://localhost:5000/form in browser
- [ ] Fill form with name, email, message and submit
- [ ] Verify success message appears
- [ ] Check backend logs: docker logs backend (should show POST /form with form data)
- [ ] Run: docker exec -it k6 k6 run /scripts/form.js
- [ ] Check backend logs again (should show more form submissions)

### SOAP Requests
- [ ] Run: docker exec -it k6 k6 run /scripts/soap.js
- [ ] Check backend logs: docker logs backend (should show POST /soap with XML body)
- [ ] Verify response contains SOAP envelope with Success status

### k6 Test Runs
- [ ] Run smoke.js and verify output shows checks passing
- [ ] Run load.js and verify metrics appear (requests, duration, checks)
- [ ] Run stress.js and verify gradual load increase
- [ ] Run spike.js and verify sudden load spike
- [ ] Run soak.js and verify sustained load

### Grafana Dashboards
- [ ] Login to Grafana at http://localhost:3000
- [ ] Verify InfluxDB data source is connected
- [ ] Go to Explore and select k6 bucket
- [ ] Run any k6 test with --out influxdb flag
- [ ] In Grafana Explore, query for k6 metrics
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
