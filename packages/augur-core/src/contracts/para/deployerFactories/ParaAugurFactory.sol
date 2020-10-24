pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import 'ROOT/IAugur.sol';
import 'ROOT/para/ParaAugur.sol';


contract ParaAugurFactory {
    function createParaAugur(IAugur _augur, uint256 _tradeIntervalModifier) public returns (address) {
        ParaAugur _paraAugur = new ParaAugur(_augur, _tradeIntervalModifier);
        _paraAugur.transferOwnership(msg.sender);
        return address(_paraAugur);
    }
}