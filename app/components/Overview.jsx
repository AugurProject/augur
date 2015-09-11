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

  mixins: [FluxMixin, StoreWatchMixin('asset', 'market', 'config')],

  _onBranchChange: function () {
    var branchStore = this.getFlux().store('branch');
    this.setState({
      currentBranch: branchStore.getCurrentBranch(),
      votePeriod: branchStore.getState().currentVotePeriod
    });
  },

  _onMarketChange: function () {
    var marketStore = this.getFlux().store('market');
    this.setState({
      trendingMarkets: marketStore.getTrendingMarkets(3, this.state.currentBranch),
      authoredMarkets: marketStore.getMarketsByAuthor(this.state.account),
      holdings: marketStore.getMarketsHeld()
    });
  },

  _onAssetChange: function () {
    var assetStore = this.getFlux().store('asset');
    this.setState({ asset: assetStore.getState() });
  },

  _onConfigChange: function () {
    var configStore = this.getFlux().store('config');
    this.setState({
      account: configStore.getAccount(),
      ethereumClient: configStore.getEthereumClient()
    });
  },

  componentDidMount: function () {
    var flux = this.getFlux();
    flux.store('branch').addChangeListener(this._onBranchChange);
    flux.store('market').addChangeListener(this._onMarketChange);
    flux.store('asset').addChangeListener(this._onAssetChange);
    flux.store('config').addChangeListener(this._onConfigChange);
  },

  componentWillUnmount: function () {
    var flux = this.getFlux();
    flux.store('branch').removeChangeListener(this._onBranchChange);
    flux.store('market').removeChangeListener(this._onMarketChange);
    flux.store('asset').removeChangeListener(this._onAssetChange);
    flux.store('config').removeChangeListener(this._onConfigChange);
  },

  getStateFromFlux: function () {
    var flux = this.getFlux();
    var account = flux.store('config').getAccount();
    var currentBranch = flux.store('branch').getCurrentBranch();

    return {
      account: account,
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
      _.each(market.outcomes, function (outcome) {
        if (outcome && outcome.sharesHeld) {
          if (outcome.sharesHeld.constructor === BigNumber && outcome.sharesHeld.toNumber()) {
            var key = market.id + outcome.id;
            holdings.push( <Holding market={ market } outcome={ outcome } key={ key } /> );
          }
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

var Holding = React.createClass({

  shouldComponentUpdate: function(nextProps, nextState) {
    
    if (!this.nextProps) return true;

    if (this.props.market.price != this.nextProps.market.price ||
        this.props.outcome.sharesHeld != this.nextProps.outcome.sharesHeld) return true;

  },

  render: function() {

    var name = this.props.outcome.id == 1 ? 'no' : 'yes';
    var className = 'pull-right shares-held ' + name;
    var key = this.props.market.id+this.props.outcome.id;
    var percent = this.props.market.price ? utilities.priceToPercent(this.props.market.price) : '-'; 
    var closeMarket = <span />;
    if (this.props.market.expired && this.props.market.authored && !this.props.market.closed) {
     closeMarket = <CloseMarketTrigger text='close market' params={ { marketId: this.props.market.id.toString(16), branchId: this.props.market.branchId.toString(16) } } />;
    }
    
    return (
      <Link key={ key } className="list-group-item clearfix" to='market' params={ {marketId: this.props.market.id.toString(16) } }>
        <span className="price">{ percent }</span>
        <p className="description">{ this.props.market.description }</p>
        <span className={ className }>{ this.props.outcome.sharesHeld.toNumber() } { name }</span>
        { closeMarket }            
      </Link>
    );
  }
});

module.exports = Overview;
