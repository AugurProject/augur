let React = require("react");

let BigNumber = require("bignumber.js");
let abi = require("augur-abi");
let Fluxxor = require("fluxxor");
let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;
let utils = require("../../libs/utilities");
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
let Comments = require('./comments/Comments.jsx');
let CloseMarketModal = require("../CloseMarket");
let Tour = require("./Tour");

let MarketPage = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("branch", "market", "config")],

    getInitialState() {
        return {
            priceHistoryTimeout: null,
            orderBookTimeout: null,
            addMarketModalOpen: false,
            metadataTimeout: null,
            showDetails: false,
            shouldOpenTour: false
        };
    },

    getStateFromFlux() {
        let self = this;
        let flux = this.getFlux();
        let marketId = new BigNumber(this.props.params.marketId, 16);
        let market = flux.store("market").getMarket(marketId);
        let marketState = flux.store("market").getState();
        let currentBranch = flux.store("branch").getCurrentBranch();
        let account = flux.store("config").getAccount();
        let handle = flux.store("config").getHandle();
        let blockNumber = flux.store("network").getState().blockNumber;
        let searchState = flux.store("search").getState();
        if (currentBranch && market && market.tradingPeriod &&
            currentBranch.currentPeriod >= market.tradingPeriod.toNumber()) {
            market.matured = true;
            if (currentBranch.reportPeriod > market.tradingPeriod.toNumber()) {
                market.closable = true;
            }
        }
        let image = null;
        if (market && market.metadata && market.metadata.image) {
            image = market.metadata.image;
        }
        return {
            market,
            account,
            handle,
            blockNumber,
            tourMarket: marketState.tourMarket,
            image
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
            if (!this.props.isSiteLoaded) {
                return <div className="loader"></div>;
            }
            else {
                return <div>No market info</div>;
            }
        }
        let tags = [];
        if (market.metadata && market.metadata.tags && market.metadata.tags.length) {
            for (var i = 0, n = market.metadata.tags.length; i < n; ++i) {
                if (market.metadata.tags[i] !== "") {
                    tags.push(
                        <span key={market._id + "-tag-" + i} className="tag">
                            {market.metadata.tags[i]}
                        </span>
                    );
                }
            }
        }
        let closeMarketButton = <span />;
        if (market.matured && market.closable && !market.closed) {
             closeMarketButton = (
                <div className="close-market">
                    <Button
                        className="btn-block active close-market-button"
                        bsStyle="warning"
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
                    <li key={market._id + "-link-" + i + "-" + metadata.links[i]}>
                        <a href={metadata.links[i]}>
                            {metadata.links[i]}
                        </a>
                    </li>
                );
            }
        }
        let image = <span />;
        if (metadata.image) {
            image = <div className="metadata-image-container"><img className="metadata-image" src={this.state.image} /></div>;
        }

        return (
            <div className="marketPage">
                {closeMarketButton}
                <h1>
                    {image}
                    { this.state.market.description }
                </h1>
                <div className="tags">
                    {tags}
                </div>

                <OrderTicket market={this.state.market} account={this.state.account}/>
                <UserOrders market={this.state.market}/>

                <MarketInfo market={market} />

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
                    <nav className="submenu">
                        <ul className="list-group">
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
                    </nav>

                    <div className="tab-content">
                        <div id="statsTab" className="tab-pane active" role="tabpanel">
                            <StatsTab
                                priceTimeSeries={this.state.market.priceTimeSeries}
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

                <Comments
                    toggleSignInModal={this.state.toggleSignInModal}
                    market={this.state.market}
                    //comments={this.props.market.comments} // comments are already in market, should I pass them?
                    account={this.state.account}
                    handle={this.state.handle}
                    />
            </div>
        );
    },

    componentWillReceiveProps : function(nextProps) {
        var shouldOpenTour = this.state.market === this.state.tourMarket && !localStorage.getItem("marketPageTourOpen") && !localStorage.getItem("marketPageTourComplete") && !localStorage.getItem("tourComplete");
        if (this.state.shouldOpenTour !== shouldOpenTour) {
            this.setState({
                shouldOpenTour: shouldOpenTour
            });
        }
    },

    componentDidUpdate() {
        if (this.state.shouldOpenTour) {
            try {
                setTimeout(() => {
                    Tour.show(this.state.market);
                }, 2000);
                localStorage.setItem("marketPageTourOpen", true);
            } catch (e) {
                console.warn('MarketPage tour failed to open (caught): ', e.message);
            }
        }
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
    },

    componentWillUnmount() {
        this.stylesheetEl.remove();

        clearTimeout(this.state.priceHistoryTimeout);
        clearTimeout(this.state.orderBookTimeout);
        clearTimeout(this.state.metadataTimeout);

        Tour.hide('marketPageTourComplete');
    },

    getMetadata() {
        let market = this.state.market;
        if (this.state.metadataTimeout) {
            clearTimeout(this.state.metadataTimeout);
        }
        if (market && market.constructor === Object && market._id) {
            if (!market.metadata) {
                console.info("Loading metadata from IPFS...");
                return this.getFlux().actions.market.loadMetadata(market);
            }
        } else {
            this.setState({metadataTimeout: setTimeout(this.getMetadata, 5000)});
        }
    },

    checkOrderBook() {
        let market = this.state.market;
        if (this.state.orderBookTimeout) {
            clearTimeout(this.state.orderBookTimeout);
        }
        if (market && market.constructor === Object && market._id &&
            !market.orderBookChecked) {
            console.info("Checking order book...");
            return this.getFlux().actions.market.checkOrderBook(market);
        }
        this.setState({orderBookTimeout: setTimeout(this.checkOrderBook, 5000)});
    },

    getPriceHistory() {
        let market = this.state.market;
        if (this.state.priceHistoryTimeout) {
            clearTimeout(this.state.priceHistoryTimeout);
        }
        if (market && market.constructor === Object && market._id &&
            !market.priceHistory && !market.priceHistoryStatus) {
            console.info("Loading price history...");
            return this.getFlux().actions.market.loadPriceHistory(market);
        }
        this.setState({priceHistoryTimeout: setTimeout(this.getPriceHistory, 5000)});
    },

    toggleCloseMarketModal(event) {
        this.setState({closeMarketModalOpen: !this.state.closeMarketModalOpen});
    }
});

module.exports = MarketPage;
