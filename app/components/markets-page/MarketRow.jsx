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

let Shepherd = require("tether-shepherd");
let tour;

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

        let tableHeader, tableHeaderColSpan, content, tableHeaderClass = "";
        if (report.isCommitPeriod) {
            tableHeaderColSpan = 2;
            let reportedOutcomeFmt;
            if (report.reportedOutcome == null) {
                tableHeader = "Please report outcome";
                reportedOutcomeFmt = "-";
            } else {
                tableHeaderClass = " holdings";
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
            tableHeader = report.isConfirmed ? "Report confirmed" : "Confirming report...";
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
            <div className={"table-container" + tableHeaderClass}>
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
            if (report.isCommitPeriod) {
                return (
                    <Link to="report" params={{eventId: market.events[0].id.toString(16)}}>
                        {market.description}
                    </Link>
                );
            } else if (report.isRevealPeriod) {
                if (!report.isConfirmed) {
                    return (
                        <a href="#" onClick={report.confirmReport}>
                            {market.description}
                        </a>
                    )
                } else {
                    return null;
                }
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
                    return (
                        <button className="btn btn-disabled">
                            Report Complete
                        </button>
                    )
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

        let holdingsSection = this.getHoldingsSection(this.props.numOpenOrders, numPositions, numTrades, pnl, unrealizedPnl);
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
        var self = this;

        if (!this.props.tour || localStorage.getItem("tourMarketComplete") || localStorage.getItem("tourComplete")) {
            return;
        }

        localStorage.setItem("tourMarketComplete", true);

        let outcomes = this.props.market.outcomes;
        let outcomeNames = utilities.getOutcomeNames(this.props.market);

        Shepherd.once('cancel', () => localStorage.setItem("tourComplete", true));

        tour = new Shepherd.Tour({
            defaults: {
                classes: "shepherd-element shepherd-open shepherd-theme-arrows",
                showCancelLink: true
            }
        });

        // TODO add glowing border to current top market
        tour.addStep("markets-list", {
            title: "Welcome to the Augur beta test!",
            text: "<p>On Augur, you can trade the probability of any real-world event happening. (Note: from now until the end of the beta test, everything on Augur is just play money!  Please do <b>not</b> send real Ether to your Augur beta account.)<br /></p>"+
                "<p>In this market, you are considering:<br /><br /><b><i>" + this.props.market.description + "</i></b></p>",
            attachTo: ".market-row .description top",
            buttons: [{
                text: "Exit",
                classes: "shepherd-button-secondary",
                action: tour.cancel
            }, {
                text: "Next",
                action: tour.next
            }]
        });

        // TODO highlight outcome labels
        let outcomeList = "";
        for (let i = 0; i < outcomeNames.length; ++i) {
            outcomeList += "<li>" + outcomeNames[i] + " has a probability of " + utilities.getPercentageFormatted(this.props.market, outcomes[i]) + "</li>";
        }
        tour.addStep("outcomes", {
            text: "<p>This event has " + outcomeNames.length + " possible outcomes: " + outcomeNames.join(" or ") + "</p>" +
                "<p>According to the market:</p>"+
                "<ul class='tour-outcome-list'>" + outcomeList + "</ul>",
            attachTo: ".outcomes right",
            buttons: [{
                text: "Back",
                classes: "shepherd-button-secondary",
                action: tour.back
            }, {
                text: "Next",
                action: tour.next
            }]
        });

        // TODO highlight trade button
        tour.addStep("trade-button", {
            title: "What do you think?",
            text: "<p>" + this.props.market.description + " " + outcomeNames.join(" or ") + "?</p>"+
                "<p>If you feel strongly enough, put your money where your mouth is and trade it!</p>",
            attachTo: ".market-row .trade-button left",
            buttons: [{
                text: "Exit Tour",
                classes: "shepherd-button-secondary",
                action: tour.cancel
            }, {
                text: "Back",
                classes: "shepherd-button-secondary",
                action: tour.back
            }],
            when: {
                show: function() {
                    let el = ReactDOM.findDOMNode(self.refs.tradeButton);
                    el.className += ' btn-warning super-highlight';
                },

                hide: function() {
                    let el = ReactDOM.findDOMNode(self.refs.tradeButton);
                    if (el) {
                        el.className = el.className.replace(' btn-warning super-highlight', '');
                    }
                }
            },
            advanceOn: '.trade-button click'
        });

        setTimeout(() => tour.start(), 3000);
    },

    componentWillUnmount() {
        tour && tour.hide();
    }
});

module.exports = MarketRow;
