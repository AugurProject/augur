#!/bin/bash
# augur.js test suite
# @author Jack Peterson (jack@tinybike.net)

set -e
trap "exit" INT

gospel=0
basic=0
connect=0
core=0
markets=0
consensus=0
aux=0

for arg in "$@"; do
    shift
    case "$arg" in
        "--gospel") set -- "$@" "-g" ;;
        "--basic") set -- "$@" "-b" ;;
        "--connect") set -- "$@" "-n" ;;
        "--core") set -- "$@" "-c" ;;
        "--markets") set -- "$@" "-m" ;;
        "--consensus") set -- "$@" "-s" ;;
        "--aux") set -- "$@" "-x" ;;
        *) set -- "$@" "$arg"
    esac
done
OPTIND=1
while getopts "gbncmsxa" opt; do
    case "$opt" in
        g) gospel="--gospel" ;;
        b) basic=1 ;;
        n) connect=1 ;;
        c) core=1 ;;
        m) markets=1 ;;
        s) consensus=1 ;;
        x) aux=1 ;;
    esac
done
shift $(expr $OPTIND - 1)

if [ "${basic}" == "0" ] && [ "${connect}" == "0" ] &&
   [ "${core}" == "0" ] && [ "${markets}" == "0" ] &&
   [ "${consensus}" == "0" ] && [ "${aux}" == "0" ]; then
    basic=1
    connect=1
    core=1
    markets=1
    consensus=0
    aux=1
fi

CYAN='\033[0;36m'
PURPLE='\033[1;35m'
BLUE='\033[1;34m'
GRAY='\033[1;30m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GRAY}+=====================+"
echo -e "|${PURPLE} augur.js${NC} test suite ${GRAY}|"
echo -e "+=====================+${NC}\n"

echo -e "${BLUE}jshint:${NC}\n"
echo -e "  ${CYAN}src/*\n"
jshint src

if [ "${basic}" == "1" ]; then

    declare -a basic_tests=("utilities" "numeric" "abi")

    echo -e "${BLUE}basic:${NC}\n"

    for i in "${basic_tests[@]}"; do
        printf "  ${CYAN}test/$i${NC}"
        mocha test/$i.js
    done
fi

if [ "${connection}" == "1" ]; then

    declare -a connection_tests=("connect" "contracts")

    echo -e "${BLUE}connection:${NC}\n"

    for i in "${connection_tests[@]}"; do
        printf "  ${CYAN}test/$i ${GRAY}$gospel${NC}"
        mocha test/$i.js $gospel
    done
fi

if [ "${core}" == "1" ]; then

    declare -a core_tests=("ethrpc" "invoke" "batch" "faucets")

    echo -e "${BLUE}core:${NC}\n"

    for i in "${core_tests[@]}"; do
        printf "  ${CYAN}test/$i ${GRAY}$gospel${NC}"
        mocha test/$i.js $gospel
    done
fi

if [ "${markets}" == "1" ]; then

    declare -a markets_tests=("createMarket" "branches" "info" "markets" "events" "reporting" "payments" "createEvent" "buyAndSellShares")

    echo -e "${BLUE}markets:${NC}\n"

    for i in "${markets_tests[@]}"; do
        printf "  ${CYAN}test/$i ${GRAY}$gospel${NC}"
        mocha test/$i.js $gospel
    done
fi

if [ "${consensus}" == "1" ]; then

    declare -a consensus_tests=("expiring" "addEvent" "ballot" "makeReports" "checkQuorum" "closeMarket" "dispatch" "interpolate" "resolve" "score")

    echo -e "${BLUE}consensus:${NC}\n"

    for i in "${consensus_tests[@]}"; do
        printf "  ${CYAN}test/$i ${GRAY}$gospel${NC}"
        mocha test/$i.js $gospel
    done
fi

if [ "${aux}" == "1" ]; then

    declare -a aux_tests=("web" "multicast" "namereg" "comments" "priceLog")

    echo -e "${BLUE}aux:${NC}\n"

    for i in "${aux_tests[@]}"; do
        printf "  ${CYAN}test/$i ${GRAY}$gospel${NC}"
        mocha test/$i.js $gospel
    done
fi
