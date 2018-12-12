pragma solidity 0.4.24;


import 'trading/ICash.sol';
import 'IAugur.sol';


/**
 * @title Provides modifiers which take care of Cash/ETH conversion
 */
contract CashAutoConverter {

    IAugur public augur;

    /**
     * @dev Convert any ETH provided in the transaction into Cash before the function executes and convert any remaining Cash balance into ETH after the function completes
     */
    modifier convertToAndFromCash() {
        ethToCash();
        _;
        cashToEth();
    }

    function ethToCash() private returns (bool) {
        ICash _cash = ICash(augur.lookup("Cash"));
        if (msg.value > 0) {
            _cash.depositEtherFor.value(msg.value)(msg.sender);
        }
        return true;
    }

    function cashToEth() private returns (bool) {
        ICash _cash = ICash(augur.lookup("Cash"));
        uint256 _tokenBalance = _cash.balanceOf(msg.sender);
        if (_tokenBalance > 0) {
            augur.trustedTransfer(_cash, msg.sender, this, _tokenBalance);
            _cash.withdrawEtherTo(msg.sender, _tokenBalance);
        }
        return true;
    }
}
