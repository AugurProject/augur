var _ = require('lodash');
var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var moment = require('moment');
var Paginate = require('react-paginate');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var AddMarketTrigger =  require('./AddMarket').AddMarketTrigger;
var Markets = require('./Markets');

var constants = require('../libs/constants');

var Branch = React.createClass({

  // assuming only one branch and all markets in store are of that branch
  mixins: [FluxMixin, StoreWatchMixin('market', 'branch')],

  getInitialState: function () {
    return {
      marketsPerPage: constants.MARKETS_PER_PAGE,
      visiblePages: 3,
      pageNum: 0
    };
  },

  getStateFromFlux: function () {

    var flux = this.getFlux();
    var marketState = flux.store('market').getState();
    var currentBranch = flux.store('branch').getCurrentBranch();

    return {
      markets: marketState.markets,
      currentBranch: currentBranch
    }
  },

  handlePageChanged: function (data) {

    this.setState({ pageNum: data.selected });
  },

  render: function () {


    var start = 0 + (this.state.pageNum) * this.state.marketsPerPage;
    var total = _.size(this.state.markets);
    var end = start + this.state.marketsPerPage;
    end = end > total ? total : end;
    //var marketPage = _.sortBy(this.state.markets, 'volume').reverse().slice(start, end);
    var marketPage = _.map(this.state.markets).slice(start, end);
    
    return (
      <div id="branch">
        <h3 className="clearfix">Markets <span className="subheading pull-right"><AddMarketTrigger /></span></h3>
        <div className='subheading clearfix'>
          <span className='showing'>Showing { start+1 } - { end } of { total }</span>
          <Paginate 
            previousLabel={ <i className='fa fa-chevron-left'></i> }
            nextLabel={ <i className='fa fa-chevron-right'></i> }
            breakLabel={ <li className="break"><a href="">...</a></li> }
            pageNum={ total / this.state.marketsPerPage }
            marginPagesDisplayed={ 2 }
            pageRangeDisplayed={ 5 }
            clickCallback={ this.handlePageChanged }
            containerClassName={ 'paginator' }
            subContainerClassName={ 'pages' }
            activeClass={ 'active' } 
          />
        </div>
        <div className='markets row'>
          <Markets 
            markets={ marketPage }
            currentBranch={ this.state.currentBranch }
            classNameWrapper='col-sm-4' />
        </div>
      </div>
    );
  }
});

module.exports = Branch;
