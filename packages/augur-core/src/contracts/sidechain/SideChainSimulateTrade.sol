// Copyright (C) 2015 Forecast Foundation OU, full GPL notice in LICENSE

pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;


import 'ROOT/sidechain/interfaces/ISideChainAugur.sol';
import 'ROOT/libraries/ReentrancyGuard.sol';
import 'ROOT/trading/Order.sol';
import 'ROOT/sidechain/interfaces/ISideChainFillOrder.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/libraries/token/IERC20.sol';
import "ROOT/external/IExchange.sol";
import "ROOT/sidechain/interfaces/ISideChainZeroXTrade.sol";
import 'ROOT/sidechain/interfaces/ISideChainAugurTrading.sol';
import 'ROOT/sidechain/interfaces/ISideChainShareToken.sol';
import 'ROOT/sidechain/IMarketGetter.sol';


/**
 * @title Simulate Trade
 * @notice Provides a function to simulate a trade with the current orderbook in order to estimate the cost and the resulting position
 */
contract SideChainSimulateTrade is Initializable {
    using SafeMathUint256 for uint256;

    struct SimulationData {
        Order.Types orderType;
        Order.TradeDirections direction;
        address market;
        uint256 outcome;
        uint256 amount;
        uint256 price;
        uint256 numTicks;
        uint256 availableShares;
        bytes32 orderId;
        uint256 orderAmount;
        uint256 orderPrice;
        uint256 orderShares;
        address orderCreator;
        uint256 fillAmount;
        uint256 sharesUsedInFill;
    }

    ISideChainAugur public augur;
    ISideChainAugurTrading public augurTrading;
    ISideChainZeroXTrade public zeroXTrade;
    ISideChainShareToken public shareToken;
    IMarketGetter public marketGetter;

    address private constant NULL_ADDRESS = address(0);
    uint256 private constant GAS_BUFFER = 50000;

    function initialize(ISideChainAugur _augur, ISideChainAugurTrading _augurTrading) public beforeInitialized {
        endInitialization();
        augur = _augur;
        shareToken = ISideChainShareToken(augur.lookup("ShareToken"));
        require(shareToken != ISideChainShareToken(0));
        marketGetter = IMarketGetter(_augur.lookup("MarketGetter"));
        require(marketGetter != IMarketGetter(0));

        augurTrading = _augurTrading;
        zeroXTrade = ISideChainZeroXTrade(_augurTrading.lookup("ZeroXTrade"));
        require(zeroXTrade != ISideChainZeroXTrade(0));
    }

    function createFromSignedOrders(IExchange.Order memory _order, uint256 _amount, address _sender) internal view returns (SimulationData memory) {
        ISideChainZeroXTrade.AugurOrderData memory _augurOrderData = zeroXTrade.parseOrderData(_order);
        Order.Types _type = Order.Types(_augurOrderData.orderType);
        Order.TradeDirections _direction = _type == Order.Types.Bid ? Order.TradeDirections.Short : Order.TradeDirections.Long;
        address _market = address(_augurOrderData.marketAddress);

        return SimulationData({
            orderType: _type,
            direction: _direction,
            market: _market,
            outcome: _augurOrderData.outcome,
            amount: _amount,
            price: _augurOrderData.price,
            numTicks: marketGetter.getNumTicks(_market),
            availableShares: getNumberOfAvaialableShares(_direction, _market, _augurOrderData.outcome, _sender),
            orderId: bytes32(0),
            orderAmount: _order.makerAssetAmount,
            orderPrice: _augurOrderData.price,
            orderShares: getNumberOfAvaialableShares(_direction == Order.TradeDirections.Long ? Order.TradeDirections.Short : Order.TradeDirections.Long, _market, _augurOrderData.outcome, _order.makerAddress),
            orderCreator: _order.makerAddress,
            fillAmount: 0,
            sharesUsedInFill: 0
        });
    }

    function simulateZeroXTrade(IExchange.Order[] memory _orders, uint256 _amount, bool _fillOnly) public view returns (uint256 _sharesFilled, uint256 _tokensDepleted, uint256 _sharesDepleted, uint256 _settlementFees, uint256 _numFills) {
        require(_orders.length > 0, "Must provide orders to simulate zeroX trade");
        SimulationData memory _simulationData = createFromSignedOrders(_orders[0], _amount, msg.sender);
        uint256 _orderIndex = 0;
        while (_orderIndex < _orders.length && _simulationData.amount > 0 && gasleft() > GAS_BUFFER) {
            if (_simulationData.orderCreator != msg.sender) {
                _simulationData.fillAmount = _simulationData.amount.min(_simulationData.orderAmount);
                _simulationData.sharesUsedInFill = _simulationData.fillAmount.min(_simulationData.availableShares);
                _simulationData.availableShares = _simulationData.availableShares.sub(_simulationData.sharesUsedInFill);

                _sharesDepleted += _simulationData.sharesUsedInFill;
                _tokensDepleted += (_simulationData.fillAmount - _simulationData.sharesUsedInFill) * (_simulationData.direction == Order.TradeDirections.Long ? _simulationData.orderPrice : _simulationData.numTicks - _simulationData.orderPrice);

                _sharesFilled += _simulationData.fillAmount;
                _settlementFees += getSettlementFees(_simulationData, _simulationData.sharesUsedInFill);

                _simulationData.amount -= _simulationData.fillAmount;
                _numFills += 1;
            }

            _orderIndex += 1;
            if (_orderIndex >= _orders.length) {
                break;
            }
            ISideChainZeroXTrade.AugurOrderData memory _augurOrderData = zeroXTrade.parseOrderData(_orders[_orderIndex]);
            _simulationData.orderAmount = _orders[_orderIndex].makerAssetAmount;
            _simulationData.orderPrice = _augurOrderData.price;
            _simulationData.orderCreator = _orders[_orderIndex].makerAddress;
            _simulationData.orderShares = getNumberOfAvaialableShares(_simulationData.direction == Order.TradeDirections.Long ? Order.TradeDirections.Short : Order.TradeDirections.Long, _simulationData.market, _simulationData.outcome, _simulationData.orderCreator);
        }

        if (_simulationData.amount > 0 && !_fillOnly) {
            uint256 _sharesUsedInCreate = _simulationData.amount.min(_simulationData.availableShares);
            _sharesDepleted += _sharesUsedInCreate;
            _tokensDepleted += (_simulationData.amount - _sharesUsedInCreate) * (_simulationData.direction == Order.TradeDirections.Long ? _simulationData.price : _simulationData.numTicks - _simulationData.price);
        }

        uint256 _shareSaleProfit = _sharesDepleted * (_simulationData.direction == Order.TradeDirections.Short ? _simulationData.price : _simulationData.numTicks - _simulationData.price);
        _tokensDepleted = _shareSaleProfit >= _tokensDepleted ? 0 : _tokensDepleted.sub(_shareSaleProfit);
    }

    function getSettlementFees(SimulationData memory _simulationData, uint256 _sharesUsedInFill) private view returns (uint256) {
        uint256 _completeSetsSold = _sharesUsedInFill.min(_simulationData.orderShares);
        if (_completeSetsSold < 1) {
            return 0;
        }
        uint256 _payout = _sharesUsedInFill * (_simulationData.direction == Order.TradeDirections.Short ? _simulationData.orderPrice : _simulationData.numTicks - _simulationData.orderPrice);
        uint256 _reportingFeeDivisor = marketGetter.getOrCacheReportingFeeDivisor();
        uint256 _settlementFee = _payout.div(_reportingFeeDivisor);
        uint256 _creatorFee = marketGetter.getCreatorFee(_simulationData.market);
        if (_creatorFee == 0) {
            return _settlementFee;
        }
        return _settlementFee + _payout.div(_creatorFee);
    }

    function getNumberOfAvaialableShares(Order.TradeDirections _direction, address _market, uint256 _outcome, address _sender) public view returns (uint256) {
        if (_direction == Order.TradeDirections.Short) {
            return shareToken.balanceOfMarketOutcome(_market, _outcome, _sender);
        } else {
            uint256 _numberOfOutcomes = marketGetter.getNumberOfOutcomes(_market);
            uint256[] memory _shortOutcomes = new uint256[](_numberOfOutcomes - 1);
            uint256 _indexOutcome = 0;
            for (uint256 _i = 0; _i < _numberOfOutcomes - 1; _i++) {
                if (_i == _outcome) {
                    _indexOutcome++;
                }
                _shortOutcomes[_i] = _indexOutcome;
                _indexOutcome++;
            }
            return shareToken.lowestBalanceOfMarketOutcomes(_market, _shortOutcomes, _sender);
        }
    }

    function isMatch(SimulationData memory _simulationData) private pure returns (bool) {
        if (_simulationData.orderId == 0) {
            return false;
        }
        return _simulationData.orderType == Order.Types.Bid ? _simulationData.orderPrice >= _simulationData.price : _simulationData.orderPrice <= _simulationData.price;
    }
}
