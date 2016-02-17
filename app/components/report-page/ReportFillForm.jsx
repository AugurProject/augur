let React = require('react');

let BigNumber = require("bignumber.js");
let utilities = require("../../libs/utilities");
let constants = require("../../libs/constants");
let moment = require("moment");
let classnames = require("classnames");

var ReportFillForm = React.createClass({
    _getOutcomeOptions(outcomes, market) {
        let nameAttr = "reportedOutcome";
        let outcomeOptions = outcomes.map(outcome => {
            let outcomeName = utilities.getOutcomeName(outcome.id, market).outcome;
            return (
                <div key={outcome.id}>
                    <label>
                        <input type="radio"
                               name={nameAttr}
                               value={outcome.id}
                               checked={this.props.reportedOutcome == outcome.id}
                               onChange={this.props.onReportedOutcomeChanged}/>
                        { outcomeName }
                    </label>
                </div>
            );
        });
        outcomeOptions.push(
            <div key="indeterminate">
                <label>
                    <input type="radio"
                           name={nameAttr}
                           value={constants.INDETERMINATE_OUTCOME}
                           checked={this.props.reportedOutcome == constants.INDETERMINATE_OUTCOME}
                           onChange={this.props.onReportedOutcomeChanged} />
                    Outcome is indeterminate
                </label>
            </div>
        );
        return outcomeOptions;
    },

    render() {
        let market = this.props.market;
        let outcomeOptions = this._getOutcomeOptions(market.outcomes, market);

        return (
            <form onSubmit={this.props.onReportFormSubmit}>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-3">
                            <label>Question</label>
                        </div>

                        <div className="col-sm-9">
                            <div className="form-control-static">{ market.description }</div>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-3">
                            <label>End date</label>
                        </div>

                        <div className="col-sm-9">
                            <span className="form-control-static">
                                { market.endDate != null ? moment(market.endDate).format('MMM Do, YYYY') : '-' }
                            </span>
                        </div>
                    </div>
                </div>
                <div className={classnames("form-group", {"has-error": this.props.reportError != null})}>
                    <div className="row">
                        <div className="col-sm-3">
                            <label>Report the outcome</label>
                        </div>

                        <div className="col-sm-9">
                            { outcomeOptions }
                            <span className="help-block">
                                { this.props.reportError }
                            </span>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-3">
                            <label htmlFor="isUnethical-input">
                                Is this question unethical?
                            </label>
                        </div>

                        <div className="col-sm-9">
                            <label className="checkbox-inline">
                                <input type="checkbox"
                                       id="isUnethical-input"
                                       name="isUnethical"
                                       checked={this.props.isUnethical}
                                       onChange={this.props.onUnethicalChange}/>
                                Yes, this question is unethical
                            </label>
                            <span className="help-block">
                                The consensus answer to this question will be over-ridden if the question is reported as
                                unethical by 60% (or more) of those reporting the outcome of this market.
                            </span>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-offset-3 col-sm-9">
                            <button className="btn btn-primary" type="submit">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
});

module.exports = ReportFillForm;