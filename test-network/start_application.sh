#!/bin/sh

./network.sh down
rm -r ../asset-transfer-basic/application-javascript/wallet
./network.sh up createChannel -c mychannel -ca
./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-javascript/ -ccl javascript
cd ../asset-transfer-basic/application-javascript
npm install
cd frontend
npm install
cd ..
node enroll.js
npm run start_servers