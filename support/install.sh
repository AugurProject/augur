#!/usr/bin/env bash

DOCKER_COMPOSE_FILE_URL=https://raw.githubusercontent.com/AugurProject/augur/v2/support/docker-compose.yml
CLI_FILE_URL=https://raw.githubusercontent.com/AugurProject/augur/v2/support/cli

make_docker_compose() {
  cat << 'EOF' > "${PWD}/augur/docker-compose.yml"
version: '3.7'

services:
  caddy:
    image: caddy:2.1.1-alpine
    restart: always
    ports:
      - 80:80
      - 443:443
    volumes:
      - ./caddy:/data
    entrypoint: ["caddy", "reverse-proxy", "--from", "${GSN_HOSTNAME}", "--to", "http://gsn:8090"]

  gsn:
    image: tabookey/gsn-dev-server:v0.4.1
    restart: always
    ports:
      - 8090:8090 #needed for debugging without https frontend
    volumes:
      - ./gsn:/data
    entrypoint: ["./RelayHttpServer", "-RelayHubAddress", "${GSN_RELAY_HUB}", "-Workdir", "/data", "-GasPricePercent", "${GSN_GAS_PRICE_PERCENT}", "-EthereumNodeUrl", "${ETHEREUM_HTTP}", "-Url", "https://${GSN_HOSTNAME}", "-Fee", "${GSN_FEE}", "-Port", "${GSN_PORT}"]

  augur:
    image: augurproject/augur:runner
    restart: always
    ports:
      - 9001:9001
      - 9002:9002
      - 9003:9003
      - 9004:9004
    volumes:
      - ./keys:/keys
    environment:
      AUGUR_ENV: ${AUGUR_ENV}
      ETHEREUM_NETWORK: ${AUGUR_ENV}
      ETH_NODE_URL: ${ETHEREUM_HTTP}
EOF
}

make_cli() {
  cat << 'EOF' > "${PWD}/augur/cli"
#!/usr/bin/env sh

set -e;

DEFAULT_ETH_NODE_URL="${ETHEREUM_HTTP:-http://localhost:8545}";

method="$1"

intro() {
  cat <<HERE

##############################################################################
                          Welcome, Friend of Augur

This utility will help to set up the services which can interact with Augur on
kovan, mainnet, and localhost.

This utility requires docker-ce and docker-compose, and once fully installed
the services can be managed using docker-compose directly.

Configuration will be written to a directory on your filesystem.
##############################################################################

HERE
}

usage() {
  cat <<HERE
To setup scripts and start augur services:
./augur/cli setup

To start augur services:
./augur/cli start

To start GSN
./augur/cli start-gsn

To stop services:
./augur/cli stop

To restart services:
./augur/cli restart

To upgrade this script:
./augur/cli upgrade
HERE
}

prereqs() {
  # Check docker is present
  printf "Checking prerequisites...\n"
  if [ -x "$(command -v docker)" ]; then
    printf "[x]: Docker - Installed\n"
  else
    printf "[!]: Docker - not installed\n~~> You need Docker installed and configured in order to run the augur services. See: https://docs.docker.com/get-docker/ for instructions.\n\n";
    exit 1;
  fi

  docker info > /dev/null 2>&1;
  if [ $? != 0 ]; then
    printf "[!]: Docker Daemon - Not running!\n~~> Follow the instructions from the docker install guide on making sure your docker daemon is running or download docker desktop and double click to install\n";
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
  printf "Prerequisites check complete!\n\n"
}

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

setup() {
####################################################
# Configuration needed if the user wants to run GSN
export GSN_HOSTNAME=configurable-hostname-for-gsn-server.com
export GSN_PORT=8090
export GSN_RELAY_HUB=0xD216153c06E857cD7f72665E0aF1d7D82172F494
export GSN_GAS_PRICE_PERCENT=10
export GSN_FEE=1

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

cat <<HERE

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          Configuring Docker Environment
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
HERE

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
        Ready To Start Augur Services
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Will run `./augur/cli start`.
This may take some time...

HERE
read -n 1 -s -r -p "Press any key to continue"
echo
$0 start
}


intro
prereqs


if [ -z "${method}" ]; then
  usage
  exit 1
fi

case "$method" in
"setup")
  (
    setup
  )
  ;;
"start")
  (
    cd augur &&\
    docker-compose up -d augur
  )
  ;;
"start-gsn")
  (
    cd augur &&\
    docker-compose up -d caddy gsn
    # TODO wait until gsn is up then give user instructions like where to send staking ETH
  )
  ;;
"stop")
  (
    cd augur &&\
    docker-compose stop
  )
  ;;
"restart")
  (
    cd augur &&\
    docker-compose restart -d
  )
  ;;
"upgrade")
  printf "Pulls new docker images and restarts augur or gsn if they were run before.\n";
  (
    cd augur || (echo 'augur directory does not exist'; exit 1)

    augur_running=`docker ps|grep augur_augur_1`
    gsn_running=`docker ps|grep augur_gsn_1`

    docker-compose stop

    docker pull caddy:2.1.1-alpine
    docker pull tabookey/gsn-dev-server:v0.4.1
    docker pull augurproject/augur:runner

    if [ "$augur_running" == 0 ]; then
      docker-compose up -d augur
    fi

    if [ "gsn_running" == 0 ]; then
      docker-compose up -d caddy gsn
    fi
  )
  ;;
*)
  usage
  exit 1
esac
EOF
}

cat <<HERE

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          Configuring Augur runtime
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
HERE

mkdir augur 2>/dev/null
make_docker_compose
make_cli && chmod +x ./augur/cli

./augur/cli setup
