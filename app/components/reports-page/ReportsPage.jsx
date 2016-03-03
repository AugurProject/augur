let React = require("react");
let Link = require("react-router/lib/components/Link");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");
let BigNumber = require("bignumber.js");
let _ = require("lodash");
let clone = require("clone");
let moment = require("moment");
let MarketRow = require("../markets-page/MarketRow");
let utils = require("../../libs/utilities");
let constants = require("../../libs/constants");

let ReportsPage = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("asset", "branch", "config", "network", "report")],

    getStateFromFlux() {
        let flux = this.getFlux();
        let blockNumber = flux.store("network").getState().blockNumber;
        console.log("blockNumber:", blockNumber);
        let state = {
            account: flux.store("config").getAccount(),
            asset: flux.store("asset").getState(),
            blockNumber: blockNumber,
            currentBranch: flux.store("branch").getCurrentBranch(),
            events: flux.store("report").getState().eventsToReport,
            isCommitPeriod: flux.store("branch").isReportCommitPeriod(blockNumber)
        };
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
                report.isCommitPeriod = isCommitPeriod;
                report.isRevealPeriod = isRevealPeriod;
                report.confirmReport = this.confirmReport;
                report.isConfirmed = report.submitReport;
                report.commitPeriodEndMillis = commitPeriodEndMillis;
                report.revealPeriodEndMillis = revealPeriodEndMillis;
                console.log("commit period:", commitPeriodEndMillis);
                console.log("reveal period:", revealPeriodEndMillis);
                marketRows.push(
                    <MarketRow
                        key={event.id + "-" + market._id}
                        market={market}
                        report={report}
                        account={account} />
                );
            }
        }
        return (
            <div>
                <h1>Reporting</h1>
                {/*<div className="row submenu">
                    <a className="collapsed"
                       data-toggle="collapse"
                       href="#collapseSubmenu"
                       aria-expanded="false"
                       aria-controls="collapseSubmenu">
                        <h2>Navigation</h2>
                    </a>
                    <div id="collapseSubmenu"
                         className="col-xs-12 collapse"
                         aria-expanded="false">
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
                    </div>
                </div>*/}
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
