let React = require('react');

let MarketCreateStep4 = React.createClass({
    render() {
        return (
            <div>
                MarketCreateStep4
                <div className="form-group">
                    <button type="button" onClick={this.props.goToPreviousStep}>
                        back
                    </button>
                </div>
            </div>
        )
    }
});

module.exports = MarketCreateStep4;