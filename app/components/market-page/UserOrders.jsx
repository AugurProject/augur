let React = require('react');
let BigNumber = require('bignumber.js');
let abi = require("augur-abi");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");
let Button = require('react-bootstrap/lib/Button');
let utilities = require("../../libs/utilities");

let UserOrders = React.createClass({

    mixins: [FluxMixin, StoreWatchMixin("market")],

    getStateFromFlux() {
        var flux = this.getFlux();
        var orders = flux.augur.orders.get(flux.augur.from);
        return {myOpenOrders: orders};
    },

    onOrderCancel(outcome, orderId) {
        var flux = this.getFlux();
        flux.augur.orders.cancel(flux.augur.from, this.props.market._id, outcome, orderId);
        this.setState({myOpenOrders: flux.augur.orders.get(flux.augur.from)})
    },

    render() {
        var myOpenOrders = this.state.myOpenOrders;
        var direction, order, openOrders = [];
        var numOrders = 0;
        if (myOpenOrders) {
            myOpenOrders = myOpenOrders[this.props.market._id];
            for (var outcome in myOpenOrders) {
                if (!myOpenOrders.hasOwnProperty(outcome)) continue;
                for (var i = 0, n = myOpenOrders[outcome].length; i < n; ++i) {
                    order = myOpenOrders[outcome][i];
                    direction = (abi.bignum(order.amount).gt(new BigNumber(0))) ? "Buy" : "Sell";
                    openOrders.push(
                        <tr className="openOrder" key={order.id}>
                            <td className="text-uppercase"><strong>{direction}</strong></td>
                            <td className="text-center">{utilities.getOutcomeName(parseInt(outcome), this.props.market).outcome}</td>
                            <td className="text-right">{abi.bignum(order.amount).toFixed(2)}</td>
                            <td className="text-right">{order.price}</td>
                            <td className="text-right">{order.cap || '-'}</td>
                            <td className="text-right">
                                <Button
                                    className="btn btn-info"
                                    onClick={this.onOrderCancel.bind(this, outcome, order.id)}>
                                    Cancel
                                </Button>
                            </td>
                        </tr>
                    );
                    numOrders++;
                }
            }
        }
        if (!numOrders) {
            openOrders = (
                <tr className="js-emptyRow">
                    <td colSpan="6" className="text-center">
                        You have no <span className="text-uppercase">open orders</span> right now
                    </td>
                </tr>
            );
        }
        return (
            <div className="openOrders" ng-controller="OpenOrdersController as openOrders">
                <h4>
                    <span className="hidden-xs">My Open Orders</span>
                    <a className="visible-xs-inline-block collapsibleTitle collapsed" data-toggle="collapse"
                       href="#myOpenOrdersCollapse" aria-expanded="true" aria-controls="myOpenOrdersCollapse">
                        My Open Orders
                    </a>
                </h4>
                <div id="myOpenOrdersCollapse" className="collapse collapsedOnMobile">
                    <div className="table-responsive">
                        <table className="tabular info user-order">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th className="text-right">Outcome</th>
                                    <th className="text-right">Qty.</th>
                                    <th className="text-right">Price</th>
                                    <th className="text-right">Cap</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {openOrders}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = UserOrders;
