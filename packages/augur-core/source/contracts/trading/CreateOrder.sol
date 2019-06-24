// Copyright (C) 2015 Forecast Foundation OU, full GPL notice in LICENSE

pragma solidity 0.5.4;


import 'ROOT/libraries/ReentrancyGuard.sol';
import 'ROOT/trading/Order.sol';
import 'ROOT/trading/ICreateOrder.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/IAugur.sol';
import 'ROOT/trading/IProfitLoss.sol';


contract CreateOrder is Initializable, ReentrancyGuard {
    using Order for Order.Data;

    IAugur public augur;
    address public trade;
    IProfitLoss public profitLoss;


    function initialize(IAugur _augur) public beforeInitialized returns (bool) {
        endInitialization();
        augur = _augur;
        trade = augur.lookup("Trade");
        profitLoss = IProfitLoss(augur.lookup("ProfitLoss"));
        return true;
    }

    function publicCreateOrder(Order.Types _type, uint256 _attoshares, uint256 _price, IMarket _market, uint256 _outcome, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, bool _ignoreShares, IERC20 _kycToken) external afterInitialized returns (bytes32) {
        bytes32 _result = this.createOrder(msg.sender, _type, _attoshares, _price, _market, _outcome, _betterOrderId, _worseOrderId, _tradeGroupId, _ignoreShares, _kycToken);
        _market.assertBalances();
        return _result;
    }

    function createOrder(address _creator, Order.Types _type, uint256 _attoshares, uint256 _price, IMarket _market, uint256 _outcome, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, bool _ignoreShares, IERC20 _kycToken) external afterInitialized nonReentrant returns (bytes32) {
        require(augur.isValidMarket(_market));
        require(_kycToken == IERC20(0) || _kycToken.balanceOf(_creator) > 0);
        require(msg.sender == trade || msg.sender == address(this));
        Order.Data memory _orderData = Order.create(augur, _creator, _outcome, _type, _attoshares, _price, _market, _betterOrderId, _worseOrderId, _ignoreShares, _kycToken);
        Order.escrowFunds(_orderData);
        require(_orderData.orders.getAmount(_orderData.getOrderId()) == 0);
        profitLoss.recordFrozenFundChange(_market, _creator, _outcome, int256(_orderData.moneyEscrowed));
        return Order.saveOrder(_orderData, _tradeGroupId);
    }

    function publicCreateOrders(uint256[] memory _outcomes, Order.Types[] memory _types, uint256[] memory _attoshareAmounts, uint256[] memory _prices, IMarket _market, bool _ignoreShares, bytes32 _tradeGroupId, IERC20 _kycToken) public afterInitialized nonReentrant returns (bytes32[] memory _orders) {
        require(augur.isValidMarket(_market));
        require(_kycToken == IERC20(0) || _kycToken.balanceOf(msg.sender) > 0);
        _orders = new bytes32[]( _types.length);

        for (uint256 i = 0; i <  _types.length; i++) {
            Order.Data memory _orderData = Order.create(augur, msg.sender, _outcomes[i], _types[i], _attoshareAmounts[i], _prices[i], _market, bytes32(0), bytes32(0), _ignoreShares, _kycToken);
            Order.escrowFunds(_orderData);
            require(_orderData.orders.getAmount(_orderData.getOrderId()) == 0);
            profitLoss.recordFrozenFundChange(_market, msg.sender, _outcomes[i], int256(_orderData.moneyEscrowed));
            _orders[i] = Order.saveOrder(_orderData, _tradeGroupId);
        }

        return _orders;
    }
}
