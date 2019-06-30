pragma solidity 0.5.4;


import 'ROOT/trading/Order.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/libraries/token/IERC20.sol';


contract ICreateOrder {
    function publicCreateOrder(Order.Types, uint256, uint256, IMarket, uint256, bytes32, bytes32, bytes32, bool, IERC20) external returns (bytes32);
    function createOrder(address, Order.Types, uint256, uint256, IMarket, uint256, bytes32, bytes32, bytes32, bool, IERC20) external returns (bytes32);
}
