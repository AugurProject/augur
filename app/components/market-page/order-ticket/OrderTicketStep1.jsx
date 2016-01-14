let React = require('react');
let Formsy = require('formsy-react');

let SideInput = require('./SideInput.jsx');
let QuantityInput = require('./QuantityInput.jsx');
let ConfirmOrderInput = require('./ConfirmOrderInput.jsx');

let OrderTicketStep1 = React.createClass({
    onSubmit(...rest) {
        this.refs.orderForm.validateForm();
        this.props.onFormSubmit(...rest);
    },
    render() {
        let style = {
            display: this.props.isVisible ? "" : "none"
        };
        return (
            <div id="orderTicketCollapse" className="orderTicket-step collapse collapsedOnMobile" style={style}>
                <Formsy.Form name="orderTicketForm"
                             noValidate
                             method="post"
                             onValid={this.props.onFormValid}
                             onInvalid={this.props.onFormInvalid}
                             onSubmit={this.onSubmit}
                             ref="orderForm"
                    >
                    <div className="orderTicket-step-content">
                        <SideInput
                            value={this.props.order.side}
                            name="order.side"
                            onChange={this.props.onSideInputChange}
                            required/>

                        <QuantityInput
                            name="order.quantity"
                            validations="isInt,isExisty"
                            onInputChange={this.props.onQuantityInputChange}
                            required
                            validationError="Default error message"
                            validationErrors={{
                                isDefaultRequiredValue: 'Field is required',
                                isInt: "this field is number",
                                isExisty: "this is required"
                            }}
                            value={this.props.order.quantity}
                            />

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
                                {this.props.isOrderConfirmationRequired ? "Review order" : "Submit order"}
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
                            <ConfirmOrderInput
                                name="ticket.isOrderConfirmationRequired"
                                value={this.props.isOrderConfirmationRequired}
                                onChange={this.props.onOrderConfirmationChange}
                                />
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