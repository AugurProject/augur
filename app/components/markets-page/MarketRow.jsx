let React = require('react');

let _ = require("lodash");
let moment = require("moment");

let Link = require("react-router/lib/components/Link");

let Collapse = require('react-bootstrap/lib/Collapse');
let Glyphicon = require('react-bootstrap/lib/Glyphicon');

let OutcomeRow = require("./OutcomeRow");

let MarketRow = React.createClass({
    getInitialState() {
        return {
            isOutcomeTableOpen: false
        };
    },
    handleTitleClick(event) {
        this.setState({
            isOutcomeTableOpen: !this.state.isOutcomeTableOpen
        });
    },
    render() {
        let market = this.props.market;
        let endDateLabel = (market.endDate != null && market.matured) ? 'matured' : 'ends';
        let endDateFormatted = market.endDate != null ? moment(market.endDate).format('MMM Do, YYYY') : '-';

        let outcomeRows;

        let tableRows = [];
        let tHRow;
        if (this.props.contentType === "holdings") {
            tHRow = (
                <tr key={`th-${market._id}`}>
                    <th>Outcome</th>
                    <th>Probability</th>
                    <th>Last Trade</th>
                    <th>Shares held</th>
                    <th>Potential P/L</th>
                </tr>
            );
        } else {
            tHRow = (
                <tr key={`th-${market._id}`}>
                    <th>Outcome</th>
                    <th>Probability</th>
                    <th>Last Trade</th>
                </tr>
            );
        }

        if (market.type == "combinatorial") {
            outcomeRows = (<tr key={market._id}><td colSpan="5">todo</td></tr>);
        } else {
            let outcomes;
            if (this.props.contentType === "holdings") {
                outcomes = _.filter(market.outcomes, outcome => outcome.sharesHeld && outcome.sharesHeld.toNumber() > 0);
            } else {
                outcomes = market.outcomes;
            }
            outcomeRows = outcomes.map((outcome) => {
                return <OutcomeRow key={`${market._id}-${outcome.id}`} outcome={outcome} market={market} contentType={this.props.contentType} />;
            }, this);
        }

        tableRows.push(tHRow);
        tableRows = tableRows.concat(outcomeRows);

        return (
            <div className="marketRow">
                <div className="row">
                    <div className="col-xs-12">
                        <div className="marketRow-title">
                            <h4 onClick={this.handleTitleClick} className="pointer">
                                <Glyphicon glyph={this.state.isOutcomeTableOpen ? "chevron-down" : "chevron-right"}/>
                                {market.description}
                            </h4>
                            <Link className="btn btn-primary" to="market" params={{marketId: market.id.toString(16)}}>
                                Trade
                            </Link>
                            <div className="clearfix"></div>
                        </div>
                        <p className="marketRow-subtitle clearfix">
                            {market.tradingFee ? +market.tradingFee.times(100).toFixed(2) + '%' : '-'} fee, {endDateLabel} {endDateFormatted}
                        </p>
                    </div>
                </div>
                <Collapse in={this.state.isOutcomeTableOpen}>
                    <div className="row">
                        <div className="col-sm-7">
                            <table className="marketRow-outcomes table">
                                <tbody>
                                    { tableRows }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Collapse>
                <div className="clearfix"></div>
            </div>
        );
    }
});

module.exports = MarketRow;