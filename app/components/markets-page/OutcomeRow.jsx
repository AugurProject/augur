let React = require('react');
let utilities = require("../../libs/utilities");

let abi = require("augur-abi");

const NO = 1;
const YES = 2;


module.exports = React.createClass({
    getInitialState() {
        return { potentialProfit: null };
    },

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
            <tr>
                <td>{ utilities.getOutcomeName(outcome.id, market).outcome }</td>
                <td>{ this.getPercentageFormatted(market, outcome) }</td>
            </tr>
        );
    }
});