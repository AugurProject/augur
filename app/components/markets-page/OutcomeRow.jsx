let React = require('react');
let utilities = require("../../libs/utilities");

let abi = require("augur-abi");

const NO = 1;
const YES = 2;


var OutcomeRow = React.createClass({

    getInitialState() {
        return {potentialProfit: null};
    },

    render() {
        let outcome = this.props.outcome;
        let market = this.props.market;

        return (
            <tr className="labelValue">
                <td className="labelValue-label outcome-name">{ utilities.getOutcomeName(outcome.id, market).outcome }</td>
                <td className="labelValue-value change-percent">{ utilities.getPercentageFormatted(market, outcome) }</td>
                {/* TODO: make this functional, the data for this is not easily available yet
                 <td className="change-direction"><i className={ Math.random() > 0.5 ? 'green fa fa-play fa-rotate-270' : 'red fa fa-play fa-rotate-90' } /></td>
                 */}
            </tr>
        );
    }
});

module.exports = OutcomeRow;