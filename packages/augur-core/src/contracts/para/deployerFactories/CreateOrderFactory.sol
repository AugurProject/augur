pragma solidity 0.5.15;

import 'ROOT/trading/CreateOrder.sol';


contract CreateOrderFactory {
    function createCreateOrder() public returns (address) {
        return address(new CreateOrder());
    }
}