// Copyright (C) 2015 Forecast Foundation OU, full GPL notice in LICENSE

// Bid / Ask actions: puts orders on the book
// price is denominated by the specific market's numTicks
// amount is the number of attoshares the order is for (either to buy or to sell).
// price is the exact price you want to buy/sell at [which may not be the cost, for example to short a yesNo market it'll cost numTicks-price, to go long it'll cost price]

pragma solidity 0.5.10;


import 'ROOT/IAugur.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/trading/IOrders.sol';
import 'ROOT/libraries/token/IERC20.sol';


// CONSIDER: Is `price` the most appropriate name for the value being used? It does correspond 1:1 with the attoCASH per share, but the range might be considered unusual?
library Order {
    using SafeMathUint256 for uint256;

    enum Types {
        Bid, Ask
    }

    enum TradeDirections {
        Long, Short
    }

    struct Data {
        // Contracts
        IMarket market;
        IERC20 kycToken;

        // Order
        bytes32 id;
        address creator;
        uint256 outcome;
        Order.Types orderType;
        uint256 amount;
        uint256 price;
        uint256 sharesEscrowed;
        uint256 moneyEscrowed;
        bytes32 betterOrderId;
        bytes32 worseOrderId;
    }

    // No validation is needed here as it is simply a library function for organizing data
    function create(address _creator, uint256 _outcome, Order.Types _type, uint256 _attoshares, uint256 _price, IMarket _market, bytes32 _betterOrderId, bytes32 _worseOrderId, IERC20 _kycToken) internal view returns (Data memory) {
        require(_outcome < _market.getNumberOfOutcomes(), "Order.create: Outcome is not within market range");
        require(_price != 0, "Order.create: Price may not be 0");
        require(_price < _market.getNumTicks(), "Order.create: Price is outside of market range");
        require(_attoshares > 0, "Order.create: Cannot use amount of 0");
        require(_creator != address(0), "Order.create: Creator is 0x0");

        return Data({
            market: _market,
            kycToken: _kycToken,
            id: 0,
            creator: _creator,
            outcome: _outcome,
            orderType: _type,
            amount: _attoshares,
            price: _price,
            sharesEscrowed: 0,
            moneyEscrowed: 0,
            betterOrderId: _betterOrderId,
            worseOrderId: _worseOrderId
        });
    }

    //
    // "public" functions
    //

    function getOrderId(Order.Data memory _orderData, IOrders _orders) internal view returns (bytes32) {
        if (_orderData.id == bytes32(0)) {
            bytes32 _orderId = _orders.getOrderId(_orderData.orderType, _orderData.market, _orderData.amount, _orderData.price, _orderData.creator, block.number, _orderData.outcome, _orderData.moneyEscrowed, _orderData.sharesEscrowed, _orderData.kycToken);
            require(_orders.getAmount(_orderId) == 0, "Order.getOrderId: New order had amount. This should not be possible");
            _orderData.id = _orderId;
        }
        return _orderData.id;
    }

    function getOrderTradingTypeFromMakerDirection(Order.TradeDirections _creatorDirection) internal pure returns (Order.Types) {
        return (_creatorDirection == Order.TradeDirections.Long) ? Order.Types.Bid : Order.Types.Ask;
    }

    function getOrderTradingTypeFromFillerDirection(Order.TradeDirections _fillerDirection) internal pure returns (Order.Types) {
        return (_fillerDirection == Order.TradeDirections.Long) ? Order.Types.Ask : Order.Types.Bid;
    }

    function escrowFunds(Order.Data memory _orderData) internal returns (bool) {
        if (_orderData.orderType == Order.Types.Ask) {
            return escrowFundsForAsk(_orderData);
        } else if (_orderData.orderType == Order.Types.Bid) {
            return escrowFundsForBid(_orderData);
        }
    }

    function saveOrder(Order.Data memory _orderData, bytes32 _tradeGroupId, IOrders _orders) internal returns (bytes32) {
        uint256[5] memory _uints;
        _uints[0] = _orderData.amount;
        _uints[1] = _orderData.price;
        _uints[2] = _orderData.outcome;
        _uints[3] = _orderData.moneyEscrowed;
        _uints[4] = _orderData.sharesEscrowed;
        bytes32[3] memory _bytes32s;
        _bytes32s[0] = _orderData.betterOrderId;
        _bytes32s[1] = _orderData.worseOrderId;
        _bytes32s[2] = _tradeGroupId;
        return _orders.saveOrder(_uints, _bytes32s, _orderData.orderType, _orderData.market, _orderData.creator, _orderData.kycToken);
    }

    //
    // Private functions
    //

    function escrowFundsForBid(Order.Data memory _orderData) private returns (bool) {
        require(_orderData.moneyEscrowed == 0, "Order.escrowFundsForBid: New order had money escrowed. This should not be possible");
        require(_orderData.sharesEscrowed == 0, "Order.escrowFundsForBid: New order had shares escrowed. This should not be possible");
        uint256 _attosharesToCover = _orderData.amount;

        // Figure out how many almost-complete-sets (just missing `outcome` share) the creator has
        uint256 _attosharesHeld = 2**254;
        IShareToken[] memory _shareTokens = _orderData.market.getShareTokens();
        uint256 _numOutcomes = _shareTokens.length;

        uint256 _i = 0;
        for (; _i < _orderData.outcome; _i++) {
            uint256 _creatorShareTokenBalance = _shareTokens[_i].balanceOf(_orderData.creator);
            _attosharesHeld = SafeMathUint256.min(_creatorShareTokenBalance, _attosharesHeld);
        }
        for (_i++; _i < _numOutcomes; _i++) {
            uint256 _creatorShareTokenBalance = _shareTokens[_i].balanceOf(_orderData.creator);
            _attosharesHeld = SafeMathUint256.min(_creatorShareTokenBalance, _attosharesHeld);
        }

        // Take shares into escrow if they have any almost-complete-sets
        if (_attosharesHeld > 0) {
            _orderData.sharesEscrowed = SafeMathUint256.min(_attosharesHeld, _attosharesToCover);
            _attosharesToCover -= _orderData.sharesEscrowed;
            
            _i = 0;
            for (; _i < _orderData.outcome; _i++) {
                _shareTokens[_i].trustedOrderTransfer(_orderData.creator, address(_orderData.market), _orderData.sharesEscrowed);
            }
            for (_i++; _i < _numOutcomes; _i++) {
                _shareTokens[_i].trustedOrderTransfer(_orderData.creator, address(_orderData.market), _orderData.sharesEscrowed);
            }
        }

        // If not able to cover entire order with shares alone, then cover remaining with tokens
        if (_attosharesToCover > 0) {
            _orderData.moneyEscrowed = _attosharesToCover.mul(_orderData.price);
            _orderData.market.getUniverse().deposit(_orderData.creator, _orderData.moneyEscrowed, address(_orderData.market));
        }

        return true;
    }

    function escrowFundsForAsk(Order.Data memory _orderData) private returns (bool) {
        require(_orderData.moneyEscrowed == 0, "Order.escrowFundsForAsk: New order had money escrowed. This should not be possible");
        require(_orderData.sharesEscrowed == 0, "Order.escrowFundsForAsk: New order had shares escrowed. This should not be possible");
        IShareToken _shareToken = _orderData.market.getShareToken(_orderData.outcome);
        uint256 _attosharesToCover = _orderData.amount;

        // Figure out how many shares of the outcome the creator has
        uint256 _attosharesHeld = _shareToken.balanceOf(_orderData.creator);

        // Take shares in escrow if user has shares
        if (_attosharesHeld > 0) {
            _orderData.sharesEscrowed = SafeMathUint256.min(_attosharesHeld, _attosharesToCover);
            _attosharesToCover -= _orderData.sharesEscrowed;
            _shareToken.trustedOrderTransfer(_orderData.creator, address(_orderData.market), _orderData.sharesEscrowed);
        }

        // If not able to cover entire order with shares alone, then cover remaining with tokens
        if (_attosharesToCover > 0) {
            _orderData.moneyEscrowed = _orderData.market.getNumTicks().sub(_orderData.price).mul(_attosharesToCover);
            _orderData.market.getUniverse().deposit(_orderData.creator, _orderData.moneyEscrowed, address(_orderData.market));
        }

        return true;
    }
}
