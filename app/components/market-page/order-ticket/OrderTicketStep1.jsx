let React = require('react');
let Formsy = require('formsy-react');

var _ = require("lodash");
var Outcomes = require("../../Outcomes");

let SideInput = require('./SideInput.jsx');
let QuantityInput = require('./QuantityInput.jsx');
let ConfirmOrderInput = require('./ConfirmOrderInput.jsx');


let OrderTicketStep1 = React.createClass({
    onSubmit(...rest) {
        this.refs.orderForm.validateForm();
        this.props.onFormSubmit(...rest);
    },
    getOutcomeName(id, market) {
        switch (market.type) {
            case "categorical":
                if (market && market.description && market.description.indexOf("Choices:") > -1) {
                    var desc = market.description.split("Choices:");
                    try {
                        return {
                            type: "categorical",
                            outcome: desc[desc.length - 1].split(",")[id - 1].trim()
                        };
                    } catch (exc) {
                        console.error("categorical parse error:", market.description, exc);
                    }
                }
                return {
                    type: "categorical",
                    outcome: id
                };
                break;
            case "scalar":
                if (id === NO) return {type: "scalar", outcome: "⇩"};
                return {type: "scalar", outcome: "⇧"};
                break;
            case "binary":
                if (id === NO) return {type: "binary", outcome: "No"};
                return {type: "binary", outcome: "Yes"};
            default:
                console.error("unknown type:", market);
        }
    },
    priceToPercentage(price) {
        if (price) {
            return +price.times(100).toFixed(1);
        } else {
            return 0;
        }
    },

    /**
     * Copied from Market#render
     */
    render() {
        let style = {
            display: this.props.isVisible ? "" : "none"
        };

        let outcomes = [];
        var market = this.props.market;
        if (market.type === "combinatorial") {
            outcomes = (<span>todo</span>);
        } else {
            outcomes = _.map(market.outcomes, function (outcome) {
                return (
                    <div className="" key={outcome.id}>
                        <Outcomes.Overview
                            market={this.props.market}
                            outcome={_.clone(outcome)}
                            account={this.props.account}/>
                    </div>
                );
            }, this);
        }

        return (
            <div id="orderTicketCollapse" className="orderTicket-step collapse in collapsedOnMobile" style={style}>
                { outcomes }
            </div>

        );
    }
});

module.exports = OrderTicketStep1;