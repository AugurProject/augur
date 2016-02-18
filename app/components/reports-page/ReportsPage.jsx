let React = require("react");
let Link = require("react-router/lib/components/Link");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");

let BigNumber = require("bignumber.js");
let _ = require("lodash");

let ReportConfirmedModal = require("./ReportConfirmedModal");
let MarketRow = require("../markets-page/MarketRow");

var ReportsPage = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("asset", "branch", "config", "network", "report")],

    getStateFromFlux() {
        let flux = this.getFlux();

        let state = {
            account: flux.store("config").getAccount(),
            asset: flux.store("asset").getState(),
            blockNumber: flux.store("network").getState().blockNumber,
            branchState: flux.store("branch").getState(),
            events: flux.store("report").getState().eventsToReport
        };

        if (state.branchState.currentBranch) {
            state.report = flux.store("report").getReport(
                state.branchState.currentBranch.id,
                state.branchState.currentBranch.reportPeriod
            );
        }

        return state;
    },
    confirmReport() {
        console.log("ReportsPage: todo: confirm the report");
        this.props.toggleConfirmReportModal();
    },

    render() {
        return (
            <div>
                <h1>
                    Reporting
                </h1>

                <div className="row submenu">
                    <a className="collapsed" data-toggle="collapse" href="#collapseSubmenu"
                       aria-expanded="false"
                       aria-controls="collapseSubmenu">
                        <h2>Navigation</h2>
                    </a>

                    <div id="collapseSubmenu" className="col-xs-12 collapse" aria-expanded="false">
                        <ul className="list-group" role="tablist" id="tabpanel">
                            <li role="presentation" className={`list-group-item ${this.props.query.pending != null ? 'active' : ''}`}>
                                <Link to='reports' query={{pending: true}} role="tab" activeClassName="">
                                    Pending Reports
                                </Link>
                            </li>
                            <li role="presentation" className={`list-group-item ${this.props.query.committed != null ? 'active' : ''}`}>
                                <Link to="reports" query={{committed: true}} role="tab" activeClassName="">
                                    Pending Confirmations
                                </Link>
                            </li>
                            <li role="presentation" className={`list-group-item ${this.props.query.previous != null ? 'active' : ''}`}>
                                <Link to="reports" query={{previous: true}} role="tab" activeClassName="">
                                    Previous Reports
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12">
                        {
                            // I'm not sure about the iteration
                            this.state.events.map(event => {
                                let market = event.markets[0];
                                if (market == null) {
                                    return null;
                                }
                                return <MarketRow
                                    key={market.id}
                                    market={market}
                                    report={{ // dummy data to present interface
                                        // general info about report
                                        reportedOutcome: 1,
                                        isUnethical: true,

                                        // values needed for filling period
                                        isFillingPeriod: true,
                                        fillingPeriodEndMillis: 1000,

                                        // values needed for commit period
                                        confirmReport: this.confirmReport,
                                        isCommitPeriod: false,
                                        commitPeriodEndMillis: 1000 + 1000,
                                        isConfirmed: false
                                        // values needed for expired period
                                    }}
                                    />;
                            }, this)
                        }
                    </div>
                </div>
                <ReportConfirmedModal
                    show={this.props.reportConfirmedModalOpen}
                    onHide={this.props.toggleConfirmReportModal}/>
            </div>
        )
    }
});
module.exports = ReportsPage;