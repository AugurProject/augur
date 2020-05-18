import React, { useState, useRef } from 'react';
import QuadBox from 'modules/portfolio/components/common/quad-box';
import EmptyDisplay from 'modules/portfolio/components/common/empty-display';
import { Tab } from 'modules/portfolio/types';
import { SwitchLabelsGroup } from 'modules/common/switch-labels-group';
import MarketCard from 'modules/market-cards/containers/market-card';
import { Checkbox } from 'modules/common/form';

import PaginationStyles from 'modules/common/pagination.styles.less';
import Styles from 'modules/reporting/components/markets-in-dispute.styles.less';

import { MarketData, ReportingListState } from 'modules/types';
import { LoadingMarketCard } from 'modules/market-cards/common';
import { Pagination } from 'modules/common/pagination';
import { REPORTING_STATE, SMALL_MOBILE } from 'modules/common/constants';
import Media from 'react-media';
import { useEffect } from 'react';
import { useMarketsStore } from 'modules/markets/store/markets';
import { selectDisputingMarkets } from 'modules/markets/selectors/select-reporting-markets';
import { useAppStatusStore } from 'modules/app/store/app-status';

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
  loadCurrentlyDisputingMarkets: Function;
  loadNextWindowDisputingMarkets: Function;
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
    label: 'Amount REP Staked',
    value: SORT_REP_STAKED,
  },
  {
    label: 'Dispute Round',
    value: SORT_DISPUTE_ROUND,
  },
];

const MarketsInDispute = ({
  loadCurrentlyDisputingMarkets,
  loadNextWindowDisputingMarkets,
}: MarketsInDisputeProps) => {
  const { reportingListState } = useMarketsStore();
  const {
    loginAccount: { mixedCaseAddress: userAddress },
    isConnected,
  } = useAppStatusStore();

  const disputingMarketsMeta = reportingListState;
  const markets = selectDisputingMarkets(reportingListState);

  const [state, setState] = useState({
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
  });

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
    sortBy,
  } = state;

  const prev = useRef();

  useEffect(() => {
    if (isConnected) loadMarkets();
  }, []);

  useEffect(() => {
    if (
      isConnected !== prev?.current?.isConnected ||
      filterByMyPortfolio !== prev?.current?.filterByMyPortfolio ||
      sortBy !== prev?.current?.sortBy ||
      search !== prev?.current?.search ||
      offset !== prev?.current?.offset ||
      selectedTab !== prev?.current?.selectedTab
    ) {
      loadMarkets();
    }
    if (
      JSON.stringify(disputingMarketsMeta) !==
      JSON.stringify(prev?.current?.disputingMarketsMeta)
    ) {
      getFilteredDataMarkets(markets, disputingMarketsMeta);
    }
  }, [
    isConnected,
    filterByMyPortfolio,
    sortBy,
    search,
    offset,
    selectedTab,
    disputingMarketsMeta,
  ]);

  useEffect(() => {
    prev.current = {
      isConnected,
      filterByMyPortfolio,
      sortBy,
      search,
      offset,
      selectedTab,
      disputingMarketsMeta,
    };
  }, [
    isConnected,
    filterByMyPortfolio,
    sortBy,
    search,
    offset,
    selectedTab,
    disputingMarketsMeta,
  ]);

  function toggleOnlyMyPortfolio() {
    setState({
      ...state,
      filterByMyPortfolio: !filterByMyPortfolio,
    });
  }

  function loadMarkets() {
    const filterOptions = getLoadMarketsFiltersOptions();
    getLoadMarketsMethods().map(loader => loader.method(filterOptions));
  }

  function setTabCounts(tabs, tabName, marketCount) {
    const index = tabName === TAB_CURRENT ? 0 : 1;
    tabs[index].num = marketCount;
    return tabs;
  }

  function getLoadMarketsMethods() {
    return [
      { method: loadCurrentlyDisputingMarkets, tabName: TAB_CURRENT },
      { method: loadNextWindowDisputingMarkets, tabName: TAB_AWAITING },
    ];
  }

  function getLoadMarketsFiltersOptions() {
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
  }

  function updateDropdown(sortBy) {
    setState({ ...state, sortBy, ...DEFAULT_PAGINATION });
  }

  function setOffset(offset) {
    setState({
      ...state,
      offset,
      isLoadingMarkets: true,
      filteredData: defaultTabs,
    });
  }

  function selectTab(selectedTab: string) {
    setState({
      ...state,
      selectedTab,
      ...DEFAULT_PAGINATION,
    });
  }

  function onSearchChange(search: string) {
    setState({
      ...state,
      search,
      ...DEFAULT_PAGINATION,
    });
  }

  function getFilteredDataMarkets(
    markets: DisputingMarkets,
    disputingMarketsMeta: ReportingListState
  ) {
    const currentIsLoading =
      disputingMarketsMeta[REPORTING_STATE.CROWDSOURCING_DISPUTE]?.isLoading;
    const awaitingIsLoading =
      disputingMarketsMeta[REPORTING_STATE.AWAITING_NEXT_WINDOW]?.isLoading;
    const filteredData = {
      [TAB_CURRENT]: markets[REPORTING_STATE.CROWDSOURCING_DISPUTE],
      [TAB_AWAITING]: markets[REPORTING_STATE.AWAITING_NEXT_WINDOW],
    };
    let newTabs = setTabCounts(
      tabs,
      TAB_CURRENT,
      markets[REPORTING_STATE.CROWDSOURCING_DISPUTE].length
    );
    newTabs = setTabCounts(
      tabs,
      TAB_AWAITING,
      markets[REPORTING_STATE.AWAITING_NEXT_WINDOW].length
    );
    const marketCount = filteredData[selectedTab].length;
    const showPagination = marketCount > limit;
    setState({
      ...state,
      filteredData,
      tabs: newTabs,
      isLoadingMarkets:
        selectedTab === TAB_CURRENT ? currentIsLoading : awaitingIsLoading,
      showPagination,
      marketCount,
    });
  }

  const { label } = tabs.find(tab => tab.key === selectedTab);
  const checkBox = {
    label: 'Only Markets In My Portfolio',
    action: toggleOnlyMyPortfolio,
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
        onSearchChange={onSearchChange}
        sortByOptions={sortByOptions}
        updateDropdown={updateDropdown}
        h1Title={true}
        bottomBarContent={
          <SwitchLabelsGroup
            tabs={tabs}
            selectedTab={selectedTab}
            selectTab={selectTab}
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
                title="Markets In Dispute"
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
                  action={setOffset}
                  updateLimit={null}
                />
              </div>
            )}
          </div>
        }
      />
    </div>
  );
};

export default MarketsInDispute;
