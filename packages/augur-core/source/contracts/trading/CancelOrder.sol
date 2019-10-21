/**
 * Copyright (C) 2015 Forecast Foundation OU, full GPL notice in LICENSE
 */

pragma solidity 0.5.10;


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
    IShareToken public shareToken;
    IProfitLoss public profitLoss;

    function initialize(IAugur _augur) public beforeInitialized {
        endInitialization();
        augur = _augur;
        orders = IOrders(_augur.lookup("Orders"));
        cash = ICash(_augur.lookup("Cash"));
        shareToken = IShareToken(_augur.lookup("ShareToken"));
        profitLoss = IProfitLoss(_augur.lookup("ProfitLoss"));
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

        IOrders _orders = orders;
        // Look up the order the sender wants to cancel
        uint256 _moneyEscrowed;
        uint256 _sharesEscrowed;
        Order.Types _type;
        IMarket _market;
        uint256 _outcome;
        // Check creator in inner scope to reduce stack depth
        {
            /* solium-disable indentation */
            address _creator;
            (_moneyEscrowed, _sharesEscrowed, _type, _market, _outcome, _creator) = _orders.getOrderDataForCancel(_orderId);
            // Check that the order ID is correct and that the sender owns the order
            require(_sender == _creator, "CancelOrder.cancelOrderInternal: sender is not order owner");
            /* solium-enable indentation */
        }

        // Clear the order first
        _orders.removeOrder(_orderId);

        refundOrder(_sender, _type, _sharesEscrowed, _moneyEscrowed, _market, _outcome);
        _market.assertBalances(address(_orders));

        IUniverse _universe = _market.getUniverse();
        augur.logOrderCanceled(_universe, _market, _sender, _moneyEscrowed, _sharesEscrowed, _orderId);
        profitLoss.recordFrozenFundChange(_universe, _market, _sender, _outcome, -int256(_moneyEscrowed));

        return true;
    }

    function refundOrder(address _sender, Order.Types _type, uint256 _sharesEscrowed, uint256 _moneyEscrowed, IMarket _market, uint256 _outcome) private returns (bool) {
        if (_sharesEscrowed > 0) {
            // Return to user sharesEscrowed that weren't filled yet for all outcomes except the order outcome
            if (_type == Order.Types.Bid) {
                uint256 _numberOfOutcomes = _market.getNumberOfOutcomes();
                uint256[] memory _shortOutcomes = new uint256[](_numberOfOutcomes - 1);
                uint256 _indexOutcome = 0;
                for (uint256 _i = 0; _i < _numberOfOutcomes - 1; _i++) {
                    if (_i == _outcome) {
                        _indexOutcome++;
                    }
                    _shortOutcomes[_i] = _indexOutcome;
                    _indexOutcome++;
                }
                shareToken.trustedCancelOrderBatchTransfer(_market, _shortOutcomes, address(_market), _sender, _sharesEscrowed);
            } else {
                shareToken.trustedCancelOrderTransfer(_market, _outcome, address(_market), _sender, _sharesEscrowed);
            }
        }

        // Return to user moneyEscrowed that wasn't filled yet
        if (_moneyEscrowed > 0) {
            _market.getUniverse().withdraw(_sender, _moneyEscrowed, address(_market));
        }

        return true;
    }
}
