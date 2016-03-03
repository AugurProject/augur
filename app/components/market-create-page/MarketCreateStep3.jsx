let React = require('react');

let MarketCreateStep3 = React.createClass({
    render() {
        return (
            <div>
                <h1>
                    Trading fee and liquidity
                </h1>

                <form>
                    <div className="form-group">
                        <button type="button" onClick={this.props.goToPreviousStep}>
                            back
                        </button>
                        <button type="button" onClick={this.props.goToNextStep}>
                            next
                        </button>
                    </div>
                </form>
            </div>
        )
    }
});

module.exports = MarketCreateStep3;