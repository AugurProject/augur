// Copyright (C) 2015 Forecast Foundation OU, full GPL notice in LICENSE

pragma solidity 0.5.4;


import 'ROOT/IAugur.sol';
import 'ROOT/libraries/ReentrancyGuard.sol';
import 'ROOT/trading/Order.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/trading/ICreateOrder.sol';
import 'ROOT/trading/IOrders.sol';
import 'ROOT/trading/IFillOrder.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/libraries/token/IERC20.sol';


/**
 * @title Trade
 * @notice Provides functions to perform actions on an orderbook which will fill or create orders as appropriate
 */
contract Trade is Initializable, ReentrancyGuard {

    struct Data {
        Order.TradeDirections direction;
        IMarket market;
        IERC20 kycToken;
        uint256 outcome;
        uint256 amount;
        uint256 price;
        bytes32 betterOrderId;
        bytes32 worseOrderId;
        bytes32 tradeGroupId;
        uint256 loopLimit;
        bool ignoreShares;
        address affiliateAddress;
        address sender;
    }

    IAugur public augur;
    ICreateOrder public createOrder;
    IFillOrder public fillOrder;
    IOrders public orders;
    ICash public cash;

    address private constant NULL_ADDRESS = address(0);

    function initialize(IAugur _augur) public beforeInitialized {
        endInitialization();
        augur = _augur;
        createOrder = ICreateOrder(augur.lookup("CreateOrder"));
        fillOrder = IFillOrder(augur.lookup("FillOrder"));
        orders = IOrders(augur.lookup("Orders"));
        cash = ICash(augur.lookup("Cash"));
    }

    function create(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, uint256 _loopLimit, bool _ignoreShares, address _affiliateAddress, address _sender, IERC20 _kycToken) internal pure returns (Data memory) {
        require(_amount > 0, "Trade.create: Trade amount cannot be 0");

        return Data({
            direction: _direction,
            market: _market,
            kycToken: _kycToken,
            outcome: _outcome,
            amount: _amount,
            price: _price,
            betterOrderId: _betterOrderId,
            worseOrderId: _worseOrderId,
            tradeGroupId: _tradeGroupId,
            loopLimit: _loopLimit,
            ignoreShares: _ignoreShares,
            affiliateAddress: _affiliateAddress,
            sender: _sender
        });
    }

    /**
     * @notice Perform a trade which will fill orders and if a desired amount remains will create an order
     * @param _direction The trade direction of order. Either LONG==0, or SHORT==1
     * @param _market The associated market
     * @param _outcome The associated outcome of the market
     * @param _amount The number of attoShares desired
     * @param _price The price in attoCash. Must be within the market range (1 to numTicks-1)
     * @param _betterOrderId The id of an order which is better than this one. Used to reduce gas costs when sorting
     * @param _worseOrderId The id of an order which is worse than this one. Used to reduce gas costs when sorting
     * @param _tradeGroupId A Bytes32 value used when attempting to associate multiple orderbook actions with a single TX
     * @param _loopLimit The number of orders to take from the book before completing the tx. Used to limit gas cost
     * @param _ignoreShares Boolean indicating whether to ignore available shares when escrowing funds for the order
     * @param _affiliateAddress Address of an affiliate to give a portion of market creator fees to if any fills trigger settlement
     * @param _kycToken KYC token address if applicable. Specifying this will use an orderbook that is only available to acounts which have a non-zero balance of the specified token
     * @return The Bytes32 orderid of the created order
     */
    function publicTrade(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, uint256 _loopLimit, bool _ignoreShares, address _affiliateAddress, IERC20 _kycToken) external returns (bytes32) {
        return internalTrade(_direction, _market, _outcome, _amount, _price, _betterOrderId, _worseOrderId, _tradeGroupId, _loopLimit, _ignoreShares, _affiliateAddress, msg.sender, _kycToken);
    }

    /**
     * @notice Perform a trade which will only fill orders
     * @param _direction The trade direction of order. Either LONG==0, or SHORT==1
     * @param _market The associated market
     * @param _outcome The associated outcome of the market
     * @param _amount The number of attoShares desired
     * @param _price The price in attoCash. Must be within the market range (1 to numTicks-1)
     * @param _tradeGroupId A Bytes32 value used when attempting to associate multiple orderbook actions with a single TX
     * @param _loopLimit The number of orders to take from the book before completing the tx. Used to limit gas cost
     * @param _ignoreShares Boolean indicating whether to ignore available shares when escrowing funds for the order
     * @param _affiliateAddress Address of an affiliate to give a portion of market creator fees to if any fills trigger settlement
     * @param _kycToken KYC token address if applicable. Specifying this will use an orderbook that is only available to acounts which have a non-zero balance of the specified token
     * @return The desired amount remaining that was not filled
     */
    function publicFillBestOrder(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, bytes32 _tradeGroupId, uint256 _loopLimit, bool _ignoreShares, address _affiliateAddress, IERC20 _kycToken) external returns (uint256) {
        return internalFillBestOrder(_direction, _market, _outcome, _amount, _price, _tradeGroupId, _loopLimit, _ignoreShares, _affiliateAddress, msg.sender, _kycToken);
    }

    function internalTrade(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, uint256 _loopLimit, bool _ignoreShares, address _affiliateAddress, address _sender, IERC20 _kycToken) internal returns (bytes32) {
        require(augur.isKnownMarket(_market));
        Data memory _tradeData = create(_direction, _market, _outcome, _amount, _price, _betterOrderId, _worseOrderId, _tradeGroupId, _loopLimit, _ignoreShares, _affiliateAddress, _sender, _kycToken);
        bytes32 _result = trade(_tradeData);
        _market.assertBalances();
        return _result;
    }

    function internalFillBestOrder(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, bytes32 _tradeGroupId, uint256 _loopLimit, bool _ignoreShares, address _affiliateAddress, address _sender, IERC20 _kycToken) internal returns (uint256) {
        require(augur.isKnownMarket(_market));
        Data memory _tradeData = create(_direction, _market, _outcome, _amount, _price, bytes32(0), bytes32(0), _tradeGroupId, _loopLimit, _ignoreShares, _affiliateAddress, _sender, _kycToken);
        uint256 _result = fillBestOrder(_tradeData);
        _market.assertBalances();
        return _result;
    }

    function trade(Data memory _tradeData) internal returns (bytes32) {
        uint256 _bestAmount = fillBestOrder(_tradeData);
        if (_bestAmount == 0) {
            return bytes32(uint256(1));
        }
        return createOrder.createOrder(_tradeData.sender, Order.getOrderTradingTypeFromMakerDirection(_tradeData.direction), _bestAmount, _tradeData.price, _tradeData.market, _tradeData.outcome, _tradeData.betterOrderId, _tradeData.worseOrderId, _tradeData.tradeGroupId, _tradeData.ignoreShares, _tradeData.kycToken);
    }

    function fillBestOrder(Data memory _tradeData) internal nonReentrant returns (uint256 _bestAmount) {
        // we need to fill a BID if we want to SELL and we need to fill an ASK if we want to BUY
        Order.Types _type = Order.getOrderTradingTypeFromFillerDirection(_tradeData.direction);
        bytes32 _orderId = orders.getBestOrderId(_type, _tradeData.market, _tradeData.outcome, _tradeData.kycToken);
        _bestAmount = _tradeData.amount;
        uint256 _orderPrice = orders.getPrice(_orderId);
        // If the price is acceptable relative to the trade type
        while (_orderId != 0 && _bestAmount > 0 && _tradeData.loopLimit > 0 && isMatch(_orderId, _type, _orderPrice, _tradeData.price)) {
            bytes32 _nextOrderId = orders.getWorseOrderId(_orderId);
            orders.setPrice(_tradeData.market, _tradeData.outcome, _orderPrice);
            _bestAmount = fillOrder.fillOrder(_tradeData.sender, _orderId, _bestAmount, _tradeData.tradeGroupId, _tradeData.ignoreShares, _tradeData.affiliateAddress);
            _orderId = _nextOrderId;
            _orderPrice = orders.getPrice(_orderId);
            _tradeData.loopLimit -= 1;
        }
        if (isMatch(_orderId, _type, _orderPrice, _tradeData.price)) {
            return 0;
        }
        return _bestAmount;
    }

    function isMatch(bytes32 _orderId, Order.Types _type, uint256 _orderPrice, uint256 _price) private pure returns (bool) {
        if (_orderId == 0) {
            return false;
        }
        return _type == Order.Types.Bid ? _orderPrice >= _price : _orderPrice <= _price;
    }
}
