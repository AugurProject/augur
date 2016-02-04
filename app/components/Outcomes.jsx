var _ = require("lodash");
var abi = require("augur-abi");
var React = require("react");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");
var utilities = require("../libs/utilities");
var constants = require("../libs/constants");
let Input = require('react-bootstrap/lib/Input');
let Button = require('react-bootstrap/lib/Button');

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
        this.setState({buyShares: false, sellShares: false});
    },

    handleTrade: function (relativeShares, limit) {
        var self = this;
        var flux = this.getFlux();
        var txhash;
        var marketId = this.props.market.id;
        var branchId = this.props.market.branchId;
        var outcomeId = this.props.outcome.id;
        var limit = (limit === '') ? 0 : abi.string(limit);
        flux.augur.trade({
            branch: branchId,
            market: abi.hex(marketId),
            outcome: outcomeId,
            amount: relativeShares,
            limit: limit,
            stop: !!limit,
            expiration: 0,
            callbacks: {
                onMarketHash: function (marketHash) {
                    console.debug("marketHash:", marketHash);
                },
                onCommitTradeSent: function (res) {
                    console.debug("commit trade:", res);
                    flux.actions.market.updatePendingShares(
                        self.props.market,
                        self.props.outcome.id,
                        relativeShares
                    );
                    var newState = {
                        pending: self.state.pending,
                        buyShares: false,
                        sellShares: false
                    };
                    var oldPrice = flux.store("market").getMarket(
                        marketId
                    ).outcomes[abi.number(outcomeId) - 1].price;
                    newState.pending[res.txHash] = {
                        branchId: branchId,
                        marketId: marketId,
                        outcome: outcomeId,
                        oldPrice: oldPrice
                    };
                    self.setState(newState);
                },
                onCommitTradeSuccess: function (res) {
                    console.info("trade committed:", res.txHash);
                },
                onCommitTradeFailed: function (err) {
                    console.error("commit trade failed:", err);
                    var pending = self.state.pending;
                    delete pending[txhash];
                    self.setState({pending: pending})
                },
                onNextBlock: function (blockNumber) {
                    console.debug("got next block:", blockNumber);
                },
                onTradeSent: function (res) {
                    console.debug("trade:", res);
                },
                onTradeSuccess: function (res) {
                    console.info("trade succeeded:", res.txHash);
                    flux.actions.market.tradeSucceeded(self.state.pending[res.txHash], marketId);
                    var pending = self.state.pending;
                    delete pending[res.txHash];
                    self.setState({pending: pending})
                },
                onTradeFailed: function (err) {
                    console.error("trade failed:", err);
                    var pending = self.state.pending;
                    delete pending[txhash];
                    self.setState({pending: pending})
                },
                onOrderCreated: function (orders) {
                    self.setState({buyShares: false, sellShares: false});
                    flux.actions.market.updateOrders(orders);
                }
            }
        });
    },
    getDescription(market, outcome) {
        return getOutcomeName(outcome.id, this.props.market);
    },
    getPercentageFormatted(market, outcome) {
        let percentageFormatted;
        if (market.type === "scalar") {
            percentageFormatted = +outcome.price.toFixed(2);
        } else {
            percentageFormatted = priceToPercentage(outcome.price) + "%";
        }
        return percentageFormatted;
    },

    render: function () {
        let description, percentageFormatted, costPerShareFormatted, sharesOutstandingFormatted;


        var buySellActions;
        var outcome = this.props.outcome;
        var className = 'outcome outcome-' + outcome.id;

        var market = this.props.market;
        let isReadOnly = market.matured || !this.props.account;
        if (isReadOnly) {
            className += ' read-only';
        }

        description = this.getDescription(market, outcome);
        percentageFormatted = this.getPercentageFormatted(market, outcome);

        if (this.state.buyShares && !isReadOnly) {
            className += ' buy';
            buySellActions = (
                <Buy {...this.props} handleTrade={ this.handleTrade } handleCancel={ this.handleCancel }/>
            );

        } else if (this.state.sellShares && !isReadOnly) {
            className += ' sell';
            buySellActions = (
                <Sell {...this.props} handleTrade={ this.handleTrade } handleCancel={ this.handleCancel }/>
            );

        } else {
            let buyAction, sellAction;

            if (!isReadOnly) {
                buyAction = (
                    <Button bsStyle='success' onClick={ this.handleBuyClick }>Buy</Button>
                );

                let pendingShares = this.props.outcome.pendingShares.toNumber();
                let pendingSharesNode;
                if (pendingShares != 0) {
                    let sharesWithSignFormatted = pendingShares < 0 ? pendingShares.toString() : '+' + pendingShares;
                    pendingSharesNode = (
                        <p>
                            { sharesWithSignFormatted } { pendingShares === 1 ? 'share ' : 'shares ' } pending
                        </p>
                    )
                }

                let sharesHeld = this.props.outcome.sharesHeld.toNumber();
                let sharesHeldNode;

                if (sharesHeld > 0) {
                    sharesHeldNode = (
                        <p className="shares-held">
                            { sharesHeld } { sharesHeld === 1 ? 'share ' : 'shares ' } held
                        </p>
                    );
                    sellAction = (
                        <div>
                            <Button bsStyle='danger' onClick={ this.handleSellClick }>Sell</Button>
                            { sharesHeldNode }
                            { pendingSharesNode }
                        </div>
                    );

                } else if (pendingShares != 0) {
                    sellAction = pendingSharesNode;

                } else {
                    sellAction = (
                        <span className="shares-held none">no shares held</span>
                    );
                }
            }

            buySellActions = (
                <div className="summary">
                    <div className="">
                        <div className='tradeAction tradeAction-buy'>
                            { buyAction }
                        </div>
                        <div className='tradeAction tradeAction-sell'>
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
            limitInputError: null,
            value: '',
            limit: ''
        }
    },

    handleChange: function () {
        var self = this;
        var flux = this.getFlux();
        var rawValue = this.refs.inputShares.getValue();
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

    handleLimitChange: function () {
        var limit = this.refs.inputLimit.getValue();
        this.setState({limit: limit});
        this.setState({limitInputError: null});
    },

    onSubmit: function (event) {
        event.preventDefault();
        var numShares = abi.number(this.state.value);
        var limitPrice = abi.number(this.state.limit);
        if (typeof(numShares) !== 'number' || !numShares) {
            this.setState({inputError: 'Shares must be a number'});
        } else if (this.state.simulation.cost > this.props.cashBalance) {
            this.setState({inputError: 'Cost of shares exceeds available funds'});
        } else {
            if (typeof(limitPrice) !== 'number' || !limitPrice) {
                this.setState({inputError: 'Limit price must be a number'});
            } else {
                this.props.handleTrade(this.getRelativeShares(), limitPrice);
            }
        }
    },

    render: function () {

        var outcomeCount = this.props.market.outcomes.length;
        var outcome = this.props.outcome;

        var buttonStyle = this.actionLabel === 'Sell' ? 'danger' : 'success';
        var submit = (
            <Button bsStyle={buttonStyle} type="submit">{this.actionLabel}</Button>
        );
        var inputStyle = this.state.inputError ? 'error' : null;

        return (
            <div className="summary trade">
                <div className='buy trade-button'>
                    <form onSubmit={this.onSubmit}>
                        <Input
                            type="text"
                            bsStyle={inputStyle}
                            value={this.state.value}
                            help={this.getHelpText()}
                            ref="inputShares"
                            placeholder="Shares"
                            onChange={this.handleChange}
                            buttonAfter={submit} />
                        <Input
                            type="text"
                            bsStyle={inputStyle}
                            value={this.state.limit}
                            // help="Specifying a price will create a Stop Order"
                            ref="inputLimit"
                            placeholder="Price (optional)"
                            onChange={this.handleLimitChange} />
                    </form>
                </div>
                <div className='cancel trade-button'>
                    <Button bsStyle='default' onClick={this.props.handleCancel} bsSize='small'>CANCEL</Button>
                </div>
                <p>{Math.abs(outcome.price).toFixed(4)} cash/share</p>
                <p>
                    {outcome.sharesHeld.toNumber()} {outcome.sharesHeld.toNumber() === 1 ? 'share ' : 'shares '} held
                </p>
                <p className='new-price'>{this.getPriceDelta()}</p>
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
