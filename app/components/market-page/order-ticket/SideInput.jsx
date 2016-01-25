let React = require('react');

let Formsy = require('formsy-react');

let SideInput = React.createClass({
    mixins: [Formsy.Mixin],

    handleChange(event) {
        let value = event.target.value;
        this.props.onChange(value);
        this.setValue(value);
    },
    render() {
        let isErrorVisible = (this.isFormSubmitted() || !this.isPristine()) && !this.isValid();

        let isBuyChecked = this.props.value === 'buy';
        let isSellChecked = this.props.value === 'sell';
        return (
            <div className={`form-group clearfix ${isErrorVisible ? 'has-error' : ''}`}>
                <label className={`radio orderTicket-buyRadio buy ${isBuyChecked ? 'checked' : ''}`}>
                    <input className="form-control input-sm" name="order.isBuy" value="buy" type="radio" required noValidate
                        checked={isBuyChecked} onChange={this.handleChange} />
                    Buy
                </label>
                <label className={`radio orderTicket-sellRadio sell ${isSellChecked ? 'checked' : ''}`}>
                    <input className="form-control input-sm" name="order.isBuy" value="sell" type="radio" required noValidate
                           checked={ isSellChecked} onChange={this.handleChange} />
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