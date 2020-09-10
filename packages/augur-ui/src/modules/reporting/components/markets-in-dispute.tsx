import React, { useState, useEffect } from 'react';
import EmptyDisplay from 'modules/portfolio/components/common/empty-display';
import { SwitchLabelsGroup } from 'modules/common/switch-labels-group';
import MarketCard from 'modules/market-cards/market-card';
import { Checkbox } from 'modules/common/form';

import PaginationStyles from 'modules/common/pagination.styles.less';
import Styles from 'modules/reporting/components/markets-in-dispute.styles.less';

import { MarketData, ReportingListState } from 'modules/types';
import { LoadingMarketCard } from 'modules/market-cards/common';
import { Pagination } from 'modules/common/pagination';
import { REPORTING_STATE, SMALL_MOBILE } from 'modules/common/constants';
import Media from 'react-media';
import { useMarketsStore } from 'modules/markets/store/markets';
import { selectDisputingMarkets } from 'modules/markets/selectors/select-reporting-markets';
import { useAppStatusStore } from 'modules/app/store/app-status';
import {
  loadCurrentlyDisputingMarkets,
  loadNextWindowDisputingMarkets,
} from 'modules/markets/actions/load-markets';
import QuadBox from 'modules/portfolio/components/common/quad-box';

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
  offset: DEFAULT_PAGE,
  isLoadingMarkets: true,
  filteredData: defaultTabs,
};

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

const MarketsInDispute = () => {
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
    filteredData: defaultTabs,
    isLoadingMarkets: true,
    offset: DEFAULT_PAGE,
    filterByMyPortfolio: false,
  });

  const {
    selectedTab,
    search,
    filterByMyPortfolio,
    isLoadingMarkets,
    offset,
    filteredData,
    sortBy,
  } = state;

  useEffect(() => {
    if (isConnected) loadMarkets();
  }, [isConnected, filterByMyPortfolio, sortBy, search, offset, selectedTab]);

  useEffect(() => {
    getFilteredDataMarkets(disputingMarketsMeta);
  }, [disputingMarketsMeta]);

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

  function getLoadMarketsMethods() {
    return [
      { method: loadCurrentlyDisputingMarkets, tabName: TAB_CURRENT },
      { method: loadNextWindowDisputingMarkets, tabName: TAB_AWAITING },
    ];
  }

  function getLoadMarketsFiltersOptions() {
    let filterOptions = {
      limit: ITEMS_PER_SECTION,
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

  function getFilteredDataMarkets(disputingMarketsMeta: ReportingListState) {
    const currentIsLoading =
      disputingMarketsMeta[REPORTING_STATE.CROWDSOURCING_DISPUTE]?.isLoading;
    const awaitingIsLoading =
      disputingMarketsMeta[REPORTING_STATE.AWAITING_NEXT_WINDOW]?.isLoading;
    const filteredData = {
      [TAB_CURRENT]: markets[REPORTING_STATE.CROWDSOURCING_DISPUTE],
      [TAB_AWAITING]: markets[REPORTING_STATE.AWAITING_NEXT_WINDOW],
    };

    setState({
      ...state,
      filteredData,
      isLoadingMarkets:
        selectedTab === TAB_CURRENT ? currentIsLoading : awaitingIsLoading,
    });
  }

  const tabs = [
    {
      key: TAB_CURRENT,
      label: 'Currently Disputing',
      num: markets[REPORTING_STATE.CROWDSOURCING_DISPUTE].length,
    },
    {
      key: TAB_AWAITING,
      label: 'Awaiting Next Dispute',
      num: markets[REPORTING_STATE.AWAITING_NEXT_WINDOW].length,
    },
  ];

  const { label } = tabs.find(tab => tab.key === selectedTab);
  const checkBox = {
    label: 'Only Markets In My Portfolio',
    action: toggleOnlyMyPortfolio,
    didCheck: filterByMyPortfolio,
  };

  const marketCount = filteredData[selectedTab].length;
  const showPagination = filteredData[selectedTab].length > ITEMS_PER_SECTION;
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
        onSearchChange={onSearchChange}
        sortByOptions={sortByOptions}
        updateDropdown={updateDropdown}
        headerComplement={
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
        subheader={
          <SwitchLabelsGroup
            tabs={tabs}
            selectedTab={selectedTab}
            selectTab={selectTab}
            checkBox={userAddress && checkBox}
          />
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
                  itemsPerPage={ITEMS_PER_SECTION}
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
