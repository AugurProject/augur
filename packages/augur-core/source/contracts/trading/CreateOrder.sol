// Copyright (C) 2015 Forecast Foundation OU, full GPL notice in LICENSE

pragma solidity 0.5.10;


import 'ROOT/libraries/ReentrancyGuard.sol';
import 'ROOT/trading/Order.sol';
import 'ROOT/trading/ICreateOrder.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/IAugur.sol';
import 'ROOT/trading/IProfitLoss.sol';
import 'ROOT/trading/IAugurTrading.sol';


/**
 * @title Create Order
 * @notice Exposes functions to place an order on the book for other parties to take
 */
contract CreateOrder is Initializable, ReentrancyGuard {
    using Order for Order.Data;

    IAugur public augur;
    IAugurTrading public augurTrading;
    address public trade;
    IProfitLoss public profitLoss;
    IOrders public orders;


    function initialize(IAugur _augur, IAugurTrading _augurTrading) public beforeInitialized {
        endInitialization();
        augur = _augur;

        augurTrading = _augurTrading;
        trade = _augurTrading.lookup("Trade");
        profitLoss = IProfitLoss(_augurTrading.lookup("ProfitLoss"));
        orders = IOrders(_augurTrading.lookup("Orders"));
    }

    /**
     * @notice Create an order
     * @param _type The type of order. Either BID==0, or ASK==1
     * @param _attoshares The number of attoShares desired
     * @param _price The price in attoCash. Must be within the market range (1 to numTicks-1)
     * @param _market The associated market
     * @param _outcome The associated outcome of the market
     * @param _betterOrderId The id of an order which is better than this one. Used to reduce gas costs when sorting
     * @param _worseOrderId The id of an order which is worse than this one. Used to reduce gas costs when sorting
     * @param _tradeGroupId A Bytes32 value used when attempting to associate multiple orderbook actions with a single TX
     * @param _kycToken KYC token address if applicable. Specifying this will use an orderbook that is only available to acounts which have a non-zero balance of the specified token
     * @return The Bytes32 orderid of the created order
     */
    function publicCreateOrder(Order.Types _type, uint256 _attoshares, uint256 _price, IMarket _market, uint256 _outcome, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, IERC20 _kycToken) external returns (bytes32) {
        bytes32 _result = this.createOrder(msg.sender, _type, _attoshares, _price, _market, _outcome, _betterOrderId, _worseOrderId, _tradeGroupId, _kycToken);
        _market.assertBalances(address(orders));
        return _result;
    }

    function createOrder(address _creator, Order.Types _type, uint256 _attoshares, uint256 _price, IMarket _market, uint256 _outcome, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, IERC20 _kycToken) external nonReentrant returns (bytes32) {
        require(augur.isKnownMarket(_market));
        require(_kycToken == IERC20(0) || _kycToken.balanceOf(_creator) > 0, "Createorder.createOrder: KYC token failure");
        require(msg.sender == trade || msg.sender == address(this));
        Order.Data memory _orderData = Order.create(augur, augurTrading, _creator, _outcome, _type, _attoshares, _price, _market, _betterOrderId, _worseOrderId, _kycToken);
        Order.escrowFunds(_orderData);
        profitLoss.recordFrozenFundChange(_market.getUniverse(), _market, _creator, _outcome, int256(_orderData.moneyEscrowed));
        /* solium-disable indentation */
        {
            IOrders _orders = orders;
            require(_orders.getAmount(Order.getOrderId(_orderData, _orders)) == 0, "Createorder.createOrder: Order duplication in same block");
            return Order.saveOrder(_orderData, _tradeGroupId, _orders);
        }
        /* solium-enable indentation */
    }

    /**
     * @notice Create multiple orders
     * @param _outcomes Array of associated outcomes for each order
     * @param _types Array of the type of each order. Either BID==0, or ASK==1
     * @param _attoshareAmounts Array of the number of attoShares desired for each order
     * @param _prices Array of the price in attoCash for each order. Must be within the market range (1 to numTicks-1)
     * @param _market The associated market
     * @param _tradeGroupId A Bytes32 value used when attempting to associate multiple orderbook actions with a single TX
     * @param _kycToken KYC token address if applicable. Specifying this will use an orderbook that is only available to acounts which have a non-zero balance of the specified token
     * @return Array of Bytes32 ids of the created orders
     */
    function publicCreateOrders(uint256[] memory _outcomes, Order.Types[] memory _types, uint256[] memory _attoshareAmounts, uint256[] memory _prices, IMarket _market, bytes32 _tradeGroupId, IERC20 _kycToken) public nonReentrant returns (bytes32[] memory _orders) {
        require(augur.isKnownMarket(_market));
        require(_kycToken == IERC20(0) || _kycToken.balanceOf(msg.sender) > 0, "Createorder.publicCreateOrders: KYC token failure");
        _orders = new bytes32[]( _types.length);

        IUniverse _universe = _market.getUniverse();
        for (uint256 i = 0; i <  _types.length; i++) {
            Order.Data memory _orderData = Order.create(augur, augurTrading, msg.sender, _outcomes[i], _types[i], _attoshareAmounts[i], _prices[i], _market, bytes32(0), bytes32(0), _kycToken);
            Order.escrowFunds(_orderData);
            profitLoss.recordFrozenFundChange(_universe, _market, msg.sender, _outcomes[i], int256(_orderData.moneyEscrowed));
            /* solium-disable indentation */
            {
                IOrders _ordersContract = orders;
                require(_ordersContract.getAmount(Order.getOrderId(_orderData, _ordersContract)) == 0, "Createorder.publicCreateOrders: Order duplication in same block");
                _orders[i] = Order.saveOrder(_orderData, _tradeGroupId, _ordersContract);
            }
            /* solium-enable indentation */
        }

        return _orders;
    }
}
