pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import 'ROOT/para/ParaZeroXTrade.sol';


contract ZeroXTradeFactory {
    function createZeroXTrade() public returns (address) {
        return address(new ParaZeroXTrade());
    }
}