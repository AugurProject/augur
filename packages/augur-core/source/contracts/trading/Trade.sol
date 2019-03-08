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


contract Trade is Initializable, ReentrancyGuard {

    struct Data {
        Order.TradeDirections direction;
        IMarket market;
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

    address private constant NULL_ADDRESS = address(0);
    uint256 private constant DEFAULT_LOOP_LIMIT = 3;

    // Trade Signing support
    mapping (bytes32 => bool) public executed;
    mapping (bytes32 => bool) public cancelled;

    function initialize(IAugur _augur) public beforeInitialized returns (bool) {
        endInitialization();
        augur = _augur;
        createOrder = ICreateOrder(augur.lookup("CreateOrder"));
        fillOrder = IFillOrder(augur.lookup("FillOrder"));
        orders = IOrders(augur.lookup("Orders"));
        return true;
    }

    function create(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, uint256 _loopLimit, bool _ignoreShares, address _affiliateAddress, address _sender) internal pure returns (Data memory) {
        require(_amount > 0);

        return Data({
            direction: _direction,
            market: _market,
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

    function createWithTotalCost(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _totalCost, uint256 _price, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, uint256 _loopLimit, bool _ignoreShares, address _affiliateAddress, address _sender) internal pure returns (Data memory) {
        return create(_direction, _market, _outcome, _totalCost / _price, _price, _betterOrderId, _worseOrderId, _tradeGroupId, _loopLimit, _ignoreShares, _affiliateAddress, _sender);
    }

    function publicTrade(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, uint256 _loopLimit, bool _ignoreShares, address _affiliateAddress) external afterInitialized returns (bytes32) {
        return internalTrade(_direction, _market, _outcome, _amount, _price, _betterOrderId, _worseOrderId, _tradeGroupId, _loopLimit, _ignoreShares, _affiliateAddress, msg.sender);
    }

    function publicFillBestOrder(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, bytes32 _tradeGroupId, uint256 _loopLimit, bool _ignoreShares, address _affiliateAddress) external afterInitialized returns (uint256) {
        return internalFillBestOrder(_direction, _market, _outcome, _amount, _price, _tradeGroupId, _loopLimit, _ignoreShares, _affiliateAddress, msg.sender);
    }

    function internalTrade(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, uint256 _loopLimit, bool _ignoreShares, address _affiliateAddress, address _sender) internal returns (bytes32) {
        require(augur.isValidMarket(_market));
        Data memory _tradeData = create(_direction, _market, _outcome, _amount, _price, _betterOrderId, _worseOrderId, _tradeGroupId, _loopLimit, _ignoreShares, _affiliateAddress, _sender);
        bytes32 _result = trade(_tradeData);
        _market.assertBalances();
        return _result;
    }

    function internalFillBestOrder(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, bytes32 _tradeGroupId, uint256 _loopLimit, bool _ignoreShares, address _affiliateAddress, address _sender) internal returns (uint256) {
        require(augur.isValidMarket(_market));
        Data memory _tradeData = create(_direction, _market, _outcome, _amount, _price, bytes32(0), bytes32(0), _tradeGroupId, _loopLimit, _ignoreShares, _affiliateAddress, _sender);
        uint256 _result = fillBestOrder(_tradeData);
        _market.assertBalances();
        return _result;
    }

    function trade(Data memory _tradeData) internal returns (bytes32) {
        uint256 _bestAmount = fillBestOrder(_tradeData);
        if (_bestAmount == 0) {
            return bytes32(uint256(1));
        }
        return createOrder.createOrder(_tradeData.sender, Order.getOrderTradingTypeFromMakerDirection(_tradeData.direction), _bestAmount, _tradeData.price, _tradeData.market, _tradeData.outcome, _tradeData.betterOrderId, _tradeData.worseOrderId, _tradeData.tradeGroupId, _tradeData.ignoreShares);
    }

    function fillBestOrder(Data memory _tradeData) internal nonReentrant returns (uint256 _bestAmount) {
        // we need to fill a BID if we want to SELL and we need to fill an ASK if we want to BUY
        Order.Types _type = Order.getOrderTradingTypeFromFillerDirection(_tradeData.direction);
        bytes32 _orderId = orders.getBestOrderId(_type, _tradeData.market, _tradeData.outcome);
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

    function publicTradeWithTotalCost(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _totalCost, uint256 _price, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, uint256 _loopLimit, bool _ignoreShares, address _affiliateAddress) external afterInitialized returns (bytes32) {
        require(augur.isValidMarket(_market));
        Data memory _tradeData = createWithTotalCost(_direction, _market, _outcome, _totalCost, _price, _betterOrderId, _worseOrderId, _tradeGroupId, _loopLimit, _ignoreShares, _affiliateAddress, msg.sender);
        bytes32 _result = trade(_tradeData);
        _market.assertBalances();
        return _result;
    }

    function publicFillBestOrderWithTotalCost(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _totalCost, uint256 _price, bytes32 _tradeGroupId, uint256 _loopLimit, bool _ignoreShares, address _affiliateAddress) external afterInitialized returns (uint256) {
        require(augur.isValidMarket(_market));
        Data memory _tradeData = createWithTotalCost(_direction, _market, _outcome, _totalCost, _price, bytes32(0), bytes32(0), _tradeGroupId, _loopLimit, _ignoreShares, _affiliateAddress, msg.sender);
        uint256 _result = fillBestOrder(_tradeData);
        _market.assertBalances();
        return _result;
    }

    function executeSignedTrade(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, address _sender, bool _fillOnly, uint256 _expirationTimestampInSec, uint256 _salt, uint256 _payment, uint8 v, bytes32 r, bytes32 s) public returns (bool) {
        bytes32 _tradeHash = getTradeHash(_direction, _market, _outcome, _amount, _price, _sender, _fillOnly, _expirationTimestampInSec, _salt, _payment);

        require(isValidSignature(_sender, _tradeHash, v, r, s));

        require(augur.getTimestamp() < _expirationTimestampInSec);

        require(!executed[_tradeHash]);

        require(!cancelled[_tradeHash]);

        if (_fillOnly) {
            internalExecuteSignedFillBestOrder(_direction, _market, _outcome, _amount, _price, _sender);
        } else {
            internalExecuteSignedTrade(_direction, _market, _outcome, _amount, _price, _sender);
        }

        executed[_tradeHash] = true;

        augur.trustedTransfer(_market.getDenominationToken(), _sender, msg.sender, _payment);

        return true;
    }

    function internalExecuteSignedFillBestOrder(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, address _sender) internal returns (bool) {
        internalFillBestOrder(_direction, _market, _outcome, _amount, _price, bytes32(0), DEFAULT_LOOP_LIMIT, false, NULL_ADDRESS, _sender);
        return true;
    }

    function internalExecuteSignedTrade(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, address _sender) internal returns (bool) {
        internalTrade(_direction, _market, _outcome, _amount, _price, bytes32(0), bytes32(0), bytes32(0), DEFAULT_LOOP_LIMIT, false, NULL_ADDRESS, _sender);
        return true;
    }

    function cancelTrade(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, address _sender, bool _fillOnly, uint256 _expirationTimestampInSec, uint256 _salt, uint256 _payment)
        public
        nonReentrant
        returns (bool)
    {
        bytes32 _tradeHash = getTradeHash(_direction, _market, _outcome, _amount, _price, _sender, _fillOnly, _expirationTimestampInSec, _salt, _payment);

        require(_sender == msg.sender);

        cancelled[_tradeHash] = true;

        return true;
    }

    function getTradeHash(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, address _sender, bool _fillOnly, uint256 _expirationTimestampInSec, uint256 _salt, uint256 _payment)
        public
        view
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(
            address(this),
            _direction,
            _market,
            _outcome,
            _amount,
            _price,
            _sender,
            _fillOnly,
            _expirationTimestampInSec,
            _salt,
            _payment
        ));
    }

    function isValidSignature(
        address signer,
        bytes32 hash,
        uint8 v,
        bytes32 r,
        bytes32 s)
        public
        pure
        returns (bool)
    {
        return signer == ecrecover(
            keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)),
            v,
            r,
            s
        );
    }
}
