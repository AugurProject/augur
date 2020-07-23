#!/usr/bin/env sh

BUFFER_TEXT="\n###########################";
DEFAULT_ETH_NODE_URL="http://localhost:8545";

echo "$BUFFER_TEXT\n  Welcome friend of Augur$BUFFER_TEXT";

# Check docker is present
if [ -x "$(command -v docker)" ]
then
  echo "Your system already has access to Docker, you're good to go!\n";
else
  echo "You need Docker installed and configured in order to run the augur services. See: https://docs.docker.com/get-docker/ for instructions.\n";
  exit 1;
fi

docker info > /dev/null 2>&1;
if [ $? != 0 ]
then
  echo "Docker daemon not running. Cannot install.\n";
  exit 1;
else
  echo "Docker daemon is running!\n";
fi

# Get eth node url
echo "$BUFFER_TEXT\nNOTE: You need to have access to an Ethereum Mainnet server.\nIf you don't have one or don't know what this is, \nregister one at https://infura.io/register and past the Mainnet URL here.$BUFFER_TEXT";

printf "Enter an ethereum RPC URL (default: $DEFAULT_ETH_NODE_URL): ";
read ETH_NODE_URL;

print_menu() {
	echo "~~~~~~~~~~~~~~~~~~~~~"
	echo " Select Augur Environment"
	echo "~~~~~~~~~~~~~~~~~~~~~"
	echo "1. mainnet"
	echo "2. v2 (kovan)"
	echo "3. local"
}

read_options(){
	local choice
	read -p "Enter choice [ 1 - 3] " choice
	case $choice in
		1) echo "mainnet";;
		2) echo "v2" ;;
		3) echo "local" ;;
		*) echo -e "${RED}Error...${STD}" && sleep 2
	esac
}

print_menu;
AUGUR_ENV=$(read_options);

docker run -e ETH_NODE_URL=${ETH_NODE_URL:-$DEFAULT_ETH_NODE_URL} -e AUGUR_ENV=$AUGUR_ENV augurproject/augur:runner;
