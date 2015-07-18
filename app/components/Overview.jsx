var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Table = ReactBootstrap.Table;
var Router = require('react-router');
var Link = Router.Link;
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;

var utilities = require('../libs/utilities');
var constants = require('../libs/constants');

var CloseMarketModal = require('./CloseMarket').CloseMarketModal;
var EtherWarningModal = require('./EtherWarningModal');
var Welcome = require('./Welcome');
var Markets = require('./Markets');

var Overview = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('asset', 'market')],

  getStateFromFlux: function () {
    var flux = this.getFlux();
    var account = flux.store('network').getAccount();
    var currentBranch = flux.store('branch').getCurrentBranch();

    return {
      account: account,
      allAccounts: flux.store('network').getState().accounts,
      asset: flux.store('asset').getState(),
      trendingMarkets: flux.store('market').getTrendingMarkets(3, currentBranch),
      ethereumClient: flux.store('config').getEthereumClient(),
      authoredMarkets: flux.store('market').getMarketsByAuthor(account),
      votePeriod: flux.store('branch').getState().currentVotePeriod,
      currentBranch: currentBranch,
      holdings: flux.store('market').getMarketsHeld()
    }
  },

  render: function () {

    var cashBalance = this.state.asset.cash ? +this.state.asset.cash.toFixed(2) : '-';
    var repBalance = this.state.asset.reputation ? +this.state.asset.reputation.toFixed(2) : 0;

    var holdings = [];
    _.each(this.state.holdings, function (market) {
      _.each(market.outcomes, function(outcome) {
        var name, className, holding;
        if (outcome && outcome.sharesHeld && outcome.sharesHeld.toNumber()) {
          name = outcome.id == 1 ? 'no' : 'yes';
          className = 'pull-right shares-held ' + name;
          var key = market.id+outcome.id;
          var percent = market.price ? +market.price.toFixed(2) * 100 + '%' : '-'; 
          var closeMarket = <span />;
          if (market.expired && market.authored && !market.closed) {
           closeMarket = <CloseMarketTrigger text='close market' params={ { marketId: market.id.toString(16), branchId: market.branchId.toString(16) } } />;
          }
          
          holding = (
            <Link key={ key } className="list-group-item" to='market' params={ {marketId: market.id.toString(16) } }>
              <span className="price">{ percent }</span>
              <span className="description">{ market.description }</span>
              <span className={ className }>{ outcome.sharesHeld.toNumber() } { name }</span>            
            </Link>
          );

          holdings.push(holding);
        }
      });
    }, this);

    var holdingsSection = <span />
    if (holdings.length) {
      holdingsSection = (
        <div>
          <h4>Current Holdings</h4>
          <ListGroup className='holdings'>
            { holdings }
          </ListGroup>
        </div>
      );
    }

    var cashFaucetDisabled = this.state.cashFaucetDisabled ? true : false;
    var repFaucetDisabled = this.state.repFaucetDisabled ? true : false;

    var trendingMarketsSection = <span />;
    if (this.state.trendingMarkets) {
      trendingMarketsSection = (
        <div>
          <h4>Trending Markets</h4>
          <div className='row'>
            <Markets 
              markets={ this.state.trendingMarkets }
              currentBranch={ this.state.currentBranch }
              classNameWrapper='col-sm-4' />
            </div>
        </div>
      );
    }

    var rendered = (
      <div id="overview">
        <div className='row'>
          <div className="col-xs-12">
            <Welcome />
            { trendingMarketsSection }
            { holdingsSection }
          </div>
        </div>
      </div>
    );

    return rendered;
  }
});

module.exports = Overview;
