pragma solidity 0.5.15;


import 'ROOT/trading/IFillOrder.sol';


contract MockFillOrder is IFillOrder {
    using SafeMathUint256 for uint256;

    bytes32 private publicFillOrderOrderIdValue;
    uint256 private publicFillOrderAmountFillerWantsValue;
    bytes32 private publicFillOrderTradeGroupIdValue;
    address private fillOrderFillerValue;
    bytes32 private fillOrderOrderIdValue;
    uint256 private fillOrderAmountFillerWantsValue;
    bytes32 private fillOrderTradeGroupIdValue;

    function publicFillOrder(bytes32 _orderId, uint256 _amountFillerWants, bytes32 _tradeGroupId, bool _ignoreShares) external returns (uint256) {
        publicFillOrderOrderIdValue = _orderId;
        publicFillOrderAmountFillerWantsValue = _amountFillerWants;
        publicFillOrderTradeGroupIdValue = _tradeGroupId;
        return 100;
    }

    function fillOrder(address _filler, bytes32 _orderId, uint256 _amountFillerWants, bytes32 _tradeGroupId, bool _ignoreShares) external returns (uint256) {
        fillOrderFillerValue = _filler;
        fillOrderOrderIdValue = _orderId;
        fillOrderAmountFillerWantsValue = _amountFillerWants;
        fillOrderTradeGroupIdValue = _tradeGroupId;
        return 100;
    }
}
