let React = require("react");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");
let _ = require("lodash");
let moment = require("moment");
let Link = require("react-router/lib/components/Link");
let OutcomeRow = require("./OutcomeRow");

let MarketRow = React.createClass({

    mixins: [FluxMixin, StoreWatchMixin("market")],

    getInitialState() {
        return {};
    },

    getStateFromFlux: function () {
        return {};
    },


    render() {
        let market = this.props.market;
        let endDateLabel = (market.endDate != null && market.matured) ? 'Matured' : 'End Date';
        let endDateFormatted = market.endDate != null ? moment(market.endDate).format('MMM Do, YYYY') : '-';

        var tags = [];
        if (market.metadata && market.metadata.tags && market.metadata.tags.length) {
            console.log("tags:", market.metadata.tags);
            for (var i = 0, n = market.metadata.tags.length; i < n; ++i) {
                tags.push(<span className="tag">{market.metadata.tags[i]}</span>);
            }
        }

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
                        {tags}
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
                        <div className="table-container holdings">
                            <table className="tabular tabular-condensed">
                                <thead>
                                    <tr>
                                        <th colSpan="4">Your Trading [DUMMY]</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td className="title">Positions</td><td className="value">2</td>
                                        <td className="title">Trades</td><td className="value">8</td>
                                    </tr>
                                    <tr>
                                        <td className="title">Open Orders</td><td className="value">{ this.props.numOpenOrders }</td>
                                        <td className="title">Profit / Loss</td><td className="value"><span className={ Math.random() > 0.5 ? 'green' : 'red' }>+5.06%</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="buttons">
                    <Link className="btn btn-primary" to="market" params={{marketId: market.id.toString(16)}}>
                        Trade
                    </Link>
                </div>
            </div>
        );
    }
});

module.exports = MarketRow;