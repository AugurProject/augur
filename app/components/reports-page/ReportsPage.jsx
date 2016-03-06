let React = require("react");
let Link = require("react-router/lib/components/Link");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");
let BigNumber = require("bignumber.js");
let _ = require("lodash");
let clone = require("clone");
let moment = require("moment");
let ProgressBar = require("react-bootstrap/lib/ProgressBar");
let MarketRow = require("../markets-page/MarketRow");
let utils = require("../../libs/utilities");
let constants = require("../../libs/constants");

let ReportsPage = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("asset", "branch", "config", "network", "report")],

    getStateFromFlux() {
        let flux = this.getFlux();
        let blockNumber = flux.store("network").getState().blockNumber;
        let state = {
            account: flux.store("config").getAccount(),
            asset: flux.store("asset").getState(),
            blockNumber: blockNumber,
            currentBranch: flux.store("branch").getCurrentBranch(),
            events: flux.store("report").getState().eventsToReport,
            isCommitPeriod: flux.store("branch").isReportCommitPeriod(blockNumber)
        };
        // console.log("blockNumber:", blockNumber, "(" + state.currentBranch.percentComplete + "%)");
        if (state.currentBranch && state.currentBranch.id) {
            state.report = flux.store("report").getReport(
                state.currentBranch.id,
                state.currentBranch.reportPeriod
            );
        }
        return state;
    },

    render() {
        let self = this;
        let account = this.state.account;
        let blockNumber = this.state.blockNumber;
        let isCommitPeriod = this.state.isCommitPeriod;
        let isRevealPeriod = !isCommitPeriod;
        let marketRows = [];
        if (this.state.currentBranch) {
            let periodLength = this.state.currentBranch.periodLength;
            let commitPeriodEndMillis = moment.duration(0);
            if (isCommitPeriod === true) {
                commitPeriodEndMillis = moment.duration(constants.SECONDS_PER_BLOCK * ((periodLength / 2) - (blockNumber % (periodLength / 2))), "seconds");
            }
            let revealPeriodEndMillis = moment.duration(constants.SECONDS_PER_BLOCK * (periodLength - (blockNumber % periodLength)), "seconds");
            for (let eventID in this.state.events) {
                if (!this.state.events.hasOwnProperty(eventID)) continue;
                let event = this.state.events[eventID];
                let market = event.markets[0];
                if (!market) continue;
                let report = clone(event.report);
                if (!report) report = {};
                report.isCommitPeriod = isCommitPeriod;
                report.isRevealPeriod = isRevealPeriod;
                report.confirmReport = this.confirmReport;
                report.isConfirmed = report.submitReport;
                report.commitPeriodEndMillis = commitPeriodEndMillis;
                report.revealPeriodEndMillis = revealPeriodEndMillis;
                // console.log("commit period:", commitPeriodEndMillis);
                // console.log("reveal period:", revealPeriodEndMillis);
                marketRows.push(
                    <MarketRow
                        key={event.id + "-" + market._id}
                        market={market}
                        report={report}
                        account={account} />
                );
            }
        }

        let percentComplete = 0;
        let phase = "Submission";
        let progressBarStyle = "info";
        if (this.state.currentBranch && this.state.currentBranch.percentComplete) {
            percentComplete = this.state.currentBranch.percentComplete;
            if (percentComplete > 50) {
                progressBarStyle = "warning";
                phase = "Confirmation";
            }
        }
        let periodLength = "";
        if (this.state.currentBranch && this.state.currentBranch.periodLength) {
            periodLength = this.state.currentBranch.periodLength.toFixed();
        }
        let reportPeriod = "";
        if (this.state.currentBranch && this.state.currentBranch.reportPeriod) {
            reportPeriod = this.state.currentBranch.reportPeriod.toFixed();
        }
        let branchId = "";
        if (this.state.currentBranch && this.state.currentBranch.id) {
            branchId = abi.hex(this.state.currentBranch.id);
        }
        let branchDescription = "";
        if (this.state.currentBranch && this.state.currentBranch.description) {
            branchDescription = this.state.currentBranch.description;
        }

        return (
            <div>
                <h1>Reporting</h1>
                <div className="row">
                    <div className="col-sm-12">
                        <h4>
                            <span className="branch-description">
                                {branchDescription}
                            </span>
                            <br />
                            <small>
                                {branchId} &middot; {periodLength} blocks/period
                            </small>
                        </h4>
                    </div>
                </div>
                <div className="col-sm-12">
                    <ProgressBar
                        now={percentComplete}
                        bsStyle={progressBarStyle}
                        // label={percentComplete.toFixed(2) + "%"}
                        // active={true}
                        className="loading-progress" />
                </div>
                <div className="col-sm-12">
                    <h4>
                        <span className="green">{phase}</span> phase of period <span className="blue">{reportPeriod}</span>
                    </h4>
                </div>
                {/*
                <nav className="row submenu">
                    <ul className="list-group" role="tablist" id="tabpanel">
                        <li role="presentation"
                            className={`list-group-item ${this.props.query.pending != null ? 'active' : ''}`}>
                            <Link to="reports"
                                query={{pending: true}}
                                role="tab"
                                activeClassName="">
                                Pending Reports
                            </Link>
                        </li>
                        <li role="presentation" className={`list-group-item ${this.props.query.committed != null ? 'active' : ''}`}>
                            <Link to="reports"
                                query={{committed: true}}
                                role="tab"
                                activeClassName="">
                                Pending Confirmations
                            </Link>
                        </li>
                        <li role="presentation"
                            className={`list-group-item ${this.props.query.previous != null ? 'active' : ''}`}>
                            <Link to="reports"
                                query={{previous: true}}
                                role="tab"
                                activeClassName="">
                                Previous Reports
                            </Link>
                        </li>
                    </ul>
                </nav>
                */}
                <div className="row">
                    <div className="col-xs-12">
                        {marketRows}
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = ReportsPage;
