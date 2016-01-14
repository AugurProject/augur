let React = require('react');

let Formsy = require('formsy-react');

let QuantityInput = React.createClass({
    mixins: [Formsy.Mixin],

    handleChange(event) {
        var value = event.currentTarget.value;
        this.setValue(value);
        this.props.onInputChange(value);
    },
    render() {
        let isErrorVisible = (this.isFormSubmitted() || !this.isPristine()) && !this.isValid();

        let errorMessage;
        if (isErrorVisible) {
            if (this.showError()) {
                errorMessage = this.getErrorMessage();
            } else {
                errorMessage = this.props.validationErrors.isExisty
            }
        }
        return (
            <div className={`form-group ${isErrorVisible ? 'has-error' : ''}`}>
                <div style={{position: 'relative'}}>
                    <label className="u-placeholder control-label" htmlFor="orderTicket-quantity">
                        Quantity
                    </label>
                    <input id="orderTicket-quantity"
                           onChange={this.handleChange}
                           className="form-control input-sm"
                           value={this.props.value}
                           name={this.props.name}
                           type="text"
                           autoComplete="off"
                        />
                </div>
                <div className="help-block" style={{display: isErrorVisible ? '' : 'none'}}>
                    {errorMessage}
                </div>
            </div>
        );
    }
});

module.exports = QuantityInput;