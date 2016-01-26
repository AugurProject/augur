let React = require('react');

let _ = require("lodash");
let moment = require("moment");

let Link = require("react-router/lib/components/Link");

let OutcomeRow = require("./OutcomeRow");

let Market = React.createClass({
    render() {
        let market = this.props.market;
        let endDateLabel = (market.endDate != null && market.matured) ? 'matured' : 'ends';
        let endDateFormatted = market.endDate != null ? moment(market.endDate).format('MMM Do, YYYY') : '-';

        let outcomes;

        if (market.type == "combinatorial") {
            outcomes = (<tr><td colSpan="5">todo</td></tr>);
        } else {
            outcomes = _.map(market.outcomes, (outcome) => {
                return <OutcomeRow key={`${market._id}-${outcome.id}`} outcome={outcome} market={market} />;
            }, this);
        }

        return (
            <div className="market">
                <div className="col-xs-12">
                    <div>
                        <h4 style={{float: "left"}}>
                            {market.description}
                        </h4>
                        <Link to="market" params={{marketId: market.id.toString(16)}} style={{float: "right"}}>
                            Trade
                        </Link>
                        <div className="clearfix"></div>
                    </div>
                    <p className="clearfix">
                        {market.tradingFee ? +market.tradingFee.times(100).toFixed(2) + '%' : '-'} fee, {endDateLabel} {endDateFormatted}
                    </p>
                </div>
                <div className="col-sm-7">
                    <table className="table">
                        <tbody>
                            <tr>
                                <th>Outcome</th>
                                <th>Probability</th>
                                <th>Last Trade</th>
                                <th>Today</th>
                                <th>Shares Traded</th>
                            </tr>
                            { outcomes }
                        </tbody>
                    </table>
                </div>
                <div className="clearfix"></div>
            </div>
        );
    }
});

module.exports = Market;