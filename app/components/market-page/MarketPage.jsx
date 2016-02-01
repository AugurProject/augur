let React = require('react');

let BigNumber = require("bignumber.js");
let Fluxxor = require("fluxxor");
let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

let Breadcrumb = require('./Breadcrumb.jsx');
let MarketInfo = require('./MarketInfo.jsx');
let TradeTab = require('./TradeTab.jsx');
let StatsTab = require('./StatsTab');
let RulesTab = require('./RulesTab');
let UserTradesTab = require('./UserTradesTab');
let UserFrozenFundsTab = require('./UserFrozenFundsTab');


let MarketPage = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('branch', 'market', 'config')],

    getInitialState: function () {
        return {priceHistoryTimeout: null};
    },

    getStateFromFlux: function () {
        let flux = this.getFlux();

        let marketId = new BigNumber(this.props.params.marketId, 16);
        let market = flux.store('market').getMarket(marketId);
        let currentBranch = flux.store('branch').getCurrentBranch();
        let account = flux.store('config').getAccount();
        let handle = flux.store('config').getHandle();
        let blockNumber = flux.store('network').getState().blockNumber;

        if (currentBranch && market && market.tradingPeriod &&
            currentBranch.currentPeriod >= market.tradingPeriod.toNumber()) {
            market.matured = true;
        }

        return {
            market,
            account,
            handle,
            blockNumber
        };
    },
    componentDidMount() {
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
    },

    getPriceHistory() {
        var market = this.state.market;
        if (this.state.priceHistoryTimeout) {
            clearTimeout(this.state.priceHistoryTimeout);
        }
        if (market && market.constructor === Object && market._id &&
            !market.priceHistory && !market.priceHistoryStatus) {
            return this.getFlux().actions.market.loadPriceHistory(market);
        }
        this.setState({priceHistoryTimeout: setTimeout(this.getPriceHistory, 2500)});
    },

    render() {
        let market = this.state.market;

        if (market == null) {
            return (
                <div>No market info</div>
            );
        }

        return (
            <div className="marketPage">
                <Breadcrumb market={market}/>
                <MarketInfo market={market}/>

                <div role="tabpanel" style={{marginTop: '15px'}}>
                    <div className="row submenu">
                        <a className="collapsed" data-toggle="collapse" href="#collapseSubmenu"
                           aria-expanded="false"
                           aria-controls="collapseSubmenu">
                            <h2>Navigation</h2>
                        </a>

                        <div id="collapseSubmenu" className="col-xs-12 collapse" aria-expanded="false">
                            <ul className="list-group" role="tablist" id="tabpanel">
                                <li role="presentation" className="list-group-item active">
                                    <a role="tab" href="#tradeTab" data-toggle="tab">Trade</a>
                                </li>
                                <li role="presentation" className="list-group-item">
                                    <a role="tab" href="#statsTab" data-toggle="tab">Stats & Charts</a>
                                </li>
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
                                        {/*<span ng-show="app.balance.eventMargin != null">
                                        (<span ng-bind="app.balance.eventMarginFormatted"></span>)
                                    </span>*/}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="tab-content">
                        <div id="tradeTab" className="tab-pane active" role="tabpanel">
                            <TradeTab
                                market={this.state.market}
                                account={this.state.account}
                                handle={this.state.handle}
                                toggleSignInModal={this.props.toggleSignInModal}
                                />
                        </div>
                        <div id="statsTab" className="tab-pane" role="tabpanel">
                            <StatsTab
                                market={this.state.market}
                                blockNumber={this.state.blockNumber}
                                />
                        </div>
                        <div id="rulesTab" className="tab-pane" role="tabpanel">
                            <RulesTab/>
                        </div>
                        <div id="userTradesTab" className="tab-pane" role="tabpanel">
                            <UserTradesTab/>
                        </div>
                        <div id="userFrozenFundsTab" className="tab-pane" role="tabpanel">
                            <UserFrozenFundsTab/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = MarketPage;