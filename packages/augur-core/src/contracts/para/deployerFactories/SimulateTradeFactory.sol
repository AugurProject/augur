pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import 'ROOT/trading/SimulateTrade.sol';


contract SimulateTradeFactory {
    function createSimulateTrade() public returns (address) {
        return address(new SimulateTrade());
    }
}