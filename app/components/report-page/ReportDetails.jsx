let React = require("react");
let moment = require("moment");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");

let ReportDetails = React.createClass({

    mixins: [FluxMixin, StoreWatchMixin("branch", "market", "network", "report")],

    getStateFromFlux() {
        let flux = this.getFlux();
        let branch = flux.store("branch").getCurrentBranch();
        let blockNumber = flux.store("network").getState().blockNumber;
        let pathname = window.location.pathname.split("/");
        let eventId = pathname[pathname.length - 1];
        return {branch, blockNumber};
    },

    render() {
        let market = this.props.market;
        let metadata = market.metadata || {};
        let links = [];
        if (metadata.links && metadata.links.constructor === Array) {
            for (var i = 0, n = metadata.links.length; i < n; ++i) {
                links.push(
                    <a key={"metadata-link-" + metadata.links[i]} href={metadata.links[i]}>
                        <li>{metadata.links[i]}</li>
                    </a>
                );
            }
        }
        return (
            <div>
                <div>
                    <h2>Market details</h2>
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
                                {market.endDate != null ? moment(market.endDate).format('MMM D, YYYY') : '-'}
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
                                    {metadata.source}
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
                                    {metadata.details}
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
                                    {links}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {/*<div>
                    <h2>Reporting details</h2>
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
                </div>*/}
            </div>
        );
    }
});

module.exports = ReportDetails;