let React = require('react');

let BigNumber = require("bignumber.js");
let utilities = require("../../libs/utilities");

let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");

let ReportFillForm = require("./ReportFillForm.jsx");
let ReportConfirmForm = require("./ReportConfirmForm.jsx");
let ReportSavedModal = require("./ReportSavedModal.jsx");
let ReportDetails = require("./ReportDetails.jsx");

var ReportPage = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('branch', 'market', 'config', 'report')],

    componentDidMount() {
      // usually this is recommended place where to perform initial calls, but I don't have account and market loaded
      // at this time and I don't know how to achieve this
      //this.getFlux().actions.report.loadReport(this.state.account, this.props.market.events[0].id);
    },

    getInitialState() {
        return {
            isReportSummaryLoading: false,
            reportedOutcome: null,
            isUnethical: null
        };
    },

    getStateFromFlux() {
        var flux = this.getFlux();

        let marketId = new BigNumber(this.props.params.marketId, 16);
        let market = flux.store('market').getMarket(marketId);
        let account = flux.store('config').getAccount();
        let currentBranch = flux.store('branch').getCurrentBranch();
        var state = {
            account,
            market,
            currentBranch,
            blockNumber: flux.store('network').getState().blockNumber
        };

        let reportStore = flux.store('report');
        if (market != null) {
            if (currentBranch && market.tradingPeriod &&
                currentBranch.currentPeriod >= market.tradingPeriod.toNumber()) {
                market.matured = true;
            }

            let eventId = market.events[0].id; // not sure whether correct
            let reportSummary = reportStore.getReportSummary(eventId);
            if (reportSummary === undefined) {
                if (!this.state.isReportSummaryLoading) {
                    this.setState({
                        isReportSummaryLoading: true
                    });
                    setTimeout(() => {
                        // this is hack because I don't know when else to call it. see also componentDidMount()
                        // without timeout:
                        // Uncaught Error: Cannot dispatch an action ('LOAD_REPORT_SUCCESS') while another
                        // action ('LOAD_MARKETS_SUCCESS') is being dispatched
                        this.getFlux().actions.report.loadReport(account, eventId);
                    }, 1);
                }
            } else {
                state.reportedOutcome = reportSummary.reportedOutcome;
                state.isUnethical = reportSummary.isUnethical;
                state.reportHash = reportSummary.reportHash;
            }
        }
        if (state.currentBranch) {
            state.report = reportStore.getReport(
                state.currentBranch.id,
                state.currentBranch.reportPeriod
            );
        }

        return state;
    },

    onReportFormSubmit(event) {
        event.preventDefault();
        if (this.state.reportedOutcome == null) {
            this.setState({
                reportError: "you must choose something"
            });
            return;
        }

        this.setState({
            reportError: null
        });

        let augur = this.getFlux().augur;

        let eventId = this.state.market.events[0].id;// is this right?
        let reportHash = augur.makeHash("salt", this.state.reportedOutcome, eventId);

        this.getFlux().actions.report.saveReport(
            this.state.account,
            eventId,
            reportHash,
            this.state.reportedOutcome,
            this.state.isUnethical
        );
        this.props.toggleReportSavedModal();
    },
    onConfirmFormSubmit(event) {
        event.preventDefault();

        let branchId, reportHash, reportPeriod, eventId, eventIndex;
        branchId = this.state.currentBranch.id;
        reportHash = this.state.reportHash;
        reportPeriod = this.state.currentBranch.reportPeriod;
        eventId = this.state.market.events[0].id;// is this right?
        eventIndex = this.getFlux().augur.getEventIndex(reportPeriod, eventId);

        this.getFlux().actions.report.submitReport(branchId, reportHash, reportPeriod, eventId, eventIndex);
    },

    onReportedOutcomeChanged(event) {
        this.setState({
            reportedOutcome: event.target.value
        });
    },
    _onUnethicalChange(event) {
        this.setState({
            isUnethical: event.target.checked
        });
    },

    render() {
        if (this.state.account == null) {
            return (
                <div>
                    Only for logged-in users
                </div>
            );
        }

        let market = this.state.market;
        if (market == null) {
            return (
                <div>
                    No report
                </div>
            );
        }

        let blockNumber = this.state.blockNumber;
        let periodLength = this.state.currentBranch.periodLength;
        let isFillingPeriod = !market.matured && ((blockNumber % periodLength) < (periodLength / 2)),
            isCommitPeriod = !market.matured && ((blockNumber % periodLength) >= (periodLength / 2));

        if (isFillingPeriod) {
            return (
                <div>
                    <h1>
                        Reporting the outcome of a market
                    </h1>

                    <h2>
                        Review the question and make your report
                    </h2>

                    <ReportFillForm onReportFormSubmit={this.onReportFormSubmit}
                                onUnethicalChange={this._onUnethicalChange}
                                onReportedOutcomeChanged={this.onReportedOutcomeChanged}
                                reportedOutcome={this.state.reportedOutcome}
                                isUnethical={this.state.isUnethical}
                                reportError={this.state.reportError}
                                market={market}/>
                    <ReportSavedModal
                        reportedOutcomeName={this.state.reportedOutcome != null ? utilities.getOutcomeName(this.state.reportedOutcome, market).outcome : "none"}
                        isUnethical={this.state.isUnethical}
                        show={this.props.reportSavedModalOpen}
                        onHide={this.props.toggleReportSavedModal} />
                </div>
            );
        } else if (isCommitPeriod) {
            if (this.state.reportedOutcome == null) {
                // todo: what to do here?
                return (
                    <div>
                        You didn't report any outcome
                    </div>
                );
            } else {
                return (
                    <div>
                        <h1>
                            Reporting the outcome of a market
                        </h1>

                        <h2>
                            Confirm your reported outcome
                        </h2>

                        <ReportConfirmForm
                            onConfirmFormSubmit={this.onConfirmFormSubmit}
                            market={market}
                            reportedOutcome={this.state.reportedOutcome}
                            isUnethical={this.state.isUnethical}
                            />
                    </div>
                );
            }
        } else {
            return (
                <div>
                        <h1>
                            Reporting details
                        </h1>

                        <ReportDetails
                            market={market}
                            />
                </div>
            )
        }
    }
});

module.exports = ReportPage;