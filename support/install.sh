#!/usr/bin/env bash

DEFAULT_ETH_NODE_URL="${ETHEREUM_HTTP:-http://localhost:8545}";
DOCKER_COMPOSE_FILE_URL=https://raw.githubusercontent.com/AugurProject/augur/v2/support/docker-compose.yml

####################################################
# Configuration needed if the user wants to run GSN
export GSN_HOSTNAME=configurable-hostname-for-gsn-server.com
export GSN_PORT=8090
export GSN_RELAY_HUB=0xD216153c06E857cD7f72665E0aF1d7D82172F494
export GSN_GAS_PRICE_PERCENT=10
export GSN_FEE=1

cat <<HERE
##############################################################################
                         Welcome, Friends of Augur

This utility will help to set up the services which can interact with Augur on
kovan, mainnet, and localhost.

This utility requires docker-ce and docker-compose, and once fully installed
the services can be managed using docker-compose directly.

Configuration will be written to the a directory on your filesystem.
##############################################################################
HERE

# Check docker is present
printf "Checking prerequisits...\n"
if [ -x "$(command -v docker)" ]; then
  printf "[x]: Docker - Installed\n"
else
  printf "[!]: Docker - not installed\n~~> You need Docker installed and configured in order to run the augur services. See: https://docs.docker.com/get-docker/ for instructions.\n\n";
  exit 1;
fi

docker info > /dev/null 2>&1;
if [ $? != 0 ]; then
  printf "[!]: Docker Daemon - Not running!\n~~> Follow the instructions from the docker install guide on making sure your docker daemon is running\n";
  exit 1;
else
  printf "[x]: Docker Daemon - Running!\n";
fi

if [ -x "$(command -v docker-compose)" ]; then
  printf "[x]: docker-compose - Installed\n"
else
  printf "[!]: docker-compose - Not installed\n~~> You must install docker-compose to run Augur services. See: https://docs.docker.com/compose/install/\n"
  exit 1
fi
printf "Prerequisits check complete!\n\n"

read_env(){
	local choice
	read -p "Enter choice [1 - 3] (Default is v2): " choice
	case $choice in
		1) printf "v2";;
		2) printf "mainnet";;
		3) printf "local";;
		# The Default
		*) printf "v2"
	esac
}

cat <<- HERE
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           Select Augur Environment
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
1. v2 (kovan)
2. mainnet
3. local
HERE
export AUGUR_ENV=$(read_env)

if [ "${AUGUR_ENV}" == "mainnet" ]; then
  # Get eth node url
  printf "$BUFFER_TEXT\nNOTE: You need to have access to an Ethereum Mainnet server.\nIf you don't have one or don't know what this is, \nregister one at https://infura.nio/register and past the Mainnet URL here.$BUFFER_TEXT\n";

  printf "Enter an ethereum RPC URL (default: $DEFAULT_ETH_NODE_URL): ";
  read ETH_NODE_URL;
  export ETHEREUM_HTTP=${ETH_NODE_URL:-$DEFAULT_ETH_NODE_URL}
elif [ "${AUGUR_ENV}" == "v2" ]; then
  export ETHEREUM_HTTP=${ETHEREUM_HTTP:-https://kovan.augur.net/ethereum-http}
else
  export ETHEREUM_HTTP=$DEFAULT_ETH_NODE_URL
fi

START_SERVICES="augur"

cat <<HERE

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          Configuring Augur runtime
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
HERE

mkdir augur 2> /dev/null
if [ $? -eq 0 ]; then
  printf "[x]: ${PWD}/augur - Created\n"
else
  printf "[x]: ${PWD}/augur - Already exists, reusing\n"
fi

if [ -f ./augur/docker-compose.yml ]; then
  printf "[!]: ${PWD}/augur/docker-compose.yml - Already exists, delete and re-run to upgrade\n"
else
  curl -fSsa $DOCKER_COMPOSE_FILE_URL -o ./augur/docker-compose.yml && \
  printf "[x]: ${PWD}/augur/docker-compose.yml- Downloaded\n"
fi


(
cat <<HEREDOC
GSN_HOSTNAME=${GSN_HOSTNAME}
GSN_PORT=${GSN_PORT}
GSN_RELAY_HUB=${GSN_RELAY_HUB}
GSN_GAS_PRICE_PERCENT=${GSN_GAS_PRICE_PERCENT}
GSN_FEE=${GSN_FEE}
ETHEREUM_HTTP=${ETHEREUM_HTTP}
AUGUR_ENV=${AUGUR_ENV}
HEREDOC
) > ./augur/.env
printf "[x]: ${PWD}/augur/.env - Configuration saved\n"


cat <<HERE

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        Ready to start augur services

This will take a while the code is built locally.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
HERE

read -n 1 -s -r -p "Press any key to continue"
docker-compose -f ./augur/docker-compose.yml --env-file ./augur/.env up ${START_SERVICES}
