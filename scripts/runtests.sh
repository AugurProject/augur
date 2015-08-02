#!/bin/bash
# augur.js test suite
# @author Jack Peterson (jack@tinybike.net)

set -e
trap "exit" INT

reporter="progress"

gospel=''
coverage=0
offline=0
connection=0
core=0
creation=0
markets=0
consensus=0
aux=0

for arg in "$@"; do
    shift
    case "$arg" in
        "--gospel") set -- "$@" "-g" ;;
        "--coverage") set -- "$@" "-v" ;;
        "--offline") set -- "$@" "-o" ;;
        "--connection") set -- "$@" "-n" ;;
        "--core") set -- "$@" "-c" ;;
        "--creation") set -- "$@" "-r" ;;
        "--markets") set -- "$@" "-m" ;;
        "--consensus") set -- "$@" "-s" ;;
        "--aux") set -- "$@" "-x" ;;
        *) set -- "$@" "$arg"
    esac
done
OPTIND=1
while getopts "gvoncrmsxa" opt; do
    case "$opt" in
        g) gospel="--gospel" ;;
        v) coverage=1 ;;
        o) offline=1 ;;
        n) connection=1 ;;
        c) core=1 ;;
        r) creation=1 ;;
        m) markets=1 ;;
        s) consensus=1 ;;
        x) aux=1 ;;
    esac
done
shift $(expr $OPTIND - 1)

if [ "${offline}" == "0" ] && [ "${connection}" == "0" ] &&
   [ "${core}" == "0" ] &&  [ "${creation}" == "0" ] && [ "${markets}" == "0" ] &&
   [ "${consensus}" == "0" ] && [ "${aux}" == "0" ]; then
    offline=1
    connection=1
    core=1
    creation=1
    markets=1
    consensus=0
    aux=1
fi

runtest()
{
    echo -e " ${CYAN}test/${1}${NC}"

    if [ "${coverage}" == "1" ]; then
        istanbul cover _mocha test/${1} --gospel -- -R ${reporter}
    else
        mocha -R ${reporter} test/${1} ${gospel}
    fi
}

CYAN='\033[0;36m'
PURPLE='\033[1;35m'
BLUE='\033[1;34m'
GRAY='\033[1;30m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "+${GRAY}=====================${NC}+"
echo -e "${GRAY}|${PURPLE} augur.js${NC} test suite ${GRAY}|${NC}"
echo -e "+${GRAY}=====================${NC}+\n"

[ "${offline}" == "1" ] && runtest "offline"
[ "${core}" == "1" ] && runtest "core"
[ "${connect}" == "1" ] && runtest "connect"
[ "${create}" == "1" ] && runtest "create"
[ "${markets}" == "1" ] && runtest "markets"
[ "${consensus}" == "1" ] && runtest "consensus"
[ "${aux}" == "1" ] && runtest "auxiliary"

if [ "${offline}" == "1" ]; then
    echo -e " ${CYAN}jshint src${NC}\n"
    jshint src
fi
