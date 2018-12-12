// Copyright (C) 2015 Forecast Foundation OU, full GPL notice in LICENSE

pragma solidity 0.4.24;


import 'libraries/ReentrancyGuard.sol';
import 'trading/Order.sol';
import 'trading/ICreateOrder.sol';
import 'libraries/CashAutoConverter.sol';
import 'libraries/Initializable.sol';


contract CreateOrder is CashAutoConverter, Initializable, ReentrancyGuard {
    using Order for Order.Data;

    address public trade;

    function initialize(IAugur _augur) public beforeInitialized returns (bool) {
        endInitialization();
        augur = _augur;
        trade = augur.lookup("Trade");
        return true;
    }

    function publicCreateOrder(Order.Types _type, uint256 _attoshares, uint256 _price, IMarket _market, uint256 _outcome, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, bool _ignoreShares) external payable afterInitialized convertToAndFromCash returns (bytes32) {
        bytes32 _result = this.createOrder(msg.sender, _type, _attoshares, _price, _market, _outcome, _betterOrderId, _worseOrderId, _tradeGroupId, _ignoreShares);
        _market.assertBalances();
        return _result;
    }

    function createOrder(address _creator, Order.Types _type, uint256 _attoshares, uint256 _price, IMarket _market, uint256 _outcome, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, bool _ignoreShares) external afterInitialized nonReentrant returns (bytes32) {
        require(augur.isValidMarket(_market));
        require(msg.sender == trade || msg.sender == address(this));
        Order.Data memory _orderData = Order.create(augur, _creator, _outcome, _type, _attoshares, _price, _market, _betterOrderId, _worseOrderId, _ignoreShares);
        Order.escrowFunds(_orderData);
        require(_orderData.orders.getAmount(_orderData.getOrderId()) == 0);
        return Order.saveOrder(_orderData, _tradeGroupId);
    }
}
