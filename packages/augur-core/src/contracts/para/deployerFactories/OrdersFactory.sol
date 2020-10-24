pragma solidity 0.5.15;

import 'ROOT/trading/Orders.sol';


contract OrdersFactory {
    function createOrders() public returns (address) {
        return address(new Orders());
    }
}