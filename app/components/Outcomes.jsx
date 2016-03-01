let _ = require("lodash");
let abi = require("augur-abi");
let React = require("react");
let utils = require("../libs/utilities");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");
let utilities = require("../libs/utilities");
let constants = require("../libs/constants");
let Input = require("react-bootstrap/lib/Input");
let Button = require("react-bootstrap/lib/Button");
let Collapse = require("react-bootstrap/lib/Collapse");
let Glyphicon = require("react-bootstrap/lib/Glyphicon");
let ProgressModal = require("./ProgressModal");

let NO = 1;
let YES = 2;

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
                steps: 5,
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
        var market = this.props.market;
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
                    self.updateProgressModal();
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
                    txhash = res.txHash;
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
                    newState.pending[res.txHash] = {
                        branchId: branchId,
                        marketId: marketId,
                        outcome: outcomeId
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
                        header: "Revealing Trade",
                        status: "Trade commitment confirmed. Sending trade...",
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
                onTradeSent: function (res) {
                    console.debug("trade sent:", res);
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
                    flux.actions.market.tradeSucceeded(marketId);
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
                    flux.actions.market.updateOrders(market, orders);
                }
            }
        });
    },

    render: function () {
        let description, percentageFormatted;

        let singInOrRegisterText = 'Sign in or register to ';

        var buySellActions;
        var outcome = this.props.outcome;
        var className = 'outcome outcome-' + outcome.id;

        var market = this.props.market;
        if (market.matured) {
            className += ' read-only';
        }

        description = outcome.label;
        percentageFormatted = utils.getPercentageFormatted(market, outcome);

        if (this.state.buyShares && !market.matured) {
            className += ' buy';
            buySellActions = (
                <Buy {...this.props}
                    handleTrade={ this.handleTrade }
                    handleCancel={ this.handleCancel } />
            );

        } else if (this.state.sellShares && !market.matured) {
            className += ' sell';
            buySellActions = (
                <Sell {...this.props}
                    handleTrade={ this.handleTrade }
                    handleCancel={ this.handleCancel } />
            );

        } else {
            let buyAction, sellAction;

            if (!market.matured) {
                buyAction = (
                    <Button
                        className="buy-button"
                        bsStyle='success'
                        onClick={ this.handleBuyClick }
                        disabled={ !this.props.account }
                        data-tooltip={ !this.props.account ? singInOrRegisterText + 'buy' : null }>Buy</Button>
                );

                let pendingShares = this.props.outcome.pendingShares.toNumber();
                let pendingSharesNode;
                if (pendingShares != 0) {
                    let sharesWithSignFormatted = pendingShares < 0 ? pendingShares.toString() : '+' + pendingShares;
                    pendingSharesNode = (
                        <p className="shares-pending">
                            { sharesWithSignFormatted } { pendingShares === 1 ? 'share ' : 'shares ' } pending
                        </p>
                    )
                }

                let sharesHeld = this.props.outcome.sharesHeld.toNumber();
                let sharesHeldNode;

                sellAction = (
                    <div>
                        <Button
                            className="sell-button"
                            bsStyle='danger'
                            onClick={ this.handleSellClick }
                            disabled={ !sharesHeld || !this.props.account}
                            data-tooltip={ !this.props.account ? singInOrRegisterText + 'sell' : !sharesHeld ? 'You have no shares to sell' : null }>Sell</Button>

                        <p className="shares-held">
                            { sharesHeld } { sharesHeld === 1 ? 'share ' : 'shares ' } held
                        </p>
                        { pendingSharesNode }
                    </div>
                );
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
                    <p className="cash-per-share" style={{clear: 'both'}}>
                        { utils.getOutcomePrice(outcome) } cash/share
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
            showStopOrder: false,
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
        this.debounceChange(numShares);
    },

    debounceChange: _.debounce(function (numShares) {
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
    }, 300),

    handleLimitChange: function () {
        var limit = this.refs.inputLimit.getValue();
        this.setState({
            limit: limit,
            limitInputError: null
        });
        if (this.state.cap !== '' && limit !== '') {
            this.checkCap(null, limit);
        }
    },

    checkCap: function (cap, limit) {
        var cap = cap || this.state.cap;
        var limit = limit || this.state.limit;
        var capInputError = this.state.capInputError;
        if (this.actionLabel === "Sell") {
            if (abi.number(limit) <= abi.number(cap)) {
                capInputError = "Minimum price must be lower than starting price";
            } else {
                capInputError = null;
            }
        } else {
            if (abi.number(limit) >= abi.number(cap)) {
                capInputError = "Maximum price must be higher than starting price";
            } else {
                capInputError = null;
            }
        }
        this.setState({capInputError: capInputError});
    },

    handleCapChange: function () {
        var cap = this.refs.inputCap.getValue();
        this.setState({cap: cap});
        if (cap !== '' && this.state.limit !== '') {
            this.checkCap(cap);
        }
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
            if (cap) {
                this.checkCap();
                if (this.state.capInputError !== null) return;
            }
            this.props.handleTrade(this.getRelativeShares(), limitPrice, cap);
        }
    },

    toggleStopOrder: function () {
        this.setState({showStopOrder: !this.state.showStopOrder});
    },

    render: function () {

        var outcomeCount = this.props.market.outcomes.length;
        var outcome = this.props.outcome;

        var submit = (
            <Button bsStyle={buttonStyle} type="submit">{this.actionLabel}</Button>
        );
        var inputStyle = this.state.inputError ? 'error' : null;
        var buttonStyle, pricePlaceholder, capPlaceholder, priceLabel, capLabel;
        if (this.actionLabel === "Sell") {
            buttonStyle = "danger";
            pricePlaceholder = "Starting price";
            capPlaceholder = "Min price";
            priceLabel = "Sell shares automatically at this price:";
            capLabel = "Lowest price you're willing to sell for (optional):";
        } else {
            buttonStyle = "success";
            pricePlaceholder = "Starting price";
            capPlaceholder = "Max price";
            priceLabel = "Buy shares automatically at this price:";
            capLabel = "Highest price you're willing to pay (optional):";
        }

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
                
                        <div onClick={this.toggleStopOrder} className="pointer">
                            <Glyphicon
                                glyph={this.state.showStopOrder ? "chevron-down" : "chevron-right"} />
                            <b> Create stop order</b>
                        </div>
                        <Collapse in={this.state.showStopOrder}>
                            <div className="row col-sm-12">
                                <Input
                                    type="text"
                                    label={priceLabel}
                                    labelClassName="stop-order-label"
                                    bsStyle={inputStyle}
                                    value={this.state.limit}
                                    ref="inputLimit"
                                    placeholder={pricePlaceholder}
                                    onChange={this.handleLimitChange} />
                                <Input
                                    type="text"
                                    label={capLabel}
                                    labelClassName="stop-order-label"
                                    bsStyle={inputStyle}
                                    value={this.state.cap}
                                    help={this.state.capInputError}
                                    bsStyle={this.state.capInputError ? "error" : null}
                                    ref="inputCap"
                                    placeholder={capPlaceholder}
                                    onChange={this.handleCapChange} />
                            </div>
                        </Collapse>
                    </form>
                </div>
                <div className='cancel trade-button'>
                    <Button className="btn-plain" onClick={this.props.handleCancel} bsSize='small'>
                        CANCEL
                    </Button>
                </div>
                <p>{ utils.getOutcomePrice(outcome) } cash/share</p>
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
            newPrice = utils.priceToPercent(this.state.simulation.newPrice);
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
            newPrice = utils.priceToPercent(this.state.simulation.newPrice);
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
