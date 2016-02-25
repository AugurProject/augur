let _ = require("lodash");
let abi = require("augur-abi");
let React = require("react");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");
let utilities = require("../libs/utilities");
let constants = require("../libs/constants");
let Input = require('react-bootstrap/lib/Input');
let Button = require('react-bootstrap/lib/Button');
let ProgressModal = require("./ProgressModal");

let NO = 1;
let YES = 2;

var priceToPercentage = function (price) {
    if (price) {
        return +price.times(100).toFixed(1);
    } else {
        return 0;
    }
};

var Overview = React.createClass({

    mixins: [FluxMixin],

    getInitialState: function () {
        return {
            pending: {},
            buyShares: false,
            sellShares: false,
            progressModal: {
                open: false,
                status: "",
                header: "",
                detail: null,
                complete: null,
                steps: 6,
                step: 0
            }
        };
    },

    updateProgressModal: utilities.updateProgressModal,

    toggleProgressModal: function (event) {
        var progressModal = this.state.progressModal;
        progressModal.open = !progressModal.open;
        this.setState({progressModal: progressModal});
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

    handleTrade: function (relativeShares, limit, cap) {
        var self = this;
        var flux = this.getFlux();
        var txhash;
        var marketId = this.props.market.id;
        var branchId = this.props.market.branchId;
        var outcomeId = this.props.outcome.id;
        var limit = (limit === '') ? 0 : abi.number(limit);
        var stop = (limit) ? true : false;
        flux.augur.trade({
            branch: branchId,
            market: abi.hex(marketId),
            outcome: outcomeId,
            amount: relativeShares,
            limit: limit,
            stop: !!limit,
            cap: abi.number(cap),
            expiration: 0,
            callbacks: {
                onMarketHash: function (marketHash) {
                    console.debug("marketHash:", marketHash);
                    self.updateProgressModal({
                        header: "Committing to Trade",
                        status: "Trade commitment hash:<br /><small>" + marketHash + "</small>",
                        detail: {marketHash},
                        complete: false
                    });
                    self.toggleProgressModal();
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
                    self.updateProgressModal({
                        header: "Committing to Trade",
                        detail: res,
                        complete: false,
                        status: "Trade commitment sent. Waiting for confirmation..."
                    });
                },
                onCommitTradeSuccess: function (res) {
                    console.info("trade committed:", res.txHash);
                    self.updateProgressModal({
                        header: "Committing to Trade",
                        status: "Trade commitment confirmed. Waiting for next block...",
                        detail: res,
                        complete: false
                    });
                },
                onCommitTradeFailed: function (err) {
                    console.error("commit trade failed:", err);
                    var pending = self.state.pending;
                    delete pending[txhash];
                    self.setState({pending: pending});
                    self.updateProgressModal({
                        header: "Trade Failed",
                        status: "Your trade commitment could not be completed.",
                        detail: err,
                        complete: true
                    });
                },
                onNextBlock: function (blockNumber) {
                    console.debug("got next block:", blockNumber);
                    self.updateProgressModal({
                        header: "Committing to Trade",
                        status: "Block " + blockNumber + " arrived.",
                        detail: {blockNumber}
                    });
                },
                onTradeSent: function (res) {
                    console.debug("trade:", res);
                    self.updateProgressModal({
                        header: "Revealing Trade",
                        status: "Trade sent. Waiting for confirmation...",
                        detail: res,
                        complete: false
                    });
                },
                onTradeSuccess: function (res) {
                    var pending = self.state.pending;
                    delete pending[res.txHash];
                    self.setState({pending: pending});
                    self.updateProgressModal({
                        header: "Revealing Trade",
                        status: "Trade confirmed.<br />Your trade is complete! You can safely close this dialogue.",
                        detail: res,
                        complete: true
                    });
                    flux.actions.market.tradeSucceeded(self.state.pending[res.txHash], marketId);
                },
                onTradeFailed: function (err) {
                    var pending = self.state.pending;
                    delete pending[txhash];
                    self.setState({
                        pending: pending,
                        header: "Trade Failed",
                        tradeStatus: "Your trade could not be completed.",
                        detail: err,
                        complete: true
                    });
                },
                onOrderCreated: function (orders) {
                    self.setState({buyShares: false, sellShares: false});
                    flux.actions.market.updateOrders(orders);
                }
            }
        });
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

        description = outcome.label;
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
                <div>
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
            <div className={className + ' ' + this.props.className }>
                <h4 className="title">
                    {description} ({percentageFormatted})
                </h4>
                <div className="content">
                    {buySellActions}
                    <ProgressModal
                        backdrop="static"
                        show={this.state.progressModal.open}
                        numSteps={this.state.progressModal.steps}
                        step={this.state.progressModal.step}
                        header={this.state.progressModal.header}
                        status={this.state.progressModal.status}
                        detail={JSON.stringify(this.state.progressModal.detail, null, 2)}
                        complete={this.state.progressModal.complete}
                        onHide={this.toggleProgressModal} />
                    </div>
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
            capInputError: null,
            value: '',
            limit: '',
            cap: ''
        };
    },

    handleChange: function () {
        var rawValue = this.refs.inputShares.getValue();
        var numShares = abi.number(rawValue);
        this.setState({value: rawValue});
        this.setState({inputError: null});
        if (!numShares || numShares === '') {
            return this.setState({simulation: null});
        }
        var sim = this.getSimulationFunction().call(this.getFlux().augur,
            this.props.market,
            this.props.outcome.id,
            numShares
        );
        this.setState({
            simulation: {
                cost: abi.bignum(sim[0]),
                newPrice: abi.bignum(sim[1])
            }
        });
    },

    handleLimitChange: function () {
        var limit = this.refs.inputLimit.getValue();
        this.setState({limit: limit});
        this.setState({limitInputError: null});
    },

    handleCapChange: function () {
        var cap = this.refs.inputCap.getValue();
        this.setState({cap: cap});
        this.setState({capInputError: null});
    },

    onSubmit: function (event) {
        event.preventDefault();
        var numShares = abi.number(this.state.value);
        var limitPrice = abi.number(this.state.limit);
        var cap = abi.number(this.state.cap);
        if (typeof(numShares) !== 'number' || !numShares) {
            this.setState({inputError: 'Shares must be a number'});
        } else if (this.state.simulation.cost > this.props.cashBalance) {
            this.setState({inputError: 'Cost of shares exceeds available funds'});
        } else {
            limitPrice = (limitPrice === "") ? 0 : limitPrice;
            cap = (cap === "") ? 0 : cap;
            this.props.handleTrade(this.getRelativeShares(), limitPrice, cap);
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
            <div className="trade">
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
                            // use max price / min price instead?
                            placeholder="Price (optional)"
                            onChange={this.handleLimitChange} />
                        <Input
                            type="text"
                            bsStyle={inputStyle}
                            value={this.state.cap}
                            // help="Specifying a cap will create a Limit Order"
                            ref="inputCap"
                            placeholder="Cap (optional)"
                            onChange={this.handleCapChange} />
                    </form>
                </div>
                <div className='cancel trade-button'>
                    <Button bsStyle='plain' onClick={this.props.handleCancel} bsSize='small'>CANCEL</Button>
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
