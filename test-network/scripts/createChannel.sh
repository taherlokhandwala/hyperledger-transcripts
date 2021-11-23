#!/bin/bash

# imports  
. scripts/envVar.sh
. scripts/utils.sh

CHANNEL_NAME="$1"
DELAY="$2"
MAX_RETRY="$3"
VERBOSE="$4"
: ${CHANNEL_NAME:="mychannel"}
: ${DELAY:="3"}
: ${MAX_RETRY:="5"}
: ${VERBOSE:="false"}

if [ ! -d "channel-artifacts" ]; then
	mkdir channel-artifacts
fi

createChannelGenesisBlock() {
	which configtxgen
	if [ "$?" -ne 0 ]; then
		fatalln "configtxgen tool not found."
	fi
	set -x
	configtxgen -profile TwoOrgsApplicationGenesis -outputBlock ./channel-artifacts/${CHANNEL_NAME}.block -channelID $CHANNEL_NAME
	res=$?
	{ set +x; } 2>/dev/null
  verifyResult $res "Failed to generate channel configuration transaction..."
}

createChannel() {
	setGlobals 1
	# Poll in case the raft leader is not set yet
	local rc=1
	local COUNTER=1
	export ORDERER_CA=${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer$2.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
	export ORDERER_ADMIN_TLS_SIGN_CERT=${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer$2.example.com/tls/server.crt
	export ORDERER_ADMIN_TLS_PRIVATE_KEY=${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer$2.example.com/tls/server.key
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
		sleep $DELAY
		set -x
		osnadmin channel join --channelID $CHANNEL_NAME --config-block ./channel-artifacts/${CHANNEL_NAME}.block -o localhost:$1 --ca-file "$ORDERER_CA" --client-cert "$ORDERER_ADMIN_TLS_SIGN_CERT" --client-key "$ORDERER_ADMIN_TLS_PRIVATE_KEY" >&log.txt
		res=$?
		{ set +x; } 2>/dev/null
		let rc=$res
		COUNTER=$(expr $COUNTER + 1)
	done
	cat log.txt
	verifyResult $res "Channel creation failed"
}

# joinChannel ORG
joinChannel() {
  FABRIC_CFG_PATH=$PWD/../config/
  ORG=$1
  setGlobals $ORG
	local rc=1
	local COUNTER=1
	export PEER_ORG_CA=${PWD}/organizations/peerOrganizations/org$1.example.com/peers/peer$2.org$1.example.com/tls/ca.crt
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER_ORG_CA
    export CORE_PEER_ADDRESS=localhost:$3
	## Sometimes Join takes time, hence retry
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
    sleep $DELAY
    set -x
    peer channel join -b $BLOCKFILE >&log.txt
    res=$?
    { set +x; } 2>/dev/null
		let rc=$res
		COUNTER=$(expr $COUNTER + 1)
	done
	cat log.txt
	verifyResult $res "After $MAX_RETRY attempts, peer0.org${ORG} has failed to join channel '$CHANNEL_NAME' "
}

setAnchorPeer() {
  ORG=$1
  docker exec cli ./scripts/setAnchorPeer.sh $ORG $CHANNEL_NAME 
}

FABRIC_CFG_PATH=${PWD}/configtx

## Create channel genesis block
infoln "Generating channel genesis block '${CHANNEL_NAME}.block'"
createChannelGenesisBlock

FABRIC_CFG_PATH=$PWD/../config/
BLOCKFILE="./channel-artifacts/${CHANNEL_NAME}.block"

## Create channel
infoln "Creating channel ${CHANNEL_NAME}"
createChannel 7053 0 
successln "Channel '$CHANNEL_NAME' created"

infoln "Creating channel ${CHANNEL_NAME}"
createChannel 8053 1 
successln "Channel '$CHANNEL_NAME' created"

infoln "Creating channel ${CHANNEL_NAME}"
createChannel 9053 2 
successln "Channel '$CHANNEL_NAME' created"

infoln "Creating channel ${CHANNEL_NAME}"
createChannel 6053 3
successln "Channel '$CHANNEL_NAME' created"

## Join all the peers to the channel
infoln "Joining org1 peer to the channel..."
joinChannel 1 0 7051
joinChannel 1 1 8051
joinChannel 1 2 6051

infoln "Joining org2 peer to the channel..."
joinChannel 2 0 9051
joinChannel 2 1 5051
joinChannel 2 2 4051

## Set the anchor peers for each org in the channel
infoln "Setting anchor peer for org1..."
setAnchorPeer 1
infoln "Setting anchor peer for org2..."
setAnchorPeer 2

successln "Channel '$CHANNEL_NAME' joined"
