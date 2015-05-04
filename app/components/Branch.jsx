var _ = require('lodash');
var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var moment = require('moment');
var Pager = require('react-pager');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var AddMarketTrigger =  require('./AddMarket').AddMarketTrigger;

var Branch = React.createClass({

  // assuming only one branch and all markets in store are of that branch

  mixins: [FluxMixin, StoreWatchMixin('market')],

  getInitialState: function () {
    return {
      marketsPerPage: 15,
      visiblePages: 3,
      pageNum: 0
    };
  },

  getStateFromFlux: function () {

    var flux = this.getFlux();
    var marketState = flux.store('market').getState();

    return {
      markets: marketState.markets
    }
  },

  handlePageChanged: function (newPageNum) {
    this.setState({ pageNum: newPageNum });
  },

  render: function () {

    var start = 0 + (this.state.pageNum) * this.state.marketsPerPage;
    var total = _.size(this.state.markets);
    var end = start + this.state.marketsPerPage;
    end = end > total ? total : end;
    var marketPage = _.sortBy(this.state.markets, 'volume').reverse().slice(start, end);


    return (
      <div id="branch">
        <h3 className="clearfix">Markets <span className="subheading pull-right">Showing { start+1 } - { end } of { total }</span></h3>
        <h4 className="clearfix">
          <AddMarketTrigger />
          <Pager 
            total={  total / this.state.marketsPerPage }
            current={ this.state.pageNum }
            titles={{
              first:   '\u2758\u25c0',
              prev:    '\u25c0',
              next:    '\u25b6',
              last:    '\u25b6\u2758'
            }}
            visiblePages={ this.state.visiblePages }
            onPageChanged={ this.handlePageChanged }
          />
        </h4>
        <MarketList markets={ marketPage } />
      </div>
    );
  }
});

// bundling this list class here for now until needed for reuse
var MarketList = React.createClass({

  render: function() {

    var marketList = _.map(this.props.markets, function (market) {
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

// bundling this list class here for now until needed for reuse
var MarketPane = React.createClass({

  render: function() {

    var market = this.props.market;
    var formattedDate = market.endDate ? moment(market.endDate).format('MMM Do, YYYY') : '-'

    return (
      <Link to='market' params={ {marketId: market.id.toString(16)} } className='market-pane'>
        <h5>{ market.description }</h5>
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
