let React = require("react");

let Link = require("react-router/lib/components/Link");
let Glyphicon = require("react-bootstrap/lib/Glyphicon");
let Collapse = require("react-bootstrap/lib/Collapse");
let ProgressBar = require("react-bootstrap/lib/ProgressBar");

let MarketCreateStep5 = React.createClass({

    getInitialState() {
        return {
            isDetailOpen: false
        }
    },
    onToggleDetailClick(event) {
        this.setState({
            isDetailOpen: !this.state.isDetailOpen
        });
    },
    getFinalAction() {
        if (!this.props.newMarketRequestComplete) {
            return null;
        }

        if (this.props.newMarketRequestSuccess) {
            return (
                <Link to="market" params={{marketId: this.props.newMarketId.toString(16)}}>
                    See the market
                </Link>
            );
        } else {
            return (
                <div className="form-group">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.props.goToPreviousStep}
                        >
                        Back
                    </button>
                    <button
                        type="button"
                        className="btn btn-warning"
                        onClick={this.props.sendNewMarketRequest}
                        >
                        Try again
                    </button>
                </div>
            );
        }
    },
    render() {
        let isRequestComplete = this.props.newMarketRequestComplete;

        return (
            <div>
                <h1>Creating market...</h1>
                <div className="row">
                    <div className="col-sm-4">
                        <ProgressBar
                            bsStyle={isRequestComplete ? "success" : null}
                            now={isRequestComplete ? 100 : 100 * (this.props.newMarketRequestStep / this.props.newMarketRequestStepCount)}
                            active={!isRequestComplete}
                            label={isRequestComplete ? "Complete" : `${this.props.newMarketRequestStep}/${this.props.newMarketRequestStepCount}`} />
                    </div>
                </div>
                <p>
                    <span dangerouslySetInnerHTML={{__html: this.props.newMarketRequestStatus}}>
                    </span>
                </p>
                <h4 className="pointer" onClick={this.onToggleDetailClick}>
                    Details
                    <Glyphicon
                        className="small"
                        glyph={this.state.isDetailOpen ? "chevron-down" : "chevron-right"}
                        style={{marginLeft: "5px"}}/>
                </h4>
                <Collapse in={this.state.isDetailOpen}>
                    <pre>
                        {JSON.stringify(this.props.newMarketRequestDetail, null, 2)}
                    </pre>
                </Collapse>

                { this.getFinalAction() }
            </div>
        );
    }
});

module.exports = MarketCreateStep5;