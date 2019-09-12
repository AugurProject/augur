import React, { Component } from 'react';
import QuadBox from 'modules/portfolio/components/common/quad-box';
import EmptyDisplay from 'modules/portfolio/components/common/empty-display';
import { Tab } from 'modules/portfolio/types';
import { SwitchLabelsGroup } from 'modules/common/switch-labels-group';
import { REPORTING_STATE } from 'modules/common/constants';
import MarketCard from 'modules/market-cards/containers/market-card';
import { convertMarketInfoToMarketData } from 'utils/convert-marketInfo-marketData';
import { createBigNumber } from 'utils/create-big-number';
import { Checkbox } from 'modules/common/form';

import Styles from 'modules/reporting/components/markets-in-dispute.styles.less';
import { MarketData } from 'modules/types';
import { Getters } from '@augurproject/sdk/src';
import { selectMarket } from 'modules/markets/selectors/market';

const ITEMS_PER_SECTION = 10;
const NUM_LOADING_CARDS = 3;
const TAB_CURRENT = 'current';
const TAB_AWAITING = 'awaiting';

interface MarketsInDisputeProps {
  isConnected: boolean;
  userAddress: string;
  loadCurrentlyDisputingMarkets: Function;
  loadNextWindowDisputingMarkets: Function;
}

interface MarketsInDisputeState {
  search: string;
  selectedTab: string;
  tabs: Tab[];
  filteredData: MarketData[];
  sortBy: string;
  offset: number;
  limit: number;
  showPagination: boolean;
  marketCount: number;
  isLoadingMarkets: boolean;
  sortByDisputeRounds: boolean;
  sortByRepAmount: boolean;
  filterByMyPortfolio: boolean;
}

const sortByOptions = [
  {
    label: 'Amount REP Staked',
    value: 'repStaked',
    comp(marketA, marketB) {
      return createBigNumber(marketB.disputeInfo.stakeCompletedTotal).minus(
        createBigNumber(marketA.disputeInfo.stakeCompletedTotal)
      );
    },
  },
  {
    label: 'Dispute Round',
    value: 'disputeRound',
    comp(marketA, marketB) {
      return createBigNumber(
        marketB.disputeInfo.disputeWindow.disputeRound
      ).minus(createBigNumber(marketA.disputeInfo.disputeWindow.disputeRound));
    },
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
      filteredData: [],
      isLoadingMarkets: false,
      marketCount: 0,
      showPagination: false,
      offset: 1,
      limit: ITEMS_PER_SECTION,
      sortByDisputeRounds: false,
      sortByRepAmount: true,
      filterByMyPortfolio: false,
    };
  }

  componentDidUpdate(
    prevProps: MarketsInDisputeProps,
    prevState: MarketsInDisputeState
  ) {
    const {
      filterByMyPortfolio,
      sortByRepAmount,
      sortByDisputeRounds,
      search,
    } = this.state;
    if (
      filterByMyPortfolio !== prevState.filterByMyPortfolio ||
      sortByRepAmount !== prevState.sortByRepAmount ||
      sortByDisputeRounds !== prevState.sortByDisputeRounds ||
      search !== prevState.search
    ) {
      this.loadMarkets();
    }
  }

  componentDidMount() {
    const { isConnected } = this.props;
    if (isConnected) this.loadMarkets();
  }

  loadMarkets = () => {
    const { limit, selectedTab, tabs } = this.state;
    this.setState({ isLoadingMarkets: true });
    let loadDisputeMarkets = this.getLoadMarketsMethod();
    const filterOptions = this.getLoadMarketsFiltersOptions();
    loadDisputeMarkets(
      filterOptions,
      (err, marketResults: Getters.Markets.MarketList) => {
        if (err) return console.log('error', err);
        const filteredData = marketResults.markets.map(m => selectMarket(m.id));
        const marketCount = marketResults.meta.marketCount;
        const showPagination = marketCount > limit;
        const updatedTabs = this.getUpdatedTabs(
          selectedTab === TAB_CURRENT ? marketCount : 0,
          selectedTab === TAB_AWAITING ? marketCount : 0,
          tabs
        );
        this.setState({
          filteredData,
          showPagination,
          marketCount,
          isLoadingMarkets: false,
          tabs: updatedTabs,
        });
      }
    );
  };

  getLoadMarketsMethod = () => {
    const { selectedTab } = this.state;
    const {
      loadCurrentlyDisputingMarkets,
      loadNextWindowDisputingMarkets,
    } = this.props;
    let loadDisputeMarkets = loadCurrentlyDisputingMarkets;
    if (selectedTab === TAB_AWAITING)
      loadDisputeMarkets = loadNextWindowDisputingMarkets;
    return loadDisputeMarkets;
  };

  getLoadMarketsFiltersOptions = () => {
    const { userAddress } = this.props;
    const {
      limit,
      offset,
      filterByMyPortfolio,
      sortByRepAmount,
      sortByDisputeRounds,
      search,
    } = this.state;

    let filterOptions = {
      limit,
      offset,
      sortByRepAmount,
      sortByDisputeRounds,
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
    console.log('sortBy', sortBy);
  };

  selectTab = (selectedTab: string) => {
    this.setState({
      selectedTab,
    });
  };

  getUpdatedTabs = (currentLength, awaitingLength, tabs) => {
    const updatedTabs = tabs;
    updatedTabs[0].num = currentLength;
    updatedTabs[1].num = awaitingLength;
    return updatedTabs;
  };

  onSearchChange = (input: string) => {
    this.setState({
      search: input,
    });
  };

  toggleOnlyMyPortfolio = value => {
    const { filterByMyPortfolio } = this.state;
    this.setState({
      filterByMyPortfolio: !filterByMyPortfolio,
    });
  };

  render() {
    const {
      selectedTab,
      tabs,
      search,
      filteredData,
      filterByMyPortfolio,
    } = this.state;
    const { label } = tabs.find(tab => tab.key === selectedTab);
    const { userAddress } = this.props;
    const checkBox = {
      label: 'Only Markets In My Portfolio',
      action: this.toggleOnlyMyPortfolio,
      didCheck: filterByMyPortfolio,
    };
    return (
      <QuadBox
        title="Markets In Dispute"
        switchHeaders={true}
        showFilterSearch={true}
        onSearchChange={this.onSearchChange}
        sortByOptions={sortByOptions}
        updateDropdown={this.updateDropdown}
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
            {filteredData.length === 0 && (
              <EmptyDisplay
                selectedTab={label}
                filterLabel={''}
                search={search}
              />
            )}
            {filteredData.length > 0 &&
              filteredData.map(market => (
                <MarketCard key={market.id} market={market} />
              ))}
          </div>
        }
      />
    );
  }
}
