pragma solidity ^0.5.15;

import 'ROOT/libraries/CashAutoConverter.sol';
import 'ROOT/ICash.sol';


contract CashWrapperHelper is CashAutoConverter {

    function setAugur(IAugur _augur) public returns (bool) {
        augur = _augur;
    }

    function toEthFunction() public returns (bool) {
        return true;
    }
}
