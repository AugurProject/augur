let React = require('react');

let BigNumber = require("bignumber.js");

let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");

let ReportForm = require("./ReportForm.jsx");


module.exports = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('branch', 'market', 'config')],

    getInitialState() {
        return {
            reportedOutcome: null,
            isUnethical: null
        };
    },

    getStateFromFlux() {
        var flux = this.getFlux();

        let marketId = new BigNumber(this.props.params.marketId, 16);
        var state = {
            //account: flux.store('config').getAccount(),
            market: flux.store('market').getMarket(marketId),
            //asset: flux.store('asset').getState(),
            //blockNumber: flux.store('network').getState().blockNumber,
            branchState: flux.store('branch').getState(),
            //events: flux.store('report').getState().eventsToReport
        };

        if (state.branchState.currentBranch) {
            state.report = flux.store('report').getReport(
                state.branchState.currentBranch.id,
                state.branchState.currentBranch.reportPeriod
            );
        }

        return state;
    },

    _onReportFormSubmit(event) {
        event.preventDefault();
        let augur = this.getFlux().augur;

        var eventId = this.state.market.events[0].id;// is this right?
        let reportHash = augur.makeHash("salt", this.state.reportedOutcome, eventId);

        console.log("_onReportFormSubmit: reportHash: %o", reportHash);
        // todo: save to local storage

        this.getFlux().actions.report.saveReportHash(
            this.state.branchState.currentBranch.id,
            this.state.branchState.currentBranch.reportPeriod,
            orderedDecisions
        );
    },

    _onReportedOutcomeChanged(event) {
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
        let market = this.state.market;
        if (market == null) {
            return (
                <div>
                    No market
                </div>
            );
        }

        // todo: change this view based on state of report and user
        return (
            <div>
                <h1>
                    Reporting the outcome of a market
                </h1>

                <h2>
                    Review the question and make your report
                </h2>

                <ReportForm _onReportFormSubmit={this._onReportFormSubmit}
                            _onUnethicalChange={this._onUnethicalChange}
                            _onReportedOutcomeChanged={this._onReportedOutcomeChanged}
                            market={market}/>
            </div>
        )
    }
});