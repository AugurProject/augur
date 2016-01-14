let React = require('react');
var update = require('react-addons-update');

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
            ticket: {
                isValid: false,
                isOrderConfirmationRequired: true, // todo: persist somewhere (local storage?)
                step: 1
            }
        };
    },

    handleStep1FormOnValidState() {
        console.log("OrderTicket.jsx: handleStep1FormOnValidState");
        this.setState(update(this.state, {
            ticket: {
                isValid: {
                    $set: true
                }
            }
        }));
    },
    handleStep1FormOnInvalidState() {
        console.log("OrderTicket.jsx: handleStep1FormOnInvalidState");
        this.setState(update(this.state, {
            ticket: {
                isValid: {
                    $set: false
                }
            }
        }));
    },
    handleQuantityInputChange(quantity) {
        this.setState(update(this.state, {
            order: {
                quantity: {
                    $set: quantity
                }
            }
        }));
    },
    handleSideInputChange(side) {
        this.setState(update(this.state, {
            order: {
                side: {
                    $set: side
                }
            }
        }));
    },
    handleStep1FormSubmit(data) {
        console.log("OrderTicket.jsx: data: %o", data);
        console.log("OrderTicket.jsx: state: %o", this.state);

        if (this.state.ticket.isValid) {
            let step = this.state.ticket.isOrderConfirmationRequired ? 2 : 3;
            this.setState(update(this.state, {
                ticket: {
                    step: {
                        $set: step
                    }
                }
            }));
        } else {
            console.log("OrderTicket.jsx: is not valid");
        }
    },
    handleStep1FormClear() {
        let newState = Object.assign({}, this.getInitialState());
        console.log("OrderTicket.jsx: handleStep1FormClear newState: %o", newState);
        this.setState(newState);
    },
    handleStep1OrderConfirmationChange(event) {
        console.log("OrderTicket.jsx: %o", event);
        console.log("OrderTicket.jsx: state: %o", this.state);
        var newState = update(this.state, {
            ticket: {
                isOrderConfirmationRequired: {
                    $set: event.target.checked
                }
            }
        });
        console.log("OrderTicket.jsx: new state: %o", newState);
        this.setState(newState);
    },
    handleStep2OrderEdit() {
        this.setState(update(this.state, {
            ticket: {
                step: {
                    $set: 1
                }
            }
        }));
    },
    handleStep2OrderAbort() {
        this.setState(Object.assign({}, this.getInitialState()));
    },
    handleStep2OrderSubmit() {
        this.setState({
            ticket: {
                step: 3
            }
        });
    },
    handleStep3Continue() {
        this.refs.step1.refs.orderForm.reset();
        this.setState(Object.assign({}, this.getInitialState()));
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
                    ref="step1"
                    isVisible={this.state.ticket.step == 1}
                    order={this.state.order}
                    onFormValid={this.handleStep1FormOnValidState}
                    onFormInvalid={this.handleStep1FormOnInvalidState}
                    onFormSubmit={this.handleStep1FormSubmit}
                    onFormClear={this.handleStep1FormClear}
                    onOrderConfirmationChange={this.handleStep1OrderConfirmationChange}
                    isOrderConfirmationRequired={this.state.ticket.isOrderConfirmationRequired}
                    onQuantityInputChange={this.handleQuantityInputChange}
                    onSideInputChange={this.handleSideInputChange}
                    />

                <OrderTicketStep2
                    order={this.state.order}
                    isVisible={this.state.ticket.step == 2}
                    onEditOrder={this.handleStep2OrderEdit}
                    onAbortOrder={this.handleStep2OrderAbort}
                    onOrderSubmit={this.handleStep2OrderSubmit}
                    />

                <OrderTicketStep3
                    isVisible={this.state.ticket.step == 3}
                    onContinue={this.handleStep3Continue}
                    />
            </div>
        );
    }
});

module.exports = OrderTicket;