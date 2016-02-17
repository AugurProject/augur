let React = require('react');

let moment = require("moment");
let utilities = require("../../libs/utilities");

let ReportConfirmForm = React.createClass({
    render() {
        let market = this.props.market;

        return (
            <form onSubmit={this.props.onConfirmFormSubmit}>
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
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-3">
                            <label>Reported outcome</label>
                        </div>
                        <div className="col-sm-9">

                            { utilities.getOutcomeName(this.props.reportedOutcome, market).outcome }
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-3">
                            <label htmlFor="isUnethical-input">
                                Reported as unethical?
                            </label>
                        </div>
                        <div className="col-sm-9">
                            { this.props.isUnethical ? "Yes" : "No" }
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-offset-3 col-sm-9">
                            <button className="btn btn-primary" type="submit">
                                Submit Report
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
});

module.exports = ReportConfirmForm;