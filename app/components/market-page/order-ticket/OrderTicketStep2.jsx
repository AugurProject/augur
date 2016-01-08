let React = require('react');

let OrderTicketStep2 = React.createClass({
    render() {
        let style = {
            display: this.props.isVisible ? "" : "none"
        };
        return (
            <div className="orderTicket-step" style={style}>
                <div className="orderTicket-step-content">
                    <div className="orderTicket-reviewSection">
                        <strong className="u-text--sameSizeAsTableData" style={{marginTop: 0}}>
                            Please confirm your order:
                        </strong>
                        <table className="table table-condensed table-no-border table--fullWidthRows">
                            <tbody>
                                <tr>
                                    <td>Order type:</td>
                                    <td className="text-right">
                                        <strong className="text-uppercase"
                                                in-buy-sell="{/*orderTicket.order.isBuy*/}">{/*orderTicket.order.isBuy
                                         ? "Buy" : "Sell"*/}</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Price:</td>
                                    <td className="text-right">{/*orderTicket.order.price |
                                     costPerShare:app.contract.tickSize:app.contract.tickValue | currency*/}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Quantity:</td>
                                    <td className="text-right">{/*orderTicket.order.quantityFormatted*/}</td>
                                </tr>
                                <tr>
                                    <td>Funds available:</td>
                                    <td className="text-right">{/*app.balance.fundsAvailableFormatted || '$0.00'*/}</td>
                                </tr>
                                <tr>
                                    <td>Funds required:</td>
                                    <td className="text-right">{/*orderTicket.process.fundsRequiredFormatted*/}</td>
                                </tr>
                            </tbody>
                        </table>
                        <strong className="u-text--sameSizeAsTableData">What's the reason for this
                            trade?</strong>
                        <label className="radio" ng-repeat="reason in orderTicket.orderReason.values()"
                               ng-className="{disabled: orderTicket.order.reason != reason.id,
                                                                    checked: orderTicket.order.reason == reason.id}"
                               title="{/*!orderTicketForm.isBuyRadios.$dirty ? 'Select side (buy or sell) first' : ''*/}">
                            <input className="form-control input-sm" type="radio"
                                   ng-disabled="orderTicket.order.reason != reason.id"/>
                            <span ng-bind="reason.label"></span>
                        </label>
                    </div>
                    <div>
                        <button className="btn btn-block btn-md btn-fill btn-info orderTicket-submitAction"
                                type="submit"
                                ng-click="orderTicket.onConfirmationActionClicked()">Submit order
                        </button>
                    </div>
                </div>
                <div className="orderTicket-secondaryAction">
                    <button
                        className="btn btn-simple btn-info orderTicket-editAction u-text--sameSizeAsTableData"
                        ng-click="orderTicket.editOrder()">
                        Edit Order
                    </button>
                    <button
                        className="btn btn-simple btn-danger orderTicket-abortAction u-text--sameSizeAsTableData"
                        ng-click="orderTicket.abortOrder()">
                        Abort Order
                    </button>
                </div>
            </div>
        );
    }
});

module.exports = OrderTicketStep2;