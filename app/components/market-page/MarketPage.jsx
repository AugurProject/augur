let React = require("react");

let BigNumber = require("bignumber.js");
let abi = require("augur-abi");
let Fluxxor = require("fluxxor");
let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;
let Button = require("react-bootstrap/lib/Button");
let Collapse = require("react-bootstrap/lib/Collapse");
let Glyphicon = require("react-bootstrap/lib/Glyphicon");

let OrderTicket = require('./order-ticket/OrderTicket.jsx');
let UserOrders = require('./UserOrders.jsx');
let MarketInfo = require("./MarketInfo.jsx");
let StatsTab = require("./StatsTab");
let RulesTab = require("./RulesTab");
let UserTradesTab = require("./UserTradesTab");
let UserFrozenFundsTab = require("./UserFrozenFundsTab");
let CloseMarketModal = require("../CloseMarket");
let utils = require("../../libs/utilities");

let Shepherd = require("tether-shepherd");

let tour = new Shepherd.Tour({
    defaults: {
        classes: "shepherd-element shepherd-open shepherd-theme-arrows",
        showCancelLink: true
    }
});

let MarketPage = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("branch", "market", "config")],

    getInitialState() {
        return {
            image: null,
            priceHistoryTimeout: null,
            orderBookTimeout: null,
            addMarketModalOpen: false,
            metadataTimeout: null,
            showDetails: false
        };
    },

    getStateFromFlux() {
        let self = this;
        let flux = this.getFlux();
        let marketId = new BigNumber(this.props.params.marketId, 16);
        let market = flux.store("market").getMarket(marketId);
        let currentBranch = flux.store("branch").getCurrentBranch();
        let account = flux.store("config").getAccount();
        let handle = flux.store("config").getHandle();
        let blockNumber = flux.store("network").getState().blockNumber;
        var searchState = flux.store("search").getState();
        if (currentBranch && market && market.tradingPeriod &&
            currentBranch.currentPeriod >= market.tradingPeriod.toNumber()) {
            market.matured = true;
            if (currentBranch.reportPeriod > market.tradingPeriod.toNumber()) {
                market.closable = true;
            }
        }
        if (market && market.metadata && market.metadata.image) {
            if (!Buffer.isBuffer(market.metadata.image)) {
                market.metadata.image = new Buffer(market.metadata.image, "base64");
            }
            let blob = new Blob([market.metadata.image], {type: "image/png"});
            let reader = new FileReader();
            reader.onload = function (e) {
                self.setState({image: e.target.result});
            };
            reader.readAsDataURL(blob);
        }
        return {
            market,
            account,
            handle,
            blockNumber,
            tourMarketKey: abi.bignum(utils.getTourMarketKey(searchState.results))
        };
    },

    toggleDetails() {
        this.setState({showDetails: !this.state.showDetails});
    },

    toggleCloseMarketModal(event) {
        this.setState({closeMarketModalOpen: !this.state.closeMarketModalOpen});
    },

    render() {
        let market = this.state.market;

        if (market == null) {
            return (
                <div>No market info</div>
            );
        }
        let tags = [];
        if (market.metadata && market.metadata.tags && market.metadata.tags.length) {
            for (var i = 0, n = market.metadata.tags.length; i < n; ++i) {
                tags.push(
                    <span key={market._id + "-tag-" + i} className="tag">
                        {market.metadata.tags[i]}
                    </span>
                );
            }
        }
        let closeMarketButton = <span />;
        if (market.matured && market.closable && !market.closed) {
             closeMarketButton = (
                <div className="close-market">
                    <Button
                        bsSize="small"
                        bsStyle="info"
                        onClick={this.toggleCloseMarketModal}>
                        Close Market
                    </Button>
                </div>
            );
        }
        let details = <span />;
        let metadata = market.metadata || {};
        if (metadata.details) {
            details = (
                <p className="metadata-details">
                    {metadata.details}
                </p>
            );
        }
        let links = [];
        if (metadata.links && metadata.links.constructor === Array) {
            for (var i = 0, n = metadata.links.length; i < n; ++i) {
                links.push(
                    <li><a href={metadata.links[i]}>
                        {metadata.links[i]}
                    </a></li>
                );
            }
        }
        let image = <span />;
        // if (metadata.image) {
        //     image = <img className="metadata-image" src={this.state.image} />;
        // }

        return (
            <div className="marketPage">
                <h1>{ this.state.market.description }</h1>
                {image}
                <div className="tags">
                    {tags}
                </div>
                <OrderTicket market={this.state.market} account={this.state.account}/>
                <UserOrders market={this.state.market}/>

                <MarketInfo market={market} />

                {closeMarketButton}

                <div onClick={this.toggleDetails} className="pointer">
                    <Glyphicon
                        glyph={this.state.showDetails ? "chevron-down" : "chevron-right"} />
                    <b> Additional details</b>
                </div>
                <Collapse in={this.state.showDetails}>
                    <div className="row col-sm-12 additional-details">
                        <h4>Description</h4>
                        <div className="row col-sm-12">
                            {details}
                        </div>
                        <h4>Resources</h4>
                        <div className="row col-sm-12">
                            {links}
                        </div>
                    </div>
                </Collapse>

                <div role="tabpanel" style={{marginTop: '15px'}}>
                    <div className="row submenu">
                        <a className="collapsed" data-toggle="collapse" href="#collapseSubmenu" aria-expanded="false" aria-controls="collapseSubmenu">
                            <h2>Navigation</h2>
                        </a>

                        <div id="collapseSubmenu" className="col-xs-12 collapse" aria-expanded="false">
                            <ul className="list-group" role="tablist" id="tabpanel">
                                <li role="presentation" className="list-group-item active">
                                    <a role="tab" href="#statsTab" data-toggle="tab">Stats & Charts</a>
                                </li>
                                {/* TODO: implement
                                <li role="presentation" className="list-group-item">
                                    <a role="tab" href="#rulesTab" data-toggle="tab">Rules</a>
                                </li>
                                <li role="presentation" className="list-group-item">
                                    <a role="tab" href="#userTradesTab" data-toggle="tab">
                                        My Trades
                                    </a>
                                </li>
                                <li role="presentation" className="list-group-item">
                                    <a role="tab" href="#userFrozenFundsTab" data-toggle="tab">
                                        Frozen Funds
                                        <span ng-show="app.balance.eventMargin != null">
                                        (<span ng-bind="app.balance.eventMarginFormatted"></span>)
                                    </span>
                                    </a>
                                </li>
                                */}
                            </ul>
                        </div>
                    </div>

                    <div className="tab-content">
                        <div id="statsTab" className="tab-pane active" role="tabpanel">
                            <StatsTab
                                market={this.state.market}
                                blockNumber={this.state.blockNumber} />
                        </div>
                        {/*
                        <div id="rulesTab" className="tab-pane" role="tabpanel">
                            <RulesTab/>
                        </div>
                        <div id="userTradesTab" className="tab-pane" role="tabpanel">
                            <UserTradesTab/>
                        </div>
                        <div id="userFrozenFundsTab" className="tab-pane" role="tabpanel">
                            <UserFrozenFundsTab/>
                        </div>
                        */}
                    </div>
                </div>

                <CloseMarketModal
                    text="close market"
                    params={{market: market}}
                    show={this.state.closeMarketModalOpen}
                    onHide={this.toggleCloseMarketModal} />

            </div>
        );
    },

    componentDidMount() {
        this.getMetadata();
        this.checkOrderBook();
        this.getPriceHistory();

        this.stylesheetEl = document.createElement("link");
        this.stylesheetEl.setAttribute("rel", "stylesheet");
        this.stylesheetEl.setAttribute("type", "text/css");
        this.stylesheetEl.setAttribute("href", "/css/market-detail.css");
        document.getElementsByTagName("head")[0].appendChild(this.stylesheetEl);

        if (!this.state.tourMarketKey || !this.state.tourMarketKey.eq(this.state.market.id) || localStorage.getItem("tourTradeComplete") || localStorage.getItem("tourComplete")) {
            return;
        }
        localStorage.setItem("tourTradeComplete", true);

        let priceFormatted = this.state.market.price ? Math.abs(this.state.market.price).toFixed(3) : '-';
        let percentageFormatted = priceFormatted ? (priceFormatted * 100).toFixed(1) : '-';
        let outcomes = this.state.market.outcomes;
        let outcomeNames = utils.getOutcomeNames(this.state.market);

        Shepherd.once('cancel', () => {
            localStorage.setItem("tourComplete", true);
        });

        tour.addStep("outcome-price", {
            title: "Market price",
            text: "<div style='max-width:22rem;'><p>The current price of " + outcomeNames[0].toUpperCase() + " is " + priceFormatted + ".</p>"+
                "<p>That means people believe there is a " + percentageFormatted + "% chance that the answer to</p>"+
                "<p><i>" + this.state.market.description + "</i></p>"+
                "<p>will be " + outcomeNames[0].toUpperCase() + ".</p></div>",
            attachTo: ".labelValue-value right",
            buttons: [{
                text: "Exit",
                classes: "shepherd-button-secondary",
                action: tour.cancel
            }, {
                text: "Next",
                action: tour.next
            }]
        });

        tour.addStep("is-market-right", {
            title: "Is the market right?",
            text: "<p>Do you agree that the probability is " + percentageFormatted + "%, or should it be higher, or lower?</p>",
            buttons: [{
                text: "Back",
                classes: "shepherd-button-secondary",
                action: tour.back
            }, {
                text: "Next",
                action: tour.next
            }]
        });

        tour.addStep("believe-one", {
            title: "Lower",
            text: "<p>If you think it should be higher, buy some shares in the " + outcomeNames[0].toUpperCase() + "</p>",
            attachTo: ".outcome-" + outcomes[0].id + " .tradeAction-buy left",
            buttons: [{
                text: "Back",
                classes: "shepherd-button-secondary",
                action: tour.back
            }, {
                text: "Next",
                action: tour.next
            }]
        });

        tour.addStep("believe-two", {
            title: "Higher",
            text: "<p>If you think it should be lower, buy some shares in the " + outcomeNames[1].toUpperCase() + "</p>",
            attachTo: ".outcome-" + outcomes[1].id + "  .tradeAction-buy left",
            buttons: [{
                text: "Back",
                classes: "shepherd-button-secondary",
                action: tour.back
            }, {
                text: "Next",
                action: tour.next
            }]
        });

        tour.addStep("believe-either", {
            title: "Profit",
            text: "<p>Whichever position you take, you'll make money if you're right!</p>",
            buttons: [{
                text: "Done",
                action: tour.next
            }]
        });

        setTimeout(() => tour.start(), 1000);
    },

    componentWillUnmount() {
        this.stylesheetEl.remove();

        clearTimeout(this.state.priceHistoryTimeout);
        clearTimeout(this.state.orderBookTimeout);
        clearTimeout(this.state.metadataTimeout);

        tour.hide();
    },

    getMetadata() {
        console.info("Loading metadata from IPFS...");
        let market = this.state.market;
        if (this.state.metadataTimeout) {
            clearTimeout(this.state.metadataTimeout);
        }
        if (market && market.constructor === Object && market._id) {
            if (!market.metadata) {
                return this.getFlux().actions.market.loadMetadata(market);
            }
        } else {
            this.setState({metadataTimeout: setTimeout(this.getMetadata, 5000)});
        }
    },

    checkOrderBook() {
        console.info("Checking order book...");
        let market = this.state.market;
        if (this.state.orderBookTimeout) {
            clearTimeout(this.state.orderBookTimeout);
        }
        if (market && market.constructor === Object && market._id &&
            !market.orderBookChecked) {
            return this.getFlux().actions.market.checkOrderBook(market);
        }
        this.setState({orderBookTimeout: setTimeout(this.checkOrderBook, 5000)});
    },

    getPriceHistory() {
        console.info("Loading price history...");
        let market = this.state.market;
        if (this.state.priceHistoryTimeout) {
            clearTimeout(this.state.priceHistoryTimeout);
        }
        if (market && market.constructor === Object && market._id &&
            !market.priceHistory && !market.priceHistoryStatus) {
            return this.getFlux().actions.market.loadPriceHistory(market);
        }
        this.setState({priceHistoryTimeout: setTimeout(this.getPriceHistory, 5000)});
    },

    toggleCloseMarketModal(event) {
        this.setState({closeMarketModalOpen: !this.state.closeMarketModalOpen});
    }
});

module.exports = MarketPage;
