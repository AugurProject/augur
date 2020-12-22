pragma solidity 0.5.15;

import 'ROOT/trading/FillOrder.sol';


contract FillOrderFactory {
    function createFillOrder() public returns (address) {
        return address(new FillOrder());
    }
}