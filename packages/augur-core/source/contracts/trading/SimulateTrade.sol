// Copyright (C) 2015 Forecast Foundation OU, full GPL notice in LICENSE

pragma solidity 0.5.10;


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
 * @title Simulate Trade
 * @notice Provides a function to simulate a trade with the current orderbook in order to estimate the cost and the resulting position
 */
contract SimulateTrade is Initializable {
    using SafeMathUint256 for uint256;

    struct SimulationData {
        Order.Types orderType;
        Order.TradeDirections direction;
        IMarket market;
        IERC20 kycToken;
        uint256 outcome;
        uint256 amount;
        uint256 price;
        uint256 numTicks;
        uint256 availableShares;
        bytes32 orderId;
        uint256 orderAmount;
        uint256 orderPrice;
        uint256 orderShares;
        uint256 fillAmount;
        uint256 sharesUsedInFill;
    }

    IAugur public augur;
    IOrders public orders;

    address private constant NULL_ADDRESS = address(0);
    uint256 private constant GAS_BUFFER = 50000;

    function initialize(IAugur _augur) public beforeInitialized {
        endInitialization();
        augur = _augur;
        orders = IOrders(augur.lookup("Orders"));
    }

    function create(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, address _sender, IERC20 _kycToken) internal view returns (SimulationData memory) {
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
            availableShares: getNumberOfAvaialableShares(_direction, _market, _outcome, _sender),
            orderId: _orderId,
            orderAmount: orders.getAmount(_orderId),
            orderPrice: orders.getPrice(_orderId),
            orderShares: orders.getOrderSharesEscrowed(_orderId),
            fillAmount: 0,
            sharesUsedInFill: 0
        });
    }

    /**
     * @notice Simulate performing a trade
     * @param _direction The trade direction of order. Either LONG==0, or SHORT==1
     * @param _market The associated market
     * @param _outcome The associated outcome of the market
     * @param _amount The number of attoShares desired
     * @param _price The price in attoCash. Must be within the market range (1 to numTicks-1)
     * @param _kycToken KYC token address if applicable. Specifying this will use an orderbook that is only available to acounts which have a non-zero balance of the specified token
     * @param _fillOnly Boolean indicating whether to only fill existing orders or to also create an order if an amount remains
     * @return uint256_sharesFilled: The amount taken from existing orders, uint256 _tokensDepleted: The amount of Cash tokens used, uint256 _sharesDepleted: The amount of Share tokens used, uint256 _settlementFees: The totals fees taken from settlement that occurred, _numFills: The number of orders filled/partially filled
     */
    function simulateTrade(Order.TradeDirections _direction, IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, IERC20 _kycToken, bool _fillOnly) public view returns (uint256 _sharesFilled, uint256 _tokensDepleted, uint256 _sharesDepleted, uint256 _settlementFees, uint256 _numFills) {
        SimulationData memory _simulationData = create(_direction, _market, _outcome, _amount, _price, msg.sender, _kycToken);
        while (_simulationData.orderId != 0 && _simulationData.amount > 0 && gasleft() > GAS_BUFFER && isMatch(_simulationData)) {
            _simulationData.fillAmount = _simulationData.amount.min(_simulationData.orderAmount);
            _simulationData.sharesUsedInFill = _simulationData.fillAmount.min(_simulationData.availableShares);
            _simulationData.availableShares = _simulationData.availableShares.sub(_simulationData.sharesUsedInFill);

            if (orders.getOrderCreator(_simulationData.orderId) != msg.sender) {
                _sharesDepleted += _simulationData.sharesUsedInFill;
                _tokensDepleted += (_simulationData.fillAmount - _simulationData.sharesUsedInFill) * (_direction == Order.TradeDirections.Long ? _simulationData.orderPrice : _simulationData.numTicks - _simulationData.orderPrice);
            }

            _sharesFilled += _simulationData.fillAmount;
            _settlementFees += getSettlementFees(_simulationData, _simulationData.sharesUsedInFill);

            _simulationData.amount -= _simulationData.fillAmount;

            _simulationData.orderId = orders.getWorseOrderId(_simulationData.orderId);
            _simulationData.orderAmount = orders.getAmount(_simulationData.orderId);
            _simulationData.orderPrice = orders.getPrice(_simulationData.orderId);
            _simulationData.orderShares = orders.getOrderSharesEscrowed(_simulationData.orderId);
            _numFills += 1;
        }

        if (_simulationData.amount > 0 && !_fillOnly) {
            uint256 _sharesUsedInCreate = _simulationData.amount.min(_simulationData.availableShares);
            _sharesDepleted += _sharesUsedInCreate;
            _tokensDepleted += (_simulationData.amount - _sharesUsedInCreate) * (_direction == Order.TradeDirections.Long ? _simulationData.price : _simulationData.numTicks - _simulationData.price);
        }

        uint256 _shareSaleProfit = _sharesDepleted * (_direction == Order.TradeDirections.Short ? _simulationData.price : _simulationData.numTicks - _simulationData.price);
        _tokensDepleted = _shareSaleProfit >= _tokensDepleted ? 0 : _tokensDepleted.sub(_shareSaleProfit);
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

    function isMatch(SimulationData memory _simulationData) private pure returns (bool) {
        if (_simulationData.orderId == 0) {
            return false;
        }
        return _simulationData.orderType == Order.Types.Bid ? _simulationData.orderPrice >= _simulationData.price : _simulationData.orderPrice <= _simulationData.price;
    }
}
