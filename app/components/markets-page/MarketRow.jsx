let React = require("react");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let _ = require("lodash");
let utilities = require("../../libs/utilities");
let moment = require("moment");
let Link = require("react-router/lib/components/Link");
let OutcomeRow = require("./OutcomeRow");

/**
 * Represents detail of market in market lists.
 * This components behaves differently for different set of props passed to it (e.g. if you pass report, it displays
 * info about report, if you pass info about position (holdings) it displays info about position)
 */
let MarketRow = React.createClass({

    mixins: [FluxMixin],

    getInitialState() {
        return {metadataTimer: null};
    },

    getStateFromFlux() {
        return {};
    },

    componentDidMount() {
        this.getMetadata();
    },

    getMetadata() {
        let market = this.props.market;
        if (this.state.metadataTimer) {
            clearTimeout(this.state.metadataTimer);
        }
        if (market && market.constructor === Object && market._id) {
            if (!market.metadata) {
                console.info("Loading metadata from IPFS...");
                return this.getFlux().actions.market.loadMetadata(market);
            }
        } else {
            this.setState({metadataTimer: setTimeout(this.getMetadata, 5000)});
        }
    },

    /**
     * Based on info about report returns correct JSX
     */
    getReportSection(report, market) {
        if (report == null) return null;

        let tableHeader, tableHeaderColSpan, content;
        if (report.isCommitPeriod) {
            tableHeaderColSpan = 2;
            let reportedOutcomeFmt;

            if (report.reportedOutcome == null) {
                tableHeader = "Please report outcome";
                reportedOutcomeFmt = "-";
            } else {
                tableHeader = "Outcome reported";
                reportedOutcomeFmt = `${utilities.getOutcomeName(report.reportedOutcome, market).outcome} ${report.isUnethical ? "/ Unethical" : ""}`;
            }

            content = (
                <tbody>
                    <tr>
                        <td>Reported outcome</td>
                        <td>{ reportedOutcomeFmt }</td>
                    </tr>
                    <tr>
                        <td>Reporting period closes</td>
                        <td>{ report.commitPeriodEndMillis.humanize(true) }</td>
                    </tr>
                </tbody>
            );
        } else if (report.isRevealPeriod) {
            tableHeaderColSpan = 2;
            tableHeader = report.isConfirmed ? "Report confirmed" : "Please confirm report";
            content = (
                <tbody>
                    <tr>
                        <td>Reported outcome</td>
                        <td>{utilities.getOutcomeName(report.reportedOutcome, market).outcome} { report.isUnethical ? "/ Unethical" : "" }</td>
                    </tr>
                    <tr>
                        <td>Confirmation period closes</td>
                        <td>{ report.revealPeriodEndMillis.humanize(true) }</td>
                    </tr>
                </tbody>
            );
        } else {
            tableHeaderColSpan = 4;
            tableHeader = "Report summary";
            content = (
                <tbody>
                    <tr>
                        <td>Reported outcome</td>
                        <td>{utilities.getOutcomeName(report.reportedOutcome, market).outcome} { report.isUnethical ? "/ Unethical" : "" }</td>
                        <td>Fees</td>
                        <td>fees</td>
                    </tr>
                    <tr>
                        <td>Consensus</td>
                        <td>consensus</td>
                        <td>Reputation</td>
                        <td>reputation</td>
                    </tr>
                </tbody>
            );
        }

        return (
            <div className="table-container">
                <table className="tabular tabular-condensed">
                    <thead>
                        <tr>
                            <th colSpan={tableHeaderColSpan}>
                                { tableHeader }
                            </th>
                        </tr>
                    </thead>
                    { content }
                </table>

            </div>
        );
    },
    getHoldingsSection(openOrdersCount) {
        if (openOrdersCount != null) {
            return <span />;
            /*<div className="table-container holdings">
                <table className="tabular tabular-condensed">
                    <thead>
                    <tr>
                        <th colSpan="4">Your Trading [DUMMY]</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr>
                        <td className="title">Positions</td>
                        <td className="value">2</td>
                        <td className="title">Trades</td>
                        <td className="value">8</td>
                    </tr>
                    <tr>
                        <td className="title">Open Orders</td>
                        <td className="value">{ openOrdersCount }</td>
                        <td className="title">Profit / Loss</td>
                        <td className="value"><span className={ Math.random() > 0.5 ? 'green' : 'red' }>+5.06%</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>*/
        } else {
            return null;
        }
    },

    /**
     *
     */
    getRowAction(market, report) {
        if (report != null) {
            if (report.isCommitPeriod) {
                return (
                    <Link className="btn btn-primary" to="report" params={{eventId: market.events[0].id.toString(16)}}>
                        Report
                    </Link>
                );
            } else if (report.isRevealPeriod) {
                if (!report.isConfirmed) {
                    return (
                        <button className="btn btn-primary" onClick={report.confirmReport}>
                            Confirm Report
                        </button>
                    )
                } else {
                    return null;
                }
            } else {
                return (
                    <Link className="btn btn-primary" to="report" params={{eventId: market.events[0].id.toString(16)}}>
                        View Details
                    </Link>
                );
            }
        }

        return (
            <Link className="btn btn-primary" to="market" params={{marketId: market.id.toString(16)}}>
                Trade
            </Link>
        );
    },
    render() {
        let market = this.props.market;
        let endDateLabel = (market.endDate != null && market.matured) ? 'Matured' : 'End Date';
        let endDateFormatted = market.endDate != null ? moment(market.endDate).format('MMM Do, YYYY') : '-';

        let report = this.props.report;
        let reportSection = this.getReportSection(report, market);
        let holdingsSection = this.getHoldingsSection(this.props.numOpenOrders);
        let rowAction = this.getRowAction(market, report);

        return (
            <div className="market-row">
                <div className="info">
                    <h4 className="description">
                        {market.description}
                    </h4>
                    <div className="subtitle">
                        <span className="subtitle-label trading-fee-label">Trading Fee:</span>
                        <span className="subtitle-value trading-fee">{ market.tradingFee ? +market.tradingFee.times(100).toFixed(2) + '%' : '-'}</span>

                        <span className="subtitle-label end-date-label">{ endDateLabel }:</span>
                        <span className="subtitle-value end-date">{ endDateFormatted }</span>
                    </div>
                    <div className="tags">
                        <span className="tag">politics</span>
                        <span className="tag">US Election</span>
                        <span className="tag">WORLD</span>
                    </div>
                    <div className="details">
                        <div className="table-container outcomes">
                            <table className="tabular tabular-condensed">
                                <thead>
                                    <tr>
                                        <th colSpan="3">Market Leaders</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { market.outcomes.map((outcome) => {
                                        return <OutcomeRow key={`${market._id}-${outcome.id}`} outcome={outcome} market={market} contentType={this.props.contentType} />;
                                    })}
                                </tbody>
                            </table>
                        </div>
                        { holdingsSection }
                        { reportSection }
                    </div>
                </div>

                <div className="buttons">
                    { rowAction }
                </div>
            </div>
        );
    }
});

module.exports = MarketRow;