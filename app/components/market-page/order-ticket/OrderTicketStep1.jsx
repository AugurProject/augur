let React = require('react');

let OrderTicketStep1 = React.createClass({
    render() {
        let style = {
            display: this.props.isVisible ? "" : "none"
        };
        return (
            <div id="orderTicketCollapse" className="orderTicket-step collapse collapsedOnMobile" style={style}>
                <form name="orderTicketForm" novalidate method="post" ng-submit="orderTicket.processOrder()">
                    <div className="orderTicket-step-content">
                        <div className="form-group clearfix"
                             ng-className='{"has-error": (orderTicketForm.$submitted || orderTicketForm.isBuyRadios.$dirty) && orderTicketForm.isBuyRadios.$invalid}'>
                            {/*<%-- ng-form because https://stackoverflow.com/q/22052729 --%>*/}
                            <ng-form name="isBuyRadios" novalidate>
                                <label className="radio orderTicket-buyRadio buy"
                                       ng-className="{checked: orderTicket.order.isBuy === true}">
                                    <input className="form-control input-sm" name="isBuy" value="buy" type="radio"
                                           ng-model="orderTicket.order.side"
                                           ng-model-options="{getterSetter: true}" required/>
                                    Buy
                                </label>
                                <label className="radio orderTicket-sellRadio sell"
                                       ng-className="{checked: orderTicket.order.isBuy === false}">
                                    <input className="form-control input-sm" name="isBuy" value="sell" type="radio"
                                           ng-model="orderTicket.order.side"
                                           ng-model-options="{getterSetter: true}" required/>
                                    Sell
                                </label>
                            </ng-form>
                            <div className="help-block"
                                 ng-if="(orderTicketForm.$submitted || orderTicketForm.isBuyRadios.$dirty) && orderTicketForm.isBuyRadios.$invalid">
                                <span ng-if="orderTicketForm.isBuyRadios.$error.required" className="error-message">Please select BUY or SELL</span>
                            </div>
                        </div>

                        <div className="form-group"
                             ng-className='{"has-error": (orderTicketForm.$submitted || orderTicketForm.quantity.$dirty) && orderTicketForm.quantity.$invalid}'>
                            <div style={{position: 'relative'}}>
                                <label className="u-placeholder control-label" htmlFor="orderTicket-quantity">
                                    Quantity
                                </label>
                                <input id="orderTicket-quantity" className="form-control input-sm"
                                       name="quantity" type="text" ng-model="orderTicket.order.quantity"
                                       required min="{/*orderTicket.constraints.minQuantity*/}"
                                       max="{/*orderTicket.constraints.maxQuantity*/}"
                                       in-quantity-input autoComplete="off"/>
                            </div>
                            <div className="help-block" ng-messages="orderTicketForm.quantity.$error"
                                 ng-if="(orderTicketForm.$submitted || orderTicketForm.quantity.$dirty) && orderTicketForm.quantity.$invalid">
                                        <span ng-message="required"
                                              className="error-message">Please enter a quantity</span>
                                <span ng-message="number" className="error-message">Must be a number</span>
                                <span ng-message="integer" className="error-message">Must be an integer</span>
                                                                <span ng-message="min" className="error-message">
                                                                    Sorry, you cannot trade 0 shares
                                                                </span>
                                                                <span ng-message="max" className="error-message">
                                                                    The maximum is {/*orderTicket.constraints.maxQuantityFormatted*/}
                                                                    shares
                                                                </span>
                            </div>
                        </div>

                        <div className="form-group"
                             ng-className='{"has-error": (orderTicketForm.$submitted || orderTicketForm.price.$dirty) && orderTicketForm.price.$invalid}'>
                            <div style={{position: 'relative'}}>
                                <label className="u-placeholder control-label" htmlFor="orderTicket-price">
                                    Price
                                </label>
                                <input id="orderTicket-price" className="form-control input-sm" name="price"
                                       type="text"
                                       ng-model="orderTicket.order.price"
                                       min="{/*orderTicket.constraints.minPrice*/}"
                                       max="{/*orderTicket.constraints.maxPrice*/}"
                                       step="{/*orderTicket.constraints.priceStep*/}" required
                                       in-price-input="app.contract" autoComplete="off"/>
                            </div>
                            <div className="help-block" ng-messages="orderTicketForm.price.$error"
                                 ng-if="(orderTicketForm.$submitted || orderTicketForm.price.$dirty) && orderTicketForm.price.$invalid">
                                        <span ng-message="required"
                                              className="error-message">Please enter a price</span>
                                <span ng-message="number" className="error-message">Must be number</span>
                                        <span ng-message="step"
                                              className="error-message">Must be multiple of {/*orderTicket.constraints.priceStep | costPerShare:app.contract.tickSize:app.contract.tickValue | number:2*/}</span>
                                        <span ng-message="min" className="error-message">
                                            The price cannot be lower than {/*orderTicket.constraints.minPrice | costPerShare:app.contract.tickSize:app.contract.tickValue | currency*/}
                                        </span>
                                        <span ng-message="max" className="error-message">
                                            The price cannot be higher than {/*orderTicket.constraints.maxPrice | costPerShare:app.contract.tickSize:app.contract.tickValue | currency*/}
                                        </span>
                            </div>
                        </div>

                        <div className="form-group"
                             ng-className='{"has-error": orderTicket.process.hasEnoughMoney === false}'>
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

                        <div className="form-group">
                            <strong className="u-text--sameSizeAsTableData">What's the reason for this
                                trade?</strong>
                            {/*<%-- ng-form because https://stackoverflow.com/q/22052729 --%>*/}
                            <ng-form name="reasonRadios" novalidate>
                                <label className="radio" ng-repeat="reason in orderTicket.orderReason.values()"
                                       ng-className="{disabled: !orderTicketForm.isBuyRadios.$dirty || !(reason.isForBuySide && reason.isForSellSide)
                                                                    && ((reason.isForBuySide && !orderTicket.order.isBuy) || (reason.isForSellSide && orderTicket.order.isBuy)),
                                                                    checked: orderTicket.order.reason == reason.id}"
                                       title="{/*!orderTicketForm.isBuyRadios.$dirty ? 'Select side (buy or sell) first' : ''*/}">
                                    <input className="form-control input-sm" name="reason" value="{/*reason.id*/}"
                                           type="radio"
                                           ng-disabled="!orderTicketForm.isBuyRadios.$dirty || !(reason.isForBuySide && reason.isForSellSide) && ((reason.isForBuySide && !orderTicket.order.isBuy) || (reason.isForSellSide && orderTicket.order.isBuy))"
                                           ng-model="orderTicket.order.reason"
                                           required in-reason-side-constraint/>
                                    <span ng-bind="reason.label"></span>
                                </label>
                            </ng-form>
                            <div
                                ng-className='{"has-error": (orderTicketForm.$submitted || orderTicketForm.reasonRadios.$dirty) && orderTicketForm.reasonRadios.$invalid}'>
                                <div className="help-block"
                                     ng-if="(orderTicketForm.$submitted || orderTicketForm.reasonRadios.$dirty) && orderTicketForm.reasonRadios.$invalid">
                                                                    <span
                                                                        ng-if="orderTicketForm.reasonRadios.$error.required && !orderTicketForm.reasonRadios.$error.reasonSideConstraint"
                                                                        className="error-message">Please select a reason for your trade</span>
                                                                    <span
                                                                        ng-if="orderTicketForm.reasonRadios.$error.reasonSideConstraint">
                                                                        Please choose another option
                                                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="">
                            <button
                                className="btn btn-block btn-md btn-fill btn-info orderTicket-submitAction"
                                type="submit">
                                {/*orderTicket.orderConfirmation ? "Review order" : "Submit order"*/}
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
                            <input type="checkbox" name="orderConfirmation"
                                   ng-model="orderTicket.orderConfirmation"
                                   ng-change="orderTicket.onOrderConfirmationChanged()"/>
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
                </form>
            </div>

        );
    }
});

module.exports = OrderTicketStep1;