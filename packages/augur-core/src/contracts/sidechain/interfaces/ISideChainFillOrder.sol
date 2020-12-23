pragma solidity 0.5.15;

import 'ROOT/trading/Order.sol';


contract ISideChainFillOrder {
    function publicFillOrder(bytes32 _orderId, uint256 _amountFillerWants, bytes32 _tradeGroupId) external returns (uint256);
    function fillOrder(address _filler, bytes32 _orderId, uint256 _amountFillerWants, bytes32 tradeGroupId) external returns (uint256);
    function fillZeroXOrder(address _market, uint256 _outcome, uint256 _price, Order.Types _orderType, address _creator, uint256 _amount, bytes32 _tradeGroupId, address _filler) external returns (uint256, uint256);
    function getMarketOutcomeValues(address _market) public view returns (uint256[] memory);
    function getMarketVolume(address _market) public view returns (uint256);
}
