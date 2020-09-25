pragma solidity 0.5.15;

import 'ROOT/trading/CancelOrder.sol';


contract CancelOrderFactory {
    function createCancelOrder() public returns (address) {
        return address(new CancelOrder());
    }
}