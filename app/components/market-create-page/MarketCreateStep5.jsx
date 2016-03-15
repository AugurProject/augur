let React = require("react");

let Modal = require("react-bootstrap/lib/Modal");
let Button = require("react-bootstrap/lib/Button");
let ProgressBar = require("react-bootstrap/lib/ProgressBar");

let MarketCreateStep5 = React.createClass({

    render() {
        let isRequestComplete = this.props.newMarketRequestComplete;
        return (
            <div>
                <h1>Market creation progress</h1>
                <p>
                    {this.props.newMarketRequestStatus}
                </p>
                <pre>
                    {JSON.stringify(this.props.newMarketRequestDetail, null, 2)}
                </pre>
                <ProgressBar
                    bsStyle={isRequestComplete ? "success" : null}
                    now={isRequestComplete ? 100 : 100 * (this.props.newMarketRequestStep / this.props.newMarketRequestStepCount)}
                    active={!isRequestComplete}
                    label={isRequestComplete ? "Complete" : `${this.props.newMarketRequestStep}/${this.props.newMarketRequestStepCount}`} />

                <button className="btn btn-primary" type="button" onClick={this.props.onMarketTypeChange}>
                    {/* todo: alter text based on success/fail */}
                    Start again
                </button>
            </div>
        );
    }
});

module.exports = MarketCreateStep5;