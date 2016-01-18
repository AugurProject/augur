let React = require('react');

let OrderTicket = require('./order-ticket/OrderTicket.jsx');
let UserPosition = require('./UserPosition.jsx');
let UserOrders = require('./UserOrders.jsx');
let OrderBook = require('./OrderBook.jsx');

let TradeTab = React.createClass({
    render() {
        return (
            <div className="row collapsibleAccordion" role="tablist" aria-multiselectable="true">
                <div className="col-sm-9">
                    <div className="row">
                        <div className="col-sm-7 col-md-6">
                            <UserPosition market={this.props.market}/>
                            <UserOrders/>
                        </div>
                        <div className="col-sm-5 col-md-6">
                            <OrderBook/>
                        </div>
                    </div>
                </div>
                <div className="col-sm-3">
                    <OrderTicket market={this.props.market} account={this.props.account}/>
                </div>
            </div>
        );
    }
});

module.exports = TradeTab;