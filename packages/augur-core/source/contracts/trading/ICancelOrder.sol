pragma solidity 0.5.4;


contract ICancelOrder {
    function cancelOrder(bytes32 _orderId) external returns (bool);
}
