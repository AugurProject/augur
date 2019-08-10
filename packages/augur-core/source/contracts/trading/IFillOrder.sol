pragma solidity 0.5.10;


import 'ROOT/trading/Order.sol';


contract IFillOrder {
    function publicFillOrder(bytes32 _orderId, uint256 _amountFillerWants, bytes32 _tradeGroupId, bool _ignoreShares, address _affiliateAddress) external returns (uint256);
    function fillOrder(address _filler, bytes32 _orderId, uint256 _amountFillerWants, bytes32 tradeGroupId, bool _ignoreShares, address _affiliateAddress) external returns (uint256);
}
