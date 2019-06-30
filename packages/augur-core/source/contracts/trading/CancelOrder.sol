/**
 * Copyright (C) 2015 Forecast Foundation OU, full GPL notice in LICENSE
 */

pragma solidity 0.5.4;


import 'ROOT/trading/ICancelOrder.sol';
import 'ROOT/libraries/ReentrancyGuard.sol';
import 'ROOT/trading/Order.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/trading/ICash.sol';
import 'ROOT/trading/IOrders.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/IAugur.sol';
import 'ROOT/trading/IProfitLoss.sol';


/**
 * @title Cancel Order
 * @notice This allows you to cancel orders on the book.
 */
contract CancelOrder is Initializable, ReentrancyGuard, ICancelOrder {

    IAugur public augur;
    IOrders public orders;
    ICash public cash;
    IProfitLoss public profitLoss;

    function initialize(IAugur _augur) public beforeInitialized {
        endInitialization();
        augur = _augur;
        orders = IOrders(augur.lookup("Orders"));
        cash = ICash(augur.lookup("Cash"));
        profitLoss = IProfitLoss(augur.lookup("ProfitLoss"));
    }

    /**
     * @notice Cancels an order and refunds escrowed assets
     * @param _orderId The id of the order to cancel
     * @return Bool True
     */
    function cancelOrder(bytes32 _orderId) external nonReentrant returns (bool) {
        return cancelOrderInternal(msg.sender, _orderId);
    }

    /**
     * @notice Cancels multiple orders and refunds escrowed assets
     * @param _orderIds Array of order ids to cancel
     * @return Bool True
     */
    function cancelOrders(bytes32[] calldata _orderIds) external nonReentrant returns (bool) {
        for (uint256 i = 0; i < _orderIds.length; i++) {
            cancelOrderInternal(msg.sender, _orderIds[i]);
        }
        return true;
    }

    function cancelOrderInternal(address _sender, bytes32 _orderId) internal returns (bool) {
        require(_orderId != bytes32(0), "CancelOrder.cancelOrderInternal: Order id is 0x0");

        // Look up the order the sender wants to cancel
        uint256 _moneyEscrowed = orders.getOrderMoneyEscrowed(_orderId);
        uint256 _sharesEscrowed = orders.getOrderSharesEscrowed(_orderId);
        Order.Types _type = orders.getOrderType(_orderId);
        IMarket _market = orders.getMarket(_orderId);
        uint256 _outcome = orders.getOutcome(_orderId);
        address _creator = orders.getOrderCreator(_orderId);

        // Check that the order ID is correct and that the sender owns the order
        require(_sender == _creator, "CancelOrder.cancelOrderInternal: sender is not order owner");

        // Clear the order first
        orders.removeOrder(_orderId);

        refundOrder(_sender, _type, _sharesEscrowed, _moneyEscrowed, _market, _outcome);
        _market.assertBalances();

        augur.logOrderCanceled(_market.getUniverse(), _market, _creator, _moneyEscrowed, _sharesEscrowed, _orderId);
        profitLoss.recordFrozenFundChange(_market, _sender, _outcome, -int256(_moneyEscrowed));

        return true;
    }

    function refundOrder(address _sender, Order.Types _type, uint256 _sharesEscrowed, uint256 _moneyEscrowed, IMarket _market, uint256 _outcome) private returns (bool) {
        if (_sharesEscrowed > 0) {
            // Return to user sharesEscrowed that weren't filled yet for all outcomes except the order outcome
            if (_type == Order.Types.Bid) {
                for (uint256 _i = 0; _i < _market.getNumberOfOutcomes(); ++_i) {
                    if (_i != _outcome) {
                        _market.getShareToken(_i).trustedCancelOrderTransfer(address(_market), _sender, _sharesEscrowed);
                    }
                }
            // Shares refund if has shares escrowed for this outcome
            } else {
                _market.getShareToken(_outcome).trustedCancelOrderTransfer(address(_market), _sender, _sharesEscrowed);
            }
        }

        // Return to user moneyEscrowed that wasn't filled yet
        if (_moneyEscrowed > 0) {
            require(cash.transferFrom(address(_market), _sender, _moneyEscrowed));
        }

        return true;
    }
}
