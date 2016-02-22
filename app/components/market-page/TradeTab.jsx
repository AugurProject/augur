let React = require('react');

let OrderTicket = require('./order-ticket/OrderTicket.jsx');
let UserPosition = require('./UserPosition.jsx');
let UserOrders = require('./UserOrders.jsx');
let OrderBook = require('./OrderBook.jsx');
let Comments = require('./comments/Comments.jsx');

let TradeTab = React.createClass({
    render() {
        return (
            <div className="row collapsibleAccordion" role="tablist" aria-multiselectable="true">
                <div className="col-sm-9">
                    <div className="row">
                        <div>
                            {/* TODO: implement
                            <UserPosition market={this.props.market}/>
                            */}
                            <UserOrders market={this.props.market}/>
                        </div>
                    {/* TODO: implement
                        <div className="col-sm-5 col-md-6">
                            <OrderBook />
                        </div>
                    */}
                    </div>
                </div>
                <div className="col-sm-3">
                    <OrderTicket market={this.props.market} account={this.props.account}/>
                </div>
                <div className='col-xs-12'>
                    <Comments
                        toggleSignInModal={this.props.toggleSignInModal}
                        market={this.props.market}
                        //comments={this.props.market.comments} // comments are already in market, should I pass them?
                        account={this.props.account}
                        handle={this.props.handle}
                        />
                </div>

            </div>
        );
    }
});

module.exports = TradeTab;