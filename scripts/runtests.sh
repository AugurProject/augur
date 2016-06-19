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
core=0
create=0
markets=0
consensus=0
client=0

for arg in "$@"; do
    shift
    case "$arg" in
        "--gospel") set -- "$@" "-g" ;;
        "--coverage") set -- "$@" "-v" ;;
        "--core") set -- "$@" "-c" ;;
        "--create") set -- "$@" "-r" ;;
        "--markets") set -- "$@" "-m" ;;
        "--consensus") set -- "$@" "-s" ;;
        "--client") set -- "$@" "-l" ;;
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
        s) consensus=1 ;;
        l) client=1 ;;
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
[ "${client}" == "1" ] && runtest "client"
[ "${consensus}" == "1" ] && runtest "consensus"

echo -e " ${TEAL}jshint${NC}\n"

declare -a targets=("gulpfile.js" "src/*.js" "src/client/*.js" "src/modules/*.js" "scripts/setup.js" "test/*.js")
for target in "${targets[@]}"
do
    jshint ${target}
    echo -e "   \033[1;32m✓${NC}  ${GRAY}${target}${NC}"
done
echo
