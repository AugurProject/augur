var _ = require("lodash");
var abi = require("augur-abi");
var React = require("react");
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require("react-bootstrap");
var utilities = require("../libs/utilities");
var constants = require("../libs/constants");
var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;

var NO = 1;
var YES = 2;

var priceToPercentage = function (price) {
    if (price) {
        return +price.times(100).toFixed(1);
    } else {
        return 0;
    }
};

var getOutcomeName = function (id, market) {
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
                    // console.error("categorical parse error:", market.description, exc);
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
};

var Overview = React.createClass({

    mixins: [FluxMixin],

    getInitialState: function () {
        return {
            pending: {},
            buyShares: false,
            sellShares: false
        }
    },

    componentWillReceiveProps: function (nextProps) {
        if (abi.number(this.props.outcome.sharesHeld) !== abi.number(nextProps.outcome.sharesHeld)) {
            this.setState({pendingShares: null});
        }
    },

    handleSellClick: function () {
        this.setState({sellShares: true});
    },

    handleBuyClick: function () {
        this.setState({buyShares: true});
    },

    handleCancel: function () {
        this.setState({
            buyShares: false,
            sellShares: false
        });
    },

    getTradeFunction: function (shares) {
        var flux = this.getFlux();
        return (shares < 0) ? flux.augur.sellShares : flux.augur.buyShares;
    },

    handleTrade: function (relativeShares) {
        var self = this;
        var flux = this.getFlux();
        var txhash;
        var marketId = this.props.market.id;
        var branchId = this.props.market.branchId;
        var outcomeId = this.props.outcome.id;
        this.getTradeFunction(relativeShares).call(flux.augur, {
            branchId: branchId,
            marketId: abi.hex(marketId),
            outcome: outcomeId,
            amount: Math.abs(relativeShares),
            nonce: null,
            limit: 0,
            onSent: function (res) {
                txhash = res.txHash;

                flux.actions.market.updatePendingShares(self.props.market, self.props.outcome.id, relativeShares);

                var newState = {
                    pending: self.state.pending,
                    buyShares: false,
                    sellShares: false
                };
                var oldPrice = self.getFlux().store("market").getMarket(
                    marketId
                ).outcomes[abi.number(outcomeId) - 1].price;
                newState.pending[res.txHash] = {
                    branchId: branchId,
                    marketId: marketId,
                    outcome: outcomeId,
                    oldPrice: oldPrice
                };
                self.setState(newState);
                console.log("trade sent:", res.txHash);
            },
            onSuccess: function (res) {
                console.log("trade succeeded:", res.txHash);
                self.getFlux().actions.market.tradeSucceeded(self.state.pending[res.txHash], marketId);
                var pending = self.state.pending;
                delete pending[res.txHash];
                self.setState({pending: pending})
            },
            onFailed: function (err) {
                console.error("trade failed:", err);
                var pending = self.state.pending;
                delete pending[txhash];
                self.setState({pending: pending})
            }
        });
    },
    getDescription(market, outcome) {
        let description;

        if (market.type !== "combinatorial") {
            // todo: this loop is strange but it was in code so maybe it's legit
            for (var i = 0; i < market.numEvents; ++i) {
                description = getOutcomeName(outcome.id, market.events[i]);
            }
        } else {
            description = getOutcomeName(outcome.id, this.props.market);
        }
        return description;
    },
    getPercentageFormatted(market, outcome) {
        let percentageFormatted;
        if (market.type !== "combinatorial") {
            // todo: this loop is strange but it was in code so maybe it's legit
            for (var i = 0; i < market.numEvents; ++i) {
                if (market.events[i].type === "scalar") {
                    percentageFormatted = +outcome.price.toFixed(2);
                } else {
                    percentageFormatted = priceToPercentage(outcome.price) + "%";
                }
            }
        } else {
            if (market.type === "scalar") {
                percentageFormatted = +outcome.price.toFixed(2);
            } else {
                percentageFormatted = priceToPercentage(outcome.price) + "%";
            }
        }
        return percentageFormatted;
    },

    render: function () {
        let description, percentageFormatted, costPerShareFormatted, sharesOutstandingFormatted;


        var buySellActions;
        var outcome = this.props.outcome;
        var className = 'outcome outcome-' + outcome.id;

        var market = this.props.market;
        if (market.matured || !this.props.account) {
            className += ' read-only';
        }

        description = this.getDescription(market, outcome);
        percentageFormatted = this.getPercentageFormatted(market, outcome);

        if (this.state.buyShares) {
            className += ' buy';
            buySellActions = (
                <Buy {...this.props} handleTrade={ this.handleTrade } handleCancel={ this.handleCancel }/>
            );

        } else if (this.state.sellShares) {
            className += ' sell';
            buySellActions = (
                <Sell {...this.props} handleTrade={ this.handleTrade } handleCancel={ this.handleCancel }/>
            );

        } else {
            let buyAction, sellAction;

            buyAction = (
                <Button bsStyle='success' onClick={ this.handleBuyClick }>Buy</Button>
            );
            var pendingShares = ( <span /> );

            if (!this.props.outcome.pendingShares.equals(0)) {

                var shares = this.props.outcome.pendingShares.toNumber();
                var sharesString = shares < 0 ? shares.toString() : '+' + shares;
                var color = shares < 0 ? 'red' : 'green';
                pendingShares = (
                    <b style={ {color: color} }>{ sharesString }</b>
                )
            }

            var sharesHeld = this.props.outcome.sharesHeld.toNumber();

            if (sharesHeld) {
                sellAction = (
                    <div>
                        <Button bsStyle='danger' onClick={ this.handleSellClick }>Sell</Button>
                        <span
                            className="shares-held btn">{ sharesHeld }{ pendingShares } { sharesHeld === 1 ? 'share' : 'shares' }
                            held</span>
                    </div>
                );

            } else if (!this.props.outcome.pendingShares.equals(0)) {
                sellAction = (
                    <span className="shares-held none">{ this.props.outcome.pendingShares.toNumber() } shares pending</span>
                );

            } else {
                sellAction = (
                    <span className="shares-held none">no shares held</span>
                );
            }

            buySellActions = (
                <div className="summary">
                    <div className="">
                        <div className='buy trade-button' style={{float: 'left'}}>
                            { buyAction }
                        </div>
                        <div className='sell trade-button' style={{float: 'right'}}>
                            { sellAction }
                        </div>
                    </div>
                    <p style={{clear: 'both'}}>
                        { Math.abs(outcome.price).toFixed(4) } cash/share
                    </p>

                    <p>{ +outcome.outstandingShares.toFixed(2) } shares outstanding</p>
                </div>
            );
        }

        return (
            <div className={className}>
                <h4>
                    {description.outcome} ({percentageFormatted})
                </h4>
                {buySellActions}
            </div>
        );
    }
});

/**
 * Common trading logic.
 *
 * Components that use this must implement:
 * - actionLabel
 * - getHelpText
 * - getSimulationFunction
 */
var TradeBase = {

    mixins: [FluxMixin],

    getInitialState: function () {
        return {
            simulation: null,
            inputError: null,
            value: ''
        }
    },

    handleChange: function () {
        var self = this;
        var flux = this.getFlux();
        var rawValue = this.refs.input.getValue();
        var numShares = abi.number(rawValue);

        this.setState({value: rawValue});
        this.setState({inputError: null});

        if (!numShares || numShares === '') {
            return this.setState({simulation: null});
        }
        self.getSimulationFunction().call(flux.augur,
            abi.hex(self.props.market.id),
            self.props.outcome.id,
            numShares,
            function (sim) {
                self.setState({
                    simulation: {
                        cost: abi.bignum(sim[0]),
                        newPrice: abi.bignum(sim[1])
                    }
                });
            }
        );
    },

    onSubmit: function (event) {
        event.preventDefault();
        var numShares = abi.number(this.state.value);

        if (typeof(numShares) !== 'number' || !numShares) {
            this.setState({inputError: 'Shares must be a numeric value'});
        } else if (this.state.simulation.cost > this.props.cashBalance) {
            this.setState({inputError: 'Cost of shares exceeds funds'});
        } else {
            var relativeShares = this.getRelativeShares();
            this.props.handleTrade(relativeShares);
        }
    },

    render: function () {

        var outcomeCount = this.props.market.outcomes.length;
        var outcome = this.props.outcome;

        var buttonStyle = this.actionLabel === 'Sell' ? 'danger' : 'success';
        var submit = (
            <Button bsStyle={ buttonStyle } type="submit">{ this.actionLabel }</Button>
        );
        var inputStyle = this.state.inputError ? 'error' : null;

        return (
            <div className="summary trade">
                <div className='buy trade-button'>
                    <form onSubmit={ this.onSubmit }>
                        <Input
                            type="text"
                            bsStyle={ inputStyle }
                            value={ this.state.value }
                            help={ this.getHelpText() }
                            ref="input"
                            placeholder='Shares'
                            onChange={ this.handleChange }
                            buttonAfter={ submit }
                            />
                    </form>
                </div>
                <div className='cancel trade-button'>
                    <Button bsStyle='default' onClick={ this.props.handleCancel } bsSize='small'>CANCEL</Button>
                </div>
                <p>{ Math.abs(outcome.price).toFixed(4) } cash/share</p>

                <p>{ outcome.sharesHeld.toNumber() } { outcome.sharesHeld.toNumber() === 1 ? 'share' : 'shares' }
                    held</p>

                <p className='new-price'>{ this.getPriceDelta() }</p>
            </div>
        );
    }
};

var Buy = React.createClass(_.merge({

    actionLabel: 'Buy',

    getHelpText: function () {
        var cost;
        if (this.state.simulation && this.state.simulation.cost) {
            cost = this.state.simulation.cost.toFixed(3);
        } else {
            cost = "error :(";
        }
        if (this.state.inputError) {
            return ( this.state.inputError );
        } else if (this.state.simulation) {
            return ( 'Cost: ' + cost );
        } else {
            return '';
        }
    },

    getPriceDelta: function () {
        if (!this.state.simulation) {
            return '';
        }
        var newPrice;
        if (this.props.market.type === "scalar") {
            newPrice = +this.state.simulation.newPrice.toFixed(2);
        } else {
            newPrice = priceToPercentage(this.state.simulation.newPrice) + "%";
        }
        return (
            <span>
        <i className='fa fa-chevron-up' style={{color: 'green'}}></i>
        <span className='new-price'>{newPrice}</span>
      </span>
        );
    },

    getRelativeShares: function () {
        return this.state.value;
    },

    getSimulationFunction: function () {
        return this.getFlux().augur.getSimulatedBuy;
    }

}, TradeBase));


var Sell = React.createClass(_.merge({

    actionLabel: 'Sell',

    getHelpText: function () {
        if (!this.state.simulation) {
            return '';
        }
        return (
            'Return: ' + this.state.simulation.cost.toFixed(3)
        );
    },

    getPriceDelta: function () {
        if (!this.state.simulation) {
            return '';
        }
        var newPrice;
        if (this.props.market.type === "scalar") {
            newPrice = +this.state.simulation.newPrice.toFixed(2);
        } else {
            newPrice = priceToPercentage(this.state.simulation.newPrice) + "%";
        }
        return (
            <span>
        <i className='fa fa-chevron-down' style={{color: 'red'}}></i>
        <span className='new-price'>{newPrice}</span>
      </span>
        );
    },

    getRelativeShares: function () {
        return this.state.value * -1;
    },

    getSimulationFunction: function () {
        return this.getFlux().augur.getSimulatedSell;
    }

}, TradeBase));

module.exports = {
    Buy: Buy,
    Sell: Sell,
    Overview: Overview
};
