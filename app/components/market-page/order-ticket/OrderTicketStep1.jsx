let React = require('react');
let Formsy = require('formsy-react');

let SideInput = require('./SideInput.jsx');
let QuantityInput = require('./QuantityInput.jsx');

let OrderTicketStep1 = React.createClass({
    render() {
        let style = {
            display: this.props.isVisible ? "" : "none"
        };
        return (
            <div id="orderTicketCollapse" className="orderTicket-step collapse collapsedOnMobile" style={style}>
                <Formsy.Form name="orderTicketForm" noValidate method="post" onSubmit={this.props.onFormSubmit}
                             ref="orderTicketForm">
                    <div className="orderTicket-step-content">
                        <SideInput order={this.props.order} name="order.quantity"/>

                        <QuantityInput order={this.props.order} name="order.side"/>

                        <div className="form-group"
                             ng-className='{"has-error": orderTicket.process.hasEnoughMoney === false}'
                            style={{display: 'none'}}>
                            <table className="table table-condensed table-no-border table--fullWidthRows"
                                   style={{marginBottom: 0}}>
                                <tbody>
                                    <tr>
                                        <td>Funds Available:</td>
                                        <td className="text-right">
                                            <strong ng-bind="app.balance.fundsAvailableFormatted"
                                                    ng-if="app.isUserLoggedIn"
                                                    in-highlight="app.balance.fundsAvailable"></strong>
                                            <strong ng-if="!app.isUserLoggedIn">$0.00</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Funds Required:</td>
                                        <td className="text-right">
                                            <strong
                                                ng-if="!orderTicket.process.hypotheticalOrder.isTyping && !orderTicket.process.hypotheticalOrder.isInProgress"
                                                ng-bind="orderTicket.process.fundsRequiredFormatted"></strong>
                                                <span
                                                    ng-if="orderTicket.process.hypotheticalOrder.isInProgress"
                                                    className="fa fa-spinner fa-spin"></span>
                                                <span
                                                    ng-if="orderTicket.process.hypotheticalOrder.isTyping"
                                                    className="fa fa-pencil"></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="help-block error-message"
                                 ng-show="orderTicket.process.hasEnoughMoney === false">
                                You don't have enough funds
                            </div>
                        </div>

                        <div className="">
                            <button
                                className="btn btn-block btn-md btn-fill btn-info orderTicket-submitAction"
                                type="submit">
                                {/*orderTicket.orderConfirmation ? "Review order" : "Submit order"*/}
                                Review order
                            </button>
                        </div>
                    </div>
                    <div className="orderTicket-secondaryAction">
                        <label
                            className="orderTicket-confirmOrder checkbox text-capitalize u-text--sameSizeAsTableData"
                            ng-className="{checked: orderTicket.orderConfirmation}">
                            <span className="icons">
                                <span className="first-icon fa fa-square-o"></span>
                                <span
                                    className="second-icon fa fa-check-square-o"></span>
                            </span>
                            {/*<input type="checkbox" name="orderConfirmation"
                             ng-model="orderTicket.orderConfirmation"
                             ng-change="orderTicket.onOrderConfirmationChanged()"/>*/}
                            Confirm order
                        </label>
                        <button
                            className="orderTicket-clearForm btn btn-simple btn-danger text-capitalize u-text--sameSizeAsTableData"
                            ng-click="orderTicket.clearForm()"
                            type="button">
                            <span className="fa fa-times"></span>
                            Clear ticket
                        </button>
                    </div>
                </Formsy.Form>
            </div>

        );
    }
});

module.exports = OrderTicketStep1;