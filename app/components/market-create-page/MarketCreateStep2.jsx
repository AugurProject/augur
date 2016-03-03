let React = require('react');

let MarketCreateStep2 = React.createClass({
    render() {
        return (
            <div>
                step 2

                <button type="submit" onClick={this.props.goToPreviousStep}>
                    back
                </button>
                <button type="submit" onClick={this.props.goToNextStep}>
                    next
                </button>
            </div>
        )
    }
});

module.exports = MarketCreateStep2;