let React = require('react');

const NO = 1;
const YES = 2;

let OutcomeRow = React.createClass({
    getOutcomeName(outcomeId, market) {
        switch (market.type) {
            case "categorical":
                if (market && market.description && market.description.indexOf("Choices:") > -1) {
                    var desc = market.description.split("Choices:");
                    try {
                        return {
                            type: "categorical",
                            outcome: desc[desc.length - 1].split(",")[outcomeId - 1].trim()
                        };
                    } catch (exc) {
                        console.error("categorical parse error:", market.description, exc);
                    }
                }
                return {
                    type: "categorical",
                    outcome: outcomeId
                };
                break;
            case "scalar":
                return {
                    type: "scalar",
                    outcome: outcomeId === NO ? "⇩" : "⇧"
                };
                break;
            case "binary":
                return {
                    type: "binary",
                    outcome: outcomeId === NO ? "No" : "Yes"
                };
            default:
                console.error("unknown type:", market);
        }
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
            <tr className="asdf">
                <td>{ this.getOutcomeName(outcome.id, market).outcome }</td>
                <td>{ this.getPercentageFormatted(market, outcome) }</td>
                <td>{ outcome.price != null ? outcome.price.toFixed(2) : "-" }</td>
            </tr>
        );
    }
});

module.exports = OutcomeRow;