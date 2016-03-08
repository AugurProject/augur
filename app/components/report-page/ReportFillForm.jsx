let React = require("react");
let BigNumber = require("bignumber.js");
let Input = require("react-bootstrap/lib/Input");
let utilities = require("../../libs/utilities");
let constants = require("../../libs/constants");
let moment = require("moment");
let classnames = require("classnames");

var ReportFillForm = React.createClass({

    getInitialState() {
        return {
            reportedOutcome: this.props.reportedOutcome || "",
            isUnethical: this.props.isUnethical || null,
            isIndeterminate: this.props.isIndeterminate || null
        };
    },

    onReportedOutcomeChanged(event) {
        let report = event.target.value;
        if (report !== null && report !== undefined) {
            if (report === constants.INDETERMINATE_OUTCOME && event.target.id === "indeterminate") {
                this.setState({isIndeterminate: true});
            }
            this.setState({reportedOutcome: report});
        }
        this.props.onReportedOutcomeChanged(event);
    },

    _getOutcomeOptions(outcomes, market) {
        let nameAttr = "reportedOutcome";
        let outcomeOptions;
        if (market.type === "scalar") {
            outcomeOptions = [];
            outcomeOptions.push(
                <Input type="text"
                       name={nameAttr}
                       placeholder="Event outcome"
                       value={this.state.reportedOutcome}
                       onChange={this.onReportedOutcomeChanged} />
            );
        } else {
            outcomeOptions = outcomes.map(outcome => {
                return (
                    <div key={outcome.id} className="form-horizontal col-sm-12">
                        <Input type="radio"
                               name={nameAttr}
                               value={outcome.id}
                               checked={this.state.reportedOutcome == outcome.id}
                               label={outcome.label}
                               onChange={this.onReportedOutcomeChanged} />
                    </div>
                );
            });
        }
        outcomeOptions.push(
            <div key="indeterminate" className="form-horizontal col-sm-12">
                <Input type="radio"
                       id="indeterminate"
                       name={nameAttr}
                       value={constants.INDETERMINATE_OUTCOME}
                       checked={this.state.reportedOutcome == constants.INDETERMINATE_OUTCOME}
                       label="Outcome is indeterminate"
                       onChange={this.onReportedOutcomeChanged} />
            </div>
        );
        return outcomeOptions;
    },

    onUnethicalChange(event) {
        this.setState({isUnethical: event.target.checked});
        this.props.onUnethicalChange(event);
    },

    onReportFormSubmit(event) {
        event.preventDefault();
        this.props.onReportFormSubmit(
            this.state.reportedOutcome,
            this.state.isUnethical,
            this.state.isIndeterminate
        );
    },

    render() {
        let market = this.props.market;
        let outcomeOptions = this._getOutcomeOptions(market.outcomes, market);
        return (
            <form onSubmit={this.onReportFormSubmit}>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-3">
                            <label>Question</label>
                        </div>
                        <div className="col-sm-9">
                            <div className="form-control-static">{market.description}</div>
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
                                {market.endDate != null ? moment(market.endDate).format("MMM D, YYYY") : "-"}
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
                            {outcomeOptions}
                            <span className="help-block">
                                {this.props.reportError}
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
                                       checked={this.state.isUnethical}
                                       onChange={this.onUnethicalChange}/>
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
        );
    }
});

module.exports = ReportFillForm;
