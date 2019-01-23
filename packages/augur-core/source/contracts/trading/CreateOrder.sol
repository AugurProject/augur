// Copyright (C) 2015 Forecast Foundation OU, full GPL notice in LICENSE

pragma solidity 0.4.24;


import 'libraries/ReentrancyGuard.sol';
import 'trading/Order.sol';
import 'trading/ICreateOrder.sol';
import 'libraries/Initializable.sol';
import 'IAugur.sol';


contract CreateOrder is Initializable, ReentrancyGuard {
    using Order for Order.Data;

    IAugur public augur;
    address public trade;

    function initialize(IAugur _augur) public beforeInitialized returns (bool) {
        endInitialization();
        augur = _augur;
        trade = augur.lookup("Trade");
        return true;
    }

    function publicCreateOrder(Order.Types _type, uint256 _attoshares, uint256 _price, IMarket _market, uint256 _outcome, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, bool _ignoreShares) external afterInitialized returns (bytes32) {
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

    function publicCreateOrders(uint256[] _outcomes, Order.Types[] _types, uint256[] _attoshareAmounts, uint256[] _prices, IMarket _market, bool _ignoreShares, bytes32 _tradeGroupId) public afterInitialized nonReentrant returns (bytes32[] memory _orders) {
        require(augur.isValidMarket(_market));
        _orders = new bytes32[]( _types.length);

        for (uint256 i = 0; i <  _types.length; i++) {
            Order.Data memory _orderData = Order.create(augur, msg.sender, _outcomes[i], _types[i], _attoshareAmounts[i], _prices[i], _market, bytes32(0), bytes32(0), _ignoreShares);
            Order.escrowFunds(_orderData);
            require(_orderData.orders.getAmount(_orderData.getOrderId()) == 0);
            _orders[i] = Order.saveOrder(_orderData, _tradeGroupId);
        }

        return _orders;
    }
}
