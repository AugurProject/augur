/**
 * Copyright (C) 2015 Forecast Foundation OU, full GPL notice in LICENSE
 */

pragma solidity 0.4.24;


import 'trading/ICancelOrder.sol';
import 'libraries/ReentrancyGuard.sol';
import 'trading/Order.sol';
import 'reporting/IMarket.sol';
import 'trading/ICash.sol';
import 'trading/IOrders.sol';
import 'libraries/Initializable.sol';
import 'IAugur.sol';


/**
 * @title CancelOrder
 * @dev This allows you to cancel orders on the book.
 */
contract CancelOrder is Initializable, ReentrancyGuard, ICancelOrder {

    IAugur public augur;
    IOrders public orders;

    function initialize(IAugur _augur) public beforeInitialized returns (bool) {
        endInitialization();
        augur = _augur;
        orders = IOrders(augur.lookup("Orders"));
        return true;
    }

    /**
     * @dev Cancellation: cancels an order, if a bid refunds money, if an ask returns shares
     * @return true if successful; throw on failure
     */
    function cancelOrder(bytes32 _orderId) external afterInitialized nonReentrant returns (bool) {
        return cancelOrderInternal(msg.sender, _orderId);
    }

    function cancelOrders(bytes32[] _orderIds) external afterInitialized nonReentrant returns (bool) {
        for (uint256 i = 0; i < _orderIds.length; i++) {
            cancelOrderInternal(msg.sender, _orderIds[i]);
        }
        return true;
    }

    function cancelOrderInternal(address _sender, bytes32 _orderId) internal returns (bool) {
        require(_orderId != bytes32(0));

        // Look up the order the sender wants to cancel
        uint256 _moneyEscrowed = orders.getOrderMoneyEscrowed(_orderId);
        uint256 _sharesEscrowed = orders.getOrderSharesEscrowed(_orderId);
        Order.Types _type = orders.getOrderType(_orderId);
        IMarket _market = orders.getMarket(_orderId);
        uint256 _outcome = orders.getOutcome(_orderId);

        // Check that the order ID is correct and that the sender owns the order
        require(_sender == orders.getOrderCreator(_orderId));

        // Clear the order first
        orders.removeOrder(_orderId);

        refundOrder(_sender, _type, _sharesEscrowed, _moneyEscrowed, _market, _outcome);
        _market.assertBalances();

        augur.logOrderCanceled(_market.getUniverse(), _market.getShareToken(_outcome), _sender, _orderId, _type, _moneyEscrowed, _sharesEscrowed);

        return true;
    }

    /**
     * @dev Issue refunds
     */
    function refundOrder(address _sender, Order.Types _type, uint256 _sharesEscrowed, uint256 _moneyEscrowed, IMarket _market, uint256 _outcome) private returns (bool) {
        if (_sharesEscrowed > 0) {
            // Return to user sharesEscrowed that weren't filled yet for all outcomes except the order outcome
            if (_type == Order.Types.Bid) {
                for (uint256 _i = 0; _i < _market.getNumberOfOutcomes(); ++_i) {
                    if (_i != _outcome) {
                        _market.getShareToken(_i).trustedCancelOrderTransfer(_market, _sender, _sharesEscrowed);
                    }
                }
            // Shares refund if has shares escrowed for this outcome
            } else {
                _market.getShareToken(_outcome).trustedCancelOrderTransfer(_market, _sender, _sharesEscrowed);
            }
        }

        // Return to user moneyEscrowed that wasn't filled yet
        if (_moneyEscrowed > 0) {
            ICash _denominationToken = _market.getDenominationToken();
            require(_denominationToken.transferFrom(_market, _sender, _moneyEscrowed));
        }

        return true;
    }
}
