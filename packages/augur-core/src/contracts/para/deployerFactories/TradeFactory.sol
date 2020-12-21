pragma solidity 0.5.15;

import 'ROOT/trading/Trade.sol';


contract TradeFactory {
    function createTrade() public returns (address) {
        return address(new Trade());
    }
}