pragma solidity 0.5.10;


import 'ROOT/trading/Order.sol';


contract IFillOrder {
    function publicFillOrder(bytes32 _orderId, uint256 _amountFillerWants, bytes32 _tradeGroupId, address _affiliateAddress) external returns (uint256);
    function fillOrder(address _filler, bytes32 _orderId, uint256 _amountFillerWants, bytes32 tradeGroupId, address _affiliateAddress) external returns (uint256);
    function fillZeroXOrder(IMarket _market, uint256 _outcome, IERC20 _kycToken, uint256 _price, Order.Types _orderType, uint256 _amount, address _creator, bytes32 _tradeGroupId, address _affiliateAddress, address _filler) external returns (uint256);
}
