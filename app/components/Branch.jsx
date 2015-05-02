var _ = require('lodash');
var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var web3 = require('web3');
var moment = require('moment');

var Router = require("react-router");
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var AddMarketTrigger =  require('./AddMarket').AddMarketTrigger;

var Branch = React.createClass({

  // assuming only one branch and all markets in store are of that branch

  mixins: [FluxMixin, StoreWatchMixin('market')],

  getInitialState: function () {
    return {
      marketsPerPage: 12,
      pageNum: 1
    };
  },

  getStateFromFlux: function () {

    var flux = this.getFlux();
    var marketState = flux.store('market').getState();

    return {
      markets: marketState.markets
    }
  },

  render: function () {
    return (
      <div>
        <h3 className="clearfix">Markets <span className="subheading pull-right"><AddMarketTrigger /></span></h3>
        <MarketList markets={ this.state.markets } marketsPerPage={ this.state.marketsPerPage } pageNum={ this.state.pageNum } />
      </div>
    );
  }
});

// bundling this list class here for now until needed for reuse
var MarketList = React.createClass({

  render: function() {

    var viewMarket = this.props.viewMarket;

    var start = 0 + (this.props.pageNum-1) * this.props.marketsPerPage;
    var end = start + this.props.marketsPerPage;
    var markets = _.sortBy(this.props.markets, 'volume').slice(start, end)

    var marketList = _.map(markets, function (market) {
      return (
        <div key={ market.id } className='col-sm-4'>
          <MarketPane market={ market } />
        </div>
      );
    });

    return (
      <div className='markets row'>
        { marketList }
      </div>
    );
  }
});

var ellipsizeAddress = function (address, length) {
  var hexAddress = web3.toHex(address);
  var prefixLength = 2; // Ignore the '0x'.
  return hexAddress.substr(0, length + prefixLength) + '...';
};

// bundling this list class here for now until needed for reuse
var MarketPane = React.createClass({

  render: function() {

    var market = this.props.market;
    var formattedDate = market.endDate ? moment(market.endDate).format('MMM Do, YYYY') : '-'

    return (
      <Link to='market' params={ {marketId: market.id.toString(64)} } className='market-pane'>
        <h4>{ market.description }</h4>
        <div className='summary'>
          <span>{ market.price.times(100).toPrecision(3) }%</span>
        </div>
        <div className='details'>
          <p>Price: <b>{ market.price.toPrecision(3) }</b></p>
          <p className='alt'>Volume: <b>{ market.totalVolume.toFixed(0) }</b></p>
          <p>Fee: <b>{ market.tradingFee.times(100).toPrecision(3) }%</b></p>
          <p className='alt'>End date: <b>{ formattedDate }</b></p>
        </div>
      </Link>
    );
  }
});

module.exports = Branch;
