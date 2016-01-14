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
        return (
            <div className="container">
                <Breadcrumb market={this.state.market}/>
                <MarketInfo/>

                <div role="tabpanel" style={{marginTop: '15px'}}>
                    <div className="row submenu">
                        <a className="collapsed" data-toggle="collapse" href="#collapseSubmenu"
                           aria-expanded="false"
                           aria-controls="collapseSubmenu">
                            <h2>Navigation</h2>
                        </a>

                        <div id="collapseSubmenu" className="collapse" aria-expanded="false">
                            <ul className="list-group" role="tablist" id="tabpanel">
                                <cif test="${!contract.isExpired()}">
                                    <li role="presentation" className="list-group-item">
                                        <a role="tab" ui-sref="contract.trade({contractId: app.contract.contractId})"
                                           ui-sref-active="active">Trade</a>
                                    </li>
                                </cif>
                                <cif test="${contract.isExpired()}">
                                    <li role="presentation" className="list-group-item" ng-if="app.isUserLoggedIn">
                                        <a role="tab"
                                           ui-sref="contract.userTrades({contractId: app.contract.contractId})"
                                           ui-sref-active="active">My
                                            Trades</a>
                                    </li>
                                </cif>
                                <li role="presentation" className="list-group-item">
                                    <a role="tab" ui-sref="contract.stats({contractId: app.contract.contractId})"
                                       ui-sref-active="active">Stats & Charts</a>
                                </li>
                                <li role="presentation" className="list-group-item">
                                    <a role="tab" ui-sref="contract.rules({contractId: app.contract.contractId})"
                                       ui-sref-active="active">Rules</a>
                                </li>
                                <cif test="${!contract.isExpired()}">
                                    <li role="presentation" className="list-group-item" ng-if="app.isUserLoggedIn">
                                        <a role="tab"
                                           ui-sref="contract.userTrades({contractId: app.contract.contractId})"
                                           ui-sref-active="active">
                                            My Trades
                                        </a>
                                    </li>
                                    <li role="presentation" className="list-group-item" ng-if="app.isUserLoggedIn">
                                        <a role="tab"
                                           ui-sref="contract.userFrozenFunds({contractId: app.contract.contractId})"
                                           ui-sref-active="active">
                                            Frozen Funds
                                        <span ng-show="app.balance.eventMargin != null">
                                            (<span ng-bind="app.balance.eventMarginFormatted"></span>)
                                        </span>
                                        </a>
                                    </li>
                                </cif>
                            </ul>
                        </div>
                    </div>

                    <div className="tab-content">
                        <div id="trade" role="tabpanel" className="tab-pane active">
                            <TradeTab/>
                        </div>
                        <div id="stats" role="tabpanel" className="tab-pane">
                            <StatsTab/>
                        </div>
                        <div id="rules" role="tabpanel" className="tab-pane">
                            <RulesTab/>
                        </div>
                        <div id="userTrades" role="tabpanel" className="tab-pane" ng-if="app.isUserLoggedIn">
                            <UserTradesTab/>
                        </div>
                        <div id="frozenFunds" className="tab-pane" role="tabpanel" ng-if="app.isUserLoggedIn">
                            <UserFrozenFundsTab/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = MarketPage;