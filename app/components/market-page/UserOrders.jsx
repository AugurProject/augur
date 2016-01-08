let React = require('react');

let UserOrders = React.createClass({
    render() {
        return (
            <div className="openOrders" ng-controller="OpenOrdersController as openOrders">
                <h4>
                    <span className="hidden-xs">My Open Orders</span>
                    <a className="visible-xs-inline-block collapsibleTitle collapsed" data-toggle="collapse"
                       href="#myOpenOrdersCollapse" aria-expanded="true" aria-controls="myOpenOrdersCollapse">
                        My Open Orders
                    </a>
                    <span ng-if="openOrders.count.total > openOrders.orders.length">
                        {/*({{openOrders.count.total}})*/}
                    </span>
                    <a className="helpPopover" data-toggle="modal" data-target="#help-markets-my-open-orders">
                        {/* <%@ include file="/assets/svg/question.svg" %> */}
                    </a>
                </h4>

                <jspinclude page="../../include/help-popover.jsp">
                    <jspparam name="contentCmsName" value="help-markets-my-open-orders"/>
                    <jspparam name="labelCmsName" value="help-markets-my-open-orders-label"/>
                    <jspparam name="labelDefaultValue" value="My Open Orders"/>
                </jspinclude>

                <div id="myOpenOrdersCollapse" className="collapse collapsedOnMobile">
                    <div className="table-responsive">
                        <table className="table table-hover"
                               in-top-up-rows="openOrders.orders"
                               in-top-up-rows-max="6">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th className="text-right">Qty.</th>
                                    <th className="text-right">Price</th>
                                    <th className="text-right">Matched</th>
                                    <th className="text-right">Unmatched</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="js-emptyRow"
                                    ng-if="openOrders.orders.length == 0">
                                    <td colSpan="5" className="text-center">You have no <span
                                        className="text-uppercase">open orders</span> right
                                        now
                                    </td>
                                </tr>
                                <tr className="openOrder"
                                    ng-repeat="order in openOrders.orders track by order.orderId"
                                    ng-className="{'openOrder--cancelled': openOrders.orderCancelation[order.orderId] == 'cancelled'}">
                                    <td className="text-uppercase">
                                        <strong ng-className="{'buy': order.isBuy, 'sell': !order.isBuy}"
                                                ng-bind="order.isBuy ? 'Buy' : 'Sell'"></strong>
                                    </td>
                                    <td className="text-right"
                                        ng-bind="order.originalQuantityFormatted"></td>
                                    <td className="text-right"
                                        ng-bind="order.costPerShareFormatted"></td>
                                    <td className="text-right">
                                        <span ng-bind="order.matchedQuantityFormatted"
                                              in-highlight></span>
                                    </td>
                                    <td className="text-right">
                                        <span ng-bind="order.remainingQuantityFormatted"
                                              in-highlight></span>
                                        <button
                                            className="btn btn-simple btn-xs openOrder-cancelOrderAction btn-danger"
                                            in-confirm="Do you want to cancel this order?"
                                            in-confirm-title="Cancel Order"
                                            in-confirm-placement="right"
                                            in-confirm-yes-action="openOrders.cancelOrder(order.orderId)"
                                            in-confirm-yes-action-label="Yes, cancel"
                                            in-confirm-no-action-label="No"
                                            ng-disabled="openOrders.orderCancelation[order.orderId]"
                                            title="Cancel Order">
                                            <span className="fa fa-times"></span>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <span>
                            <a href="/my-trading/open-orders#market-"
                               _____ng-style="{visibility: openOrders.count.offers > 0 || openOrders.count.bids > 0 ? 'visible' : 'hidden'}"
                               ng-href="/my-trading/open-orders#market-{{app.contract.contractId}}"
                               className="openOrders-seeAllAction"
                               title="See all open orders">
                                <span className="fa fa-search"></span>
                                All Open Orders
                            </a>
                        </span>
                        <span style={{float: 'right'}}>
                            <span>
                                <button
                                    ng-show="openOrders.count.offers > 0 && openOrders.count.bids > 0"
                                    className="btn btn-simple btn-danger btn-xs"
                                    type="button"
                                    in-confirm="Do you want to cancel all orders?"
                                    in-confirm-title="Cancel All Orders"
                                    in-confirm-placement="right"
                                    in-confirm-yes-action="openOrders.cancelAllOrders()"
                                    in-confirm-yes-action-label="Yes, cancel"
                                    in-confirm-no-action-label="No"
                                    title="Cancel All Orders">
                                    <span className="fa fa-times"></span>
                                    All Orders
                                </button>
                            </span>
                            <span>
                                <button ng-show="openOrders.count.bids > 0"
                                        className="btn btn-simple btn-danger btn-xs"
                                        type="button"
                                        in-confirm="Do you want to cancel all buys?"
                                        in-confirm-title="Cancel All Buy Orders"
                                        in-confirm-placement="right"
                                        in-confirm-yes-action="openOrders.cancelAllBids()"
                                        in-confirm-yes-action-label="Yes, cancel"
                                        in-confirm-no-action-label="No"
                                        title="Cancel All Buy Orders">
                                    <span className="fa fa-times"></span>
                                    All Buys
                                </button>
                            </span>
                            <span>
                                <button ng-show="openOrders.count.offers > 0"
                                        className="btn btn-simple btn-danger btn-xs"
                                        type="button"
                                        in-confirm="Do you want to cancel all sells?"
                                        in-confirm-title="Cancel All Sell Orders"
                                        in-confirm-placement="right"
                                        in-confirm-yes-action="openOrders.cancelAllOffers()"
                                        in-confirm-yes-action-label="Yes, cancel"
                                        in-confirm-no-action-label="No"
                                        title="Cancel All Sell Orders">
                                    <span className="fa fa-times"></span>
                                    All Sells
                                </button>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = UserOrders;