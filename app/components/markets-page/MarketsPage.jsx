let React = require('react');
let _ = require("lodash");
let moment = require("moment");
let Paginate = require("react-paginate");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");
let Navigation = require("react-router/lib/Navigation");
let Link = require("react-router/lib/components/Link");
let Button = require("react-bootstrap/lib/Button");
let constants = require("../../libs/constants");
let MarketRow = require("./MarketRow");

let MarketsPage = React.createClass({

    // assuming only one branch and all markets in store are of that branch
    mixins: [FluxMixin, StoreWatchMixin('market', 'search', 'branch', 'config'), Navigation],

    getInitialState() {
        return {
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
        }
    },

    handlePageChanged: function (data) {
        this.transitionTo('markets', null, {page: (parseInt(data.selected) + 1), expired: this.props.query.expired});
        this.setState({pageNum: data.selected});
    },

    onChangeSearchInput: function (event) {
        this.setState({searchKeywords: event.target.value});
        this.debounceSearchInput(event.target.value);
    },

    onChangeSortBy: function (event) {
        this.handlePageChanged({selected: 0});
        var sortInput = event.target.value.split('|');
        this.getFlux().actions.search.sortMarkets(sortInput[0], parseInt(sortInput[1]));
    },

    debounceSearchInput: _.debounce(function (val) {
        this.handlePageChanged({selected: 0});
        this.getFlux().actions.search.updateKeywords(val);
    }, 500),

    componentWillReceiveProps(nextProps) {
        if (this.props.query.expired !== nextProps.query.expired) {
            // when switching from one tab to another restart pagination
            this.setState(_.merge({}, this.state, {
                pageNum: 0
            }));
        }
    },

    /**
     * Returns filtered markets (expired or not) and data for pagination
     * todo: filtering logic should probably be part of SearchStore ?
     */
    _getMarketsData() {
        let currentBranch = this.props.branch.currentBranch;
        let currentPeriod = currentBranch != null ? currentBranch.currentPeriod : null;
        let filteredMarkets = _(this.state.markets)
            .filter((market => {
                if (currentBranch == null) {
                    // at least display something
                    return true;
                }

                if (this.props.query.expired === "true") {
                    return currentPeriod >= market.tradingPeriod;
                } else {
                    return currentPeriod < market.tradingPeriod;
                }
            }));

        let firstItemIndex = this.state.pageNum * this.state.marketsPerPage;
        let marketsCount = filteredMarkets.size();
        let lastItemIndex = firstItemIndex + this.state.marketsPerPage;
        lastItemIndex = (lastItemIndex > marketsCount ? marketsCount : lastItemIndex);

        let markets = filteredMarkets
            .map()
            .slice(firstItemIndex, lastItemIndex)
            .value();

        return {
            markets, marketsCount, firstItemIndex, lastItemIndex
        };
    },

    render() {
        let flux = this.getFlux();
        let myOpenOrders = flux.augur.orders.get(flux.augur.from);

        let {markets, marketsCount, firstItemIndex, lastItemIndex} = this._getMarketsData();

        let pagination = (
            <div className="row">
                <div className="col-xs-12">
                    <span className='showing'>Showing { firstItemIndex + 1 } - { lastItemIndex } of { marketsCount }</span>
                    <Paginate
                        previousLabel={ <i className='fa fa-chevron-left'></i> }
                        nextLabel={ <i className='fa fa-chevron-right'></i> }
                        breakLabel={ <li className="break"><a href="">...</a></li> }
                        pageNum={ marketsCount / this.state.marketsPerPage }
                        marginPagesDisplayed={ 2 }
                        pageRangeDisplayed={ 5 }
                        forceSelected={ this.state.pageNum }
                        clickCallback={ this.handlePageChanged }
                        containerClassName={ 'paginator' }
                        subContainerClassName={ 'pages' }
                        activeClass={ 'active' }
                        />
                </div>
            </div>
        );

        return (
            <div className="marketsPage">
                <h1>Markets</h1>

                <div className="row submenu">
                    <a className="collapsed" data-toggle="collapse" href="#collapseSubmenu"
                       aria-expanded="false"
                       aria-controls="collapseSubmenu">
                        <h2>Navigation</h2>
                    </a>

                    <div id="collapseSubmenu" className="col-xs-12 collapse" aria-expanded="false">
                        <ul className="list-group" role="tablist" id="tabpanel">
                            <li role="presentation" className={`list-group-item ${this.props.query.expired !== 'true' ? 'active' : ''}`}>
                                <Link to='markets' role="tab" activeClassName="">
                                    Open Markets
                                </Link>
                            </li>
                            <li role="presentation" className={`list-group-item ${this.props.query.expired === 'true' ? 'active' : ''}`}>
                                <Link to="markets" activeClassName="" query={{expired: true}} role="tab">
                                    Expired Markets
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="row search-sort-row">
                    <div className="col-sm-4 sort-container">
                        <select className="sort-control" onChange={this.onChangeSortBy}>
                            <option selected disabled>Sort markets</option>
                            <option value="creationBlock|1">Creation date (newest first)</option>
                            <option value="creationBlock|0">Creation date (oldest first)</option>
                            <option value="endBlock|0">End date (soonest first)</option>
                            <option value="endBlock|1">End date (farthest first)</option>
                            <option value="description|0">Description</option>
                        </select>
                    </div>
                    <div className="col-sm-4 search-container">
                        <input type="search"
                               className="form-control search-control"
                               value={this.state.searchKeywords}
                               placeholder="Search"
                               tabIndex="0"
                               onChange={this.onChangeSearchInput}/>
                    </div>
                </div>
                { pagination }
                <div className="row">
                    <div className="col-xs-12">
                        {markets.map(market => {
                            return <MarketRow key={market.id} market={market} numOpenOrders={ (myOpenOrders && myOpenOrders[market._id] && myOpenOrders[market._id][1] && myOpenOrders[market._id][1].length) || 0 } />;
                        })}
                    </div>
                </div>
                { pagination }
            </div>
        );
    }
});

module.exports = MarketsPage;