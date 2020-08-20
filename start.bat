cd %~dp0
cd output
start "" http://localhost:5000
node server/server.js --inspect=5001