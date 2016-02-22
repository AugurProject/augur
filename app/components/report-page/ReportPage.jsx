let React = require("react");
let BigNumber = require("bignumber.js");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");
let ReportFillForm = require("./ReportFillForm.jsx");
let ReportConfirmForm = require("./ReportConfirmForm.jsx");
let ReportSavedModal = require("./ReportSavedModal.jsx");
let ReportDetails = require("./ReportDetails.jsx");
let utilities = require("../../libs/utilities");

let ReportPage = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("branch", "market", "config", "report", "network")],

    getInitialState() {
        return {reportError: null};
    },

    getStateFromFlux() {
        let flux = this.getFlux();
        let account = flux.store("config").getAccount();
        let branch = flux.store("branch").getCurrentBranch();
        let blockNumber = flux.store("network").getState().blockNumber;
        let eventId;
        if (this.props.params && this.props.params.eventId) {
            eventId = this.props.params.eventId;
        } else {
            let pathname = window.location.pathname.split("/");
            eventId = pathname[pathname.length - 1];
        }
        let event = flux.store("report").getEvent(eventId);
        let market, reportedOutcome, isUnethical, report;
        if (event && event.markets && event.markets.length) {
            market = event.markets[0];
            report = flux.store("report").getReport(branch.id, branch.reportPeriod);
            if (report && report.reportedOutcome !== null && report.reportedOutcome !== undefined) {
                reportedOutcome = event.report.reportedOutcome;
                isUnethical = event.report.isUnethical;
            } else {
                report = flux.actions.report.loadReportFromLs(eventId);
                reportedOutcome = report.reportedOutcome;
                isUnethical = report.isUnethical;
            }
        }
        if (market) {
            if (branch && market.tradingPeriod &&
                branch.currentPeriod >= market.tradingPeriod.toNumber()) {
                market.matured = true;
            }
        }
        return {event, account, market, branch, blockNumber, report, reportedOutcome, isUnethical};
    },

    onReportFormSubmit(event) {
        event.preventDefault();
        if (this.state.reportedOutcome === null) {
            return this.setState({reportError: "you must choose something"});
        }
        this.setState({reportError: null});
        this.getFlux().actions.report.submitReportHash(
            this.state.branch.id,
            this.state.event.id,
            this.state.branch.reportPeriod,
            this.state.reportedOutcome,
            this.state.isUnethical
        );
        this.props.toggleReportSavedModal();
    },

    onConfirmFormSubmit(event) {
        event.preventDefault();
        let branchId, reportHash, reportPeriod, eventId, eventIndex;
        branchId = this.state.branch.id;
        reportHash = this.state.reportHash;
        reportPeriod = this.state.branch.reportPeriod;
        eventId = this.state.event.id;
        eventIndex = this.getFlux().augur.getEventIndex(reportPeriod, eventId);
        this.getFlux().actions.report.submitReport(branchId, reportHash, reportPeriod, eventId, eventIndex);
    },

    onReportedOutcomeChanged(event) {
        this.setState({reportedOutcome: event.target.value});
    },

    _onUnethicalChange(event) {
        this.setState({isUnethical: event.target.checked});
    },

    render() {
        if (this.state.account == null) {
            return <div>Only for logged-in users</div>;
        }
        let market = this.state.market;
        if (market == null) {
            return <div>No market found for this event</div>;
        }
        let blockNumber = this.state.blockNumber;
        let isReportCommitPeriod = this.getFlux().store("branch").isReportCommitPeriod(blockNumber);
        let isReportRevealPeriod = !isReportCommitPeriod;
        if (market.matured) {
            if (isReportCommitPeriod) {
                return (
                    <div>
                        <h1>Reporting the outcome of a market</h1>
                        <h2>Review the question and make your report</h2>
                        <ReportFillForm onReportFormSubmit={this.onReportFormSubmit}
                            onUnethicalChange={this._onUnethicalChange}
                            onReportedOutcomeChanged={this.onReportedOutcomeChanged}
                            reportedOutcome={this.state.reportedOutcome}
                            isUnethical={this.state.isUnethical}
                            reportError={this.state.reportError}
                            market={market} />
                        <ReportDetails market={market} />
                        <ReportSavedModal
                            reportedOutcomeName={this.state.reportedOutcome != null ? utilities.getOutcomeName(this.state.reportedOutcome, market).outcome : "none"}
                            isUnethical={this.state.isUnethical}
                            show={this.props.reportSavedModalOpen}
                            onHide={this.props.toggleReportSavedModal} />
                    </div>
                );
            } else if (isReportRevealPeriod) {
                if (this.state.reportedOutcome == null) {
                    return (
                        <div>You did not report an outcome</div>
                    );
                } else {
                    return (
                        <div>
                            <h1>Reporting the outcome of a market</h1>
                            <h2>Confirm your reported outcome</h2>
                            <ReportConfirmForm
                                onConfirmFormSubmit={this.onConfirmFormSubmit}
                                market={market}
                                reportedOutcome={this.state.reportedOutcome}
                                isUnethical={this.state.isUnethical} />
                        </div>
                    );
                }
            } else {
                return (
                    <div>
                        <h1>Reporting details</h1>
                        <ReportDetails market={market} />
                    </div>
                )
            }
        } else {
            <div>
                <h1>Event not ready for Reporting</h1>
                <ReportDetails market={market} />
            </div>
        }
    }
});

module.exports = ReportPage;
