#!/usr/bin/env sh

BUFFER_TEXT="\n###########################";
DEFAULT_ETH_NODE_URL="http://localhost:8545";

printf "$BUFFER_TEXT\n  Welcome friend of Augur$BUFFER_TEXT\n";

# Check docker is present
if [ -x "$(command -v docker)" ]
then
  printf "Your system already has access to Docker, you're good to go!\n\n";
else
  printf "You need Docker installed and configured in order to run the augur services. See: https://docs.docker.com/get-docker/ for instructions.\n\n";
  exit 1;
fi

docker info > /dev/null 2>&1;
if [ $? != 0 ]
then
  printf "Docker daemon not running. Cannot install.\n\n";
  exit 1;
else
  printf "Docker daemon is running!\n\n";
fi

# Get eth node url
printf "$BUFFER_TEXT\nNOTE: You need to have access to an Ethereum Mainnet server.\nIf you don't have one or don't know what this is, \nregister one at https://infura.nio/register and past the Mainnet URL here.$BUFFER_TEXT\n";

printf "Enter an ethereum RPC URL (default: $DEFAULT_ETH_NODE_URL): ";
read ETH_NODE_URL;

print_menu() {
	printf "~~~~~~~~~~~~~~~~~~~~~\n"
	printf " Select Augur Environmen\n"
	printf "~~~~~~~~~~~~~~~~~~~~\n"
	printf "1. mainnet\n"
	printf "2. v2 (kovan)\n"
	printf "3. local\n"
}

read_options(){
	local choice
	read -p "Enter choice [ 1 - 3] (Default is v2): " choice
	case $choice in
		1) printf "mainnet";;
		2) printf "v2" ;;
		3) printf "local" ;;
		# The Default
		*) printf "v2"
	esac
}

print_menu;
AUGUR_ENV=$(read_options);

docker run -e ETH_NODE_URL=${ETH_NODE_URL:-$DEFAULT_ETH_NODE_URL} -e AUGUR_ENV=$AUGUR_ENV augurproject/augur:runner;
