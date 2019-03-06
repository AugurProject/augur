pragma solidity 0.5.4;


import 'ROOT/trading/Order.sol';
import 'ROOT/reporting/IMarket.sol';


contract IOrdersFetcher {
    function findBoundingOrders(Order.Types _type, uint256 _price, bytes32 _bestOrderId, bytes32 _worstOrderId, bytes32 _betterOrderId, bytes32 _worseOrderId) public returns (bytes32 betterOrderId, bytes32 worseOrderId);
}
