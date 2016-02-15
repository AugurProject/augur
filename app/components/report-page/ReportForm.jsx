let React = require('react');

let BigNumber = require("bignumber.js");
let utilities = require("../../libs/utilities");
let moment = require("moment");

module.exports = React.createClass({
    _getOutcomeOptions(outcomes, market) {
        return outcomes.map(outcome => {
            let outcomeName = utilities.getOutcomeName(outcome.id, market).outcome;
            return (
                <label>
                    <input type="radio" name="reportedOutcome" value={outcome.id} key={outcome.id} onClick={this._onReportedOutcomeChanged}/>{ outcomeName }
                </label>
            );
        });
    },

    render() {
        let market = this.props.market;
        let outcomeOptions = this._getOutcomeOptions(market.outcomes, market);

        return (
            <form onSubmit={this.props._onReportFormSubmit}>
                <div className="form-group">
                    <label>Question</label>
                    <div className="form-control-static">{ market.description }</div>
                </div>
                <div className="form-group">
                    <label>End date</label>
                    <div className="form-control-static">{ market.endDate != null ? moment(market.endDate).format('MMM Do, YYYY') : '-' }</div>
                </div>
                <div className="form-group">
                    <label>Report the outcome</label>
                    <div>
                        { outcomeOptions }
                        <label>
                            <input type="radio" name="reportedOutcome" value="indeterminate" onClick={this.props._onReportedOutcomeChanged}/>
                            Outcome is indeterminate
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <label>
                        Is this question unethical?
                    </label>
                    <div>
                        <label className="checkbox-inline">
                            <input type="checkbox" name="isUnethical" onClick={this.props._onUnethicalChange}/>
                            Yes, this question is unethical
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <button className="btn btn-primary" type="submit">
                        Submit
                    </button>
                </div>
            </form>
        )
    }
});