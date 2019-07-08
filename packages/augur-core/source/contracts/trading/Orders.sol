pragma solidity 0.5.4;


import 'ROOT/trading/IOrders.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/libraries/math/SafeMathInt256.sol';
import 'ROOT/trading/Order.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/trading/IProfitLoss.sol';


/**
 * @title Orders
 * @notice Storage of all data associated with orders
 */
contract Orders is IOrders, Initializable {
    using Order for Order.Data;
    using SafeMathUint256 for uint256;

    struct MarketOrders {
        uint256 totalEscrowed;
        mapping(uint256 => uint256) prices;
    }

    mapping(bytes32 => Order.Data) private orders;
    mapping(address => MarketOrders) private marketOrderData;
    mapping(bytes32 => bytes32) private bestOrder;
    mapping(bytes32 => bytes32) private worstOrder;

    IAugur public augur;
    ICash public cash;
    address public trade;
    address public fillOrder;
    address public cancelOrder;
    address public createOrder;
    IProfitLoss public profitLoss;

    function initialize(IAugur _augur) public beforeInitialized {
        endInitialization();
        augur = _augur;
        createOrder = augur.lookup("CreateOrder");
        fillOrder = augur.lookup("FillOrder");
        cancelOrder = augur.lookup("CancelOrder");
        trade = augur.lookup("Trade");
        cash = ICash(augur.lookup("Cash"));
        profitLoss = IProfitLoss(augur.lookup("ProfitLoss"));
    }

    /**
     * @param _orderId The id of the order
     * @return The market associated with the order id
     */
    function getMarket(bytes32 _orderId) public view returns (IMarket) {
        return orders[_orderId].market;
    }

    /**
     * @param _orderId The id of the order
     * @return The order type (BID==0,ASK==1) associated with the order
     */
    function getOrderType(bytes32 _orderId) public view returns (Order.Types) {
        return orders[_orderId].orderType;
    }

    /**
     * @param _orderId The id of the order
     * @return The outcome associated with the order
     */
    function getOutcome(bytes32 _orderId) public view returns (uint256) {
        return orders[_orderId].outcome;
    }

    /**
     * @param _orderId The id of the order
     * @return The KYC token associated with the order
     */
    function getKYCToken(bytes32 _orderId) public view returns (IERC20) {
        return orders[_orderId].kycToken;
    }

    /**
     * @param _orderId The id of the order
     * @return The remaining amount of the order
     */
    function getAmount(bytes32 _orderId) public view returns (uint256) {
        return orders[_orderId].amount;
    }

    /**
     * @param _orderId The id of the order
     * @return The price of the order
     */
    function getPrice(bytes32 _orderId) public view returns (uint256) {
        return orders[_orderId].price;
    }

    /**
     * @param _orderId The id of the order
     * @return The creator of the order
     */
    function getOrderCreator(bytes32 _orderId) public view returns (address) {
        return orders[_orderId].creator;
    }

    /**
     * @param _orderId The id of the order
     * @return The remaining shares escrowed in the order
     */
    function getOrderSharesEscrowed(bytes32 _orderId) public view returns (uint256) {
        return orders[_orderId].sharesEscrowed;
    }

    /**
     * @param _orderId The id of the order
     * @return The remaining Cash tokens escrowed in the order
     */
    function getOrderMoneyEscrowed(bytes32 _orderId) public view returns (uint256) {
        return orders[_orderId].moneyEscrowed;
    }

    function getOrderDataForLogs(bytes32 _orderId) public view returns (Order.Types _type, address[] memory _addressData, uint256[] memory _uint256Data) {
        Order.Data storage _order = orders[_orderId];
        _addressData = new address[](3);
        _uint256Data = new uint256[](10);
        _addressData[0] = address(_order.kycToken);
        _addressData[1] = _order.creator;
        _uint256Data[0] = _order.price;
        _uint256Data[1] = _order.amount;
        _uint256Data[2] = _order.outcome;
        _uint256Data[8] = _order.sharesEscrowed;
        _uint256Data[9] = _order.moneyEscrowed;
        return (_order.orderType, _addressData, _uint256Data);
    }

    /**
     * @param _market The address of the market
     * @return The amount of Cash escrowed for all orders for the specified market
     */
    function getTotalEscrowed(IMarket _market) public view returns (uint256) {
        return marketOrderData[address(_market)].totalEscrowed;
    }

    /**
     * @param _market The address of the market
     * @param _outcome The outcome number
     * @return The price for the last completed trade for the specified market and outcome
     */
    function getLastOutcomePrice(IMarket _market, uint256 _outcome) public view returns (uint256) {
        return marketOrderData[address(_market)].prices[_outcome];
    }

    /**
     * @param _orderId The id of the order
     * @return The id (if there is one) of the next order better than the provided one
     */
    function getBetterOrderId(bytes32 _orderId) public view returns (bytes32) {
        return orders[_orderId].betterOrderId;
    }

    /**
     * @param _orderId The id of the order
     * @return The id (if there is one) of the next order worse than the provided one
     */
    function getWorseOrderId(bytes32 _orderId) public view returns (bytes32) {
        return orders[_orderId].worseOrderId;
    }

    /**
     * @param _type The type of order. Either BID==0, or ASK==1
     * @param _market The market of the order
     * @param _outcome The outcome of the order
     * @param _kycToken The KYC token of the order
     * @return The id (if there is one) of the best order that satisfies the given parameters
     */
    function getBestOrderId(Order.Types _type, IMarket _market, uint256 _outcome, IERC20 _kycToken) public view returns (bytes32) {
        return bestOrder[getBestOrderWorstOrderHash(_market, _outcome, _type, _kycToken)];
    }

    /**
     * @param _type The type of order. Either BID==0, or ASK==1
     * @param _market The market of the order
     * @param _outcome The outcome of the order
     * @param _kycToken The KYC token of the order
     * @return The id (if there is one) of the worst order that satisfies the given parameters
     */
    function getWorstOrderId(Order.Types _type, IMarket _market, uint256 _outcome, IERC20 _kycToken) public view returns (bytes32) {
        return worstOrder[getBestOrderWorstOrderHash(_market, _outcome, _type, _kycToken)];
    }

    /**
     * @param _type The type of order. Either BID==0, or ASK==1
     * @param _market The market of the order
     * @param _amount The amount of the order
     * @param _price The price of the order
     * @param _sender The creator of the order
     * @param _blockNumber The blockNumber which the order was created in
     * @param _outcome The outcome of the order
     * @param _moneyEscrowed The amount of Cash tokens escrowed in the order
     * @param _sharesEscrowed The outcome Share tokens escrowed in the order
     * @param _kycToken The KYC token of the order
     * @return The order id that satisfies the given parameters
     */
    function getOrderId(Order.Types _type, IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _blockNumber, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed, IERC20 _kycToken) public pure returns (bytes32) {
        return sha256(abi.encodePacked(_type, _market, _amount, _price, _sender, _blockNumber, _outcome, _moneyEscrowed, _sharesEscrowed, _kycToken));
    }

    function isBetterPrice(Order.Types _type, uint256 _price, bytes32 _orderId) public view returns (bool) {
        if (_type == Order.Types.Bid) {
            return (_price > orders[_orderId].price);
        } else if (_type == Order.Types.Ask) {
            return (_price < orders[_orderId].price);
        }
    }

    function isWorsePrice(Order.Types _type, uint256 _price, bytes32 _orderId) public view returns (bool) {
        if (_type == Order.Types.Bid) {
            return (_price <= orders[_orderId].price);
        } else {
            return (_price >= orders[_orderId].price);
        }
    }

    function assertIsNotBetterPrice(Order.Types _type, uint256 _price, bytes32 _betterOrderId) public view returns (bool) {
        require(!isBetterPrice(_type, _price, _betterOrderId), "Orders.assertIsNotBetterPrice: Is better price");
        return true;
    }

    function assertIsNotWorsePrice(Order.Types _type, uint256 _price, bytes32 _worseOrderId) public returns (bool) {
        require(!isWorsePrice(_type, _price, _worseOrderId), "Orders.assertIsNotWorsePrice: Is worse price");
        return true;
    }

    function insertOrderIntoList(Order.Data storage _order, bytes32 _betterOrderId, bytes32 _worseOrderId) private returns (bool) {
        bytes32 _bestOrderId = bestOrder[getBestOrderWorstOrderHash(_order.market, _order.outcome, _order.orderType, _order.kycToken)];
        bytes32 _worstOrderId = worstOrder[getBestOrderWorstOrderHash(_order.market, _order.outcome, _order.orderType, _order.kycToken)];
        (_betterOrderId, _worseOrderId) = findBoundingOrders(_order.orderType, _order.price, _bestOrderId, _worstOrderId, _betterOrderId, _worseOrderId);
        if (_order.orderType == Order.Types.Bid) {
            _bestOrderId = updateBestBidOrder(_order.id, _order.market, _order.price, _order.outcome, _order.kycToken);
            _worstOrderId = updateWorstBidOrder(_order.id, _order.market, _order.price, _order.outcome, _order.kycToken);
        } else {
            _bestOrderId = updateBestAskOrder(_order.id, _order.market, _order.price, _order.outcome, _order.kycToken);
            _worstOrderId = updateWorstAskOrder(_order.id, _order.market, _order.price, _order.outcome, _order.kycToken);
        }
        if (_bestOrderId == _order.id) {
            _betterOrderId = bytes32(0);
        }
        if (_worstOrderId == _order.id) {
            _worseOrderId = bytes32(0);
        }
        if (_betterOrderId != bytes32(0)) {
            orders[_betterOrderId].worseOrderId = _order.id;
            _order.betterOrderId = _betterOrderId;
        }
        if (_worseOrderId != bytes32(0)) {
            orders[_worseOrderId].betterOrderId = _order.id;
            _order.worseOrderId = _worseOrderId;
        }
        return true;
    }

    function saveOrder(Order.Types _type, IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, IERC20 _kycToken) external returns (bytes32 _orderId) {
        require(msg.sender == createOrder || msg.sender == address(this));
        require(_outcome < _market.getNumberOfOutcomes(), "Orders.saveOrder: Outcome not in market range");
        _orderId = getOrderId(_type, _market, _amount, _price, _sender, block.number, _outcome, _moneyEscrowed, _sharesEscrowed, _kycToken);
        Order.Data storage _order = orders[_orderId];
        _order.orders = this;
        _order.market = _market;
        _order.id = _orderId;
        _order.orderType = _type;
        _order.outcome = _outcome;
        _order.price = _price;
        _order.amount = _amount;
        _order.creator = _sender;
        _order.kycToken = _kycToken;
        _order.moneyEscrowed = _moneyEscrowed;
        marketOrderData[address(_market)].totalEscrowed += _moneyEscrowed;
        _order.sharesEscrowed = _sharesEscrowed;
        insertOrderIntoList(_order, _betterOrderId, _worseOrderId);
        augur.logOrderCreated(_order.market.getUniverse(), _orderId, _tradeGroupId);
        return _orderId;
    }

    function removeOrder(bytes32 _orderId) external returns (bool) {
        require(msg.sender == cancelOrder || msg.sender == address(this));
        removeOrderFromList(_orderId);
        Order.Data storage _order = orders[_orderId];
        marketOrderData[address(_order.market)].totalEscrowed -= _order.moneyEscrowed;
        delete orders[_orderId];
        return true;
    }

    function recordFillOrder(bytes32 _orderId, uint256 _sharesFilled, uint256 _tokensFilled, uint256 _fill) external returns (bool) {
        require(msg.sender == fillOrder || msg.sender == address(this));
        Order.Data storage _order = orders[_orderId];
        require(_order.outcome < _order.market.getNumberOfOutcomes(), "Orders.recordFillOrder: Outcome is not in market range");
        require(_orderId != bytes32(0), "Orders.recordFillOrder: orderId is 0x0");
        require(_sharesFilled <= _order.sharesEscrowed, "Orders.recordFillOrder: shares filled higher than order amount");
        require(_tokensFilled <= _order.moneyEscrowed, "Orders.recordFillOrder: tokens filled higher than order amount");
        require(_order.price <= _order.market.getNumTicks(), "Orders.recordFillOrder: Price outside of market range");
        require(_fill <= _order.amount, "Orders.recordFillOrder: Fill higher than order amount");
        _order.amount -= _fill;
        _order.moneyEscrowed -= _tokensFilled;
        marketOrderData[address(_order.market)].totalEscrowed -= _tokensFilled;
        _order.sharesEscrowed -= _sharesFilled;
        if (_order.amount == 0) {
            require(_order.moneyEscrowed == 0, "Orders.recordFillOrder: Money left in filled order");
            require(_order.sharesEscrowed == 0, "Orders.recordFillOrder: Shares left in filled order");
            removeOrderFromList(_orderId);
            _order.price = 0;
            _order.creator = address(0);
            _order.betterOrderId = bytes32(0);
            _order.worseOrderId = bytes32(0);
        }
        return true;
    }

    function setPrice(IMarket _market, uint256 _outcome, uint256 _price) external returns (bool) {
        require(msg.sender == trade);
        marketOrderData[address(_market)].prices[_outcome] = _price;
        return true;
    }

    /**
     * @notice Set the price of an existing order
     * @param _orderId The type of order. Either BID==0, or ASK==1
     * @param _price The price in attoCash. Must be within the market range (1 to numTicks-1) and must be different than the current order price
     * @param _betterOrderId The id of an order which is better than this one (post price change). Used to reduce gas costs when sorting
     * @param _worseOrderId The id of an order which is worse than this one (post price change). Used to reduce gas costs when sorting
     * @return Bool True
     */
    function setOrderPrice(bytes32 _orderId, uint256 _price, bytes32 _betterOrderId, bytes32 _worseOrderId) public returns (bool) {
        Order.Data storage _order = orders[_orderId];
        IMarket _market = _order.market;
        require(msg.sender == _order.creator, "Orders.setPrice: Sender is not order creator");
        require(_order.amount > 0, "Orders.setPrice: Order is filled or canceled");
        require(_price != 0, "Orders.setPrice: Price cannot be 0");
        require(_price < _market.getNumTicks(), "Orders.setPrice: Price outside of market range");
        require(_price != _order.price, "Orders.setPrice: Price must change in setOrderPrice");
        removeOrderFromList(_orderId);
        bool _isRefund = true;
        uint256 _moneyEscrowedDelta = 0;
        if (_order.moneyEscrowed != 0) {
            _isRefund = _order.orderType == Order.Types.Bid ? _price < _order.price : _price > _order.price;
            uint256 _priceDelta = _price < _order.price ? _order.price.sub(_price) : _price.sub(_order.price);
            uint256 _attoSharesToCoverByTokens = _order.amount.sub(_order.sharesEscrowed);
            _moneyEscrowedDelta = _attoSharesToCoverByTokens.mul(_priceDelta);
            if (_isRefund) {
                _market.getUniverse().withdraw(msg.sender, _moneyEscrowedDelta, address(_market));
                marketOrderData[address(_market)].totalEscrowed = marketOrderData[address(_market)].totalEscrowed.sub(_moneyEscrowedDelta);
                _order.moneyEscrowed = _order.moneyEscrowed.sub(_moneyEscrowedDelta);
            } else {
                _market.getUniverse().deposit(msg.sender, _moneyEscrowedDelta, address(_market));
                marketOrderData[address(_market)].totalEscrowed = marketOrderData[address(_market)].totalEscrowed.add(_moneyEscrowedDelta);
                _order.moneyEscrowed = _order.moneyEscrowed.add(_moneyEscrowedDelta);
            }
        }
        _order.price = _price;
        insertOrderIntoList(_order, _betterOrderId, _worseOrderId);
        _market.assertBalances();
        augur.logOrderPriceChanged(_market.getUniverse(), _orderId);
        if (_moneyEscrowedDelta != 0) {
            int256 _frozenFundDelta = _isRefund ? -int256(_moneyEscrowedDelta) : int256(_moneyEscrowedDelta);
            profitLoss.recordFrozenFundChange(_market, msg.sender, _order.outcome, _frozenFundDelta);
        }
        return true;
    }

    function removeOrderFromList(bytes32 _orderId) private returns (bool) {
        Order.Types _type = orders[_orderId].orderType;
        IMarket _market = orders[_orderId].market;
        uint256 _outcome = orders[_orderId].outcome;
        IERC20 _kycToken = orders[_orderId].kycToken;
        bytes32 _betterOrderId = orders[_orderId].betterOrderId;
        bytes32 _worseOrderId = orders[_orderId].worseOrderId;
        if (bestOrder[getBestOrderWorstOrderHash(_market, _outcome, _type, _kycToken)] == _orderId) {
            bestOrder[getBestOrderWorstOrderHash(_market, _outcome, _type, _kycToken)] = _worseOrderId;
        }
        if (worstOrder[getBestOrderWorstOrderHash(_market, _outcome, _type, _kycToken)] == _orderId) {
            worstOrder[getBestOrderWorstOrderHash(_market, _outcome, _type, _kycToken)] = _betterOrderId;
        }
        if (_betterOrderId != bytes32(0)) {
            orders[_betterOrderId].worseOrderId = _worseOrderId;
        }
        if (_worseOrderId != bytes32(0)) {
            orders[_worseOrderId].betterOrderId = _betterOrderId;
        }
        orders[_orderId].betterOrderId = bytes32(0);
        orders[_orderId].worseOrderId = bytes32(0);
        return true;
    }

    /**
     * @dev If best bid is not set or price higher than best bid price, this order is the new best bid.
     */
    function updateBestBidOrder(bytes32 _orderId, IMarket _market, uint256 _price, uint256 _outcome, IERC20 _kycToken) private returns (bytes32) {
        bytes32 _bestBidOrderId = bestOrder[getBestOrderWorstOrderHash(_market, _outcome, Order.Types.Bid, _kycToken)];
        if (_bestBidOrderId == bytes32(0) || _price > orders[_bestBidOrderId].price) {
            bestOrder[getBestOrderWorstOrderHash(_market, _outcome, Order.Types.Bid, _kycToken)] = _orderId;
        }
        return bestOrder[getBestOrderWorstOrderHash(_market, _outcome, Order.Types.Bid, _kycToken)];
    }

    /**
     * @dev If worst bid is not set or price lower than worst bid price, this order is the new worst bid.
     */
    function updateWorstBidOrder(bytes32 _orderId, IMarket _market, uint256 _price, uint256 _outcome, IERC20 _kycToken) private returns (bytes32) {
        bytes32 _worstBidOrderId = worstOrder[getBestOrderWorstOrderHash(_market, _outcome, Order.Types.Bid, _kycToken)];
        if (_worstBidOrderId == bytes32(0) || _price <= orders[_worstBidOrderId].price) {
            worstOrder[getBestOrderWorstOrderHash(_market, _outcome, Order.Types.Bid, _kycToken)] = _orderId;
        }
        return worstOrder[getBestOrderWorstOrderHash(_market, _outcome, Order.Types.Bid, _kycToken)];
    }

    /**
     * @dev If best ask is not set or price lower than best ask price, this order is the new best ask.
     */
    function updateBestAskOrder(bytes32 _orderId, IMarket _market, uint256 _price, uint256 _outcome, IERC20 _kycToken) private returns (bytes32) {
        bytes32 _bestAskOrderId = bestOrder[getBestOrderWorstOrderHash(_market, _outcome, Order.Types.Ask, _kycToken)];
        if (_bestAskOrderId == bytes32(0) || _price < orders[_bestAskOrderId].price) {
            bestOrder[getBestOrderWorstOrderHash(_market, _outcome, Order.Types.Ask, _kycToken)] = _orderId;
        }
        return bestOrder[getBestOrderWorstOrderHash(_market, _outcome, Order.Types.Ask, _kycToken)];
    }

    /**
     * @dev If worst ask is not set or price higher than worst ask price, this order is the new worst ask.
     */
    function updateWorstAskOrder(bytes32 _orderId, IMarket _market, uint256 _price, uint256 _outcome, IERC20 _kycToken) private returns (bytes32) {
        bytes32 _worstAskOrderId = worstOrder[getBestOrderWorstOrderHash(_market, _outcome, Order.Types.Ask, _kycToken)];
        if (_worstAskOrderId == bytes32(0) || _price >= orders[_worstAskOrderId].price) {
            worstOrder[getBestOrderWorstOrderHash(_market, _outcome, Order.Types.Ask, _kycToken)] = _orderId;
        }
        return worstOrder[getBestOrderWorstOrderHash(_market, _outcome, Order.Types.Ask, _kycToken)];
    }

    function getBestOrderWorstOrderHash(IMarket _market, uint256 _outcome, Order.Types _type, IERC20 _kycToken) private pure returns (bytes32) {
        return sha256(abi.encodePacked(_market, _outcome, _type, _kycToken));
    }

    function ascendOrderList(Order.Types _type, uint256 _price, bytes32 _lowestOrderId) public view returns (bytes32 _betterOrderId, bytes32 _worseOrderId) {
        _worseOrderId = _lowestOrderId;
        bool _isWorstPrice;
        if (_type == Order.Types.Bid) {
            _isWorstPrice = _price <= getPrice(_worseOrderId);
        } else if (_type == Order.Types.Ask) {
            _isWorstPrice = _price >= getPrice(_worseOrderId);
        }
        if (_isWorstPrice) {
            return (_worseOrderId, getWorseOrderId(_worseOrderId));
        }
        bool _isBetterPrice = isBetterPrice(_type, _price, _worseOrderId);
        while (_isBetterPrice && getBetterOrderId(_worseOrderId) != 0 && _price != getPrice(getBetterOrderId(_worseOrderId))) {
            _betterOrderId = getBetterOrderId(_worseOrderId);
            _isBetterPrice = isBetterPrice(_type, _price, _betterOrderId);
            if (_isBetterPrice) {
                _worseOrderId = getBetterOrderId(_worseOrderId);
            }
        }
        _betterOrderId = getBetterOrderId(_worseOrderId);
        return (_betterOrderId, _worseOrderId);
    }

    function descendOrderList(Order.Types _type, uint256 _price, bytes32 _highestOrderId) public view returns (bytes32 _betterOrderId, bytes32 _worseOrderId) {
        _betterOrderId = _highestOrderId;
        bool _isBestPrice;
        if (_type == Order.Types.Bid) {
            _isBestPrice = _price > getPrice(_betterOrderId);
        } else if (_type == Order.Types.Ask) {
            _isBestPrice = _price < getPrice(_betterOrderId);
        }
        if (_isBestPrice) {
            return (0, _betterOrderId);
        }
        bool _isWorsePrice = isWorsePrice(_type, _price, _betterOrderId);
        while (_isWorsePrice && getWorseOrderId(_betterOrderId) != 0) {
            _worseOrderId = getWorseOrderId(_betterOrderId);
            _isWorsePrice = isWorsePrice(_type, _price, _worseOrderId);
            if (_isWorsePrice || _price == getPrice(getWorseOrderId(_betterOrderId))) {
                _betterOrderId = getWorseOrderId(_betterOrderId);
            }
        }
        _worseOrderId = getWorseOrderId(_betterOrderId);
        return (_betterOrderId, _worseOrderId);
    }

    function findBoundingOrders(Order.Types _type, uint256 _price, bytes32 _bestOrderId, bytes32 _worstOrderId, bytes32 _betterOrderId, bytes32 _worseOrderId) public returns (bytes32 betterOrderId, bytes32 worseOrderId) {
        if (_bestOrderId == _worstOrderId) {
            if (_bestOrderId == bytes32(0)) {
                return (bytes32(0), bytes32(0));
            } else if (isBetterPrice(_type, _price, _bestOrderId)) {
                return (bytes32(0), _bestOrderId);
            } else {
                return (_bestOrderId, bytes32(0));
            }
        }
        if (_betterOrderId != bytes32(0)) {
            if (getPrice(_betterOrderId) == 0) {
                _betterOrderId = bytes32(0);
            } else {
                assertIsNotBetterPrice(_type, _price, _betterOrderId);
            }
        }
        if (_worseOrderId != bytes32(0)) {
            if (getPrice(_worseOrderId) == 0) {
                _worseOrderId = bytes32(0);
            } else {
                assertIsNotWorsePrice(_type, _price, _worseOrderId);
            }
        }
        if (_betterOrderId == bytes32(0) && _worseOrderId == bytes32(0)) {
            return (descendOrderList(_type, _price, _bestOrderId));
        } else if (_betterOrderId == bytes32(0)) {
            return (ascendOrderList(_type, _price, _worseOrderId));
        } else if (_worseOrderId == bytes32(0)) {
            return (descendOrderList(_type, _price, _betterOrderId));
        }
        if (getWorseOrderId(_betterOrderId) != _worseOrderId) {
            return (descendOrderList(_type, _price, _betterOrderId));
        } else if (getBetterOrderId(_worseOrderId) != _betterOrderId) {
            // Coverage: This condition is likely unreachable or at least seems to be. Rather than remove it I'm keeping it for now just to be paranoid
            return (ascendOrderList(_type, _price, _worseOrderId));
        }
        return (_betterOrderId, _worseOrderId);
    }
}
