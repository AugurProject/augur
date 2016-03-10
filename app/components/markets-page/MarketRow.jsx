let React = require("react");
let ReactDOM = require("react-dom");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");
let abi = require("augur-abi");
let _ = require("lodash");
let utilities = require("../../libs/utilities");
let moment = require("moment");
let Link = require("react-router/lib/components/Link");
let OutcomeRow = require("./OutcomeRow");
let MarketRowTour = require("./MarketRowTour");

/**
 * Represents detail of market in market lists.
 * This components behaves differently for different set of props passed to it (e.g. if you pass report, it displays
 * info about report, if you pass info about position (holdings) it displays info about position)
 */
let MarketRow = React.createClass({

    /**
     * Based on info about report returns correct JSX
     */
    getReportSection(report, market) {
        if (report == null) return null;

        let tableHeader, content, tableHeaderClass = "";
        if (report.isCommitPeriod) {
            let reportedOutcomeFmt;
            if (report.reportedOutcome == null) {
                tableHeader = "Please report outcome";
                reportedOutcomeFmt = "-";
            } else {
                tableHeaderClass = " holdings";
                tableHeader = "Outcome reported";
                if (market.type === "scalar") {
                    reportedOutcomeFmt = report.reportedOutcome;
                } else {
                    reportedOutcomeFmt = `${utilities.getOutcomeName(report.reportedOutcome, market).outcome} ${report.isUnethical ? "/ Unethical" : ""}`;
                }
            }
            content = (
                <tbody>
                    <tr className="labelValue">
                        <td className="labelValue-label outcome-name">Reported outcome</td>
                        <td className="labelValue-value change-percent">{reportedOutcomeFmt}</td>
                    </tr>
                    <tr className="labelValue">
                        <td className="labelValue-label outcome-name">Submission phase ends</td>
                        <td className="labelValue-value change-percent">{report.commitPeriodEndMillis.humanize(true)}</td>
                    </tr>
                </tbody>
            );
        } else if (report.isRevealPeriod) {
            tableHeader = report.isConfirmed ? "Report confirmed" : "Confirming report...";
            let reportedOutcomeFmt;
            if (report.reportedOutcome == null) {
                reportedOutcomeFmt = "-";
                tableHeader = "Report not submitted"
            } else {
                if (market.type === "scalar") {
                    reportedOutcomeFmt = report.reportedOutcome;
                } else {
                    reportedOutcomeFmt = `${utilities.getOutcomeName(report.reportedOutcome, market).outcome} ${report.isUnethical ? "/ Unethical" : ""}`;
                }
            }
            content = (
                <tbody>
                    <tr className="labelValue">
                        <td className="labelValue-label outcome-name">Reported outcome</td>
                        <td className="labelValue-value change-percent">{reportedOutcomeFmt}</td>
                    </tr>
                    <tr className="labelValue">
                        <td className="labelValue-label outcome-name">Confirmation period closes</td>
                        <td className="labelValue-value change-percent">{report.revealPeriodEndMillis.humanize(true)}</td>
                    </tr>
                </tbody>
            );
        } else {
            tableHeader = "Report summary";
            content = (
                <tbody>
                    <tr className="labelValue">
                        <td className="labelValue-label outcome-name">Reported outcome</td>
                        <td className="labelValue-value change-percent">{utilities.getOutcomeName(report.reportedOutcome, market).outcome} {report.isUnethical ? "/ Unethical" : ""}</td>
                        <td className="labelValue-label outcome-name">Fees</td>
                        <td className="labelValue-value change-percent">fees</td>
                    </tr>
                    <tr className="labelValue">
                        <td className="labelValue-label outcome-name">Consensus</td>
                        <td className="labelValue-value change-percent">consensus</td>
                        <td className="labelValue-label outcome-name">Reputation</td>
                        <td className="labelValue-value change-percent">reputation</td>
                    </tr>
                </tbody>
            );
        }

        return (
            <div className="table-container holdings">
                <div className="panelify-sideways warning">
                    <div className="title">{tableHeader}</div>
                    <div className="content">
                        <table className="holdings-table">
                            {content}
                        </table>
                    </div>
                </div>
            </div>
        );
    },

    getHoldingsSection(numOpenOrders, numPositions, numTrades, profitAndLoss, unrealizedProfitAndLoss) {
        if (numOpenOrders || numPositions || numTrades) {
            let pnl = {color: "green", text: profitAndLoss};
            let unrealizedPnl = {color: "green", text: unrealizedProfitAndLoss};
            if (abi.bignum(profitAndLoss).lt(abi.bignum(0))) pnl.color = "red";
            if (abi.bignum(unrealizedProfitAndLoss).lt(abi.bignum(0))) unrealizedPnl.color = "red";
            if (!numOpenOrders) numOpenOrders = 0;
            return (
                <div className="table-container holdings">
                    <div className="panelify-sideways success">
                        <div className="title">Your Trading</div>
                        <div className="content">
                            <table className="holdings-table">
                                <tbody>
                                    <tr className="labelValue">
                                        <td className="labelValue-label outcome-name">Positions</td>
                                        <td className="labelValue-value change-percent">{numPositions}</td>
                                        <td className="labelValue-label outcome-name">Trades</td>
                                        <td className="labelValue-value change-percent">{numTrades}</td>
                                    </tr>
                                    <tr className="labelValue">
                                        <td className="labelValue-label outcome-name">Profit / Loss</td>
                                        <td className="labelValue-value change-percent">
                                            <span className={pnl.color}>{pnl.text}</span>
                                        </td>
                                        <td className="labelValue-label outcome-name">Unrealized P/L</td>
                                        <td className="labelValue-value change-percent">
                                            <span className={unrealizedPnl.color}>{unrealizedPnl.text}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    },

    /**
     *
     */
    getClickableDescription(market, report) {
        if (report != null) {
            if (report.isCommitPeriod || report.isRevealPeriod) {
                return (
                    <Link to="report" params={{eventId: market.events[0].id.toString(16)}}>
                        {market.description}
                    </Link>
                );
            } else {
                return (
                    <Link to="report" params={{eventId: market.events[0].id.toString(16)}}>
                        {market.description}
                    </Link>
                );
            }
        }
        return (
            <Link to="market"
                params={{marketId: market.id.toString(16)}}>
                {market.description}
            </Link>
        );
    },

    /**
     *
     */
    getRowAction(market, report) {
        if (report != null) {
            if (report.isCommitPeriod) {
                return (
                    <Link
                        className="btn btn-primary"
                        to="report"
                        params={{eventId: market.events[0].id.toString(16)}}>
                        Report
                    </Link>
                );
            } else if (report.isRevealPeriod) {
                if (!report.isConfirmed) {
                    return (
                        <button className="btn btn-disabled">
                            Confirming Report...
                        </button>
                    )
                } else {
                    return null;
                }
            } else {
                return (
                    <Link
                        className="btn btn-primary"
                        to="report"
                        params={{eventId: market.events[0].id.toString(16)}}>
                        View Details
                    </Link>
                );
            }
        }

        return (
            <Link ref="tradeButton"
                className="btn btn-primary trade-button"
                to="market"
                params={{marketId: market.id.toString(16)}} >
                View Market
            </Link>
        );
    },

    render() {
        let market = this.props.market;
        let tourClass = (this.props.tour) ? " tour" : "";
        let endDateLabel = (market.endDate != null && market.matured) ? "Matured" : "End Date";
        let endDateFormatted = market.endDate != null ? moment(market.endDate).format("MMM D, YYYY") : "-";
        let tags = [];
        if (market.metadata && market.metadata.tags && market.metadata.tags.length) {
            for (var i = 0, n = market.metadata.tags.length; i < n; ++i) {
                if (market.metadata.tags[i] !== "") {
                    tags.push(
                        <span key={market._id + "-tag-" + i} className="tag">
                            {market.metadata.tags[i]}
                        </span>
                    );
                }
            }
        }
        let report = this.props.report;
        let reportSection = this.getReportSection(report, market);

        let numPositions = 0;
        let numTrades = 0;
        if (this.props.account) {
            if (market.trades) {
                for (var outcome in market.trades) {
                    if (!market.trades.hasOwnProperty(outcome)) continue;
                    numTrades += market.trades[outcome].length;
                }
            }
            for (var j = 0; j < market.numOutcomes; ++j) {
                if (abi.number(market.outcomes[j].shares[this.props.account])) {
                    ++numPositions;
                }
            }
        }
        let pnl = "0.00";
        let unrealizedPnl = "0.00";
        if (market) {
            if (market.pnl) pnl = market.pnl;
            if (market.unrealizedPnl) unrealizedPnl = market.unrealizedPnl;
        }

        let holdingsSection = <span />;
        if (!report) {
            holdingsSection = this.getHoldingsSection(
                this.props.numOpenOrders,
                numPositions,
                numTrades,
                pnl,
                unrealizedPnl
            );
        }
        let rowAction = this.getRowAction(market, report);
        let clickableDescription = this.getClickableDescription(market, report);
        return (
            <div className="market-row">
                <div className="title">
                    <h4 className={`description ${tourClass}`}>
                        {clickableDescription}
                    </h4>
                    {rowAction}
                </div>
                <div className="subtitle clearfix">
                    <div className="labelValue subtitle-group">
                        <i className="fa fa-bookmark-o" />
                        <span className="labelValue-label">
                            {utilities.getMarketTypeName(market)}
                            {" "}
                            ({market.numOutcomes } {utilities.singularOrPlural(market.numOutcomes, "outcome")})
                        </span>
                    </div>
                    <div className="labelValue subtitle-group">
                        <i className="fa fa-clock-o" />
                        <span className="labelValue-label end-date-label">{endDateLabel}: </span>
                        <span className="labelValue-value end-date">{endDateFormatted}</span>
                    </div>
                    <div className="labelValue subtitle-group">
                        <i className="fa fa-signal" style={{ transform: 'scaleX(-1)', fontSize: '0.8rem' }} />
                        <span className="labelValue-label trading-fee-label">Trading Fee: </span>
                        <span className="labelValue-value trading-fee">{market.tradingFee ? market.tradingFee.times(100).toFixed(1) + '%' : '-'}</span>
                    </div>
                </div>
                <div className="tags">
                    {tags}
                </div>
                <div className="details">
                    <div className="table-container outcomes">
                        <div className="panelify-sideways info">
                            <div className="title">Top Predictions</div>
                            <div className="content">
                                <table className="outcomes-table">
                                    <tbody>
                                        {market.outcomes.map((outcome) => {
                                            return (
                                                <OutcomeRow
                                                    key={`${market._id}-${outcome.id}`}
                                                    outcome={outcome}
                                                    market={market}
                                                    contentType={this.props.contentType} />
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {holdingsSection}
                    {reportSection}
                </div>
            </div>
        );
    },

    componentDidMount() {
console.log('**', this.props.isSiteLoaded);
        if (this.props.tour && this.props.market && this.refs.tradeButton && !localStorage.getItem("marketRowTourComplete") && !localStorage.getItem("tourComplete")) {
            try {
                MarketRowTour.show(this.props.market, ReactDOM.findDOMNode(this.refs.tradeButton));
                localStorage.setItem("marketRowTourComplete", true);
            } catch (e) {
                console.warn('MarketRow tour failed to open (caught): ', e.message);
            }
        }
    },

    componentWillUnmount() {
        MarketRowTour.hide();
    }
});

module.exports = MarketRow;
