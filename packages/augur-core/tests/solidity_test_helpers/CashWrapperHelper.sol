pragma solidity ^0.4.24;

import 'libraries/CashAutoConverter.sol';
import 'trading/ICash.sol';


contract CashWrapperHelper is CashAutoConverter {

    function setAugur(IAugur _augur) public returns (bool) {
        augur = _augur;
    }

    function toEthFunction() public returns (bool) {
        return true;
    }
}
