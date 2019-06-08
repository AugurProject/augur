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
import 'ROOT/libraries/token/ERC20Token.sol';


contract Trade is Initializable, ReentrancyGuard {

    struct Data {
        Order.TradeDirections direction;
        IMarket market;
        ERC20Token kycToken;
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
    uint256 private constant DEFAULT_LOOP_LIMIT = 3;

    function initialize(IAugur _augur) public beforeInitialized returns (bool) {
        endInitialization();
        augur = _augur;
        createOrder = ICreateOrder(augur.lookup("CreateOrder"));
        fillOrder = IFillOrder(augur.lookup("FillOrder"));
        orders = IOrders(augur.lookup("Orders"));
        cash = ICash(augur.lookup("Cash"));
        return true;
    }

    function create(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, uint256 _loopLimit, bool _ignoreShares, address _affiliateAddress, address _sender, ERC20Token _kycToken) internal pure returns (Data memory) {
        require(_amount > 0);

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

    function createWithTotalCost(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _totalCost, uint256 _price, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, uint256 _loopLimit, bool _ignoreShares, address _affiliateAddress, address _sender, ERC20Token _kycToken) internal pure returns (Data memory) {
        return create(_direction, _market, _outcome, _totalCost / _price, _price, _betterOrderId, _worseOrderId, _tradeGroupId, _loopLimit, _ignoreShares, _affiliateAddress, _sender, _kycToken);
    }

    function publicTrade(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, uint256 _loopLimit, bool _ignoreShares, address _affiliateAddress, ERC20Token _kycToken) external afterInitialized returns (bytes32) {
        return internalTrade(_direction, _market, _outcome, _amount, _price, _betterOrderId, _worseOrderId, _tradeGroupId, _loopLimit, _ignoreShares, _affiliateAddress, msg.sender, _kycToken);
    }

    function publicFillBestOrder(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, bytes32 _tradeGroupId, uint256 _loopLimit, bool _ignoreShares, address _affiliateAddress, ERC20Token _kycToken) external afterInitialized returns (uint256) {
        return internalFillBestOrder(_direction, _market, _outcome, _amount, _price, _tradeGroupId, _loopLimit, _ignoreShares, _affiliateAddress, msg.sender, _kycToken);
    }

    function internalTrade(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, uint256 _loopLimit, bool _ignoreShares, address _affiliateAddress, address _sender, ERC20Token _kycToken) internal returns (bytes32) {
        require(augur.isValidMarket(_market));
        Data memory _tradeData = create(_direction, _market, _outcome, _amount, _price, _betterOrderId, _worseOrderId, _tradeGroupId, _loopLimit, _ignoreShares, _affiliateAddress, _sender, _kycToken);
        bytes32 _result = trade(_tradeData);
        _market.assertBalances();
        return _result;
    }

    function internalFillBestOrder(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, bytes32 _tradeGroupId, uint256 _loopLimit, bool _ignoreShares, address _affiliateAddress, address _sender, ERC20Token _kycToken) internal returns (uint256) {
        require(augur.isValidMarket(_market));
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

    function publicTradeWithTotalCost(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _totalCost, uint256 _price, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, uint256 _loopLimit, bool _ignoreShares, address _affiliateAddress, ERC20Token _kycToken) external afterInitialized returns (bytes32) {
        require(augur.isValidMarket(_market));
        Data memory _tradeData = createWithTotalCost(_direction, _market, _outcome, _totalCost, _price, _betterOrderId, _worseOrderId, _tradeGroupId, _loopLimit, _ignoreShares, _affiliateAddress, msg.sender, _kycToken);
        bytes32 _result = trade(_tradeData);
        _market.assertBalances();
        return _result;
    }

    function publicFillBestOrderWithTotalCost(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _totalCost, uint256 _price, bytes32 _tradeGroupId, uint256 _loopLimit, bool _ignoreShares, address _affiliateAddress, ERC20Token _kycToken) external afterInitialized returns (uint256) {
        require(augur.isValidMarket(_market));
        Data memory _tradeData = createWithTotalCost(_direction, _market, _outcome, _totalCost, _price, bytes32(0), bytes32(0), _tradeGroupId, _loopLimit, _ignoreShares, _affiliateAddress, msg.sender, _kycToken);
        uint256 _result = fillBestOrder(_tradeData);
        _market.assertBalances();
        return _result;
    }
}
