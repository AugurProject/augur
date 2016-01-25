var _ = require("lodash");
var React = require("react");
var Paginate = require("react-paginate");
var Router = require("react-router");
var Select = require("react-select");

let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");
var RouteHandler = Router.RouteHandler;
var Navigation = Router.Navigation;
var Link = Router.Link;

var AddMarketModal =  require("./AddMarketModal")
var Markets = require("./Markets");
var constants = require("../libs/constants");

var Branch = React.createClass({

  // assuming only one branch and all markets in store are of that branch
  mixins: [FluxMixin, StoreWatchMixin('market', 'search', 'branch', 'config'), Navigation],

  getInitialState: function() {
    return {
      addMarketModalOpen: false,
      marketsPerPage: constants.MARKETS_PER_PAGE,
      visiblePages: 3,
      pageNum: this.props.params.page ? this.props.params.page - 1 : 0
    };
  },

  getStateFromFlux: function () {
    var flux = this.getFlux();
    var marketState = flux.store('market').getState();
    var searchState = flux.store('search').getState();
    var currentBranch = flux.store('branch').getCurrentBranch();
    var account = flux.store('config').getAccount();

    return {
      searchKeywords: searchState.keywords,
      markets: searchState.results,
      pendingMarkets: marketState.pendingMarkets,
      currentBranch: currentBranch,
      account: account
    };
  },

  toggleAddMarketModal: function(event) {
    this.setState({addMarketModalOpen: !this.state.addMarketModalOpen});
  },

  handlePageChanged: function (data) {
    this.transitionTo('/markets/' + (parseInt(data.selected) + 1));
    this.setState({pageNum: data.selected});
  },

  onChangeSearchInput: function (event) {
    this.setState({ searchKeywords: event.target.value });
    this.debounceSearchInput(event.target.value);
  },
  
  debounceSearchInput: _.debounce(function (val) {
    this.handlePageChanged({selected: 0});
    this.getFlux().actions.search.updateKeywords(val);    
  }, 500),

  onChangeSortBy: function (event) {
    this.handlePageChanged({selected: 0});
    var sortInput = event.target.value.split('|');
    this.getFlux().actions.search.sortMarkets(sortInput[0], parseInt(sortInput[1]));
  },

  render: function () {

    var start = 0 + (this.state.pageNum) * this.state.marketsPerPage;
    var total = _.size(this.state.markets);
    var end = start + this.state.marketsPerPage;
    end = end > total ? total : end;
    //var marketPage = _.sortBy(this.state.markets, 'volume').reverse().slice(start, end);
    var marketPage = _.map(this.state.markets).slice(start, end);
    var submitMarketAction = (
      <span className="subheading pull-right">
        <a href="javascript:void(0);" onClick={this.toggleAddMarketModal}>
          <i className="fa fa-plus-circle fa-2x icon-white"></i>
        </a>
      </span>
    );
    if (!this.state.account) { 
      submitMarketAction = <span />;
    }

    var pendingMarkets = _.map(this.state.pendingMarkets);
    var pendingMarketsSection = <span />;
    if (this.state.pendingMarkets) {
      pendingMarketsSection = (
        <div className='pendingMarkets row'>
          <Markets 
            markets={pendingMarkets}
            currentBranch={this.state.currentBranch}
            classNameWrapper='col-sm-4' />
        </div>
      );
    }

    return (
      <div id="branch">
        {pendingMarketsSection}
        <h3 className="clearfix">
          <div className="col-xs-2" id="markets-label">Markets</div>
          <div className="col-xs-10 pad-top-7">
            <div className="col-xs-6 pad-top-5">
              <input type="search"
                className="markets-search-input"
                value={this.state.searchKeywords}
                placeholder="Search"
                tabIndex="0"
                onChange={this.onChangeSearchInput} />
            </div>
            <div className="col-xs-5 pad-top-5">
              <select onChange={this.onChangeSortBy}>
                <option selected disabled>Sort markets</option>
                <option value="creationBlock|1">Creation date (newest first)</option>
                <option value="creationBlock|0">Creation date (oldest first)</option>
                <option value="endBlock|0">End date (soonest first)</option>
                <option value="endBlock|1">End date (farthest first)</option>
                <option value="description|0">Description</option>
              </select>
            </div>
            <div className="col-xs-1">{submitMarketAction}</div>
          </div>
        </h3>
        <div className='subheading clearfix'>
          <span className='showing'>Showing {start+1} - {end} of {total}</span>
          <Paginate 
            previousLabel={<i className='fa fa-chevron-left'></i>}
            nextLabel={<i className='fa fa-chevron-right'></i>}
            breakLabel={<li className="break"><a href="">...</a></li>}
            pageNum={total / this.state.marketsPerPage}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            forceSelected={this.state.pageNum}
            clickCallback={this.handlePageChanged}
            containerClassName={'paginator'}
            subContainerClassName={'pages'}
            activeClass={'active'} />
        </div>
        <div className='markets row'>
          <Markets 
            markets={marketPage}
            currentBranch={this.state.currentBranch}
            classNameWrapper='col-sm-4' />
        </div>

        <AddMarketModal show={this.state.addMarketModalOpen} onHide={this.toggleAddMarketModal} />
      </div>
    );
  }
});

module.exports = Branch;
