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
            // is this branch ever visited? Why have Outcomes.Overview and this?
            var events = market.events;
            outcomes = [];
            for (var i = 0, n = market.numEvents; i < n; ++i) {
                var eventSubheading = "";
                if (events[i].endDate) {
                    eventSubheading = "Resolves after " + events[i].endDate.format("MMMM Do, YYYY");
                } else {
                    eventSubheading = "Loading...";
                }
                var outcome = [];
                for (var j = 0, m = market.numOutcomes; j < m; ++j) {
                    // Event A
                    // [ ] Yes       [ ] No
                    // Event B
                    // [ ] Yes       [ ] No
                    var outcomeName = this.getOutcomeName(market.outcomes[j].id, events[i]);
                    var metalClass = (outcomeName.type === "categorical") ? "metal-categorical" : "";
                    var displayPrice;
                    if (events[i].type === "scalar") {
                        displayPrice = +market.outcomes[j].price.toFixed(2);
                    } else {
                        displayPrice = this.priceToPercentage(market.outcomes[j].price) + "%";
                    }
                    outcome.push(
                        <div className="col-sm-4" key={market._id+market.outcomes[j].id}>
                            <h4 className={"metal " + metalClass}>
                                <div className={outcomeName.type + " name"}>{outcomeName.outcome}</div>
                                <div className="price">{displayPrice}</div>
                            </h4>
                            <div className="summary">
                                <div className='buy trade-button'>
                                    <Button bsStyle='success'>Yes Plz</Button>
                                </div>
                                <p>{ Math.abs(market.outcomes[j].price).toFixed(4) } cash/share</p>

                                <p>{ +market.outcomes[j].outstandingShares.toFixed(2) } shares
                                    outstanding</p>
                            </div>
                        </div>
                    );
                }
                outcomes.push(
                    <div className="col-sm-12" key={events[i].id}>
                        <h3 className="event-description">{events[i].description}</h3>

                        <div className="subheading clearfix">
                            <span className="pull-left event-subheading">{eventSubheading}</span>
                        </div>
                        <div className="row event-outcomes">{outcome}</div>
                    </div>
                );
            }
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