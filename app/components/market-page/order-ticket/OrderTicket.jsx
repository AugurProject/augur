let React = require('react');
let OrderTicketStep1 = require('./order-ticket/OrderTicketStep1.jsx');
let OrderTicketStep2 = require('./order-ticket/OrderTicketStep2.jsx');
let OrderTicketStep3 = require('./order-ticket/OrderTicketStep3.jsx');

let OrderTicket = React.createClass({
    getInitialState() {
        return {
            order: {
                price: null,
                quantity: null,
                isBuy: null
            },
            ticketProcess: {
                step: 1
            }
        };
    },
    render() {
        return (
            <div className="orderTicket" ng-controller="OrderTicketController as orderTicket">
                <h4>
                    <span className="hidden-xs">Order Ticket</span>
                    <a className="visible-xs-inline-block collapsibleTitle collapsed" data-toggle="collapse"
                       href="#orderTicketCollapse" aria-expanded="true" aria-controls="orderTicketCollapse">
                        Order Ticket
                    </a>
                    <a className="helpPopover" data-toggle="modal" data-target="#help-markets-create-an-order"
                       ng-include="'question-icon'">
                    </a>

                    <small className="disclaimer">
                        <a className="helpPopover" data-toggle="modal"
                           data-target="#help-markets-order-book-disclaimer">
                            Disclaimer
                        </a>
                    </small>
                </h4>

                <jspinclude page="../../include/help-popover.jsp">
                    <jspparam name="contentCmsName" value="help-markets-create-an-order"/>
                    <jspparam name="labelCmsName" value="help-markets-create-an-order-label"/>
                    <jspparam name="labelDefaultValue" value="Order Ticket"/>
                </jspinclude>

                <jspinclude page="../../include/help-popover.jsp">
                    <jspparam name="contentCmsName" value="help-markets-order-book-disclaimer"/>
                    <jspparam name="labelCmsName" value="help-markets-order-book-disclaimer-label"/>
                    <jspparam name="labelDefaultValue" value="Order Book Disclaimer"/>
                </jspinclude>

                <OrderTicketStep1 isVisible={this.state.ticketProcess.step == 1}/>
                <OrderTicketStep2 isVisible={this.state.ticketProcess.step == 2}/>
                <OrderTicketStep3 isVisible={this.state.ticketProcess.step == 3}/>
            </div>
        );
    }
});

module.exports = OrderTicket;