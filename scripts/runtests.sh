#!/bin/bash
# augur.js test suite
# @author Jack Peterson (jack@tinybike.net)

trap "exit" INT

TEAL='\033[0;36m'
GRAY='\033[1;30m'
NC='\033[0m'

runtest()
{
    echo -e " ${TEAL}test/${1}${NC}"

    if [ "${coverage}" == "1" ]; then
        istanbul cover -x **/lib/**,**/scripts/**,**/dist/** _mocha test/${1} --gospel -- -R ${reporter}
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
client=0
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
        "--client") set -- "$@" "-l" ;;
        "--aux") set -- "$@" "-x" ;;
        "--spec") set -- "$@" "-k" ;;
        *) set -- "$@" "$arg"
    esac
done
OPTIND=1
while getopts "gvoncrmslxk" opt; do
    case "$opt" in
        g) gospel="--gospel" ;;
        v) coverage=1 ;;
        o) offline=1 ;;
        n) connect=1 ;;
        c) core=1 ;;
        r) create=1 ;;
        m) markets=1 ;;
        s) consensus=1 ;;
        l) client=1 ;;
        x) aux=1 ;;
        k) reporter="spec" ;;
    esac
done
shift $(expr $OPTIND - 1)

echo -e "+${GRAY}================${NC}+"
echo -e "${GRAY}| \033[1;35maugur.js${NC} tests ${GRAY}|${NC}"
echo -e "+${GRAY}================${NC}+\n"

[ "${offline}" == "1" ] && runtest "offline"
[ "${connect}" == "1" ] && runtest "connect"
[ "${create}" == "1" ] && runtest "create"
[ "${markets}" == "1" ] && runtest "markets"
[ "${core}" == "1" ] && runtest "core"
[ "${client}" == "1" ] && runtest "client"
[ "${consensus}" == "1" ] && runtest "consensus"
[ "${aux}" == "1" ] && runtest "aux"

if [ "${offline}" == "1" ]; then

    echo -e " ${TEAL}jshint${NC}\n"

    declare -a targets=("gulpfile.js" "src/*.js" "src/client" "src/aux" "scripts/setup.js")
    for target in "${targets[@]}"
    do
        jshint ${target}
        echo -e "   \033[1;32m✓${NC}  ${GRAY}${target}${NC}"
    done
    echo
fi
