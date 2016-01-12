let React = require('react');
let OrderTicketStep1 = require('./OrderTicketStep1.jsx');
let OrderTicketStep2 = require('./OrderTicketStep2.jsx');
let OrderTicketStep3 = require('./OrderTicketStep3.jsx');

let OrderTicket = React.createClass({
    getInitialState() {
        return {
            order: {
                price: null,
                quantity: null,
                side: null
            },
            ticketProcess: {
                step: 1
            }
        };
    },

    handleStep1FormSubmit(data) {
        this.setState({
            ticketProcess: {
                step: 2
            }
        });
    },
    handleStep1FormClear() {
        this.setState(this.getInitialState());
    },
    handleStep2OrderEdit() {
        this.setState({
            ticketProcess: {
                step: 1
            }
        });
    },
    handleStep2OrderAbort() {
        this.setState(this.getInitialState());
    },
    handleStep2OrderSubmit() {
        this.setState({
            ticketProcess: {
                step: 3
            }
        });
    },
    handleStep3Continue() {
        this.setState(this.getInitialState());
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


                <OrderTicketStep1
                    isVisible={this.state.ticketProcess.step == 1}
                    order={this.state.order}
                    onFormSubmit={this.handleStep1FormSubmit}
                    onFormClear={this.handleStep1FormClear}
                    />

                <OrderTicketStep2
                    isVisible={this.state.ticketProcess.step == 2}
                    onEditOrder={this.handleStep2OrderEdit}
                    onAbortOrder={this.handleStep2OrderAbort}
                    onOrderSubmit={this.handleStep2OrderSubmit}
                    />

                <OrderTicketStep3
                    isVisible={this.state.ticketProcess.step == 3}
                    onContinue={this.handleStep3Continue}
                    />
            </div>
        );
    }
});

module.exports = OrderTicket;