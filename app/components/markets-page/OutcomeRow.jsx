let React = require('react');
let utilities = require("../../libs/utilities");

const NO = 1;
const YES = 2;

let OutcomeRow = React.createClass({
    getPercentageFormatted(market, outcome) {
        let price = outcome.price;
        if (price == null) {
            return "0 %";
        }

        if (market.type === "scalar") {
            return +price.toFixed(2);
        } else {
            return +price.times(100).toFixed(1) + " %";
        }
    },
    render() {
        let outcome = this.props.outcome;
        let market = this.props.market;

        return (
            <tr className="asdf">
                <td>{ utilities.getOutcomeName(outcome.id, market).outcome }</td>
                <td>{ this.getPercentageFormatted(market, outcome) }</td>
                <td>{ outcome.price != null ? outcome.price.toFixed(2) : "-" }</td>
            </tr>
        );
    }
});

module.exports = OutcomeRow;