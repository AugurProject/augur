import React, { Component } from 'react';
import QuadBox from 'modules/portfolio/components/common/quad-box';
import EmptyDisplay from 'modules/portfolio/components/common/empty-display';
import { Tab } from 'modules/portfolio/types';
import { SwitchLabelsGroup } from 'modules/common/switch-labels-group';
import MarketCard from 'modules/market-cards/containers/market-card';
import { Checkbox } from 'modules/common/form';

import PaginationStyles from 'modules/common/pagination.styles.less';
import Styles from 'modules/reporting/components/markets-in-dispute.styles.less';

import { MarketData, ReportingListState } from 'modules/types';
import type { Getters } from '@augurproject/sdk';
import { LoadingMarketCard } from 'modules/market-cards/common';
import { Pagination } from 'modules/common/pagination';
import { REPORTING_STATE, SMALL_MOBILE } from 'modules/common/constants';
import Media from 'react-media';

const ITEMS_PER_SECTION = 10;
const NUM_LOADING_CARDS = 5;
const DEFAULT_PAGE = 1;
const TAB_CURRENT = 'current';
const TAB_AWAITING = 'awaiting';
const SORT_REP_STAKED = 'totalRepStakedInMarket';
const SORT_DISPUTE_ROUND = 'disputeRound';
const defaultTabs = {
  [TAB_CURRENT]: [],
  [TAB_AWAITING]: [],
};
const DEFAULT_PAGINATION = {
  limit: ITEMS_PER_SECTION,
  offset: DEFAULT_PAGE,
  isLoadingMarkets: true,
  filteredData: defaultTabs,
};

interface DisputingMarkets {
  [reportingState: string]: MarketData[];
}

interface FilteredData {
  [TAB_CURRENT]: MarketData[];
  [TAB_AWAITING]: MarketData[];
}
interface MarketsInDisputeProps {
  isConnected: boolean;
  userAddress: string;
  loadCurrentlyDisputingMarkets: Function;
  loadNextWindowDisputingMarkets: Function;
  markets: DisputingMarkets;
  disputingMarketsMeta: ReportingListState;
}

interface MarketsInDisputeState {
  search: string;
  selectedTab: string;
  tabs: Tab[];
  filteredData: FilteredData;
  sortBy: string;
  offset: number;
  limit: number;
  showPagination: boolean;
  marketCount: number;
  isLoadingMarkets: boolean;
  filterByMyPortfolio: boolean;
}

const sortByOptions = [
  {
    label: 'Amount REPv2 Staked',
    value: SORT_REP_STAKED,
  },
  {
    label: 'Dispute Round',
    value: SORT_DISPUTE_ROUND,
  },
];

export default class MarketsInDispute extends Component<
  MarketsInDisputeProps,
  MarketsInDisputeState
> {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      selectedTab: TAB_CURRENT,
      sortBy: sortByOptions[0].value,
      tabs: [
        {
          key: TAB_CURRENT,
          label: 'Currently Disputing',
          num: 0,
        },
        {
          key: TAB_AWAITING,
          label: 'Awaiting Next Dispute',
          num: 0,
        },
      ],
      filteredData: defaultTabs,
      isLoadingMarkets: true,
      marketCount: 0,
      showPagination: false,
      offset: DEFAULT_PAGE,
      limit: ITEMS_PER_SECTION,
      filterByMyPortfolio: false,
    };
  }

  componentDidUpdate(
    prevProps: MarketsInDisputeProps,
    prevState: MarketsInDisputeState
  ) {
    const { isConnected, disputingMarketsMeta, markets } = this.props;
    const {
      filterByMyPortfolio,
      sortBy,
      selectedTab,
      search,
      offset,
    } = this.state;
    if (
      isConnected !== prevProps.isConnected ||
      filterByMyPortfolio !== prevState.filterByMyPortfolio ||
      sortBy !== prevState.sortBy ||
      search !== prevState.search ||
      offset !== prevState.offset ||
      selectedTab !== prevState.selectedTab
    ) {
      this.loadMarkets();
    }
    if (
      JSON.stringify(disputingMarketsMeta) !==
      JSON.stringify(prevProps.disputingMarketsMeta)
    ) {
      this.getFilteredDataMarkets(markets, disputingMarketsMeta);
    }
  }

  componentDidMount() {
    const { isConnected } = this.props;
    if (isConnected) this.loadMarkets();
  }

  loadMarkets = () => {
    const filterOptions = this.getLoadMarketsFiltersOptions();
    this.getLoadMarketsMethods().map(loader => loader.method(filterOptions));
  };

  setTabCounts = (tabs, tabName, marketCount) => {
    const index = tabName === TAB_CURRENT ? 0 : 1;
    tabs[index].num = marketCount;
    return tabs;
  };

  getLoadMarketsMethods = () => {
    const {
      loadCurrentlyDisputingMarkets,
      loadNextWindowDisputingMarkets,
    } = this.props;
    return [
      { method: loadCurrentlyDisputingMarkets, tabName: TAB_CURRENT },
      { method: loadNextWindowDisputingMarkets, tabName: TAB_AWAITING },
    ];
  };

  getLoadMarketsFiltersOptions = () => {
    const { userAddress } = this.props;
    const { limit, offset, filterByMyPortfolio, sortBy, search } = this.state;

    let filterOptions = {
      limit,
      offset,
      sortBy,
      search,
    };
    if (filterByMyPortfolio) {
      filterOptions = Object.assign(filterOptions, {
        userPortfolioAddress: userAddress,
      });
    }
    return filterOptions;
  };

  updateDropdown = sortBy => {
    this.setState({ sortBy, ...DEFAULT_PAGINATION });
  };

  setOffset = offset => {
    this.setState({
      offset,
      isLoadingMarkets: true,
      filteredData: defaultTabs,
    });
  };

  selectTab = (selectedTab: string) => {
    this.setState({
      selectedTab,
      ...DEFAULT_PAGINATION,
    });
  };

  onSearchChange = (search: string) => {
    this.setState({
      search,
      ...DEFAULT_PAGINATION,
    });
  };

  toggleOnlyMyPortfolio = () => {
    const { filterByMyPortfolio } = this.state;
    this.setState({
      filterByMyPortfolio: !filterByMyPortfolio,
    });
  };

  getFilteredDataMarkets = (
    markets: DisputingMarkets,
    disputingMarketsMeta: ReportingListState
  ) => {
    const { tabs, selectedTab, limit } = this.state;
    const currentIsLoading =
      disputingMarketsMeta[REPORTING_STATE.CROWDSOURCING_DISPUTE].isLoading;
    const awaitingIsLoading =
      disputingMarketsMeta[REPORTING_STATE.AWAITING_NEXT_WINDOW].isLoading;
    const filteredData = {
      [TAB_CURRENT]: markets[REPORTING_STATE.CROWDSOURCING_DISPUTE],
      [TAB_AWAITING]: markets[REPORTING_STATE.AWAITING_NEXT_WINDOW],
    };
    let newTabs = this.setTabCounts(
      tabs,
      TAB_CURRENT,
      markets[REPORTING_STATE.CROWDSOURCING_DISPUTE].length
    );
    newTabs = this.setTabCounts(
      tabs,
      TAB_AWAITING,
      markets[REPORTING_STATE.AWAITING_NEXT_WINDOW].length
    );
    const marketCount = filteredData[selectedTab].length;
    const showPagination = marketCount > limit;
    this.setState({
      filteredData,
      tabs: newTabs,
      isLoadingMarkets:
        selectedTab === TAB_CURRENT ? currentIsLoading : awaitingIsLoading,
      showPagination,
      marketCount,
    });
  };

  render() {
    const {
      selectedTab,
      tabs,
      search,
      filterByMyPortfolio,
      isLoadingMarkets,
      showPagination,
      offset,
      limit,
      marketCount,
      filteredData,
    } = this.state;
    const { label } = tabs.find(tab => tab.key === selectedTab);
    const { userAddress } = this.props;
    const checkBox = {
      label: 'Only Markets In My Portfolio',
      action: this.toggleOnlyMyPortfolio,
      didCheck: filterByMyPortfolio,
    };
    return (
      <div className={Styles.MarketsInDispute}>
        <Media query={SMALL_MOBILE}>
          {matches =>
            matches && (
              <label htmlFor="checkbox">
                <Checkbox
                  id="checkbox"
                  value={checkBox.didCheck}
                  isChecked={checkBox.didCheck}
                  onClick={(e: React.SyntheticEvent) => {
                    e.preventDefault();
                    checkBox.action(e);
                  }}
                />
                {checkBox.label}
              </label>
            )
          }
        </Media>
        <QuadBox
          title="Markets In Dispute"
          switchHeaders={true}
          showFilterSearch={true}
          onSearchChange={this.onSearchChange}
          sortByOptions={sortByOptions}
          updateDropdown={this.updateDropdown}
          h1Title={true}
          bottomBarContent={
            <SwitchLabelsGroup
              tabs={tabs}
              selectedTab={selectedTab}
              selectTab={this.selectTab}
              checkBox={userAddress && checkBox}
            />
          }
          leftContent={
            userAddress && (
              <label className={Styles.OnlyPortfolio} htmlFor="checkbox">
                <Checkbox
                  id="checkbox"
                  value={checkBox.didCheck}
                  isChecked={checkBox.didCheck}
                  onClick={(e: React.SyntheticEvent) => {
                    e.preventDefault();
                    checkBox.action();
                  }}
                />
                {checkBox.label}
              </label>
            )
          }
          content={
            <div className={Styles.MarketCards}>
              {!isLoadingMarkets && filteredData[selectedTab].length === 0 && (
                <EmptyDisplay
                  selectedTab={label}
                  filterLabel={''}
                  search={search}
                />
              )}
              {isLoadingMarkets &&
                filteredData[selectedTab].length === 0 &&
                new Array(NUM_LOADING_CARDS)
                  .fill(null)
                  .map((prop, index) => (
                    <LoadingMarketCard key={`${index}-loading`} />
                  ))}
              {filteredData[selectedTab].length > 0 &&
                filteredData[selectedTab].map(market => (
                  <MarketCard key={market.id} market={market} />
                ))}
              {showPagination && (
                <div className={PaginationStyles.PaginationContainer}>
                  <Pagination
                    page={offset}
                    itemCount={marketCount}
                    itemsPerPage={limit}
                    action={this.setOffset}
                    updateLimit={null}
                  />
                </div>
              )}
            </div>
          }
        />
      </div>
    );
  }
}
