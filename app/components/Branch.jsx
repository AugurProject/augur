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
var Markets = require('./Markets');

var Branch = React.createClass({

  // assuming only one branch and all markets in store are of that branch
  mixins: [FluxMixin, StoreWatchMixin('market', 'branch')],

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
    var votePeriod = flux.store('branch').getState().currentVotePeriod;

    return {
      markets: marketState.markets,
      votePeriod: votePeriod
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
        <h3 className="clearfix">Markets <span className="subheading pull-right"><AddMarketTrigger /></span></h3>
        <div className='subheading clearfix'>
          <span className='showing'>Showing { start+1 } - { end } of { total }</span>
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
        </div>
        <div className='markets row'>
          <Markets 
            markets={ marketPage }
            votePeriod={ this.state.votePeriod }
            classNameWrapper='col-sm-4' />
        </div>
      </div>
    );
  }
});

module.exports = Branch;
