let React = require("react");
let classnames = require("classnames");
let abi = require("augur-abi");
let _ = require("lodash");
let moment = require("moment");
let Paginate = require("react-paginate");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let StoreWatchMixin = require("fluxxor/lib/store_watch_mixin");
let Navigation = require("react-router/lib/Navigation");
let Link = require("react-router/lib/components/Link");
let Button = require("react-bootstrap/lib/Button");
let Select = require('react-select');
let MarketRow = require("./MarketRow");
let AddMarketModal = require("../AddMarketModal");
let constants = require("../../libs/constants");
let utils = require("../../libs/utilities");
let InputClear = require('../layout/InputClear');

let MarketsPage = React.createClass({

    // assuming only one branch and all markets in store are of that branch
    mixins: [FluxMixin, StoreWatchMixin("market", "search", "branch", "config"), Navigation],

    getInitialState() {
        return {
            marketsPerPage: constants.MARKETS_PER_PAGE,
            visiblePages: 3,
            pageNum: this.props.params.page ? this.props.params.page - 1 : 0,
            addMarketModalOpen: false,
            selectedMarketStatus: this.selectedMarketStatusFromProps(this.props)
        };
    },

    getStateFromFlux: function () {
        var flux = this.getFlux();
        var marketState = flux.store("market").getState();
        var searchState = flux.store("search").getState();
        var currentBranch = flux.store("branch").getCurrentBranch();
        var account = flux.store("config").getAccount();
        var tourMarketId = utils.getTourMarketKey(searchState.results, currentBranch);

        return {
            searchKeywords: searchState.keywords,
            sortBy: searchState.sortBy,
            reverseSort: searchState.reverseSort,
            markets: searchState.results,
            pendingMarkets: marketState.pendingMarkets,
            currentBranch: currentBranch,
            account: account,
            tourMarketKey: abi.bignum(tourMarketId)
        };
    },

    handlePageChanged: function (data) {
        this.transitionTo('markets', null, {page: (parseInt(data.selected) + 1), expired: this.props.query.expired});
        this.setState({pageNum: data.selected});
    },

    onChangeSearchInput: function (searchKeywords) {
        this.handlePageChanged({selected: 0});
        this.getFlux().actions.search.updateKeywords(searchKeywords);
    },

    onChangeSortBy: function (newValue) {
        this.handlePageChanged({selected: 0});
        var sortInput = newValue.value.split('|');
        this.getFlux().actions.search.sortMarkets(sortInput[0], parseInt(sortInput[1]));
    },

    onChangeMarketStatus: function (newValue) {
        switch(newValue.value) {
            case 'expired':
                this.transitionTo(this.context.router.getCurrentPathname(), null, { expired: true });
                break;
            default:
                this.transitionTo(this.context.router.getCurrentPathname(), null, { expired: false });
                break;
        }
    },

    selectedMarketStatusFromProps: function(props) {
        return props.query.expired === 'true' ? 'expired' : 'open';
    },

    componentWillReceiveProps(nextProps) {
        if (this.props.query.expired !== nextProps.query.expired) {
            // when switching from one tab to another restart pagination
            this.setState(_.merge({}, this.state, {
                pageNum: 0,
                selectedMarketStatus: this.selectedMarketStatusFromProps(nextProps)
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

    toggleAddMarketModal: function (event) {
        this.setState({addMarketModalOpen: !this.state.addMarketModalOpen});
    },

    render() {
        let flux = this.getFlux();
        let account = this.state.account;
        let myOpenOrders = flux.augur.orders.get(account);
        let tourMarketKey = this.state.tourMarketKey;
        let tourMarketId;
        if (tourMarketKey) tourMarketId = this.state.markets[tourMarketKey]._id;

        let {markets, marketsCount, firstItemIndex, lastItemIndex} = this._getMarketsData();

        let tourMarketRow = <span />;
        if (tourMarketId && this.state.pageNum === 0 && this.props.query.expired !== "true") {
            tourMarketRow = <MarketRow
                                key={tourMarketKey}
                                account={account}
                                market={this.state.markets[tourMarketKey]}
                                tour={true}
                                numOpenOrders={(myOpenOrders && tourMarketId && myOpenOrders[tourMarketId] && myOpenOrders[tourMarketId][1] && myOpenOrders[tourMarketId][1].length) || 0} />
        }
        let numPages = Math.ceil(marketsCount / this.state.marketsPerPage);

        let pagination = (
            <div className="row">
                <div className="col-xs-12">
                    <span className='showing'>Showing { firstItemIndex + 1 } - { lastItemIndex } of { marketsCount }</span>
                    { numPages >= 2 &&
                        <Paginate
                            previousLabel={ <i className='fa fa-chevron-left'></i> }
                            nextLabel={ <i className='fa fa-chevron-right'></i> }
                            breakLabel={ <li className="break"><a href="">...</a></li> }
                            pageNum={ numPages }
                            marginPagesDisplayed={ 2 }
                            pageRangeDisplayed={ 5 }
                            forceSelected={ this.state.pageNum }
                            clickCallback={ this.handlePageChanged }
                            containerClassName={ 'paginator' }
                            subContainerClassName={ 'pages' }
                            activeClass={ 'active' } />
                    }
                </div>
            </div>
        );

        let submitMarketAction;
        if (this.state.account) {
            submitMarketAction = (
                <Button
                  className="pull-right btn-primary btn-success"
                  onClick={this.toggleAddMarketModal}>
                  New Market
                </Button>
            );
        } else {
            submitMarketAction = <span />;
        }

        return (
            <div className="marketsPage">
                <h1>
                    Markets
                    {submitMarketAction}
                </h1>
                <div className="search-container">
                    <InputClear
                           value={this.state.searchKeywords}
                           onChange={this.onChangeSearchInput}/>
                </div>

                <div className="row dropdowns">
                    <Select className="sort-control"
                            value={this.state.sortBy + '|' + this.state.reverseSort}
                            name="markets-sort"
                            searchable={false}
                            clearable={false}
                            placeholder="Sort markets"
                            onChange={this.onChangeSortBy}
                            options={[
                                {value: "creationBlock|1", label: "Creation date (newest first)"},
                                {value: "creationBlock|0", label: "Creation date (oldest first)"},
                                {value: "endBlock|0", label: "End date (soonest first)"},
                                {value: "endBlock|1", label: "End date (farthest first)"},
                                {value: "description|0", label: "Description"}
                            ]}>
                    </Select>

                    <Select className="market-status"
                            value={ this.state.selectedMarketStatus }
                            name="market-status"
                            searchable={false}
                            clearable={false}
                            onChange={this.onChangeMarketStatus}
                            options={[
                                {value: "open", label: "Open Markets"},
                                {value: "expired", label: "Expired Markets"}
                            ]}>
                    </Select>
                </div>
                {pagination}
                <div className="row">
                    <div className="col-xs-12">
                        {tourMarketRow}
                        {markets.map(market => {
                            if (!tourMarketKey || (tourMarketKey && !tourMarketKey.eq(market.id))) {
                                return (
                                    <MarketRow
                                        key={market.id}
                                        account={account}
                                        market={market}
                                        numOpenOrders={(myOpenOrders && myOpenOrders[market._id] && myOpenOrders[market._id][1] && myOpenOrders[market._id][1].length) || 0} />
                                );
                            }
                        })}
                    </div>
                </div>
                {pagination}
                <AddMarketModal
                    show={this.state.addMarketModalOpen}
                    onHide={this.toggleAddMarketModal} />
            </div>
        );
    }

});

module.exports = MarketsPage;
