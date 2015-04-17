var _ = require('lodash');
var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Router = require("react-router");
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var AddMarketTrigger =  require('./AddMarket').AddMarketTrigger;

var Branch = React.createClass({

  // assuming only one branch and all markets in store are of that branch

  mixins: [FluxMixin, StoreWatchMixin('market')],

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
        <h3 className="clearfix">Markets <span className="pull-right"><AddMarketTrigger /></span></h3>
        <MarketList data={ this.state.markets } />
      </div>
    );
  }
});

// bundling this list class here for now until needed for reuse
var MarketList = React.createClass({

  render: function() {

    var viewMarket = this.props.viewMarket;

    var marketList = _.map(this.props.data, function (market) {
      return (
        <MarketPane market={ market } />
      );
    });

    return (
      <div className='markets'> 
        { marketList } 
      </div>
    );
  }
});

// bundling this list class here for now until needed for reuse
var MarketPane = React.createClass({

  render: function() {

    var market = this.props.market;

    return (
      <Link to='market' params={ {marketId: market.id} } className='market-pane'>
        <h4>{ market.text }</h4>
        <div className='summary'>
          <span>{ market.lastPrice * 100 }%</span>
        </div>
        <div className='details'>
          <p>Last price: <b>{ market.lastPrice }</b></p>
          <p className='alt'>Volume: <b>{ market.volume }</b></p>
          <p>Fee: <b>{ market.fee }</b></p>
          <p className='alt'>Author: <b>{ market.author }</b></p>
          <p>End date: <b>{ market.endDate || '-' }</b></p>
        </div>
      </Link>
    );
  }
});

module.exports = Branch;
