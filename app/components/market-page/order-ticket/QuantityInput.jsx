let React = require('react');

let Formsy = require('formsy-react');

let QuantityInput = React.createClass({
    mixins: [Formsy.Mixin],
    render() {
        let isErrorVisible = (this.isFormSubmitted() || !this.isPristine()) && !this.isValid();
        return (
            <div className={`form-group ${isErrorVisible ? 'has-error' : ''}`}>
                <div style={{position: 'relative'}}>
                    <label className="u-placeholder control-label" htmlFor="orderTicket-quantity">
                        Quantity
                    </label>
                    <input id="orderTicket-quantity" className="form-control input-sm" value={this.getValue()}
                           name="quantity" type="text" noValidate
                           required min="{/*orderTicket.constraints.minQuantity*/}"
                           max="{/*orderTicket.constraints.maxQuantity*/}"
                           autoComplete="off"/>
                </div>
                <div className="help-block"
                     style={{display: isErrorVisible ? "" : "none"}}>
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
        );
    }
});

module.exports = QuantityInput;