Place all scripts in k6-scripts/ folder

Run any script:

docker exec -it k6 k6 run /scripts/smoke.js


Generate HTML report:

docker exec -it k6 k6 run --out json=/scripts/output.json /scripts/load.js
docker exec -it k6 k6 report /scripts/output.json --reporter html > report.html


Open report.html in browser to see graphs
