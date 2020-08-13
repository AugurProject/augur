#!/usr/bin/env bash

make_docker_compose() {
  cat << 'EOF' > "${PWD}/augur/docker-compose.yml"
version: '3.7'

services:
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
#!/usr/bin/env bash

DEFAULT_ETH_NODE_URL="${ETHEREUM_HTTP:-http://localhost:8545}";

method="$1"

intro() {
  cat <<HERE

##############################################################################
                          Welcome, Friend of Augur

This utility will help to set up the services which can interact with Augur on
kovan, mainnet, and localhost.

This utility requires docker-ce and docker-compose, and once fully installed
the services can be managed using docker-compose directly. If you don't know
what that means, you can also just google docker desktop and download that and
run it.

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

To view logs:
./augur/cli logs

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

get_augur_key() {
  helper() {
    key=$(docker logs $(docker ps|grep augur_augur_1|awk '{print $1}') 2>&1|grep -C0 'wallet with address'|awk '{print $5}')
    key_exists=$(docker logs $(docker ps|grep augur_augur_1|awk '{print $1}') 2>&1|grep -C0 'Keyfile already exists at path')
    if [ ! -z "$key" ]; then
      echo "$key"
      echo "$key" > ./addr.key
      return 0
    elif [ ! -z "$key_exists" ]; then
      cat ./addr.key
      return 0
    else
      return 1
    fi
  }
  until helper
    do sleep 1
  done
}

get_previous_warp_sync_hash() {
  helper() {
    hash=$(docker logs $(docker ps|grep augur_augur_1|awk '{print $1}') 2>&1|grep -C0 'Previous Warp Sync Hash'|awk '{print $5}')
    if [ -z "$hash" ]
      then return 1
      else
        echo $hash
        return 0
    fi
  }
  until helper
    do sleep 1
  done
}

get_current_warp_sync_hash() {
  helper() {
    hash=$(docker logs $(docker ps|grep augur_augur_1|awk '{print $1}') 2>&1|grep -C0 'Current Warp Sync State'|awk '{print $7}')
    if [ -z "$hash" ]
      then return 1
      else
        echo $hash
        return 0
    fi
  }
  until helper
    do sleep 1
  done
}

get_trading_UI_hash() {
  docker logs $(docker ps|grep augur_augur_1|awk '{print $1}') 2>&1|grep -C0 'Pinning UI build at path'|awk '{print $10}'
}

get_trading_UI_hash32() {
  docker logs $(docker ps|grep augur_augur_1|awk '{print $1}') 2>&1|grep -C0 'Pinning UI build at path'|awk '{print $12}'
}

get_reporting_UI_hash() {
  docker logs $(docker ps|grep augur_augur_1|awk '{print $1}') 2>&1|grep -C0 'Pinning Reporting UI build at path'|awk '{print $11}'
}

get_reporting_UI_hash32() {
  docker logs $(docker ps|grep augur_augur_1|awk '{print $1}') 2>&1|grep -C0 'Pinning Reporting UI build at path'|awk '{print $13}'
}

setup() {
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
ETHEREUM_HTTP=${ETHEREUM_HTTP}
AUGUR_ENV=${AUGUR_ENV}
HEREDOC
) > ./augur/.env
printf "[x]: ${PWD}/augur/.env - Configuration saved\n"


cat <<HERE

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        Ready To Start Augur Services
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Will run "./augur/cli start".
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
    cd augur
    docker-compose up -d augur
    printf "Spinning up augur sdk server. Please wait, this'll take many minutes\n"
    printf "You can view the progress in a separate terminal with this command: $0 logs"
    printf "\n\n"

    augur_key=`get_augur_key`
    previous_warp_sync_hash=`get_previous_warp_sync_hash`
    current_warp_sync_hash=`get_current_warp_sync_hash`
    trading_ui_hash=`get_trading_UI_hash`
    trading_ui_hash32=`get_trading_UI_hash32`
    reporting_ui_hash=`get_reporting_UI_hash`
    reporting_ui_hash32=`get_reporting_UI_hash32`

    cat <<PRETTYBLOCK
##############################
IPFS Hashes
##############################
- Reporting
  - CIDv0: $reporting_ui_hash
  - CIDv1: $reporting_ui_hash32
- Trading
  - CIDv0: $trading_ui_hash
  - CIDv1: $trading_ui_hash32

##############################
IPFS Links
##############################
Links:
- Reporting
    - https://$reporting_ui_hash32.ipfs.dweb.link
    - https://dweb.link/ipfs/$reporting_ui_hash
- Trading
    - https://$trading_ui_hash32.ipfs.dweb.link
    - https://dweb.link/ipfs/$trading_ui_hash

##############################
Warp Sync
##############################
ETH Account for Warp Sync Reporting: $augur_key
Most-recently resolved warp sync hash: $previous_warp_sync_hash
Warp sync hash to be reporting/confirmed for pending market: $current_warp_sync_hash

You are currently pinning the Trading and Reporting UIs to IPFS. Thanks!
This will be true as long as you keep the "augur_augur_1" docker running.

Actions you can take:
1. Pin the Trading UI with your local ipfs daemon (not just the augur docker):
   ipfs pin add $trading_ui_hash
2. Pin the Reporting UI with your local ipfs daemon (not just the augur docker):
   ipfs pin add reporting_ui_hash
3. Begin autoreporting on the warpsync market by sending some ether (recommended: 1 ETH) to your augur address: $augur_key
PRETTYBLOCK
  )
  ;;
"logs")
  (
    cd augur
    docker-compose logs -f
  )
  ;;
"stop")
  (
    cd augur &&\
    docker-compose down
  )
  ;;
"restart")
  (
    cd augur &&\
    docker-compose restart -d
  )
  ;;
"upgrade")
  printf "Pulls new docker images and restarts augur.\n";
  (
    cd augur || (echo "augur directory does not exist - run $0 setup"; exit 1)

    docker-compose down
    docker-compose pull
    docker-compose up -d
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

if [ -d augur ]; then
  upgrade=true
else
  upgrade=false
  mkdir augur
fi

make_docker_compose
make_cli && chmod +x ./augur/cli

if [ $upgrade = true ]; then
  /usr/bin/env bash ./augur/cli upgrade
  /usr/bin/env bash ./augur/cli start
else
  /usr/bin/env bash ./augur/cli setup
fi
