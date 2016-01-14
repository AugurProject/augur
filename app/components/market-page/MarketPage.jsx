let React = require('react');

var BigNumber = require("bignumber.js");
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
    mixins: [FluxMixin, StoreWatchMixin('market')],

    getStateFromFlux: function () {
        var flux = this.getFlux();

        var marketId = new BigNumber(this.props.params.marketId, 16);
        var market = flux.store('market').getMarket(marketId);

        return {
            market: market
        };
    },

    render() {
        let market = this.state.market;
        if (market == null) {
            return (
                <div>No market info</div>
            );
        }
        return (
            <div className="">
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
                            <TradeTab/>
                        </div>
                        <div id="statsTab" className="tab-pane" role="tabpanel">
                            <StatsTab/>
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