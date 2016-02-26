let React = require('react');
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let utilities = require("../../libs/utilities");

let abi = require("augur-abi");

const NO = 1;
const YES = 2;


module.exports = React.createClass({
    mixins: [FluxMixin],
    getInitialState() {
        return { potentialProfit: null };
    },

    getSimulationFunction: function (shares) {
        var augur = this.getFlux().augur;
        return ((shares > 0) ? augur.getSimulatedSell : augur.getSimulatedBuy)
            .bind(augur);
    },

    getPercentageFormatted(market, outcome) {
        let price = outcome.price;
        if (price == null) {
            return "0 %";
        }

        if (market.type === "scalar") {
            return +price.toFixed(2);
        } else {
            return +outcome.normalizedPrice.times(100).toFixed(1) + " %";
        }
    },

    componentDidMount() {
        if (this.props.contentType === "holdings") {
            let sharesHeld = this.props.outcome.sharesHeld.toNumber();
            let simulationFunction = this.getSimulationFunction(sharesHeld);
            let simulation = simulationFunction(
                this.props.market,
                this.props.outcome.id,
                sharesHeld
            );
            this.setState({potentialProfit: abi.number(simulation[0])});
        }
    },

    render() {
        let outcome = this.props.outcome;
        let market = this.props.market;

        if (this.props.contentType === "holdings") {
            return (
                <tr>
                    <td>{ utilities.getOutcomeName(outcome.id, market).outcome }</td>
                    <td>{ this.getPercentageFormatted(market, outcome) }</td>
                    <td>{ outcome.price != null ? outcome.price.toFixed(2) : "-" }</td>
                    <td>{ this.props.outcome.sharesHeld.toNumber() }</td>
                    <td>{ this.state.potentialProfit != null ? this.state.potentialProfit.toFixed(3) : "loading" }</td>
                </tr>
            );
        } else {
            return (
                <tr>
                    <td>{ utilities.getOutcomeName(outcome.id, market).outcome }</td>
                    <td>{ this.getPercentageFormatted(market, outcome) }</td>
                    <td>{ outcome.price != null ? outcome.price.toFixed(2) : "-" }</td>
                </tr>
            );
        }
    }
});