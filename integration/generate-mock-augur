#!/bin/bash -e

# This script takes an argument, of the original (real) Augur.sol, extracts the
# events from it, and creates an emitter for those events
# the enum's are not dynamically included, so might need to be refreshed
# or new ones might need to be added

ORIGINAL_AUGUR_SOL=$1
if [ ! -f "$ORIGINAL_AUGUR_SOL" ]; then
	echo "Usage: $0 <original_augur.sol>"
	exit 1
fi

BASE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

MOCK_AUGUR_SOL=$BASE_DIR/MockAugur.sol
MOCK_AUGUR_ABI=$BASE_DIR/abi/MockAugur.abi.json

(


cat <<EOF
pragma solidity ^0.4.17;

contract IMarket {
    enum ReportingState {
        PRE_REPORTING,
        DESIGNATED_REPORTING,
        AWAITING_FORK_MIGRATION,
        DESIGNATED_DISPUTE,
        FIRST_REPORTING,
        FIRST_DISPUTE,
        AWAITING_NO_REPORT_MIGRATION,
        LAST_REPORTING,
        LAST_DISPUTE,
        FORKING,
        AWAITING_FINALIZATION,
        FINALIZED
    }
}

library Order {
    enum TradeTypes {
        Bid, Ask
    }
}

EOF

echo 'contract MockAugur {'

# Stupid mac sed
SED=sed
command -v gsed >/dev/null 2>&1 && SED=gsed

grep -w event $ORIGINAL_AUGUR_SOL | while read line; do
	echo '    '$line
	echo '    '$line | $SED -e 's/event/function/' -e 's/function ./\L&/' -e 's/indexed //g' -e 's/;/ public {/'
	echo '        '$line | $SED -E -e 's/event //' -e 's/\b(address|uint256|indexed|string|bytes32|Order.TradeTypes|IMarket.ReportingState)\b(\[\])? ?//g'
	echo '    '}
	echo
	echo
done

echo '}'

) > $MOCK_AUGUR_SOL

echo "Contract Created: $MOCK_AUGUR_SOL"

if command -v solc >/dev/null 2>&1 &&
   command -v jq   >/dev/null 2>&1; then
	solc $MOCK_AUGUR_SOL --combined-json abi | jq ".contracts[\"$MOCK_AUGUR_SOL:MockAugur\"].abi" -r | jq . > $MOCK_AUGUR_ABI
	echo "ABI Created: $MOCK_AUGUR_ABI"
else
	echo "If you had both solc and jq, I would have created the abi for you"
fi
