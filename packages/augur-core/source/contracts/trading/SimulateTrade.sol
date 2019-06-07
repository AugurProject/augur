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


contract SimulateTrade is Initializable {
    using SafeMathUint256 for uint256;

    struct SimulationData {
        Order.Types orderType;
        Order.TradeDirections direction;
        IMarket market;
        ERC20Token kycToken;
        uint256 outcome;
        uint256 amount;
        uint256 price;
        uint256 numTicks;
        bool ignoreShares;
        uint256 availableShares;
        address sender;
        bytes32 orderId;
        uint256 orderAmount;
        uint256 orderPrice;
        uint256 orderShares;
    }

    IAugur public augur;
    IOrders public orders;

    address private constant NULL_ADDRESS = address(0);
    uint256 private constant GAS_BUFFER = 50000;

    function initialize(IAugur _augur) public beforeInitialized returns (bool) {
        endInitialization();
        augur = _augur;
        orders = IOrders(augur.lookup("Orders"));
        return true;
    }

    function create(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, bool _ignoreShares, address _sender, ERC20Token _kycToken) internal view returns (SimulationData memory) {
        Order.Types _type = Order.getOrderTradingTypeFromFillerDirection(_direction);
        bytes32 _orderId = orders.getBestOrderId(_type, _market, _outcome, _kycToken);

        return SimulationData({
            orderType: _type,
            direction: _direction,
            market: _market,
            kycToken: _kycToken,
            outcome: _outcome,
            amount: _amount,
            price: _price,
            numTicks: _market.getNumTicks(),
            ignoreShares: _ignoreShares,
            availableShares: _ignoreShares ? 0 : getNumberOfAvaialableShares(_direction, _market, _outcome, _sender),
            sender: _sender,
            orderId: _orderId,
            orderAmount: orders.getAmount(_orderId),
            orderPrice: orders.getPrice(_orderId),
            orderShares: orders.getOrderSharesEscrowed(_orderId)
        });
    }

    function simulateTrade(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, bool _ignoreShares, ERC20Token _kycToken, bool _fillOnly) public view returns (uint256 _sharesFilled, uint256 _tokensDepleted, uint256 _sharesDepleted, uint256 _settlementFees) {
        SimulationData memory _simulationData = create(_direction, _market, _outcome, _amount, _price, _ignoreShares, msg.sender, _kycToken);
        while (_simulationData.orderId != 0 && _simulationData.amount > 0 && gasleft() > GAS_BUFFER && isMatch(_simulationData)) {
            uint256 _fillAmount = _simulationData.amount.min(_simulationData.orderAmount);
            uint256 _sharesUsedInFill = _fillAmount.min(_simulationData.availableShares);

            if (orders.getOrderCreator(_simulationData.orderId) != msg.sender) {
                _sharesDepleted += _sharesUsedInFill;
                _tokensDepleted += (_fillAmount - _sharesUsedInFill) * (_direction == Order.TradeDirections.Long ? _simulationData.orderPrice : _simulationData.numTicks - _simulationData.orderPrice);
            }

            _sharesFilled += _fillAmount;
            _settlementFees += getSettlementFees(_simulationData, _sharesUsedInFill);

            _simulationData.amount -= _fillAmount;

            _simulationData.orderId = orders.getWorseOrderId(_simulationData.orderId);
            _simulationData.orderAmount = orders.getPrice(_simulationData.orderId);
            _simulationData.orderPrice = orders.getPrice(_simulationData.orderId);
            _simulationData.orderShares = orders.getOrderSharesEscrowed(_simulationData.orderId);
        }

        if (_simulationData.amount > 0 && !_fillOnly) {
            uint256 _sharesUsedInCreate = _simulationData.amount.min(_simulationData.availableShares);
            _sharesDepleted += _sharesUsedInCreate;
            _tokensDepleted += (_simulationData.amount - _sharesUsedInCreate) * (_direction == Order.TradeDirections.Long ? _simulationData.price : _simulationData.numTicks - _simulationData.price);
        }
    }

    function getSettlementFees(SimulationData memory _simulationData, uint256 _sharesUsedInFill) private view returns (uint256) {
        uint256 _completeSetsSold = _sharesUsedInFill.min(_simulationData.orderShares);
        if (_completeSetsSold < 1) {
            return 0;
        }
        uint256 _payout = _sharesUsedInFill * (_simulationData.direction == Order.TradeDirections.Short ? _simulationData.orderPrice : _simulationData.numTicks - _simulationData.orderPrice);
        uint256 _reportingFeeDivisor = _simulationData.market.getUniverse().getReportingFeeDivisor();
        return _simulationData.market.deriveMarketCreatorFeeAmount(_payout) + _payout.div(_reportingFeeDivisor);
    }

    function getNumberOfAvaialableShares(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, address _sender) public view returns (uint256) {
        if (_direction == Order.TradeDirections.Short) {
            return _market.getShareToken(_outcome).balanceOf(_sender);
        } else {
            uint256 _sharesAvailable = SafeMathUint256.getUint256Max();
            for (uint256 _shortOutcome = 0; _shortOutcome < _market.getNumberOfOutcomes(); ++_shortOutcome) {
                if (_shortOutcome == _outcome) {
                    continue;
                }
                _sharesAvailable = _market.getShareToken(_shortOutcome).balanceOf(_sender).min(_sharesAvailable);
            }
            return _sharesAvailable;
        }
    }

    function isMatch(SimulationData memory _simulationData) private view returns (bool) {
        if (_simulationData.orderId == 0) {
            return false;
        }
        return _simulationData.orderType == Order.Types.Bid ? _simulationData.orderPrice >= _simulationData.price : _simulationData.orderPrice <= _simulationData.price;
    }
}
