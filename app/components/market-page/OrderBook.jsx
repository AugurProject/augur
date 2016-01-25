let React = require('react');

let OrderBook = React.createClass({
    render() {
        return (
            <div className="orderBook clearfix" ng-controller="OrderBookController as orderBook">
                <h4>
                    <span className="hidden-xs">
                        Order Book
                    </span>
                    <a className="visible-xs-inline-block collapsibleTitle collapsed" data-toggle="collapse"
                       href="#orderBookCollapse" aria-expanded="true" aria-controls="orderBookCollapse">
                        Order Book
                    </a>
                    <a className="helpPopover" data-toggle="modal" data-target="#help-markets-order-book"
                       ng-include="'question-icon'">
                    </a>
                    <span in-date-with-timezone data-in-timeToFormat="app.currentTime"
                          data-in-datePattern="'h:mm:ss a zz, ddd MMM D'"
                          className="orderBook-lastUpdatedTime pull-right">
                        {/*{{app.currentTime}}*/}
                    </span>
                </h4>

                <jspinclude page="../../include/help-popover.jsp">
                    <jspparam name="contentCmsName" value="help-markets-order-book"/>
                    <jspparam name="labelCmsName" value="help-markets-order-book-label"/>
                    <jspparam name="labelDefaultValue" value="Order Book"/>
                </jspinclude>

                <div id="orderBookCollapse" className="collapse collapsedOnMobile">
                    <div className="orderBook-bids">
                        <table className="table table-striped table-hover"
                               in-top-up-rows="orderBook.bids" in-top-up-rows-max="${orderBookDepth}">
                            <thead>
                                <tr>
                                    <th>Qty.</th>
                                    <th className="text-right">Bid Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="2">to be done</td>
                                </tr>
                                {/*
                                <tr className="js-emptyRow" ng-if="orderBook.bids.length == 0">
                                    <td colSpan="2" className="orderBook-noOrders text-center">
                                        There are no <span className="text-uppercase">bid</span> orders
                                    </td>
                                </tr>
                                <tr className="orderBook-item" ng-repeat="bid in orderBook.bids track by bid.price"
                                    in-highlight="bid.quantity"
                                    ng-className="{'u-isOfCurrentUser': bid.isOfCurrentUser}">
                                    <td ng-bind="bid.quantityFormatted"
                                        ng-click="orderBook.onQuantityClicked(bid.quantity)"
                                        title="Fill in this quantity to order ticket"></td>
                                    <td className="text-right" ng-bind="bid.costPerShareFormatted"
                                        ng-click="orderBook.onPriceClicked(bid.price)"
                                        title="Fill in this price to order ticket"></td>
                                </tr>
                                */}
                            </tbody>
                        </table>
                    </div>
                    <div className="orderBook-offers">
                        <table className="table table-striped table-hover"
                               in-top-up-rows="orderBook.offers" in-top-up-rows-max="${orderBookDepth}">
                            <thead>
                                <tr>
                                    <th>Ask Price</th>
                                    <th className="text-right">Qty.</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="2">to be done</td>
                                </tr>
                                {/*
                                <tr className="js-emptyRow" ng-if="orderBook.offers.length == 0">
                                    <td colSpan="2" className="orderBook-noOrders text-center">
                                        There are no <span className="text-uppercase">ask</span> orders
                                    </td>
                                </tr>
                                <tr className="orderBook-item"
                                    ng-repeat="offer in orderBook.offers track by offer.price"
                                    in-highlight="offer.quantity"
                                    ng-className="{'u-isOfCurrentUser': offer.isOfCurrentUser}">
                                    <td ng-bind="offer.costPerShareFormatted"
                                        ng-click="orderBook.onPriceClicked(offer.price)"
                                        title="Fill in this price to order ticket"></td>
                                    <td className="text-right" ng-bind="offer.quantityFormatted"
                                        ng-click="orderBook.onQuantityClicked(offer.quantity)"
                                        title="Fill in this quantity to order ticket"></td>
                                </tr>
                                */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = OrderBook;