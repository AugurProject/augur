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
        istanbul cover -x **/lib/**,**/scripts/**,**/dist/** _mocha test/${1} -- -R ${reporter}
    else
        mocha -R ${reporter} test/${1}
    fi
}

reporter="progress"
coverage=0
core=0
create=0
markets=0
reporting=0
trading=0

for arg in "$@"; do
    shift
    case "$arg" in
        "--coverage") set -- "$@" "-v" ;;
        "--core") set -- "$@" "-c" ;;
        "--create") set -- "$@" "-r" ;;
        "--markets") set -- "$@" "-m" ;;
        "--reporting") set -- "$@" "-s" ;;
        "--trading") set -- "$@" "-l" ;;
        "--spec") set -- "$@" "-k" ;;
        *) set -- "$@" "$arg"
    esac
done
OPTIND=1
while getopts "gvocrmslk" opt; do
    case "$opt" in
        g) gospel="--gospel" ;;
        v) coverage=1 ;;
        c) core=1 ;;
        r) create=1 ;;
        m) markets=1 ;;
        s) reporting=1 ;;
        l) trading=1 ;;
        k) reporter="spec" ;;
    esac
done
shift $(expr $OPTIND - 1)

echo -e "+${GRAY}================${NC}+"
echo -e "${GRAY}| \033[1;35maugur.js${NC} tests ${GRAY}|${NC}"
echo -e "+${GRAY}================${NC}+\n"

[ "${create}" == "1" ] && runtest "create"
[ "${markets}" == "1" ] && runtest "markets"
[ "${core}" == "1" ] && runtest "core"
[ "${trading}" == "1" ] && runtest "trading"
[ "${reporting}" == "1" ] && runtest "reporting"

echo
