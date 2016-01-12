let React = require('react');

let Formsy = require('formsy-react');

let SideInput = React.createClass({
    mixins: [Formsy.Mixin],
    render() {
        let isErrorVisible = (this.isFormSubmitted() || !this.isPristine()) && !this.isValid();

        return (
            <div className={`form-group clearfix ${isErrorVisible ? 'has-error' : ''}`}>
                <label className={`radio orderTicket-buyRadio buy ${this.props.order.side === 'buy' ? 'checked' : ''}`}>
                    <input className="form-control input-sm" name="order.isBuy" value="buy" type="radio" required noValidate />
                    Buy
                </label>
                <label className={`radio orderTicket-sellRadio sell ${this.props.order.side === 'sell' ? 'checked' : ''}`}>
                    <input className="form-control input-sm" name="order.isBuy" value="sell" type="radio" required noValidate />
                    Sell
                </label>
                <div className="help-block"
                     style={{display: isErrorVisible ? "" : "none"}}>
                    <span className="error-message" style={{display: this.showError() ? '' : 'none'}}>Please select BUY or SELL</span>
                </div>
            </div>
        );
    }
});

module.exports = SideInput;