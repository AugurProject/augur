pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import 'ROOT/IAugur.sol';
import 'ROOT/para/ParaAugurTrading.sol';


contract ParaAugurTradingFactory {
    function createParaAugurTrading(IAugur _augur) public returns (address) {
        ParaAugurTrading _paraAugurTrading = new ParaAugurTrading(_augur);
        _paraAugurTrading.transferOwnership(msg.sender);
        return address(_paraAugurTrading);
    }
}