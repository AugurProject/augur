#!/bin/bash
# augur.js test suite
# @author Jack Peterson (jack@tinybike.net)

# set -e
trap "exit" INT

TEAL='\033[0;36m'
GRAY='\033[1;30m'
NC='\033[0m'

runtest()
{
    echo -e " ${TEAL}test/${1}${NC}"

    if [ "${coverage}" == "1" ]; then
        istanbul cover _mocha test/${1} --gospel -- -R ${reporter}
    else
        mocha -R ${reporter} test/${1} ${gospel}
    fi
}

reporter="progress"
gospel=''
coverage=0
offline=0
connect=0
core=0
create=0
markets=0
consensus=0
aux=0

for arg in "$@"; do
    shift
    case "$arg" in
        "--gospel") set -- "$@" "-g" ;;
        "--coverage") set -- "$@" "-v" ;;
        "--offline") set -- "$@" "-o" ;;
        "--connect") set -- "$@" "-n" ;;
        "--core") set -- "$@" "-c" ;;
        "--create") set -- "$@" "-r" ;;
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
        n) connect=1 ;;
        c) core=1 ;;
        r) create=1 ;;
        m) markets=1 ;;
        s) consensus=1 ;;
        x) aux=1 ;;
    esac
done
shift $(expr $OPTIND - 1)

echo -e "+${GRAY}================${NC}+"
echo -e "${GRAY}| \033[1;35maugur.js${NC} tests ${GRAY}|${NC}"
echo -e "+${GRAY}================${NC}+\n"

[ "${offline}" == "1" ] && runtest "offline"
[ "${core}" == "1" ] && runtest "core"
[ "${connect}" == "1" ] && runtest "connect"
[ "${create}" == "1" ] && runtest "create"
[ "${markets}" == "1" ] && runtest "markets"
[ "${consensus}" == "1" ] && runtest "consensus"
[ "${aux}" == "1" ] && runtest "auxiliary"

if [ "${offline}" == "1" ]; then

    echo -e " ${TEAL}jshint${NC}\n"

    declare -a targets=("gulpfile.js" "src/*" "scripts/setup.js")
    for target in "${targets[@]}"
    do
        jshint ${target}
        echo -e "   \033[1;32m✓${NC}  ${GRAY}${target}${NC}"
    done
    echo
fi
