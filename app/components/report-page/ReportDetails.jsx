let React = require('react');

let moment = require("moment");


let ReportDetails = React.createClass({
    render() {
        let market = this.props.market;
        return (
            <div>
                <div>
                    <h2>
                        Market details
                    </h2>
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
                                <label>Expiry source</label>
                            </div>

                            <div className="col-sm-9">
                                <span className="form-control-static">
                                    expiry source
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-3">
                                <label>Further explanation</label>
                            </div>

                            <div className="col-sm-9">
                                <span className="form-control-static">
                                    Further explanation
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-3">
                                <label>Helpful links</label>
                            </div>

                            <div className="col-sm-9">
                                <span className="form-control-static">
                                    Helpful links
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h2>
                        Reporting details
                    </h2>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-3">
                                <label>Your report</label>
                            </div>

                            <div className="col-sm-9">
                                <span className="form-control-static">
                                    Your report
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-3">
                                <label>Report made</label>
                            </div>

                            <div className="col-sm-9">
                                <span className="form-control-static">
                                    Report made
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-3">
                                <label>Report made</label>
                            </div>

                            <div className="col-sm-9">
                                <span className="form-control-static">
                                    Report made
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-3">
                                <label>Fees</label>
                            </div>

                            <div className="col-sm-9">
                                <span className="form-control-static">
                                    Fees
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-3">
                                <label>Reputation adjustments</label>
                            </div>

                            <div className="col-sm-9">
                                <span className="form-control-static">
                                    Reputation adjustments
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
});

module.exports = ReportDetails;