import React, { Component } from 'react';
import QuadBox from 'modules/portfolio/components/common/quad-box';
import EmptyDisplay from 'modules/portfolio/components/common/empty-display';
import { Market, Tab } from 'modules/portfolio/types';
import { SwitchLabelsGroup } from 'modules/common/switch-labels-group';
import { REPORTING_STATE } from 'modules/common/constants';
import MarketCard from 'modules/market-cards/containers/market-card';
import { convertMarketInfoToMarketData } from 'utils/convert-marketinfo-marketData';

interface MarketsInDisputeProps {
  markets: Object;
  isLogged: boolean;
}

interface MarketsInDisputeState {
  search: string;
  onlyMyMarkets: boolean;
  selectedTab: string;
  tabs: Array<Tab>;
  filteredData: Array<Market>;
  didCheck: boolean;
  sortBy: string;
}

const sortByOptions = [
  {
    label: "Amount REP Staked",
    value: "repStaked",
    comp(marketA, marketB) {
      return parseFloat(marketB.disputeInfo.stakeCompletedTotal) - parseFloat(marketA.disputeInfo.stakeCompletedTotal);
    }
  },
  {
    label: "Dispute Round",
    value: "disputeRound",
    comp(marketA, marketB) {
      return marketB.disputeInfo.disputeWindow.disputeRound - marketA.disputeInfo.disputeWindow.disputeRound;
    }
  }
];

const { CROWDSOURCING_DISPUTE, AWAITING_NEXT_WINDOW, OPEN_REPORTING } = REPORTING_STATE;

export default class MarketsInDispute extends Component<
  MarketsInDisputeProps,
  MarketsInDisputeState
> {
  constructor(props) {
    super(props);
    // default to current
    const current = this.filterDisputingMarkets(props.markets, true);
    const awaiting = this.filterDisputingMarkets(props.markets);
    this.state = {
      search: 'Currently Disputing',
      selectedTab: 'current',
      onlyMyMarkets: false,
      sortBy: sortByOptions[0].value,
      tabs: [
        {
          key: 'current',
          label: 'Currently Disputing',
          num: current.length,
        },
        {
          key: 'awaiting',
          label: 'Awaiting Next Dispute',
          num: awaiting.length,
        },
      ],
      filteredData: current,
      didCheck: false,
    };
  }

  filterDisputingMarkets = (markets: Object, onlySlow = false) => {
    const filteredData = [];
    for (let [key, value] of Object.entries(markets)) {
      if (
        (value.reportingState === CROWDSOURCING_DISPUTE && onlySlow) ||
        value.reportingState === AWAITING_NEXT_WINDOW || value.reportingState === OPEN_REPORTING
      ) {
        filteredData.push(convertMarketInfoToMarketData(value));
      }
    }
    console.log("filterDisputingMarkets");
    return filteredData;
  };

  updateFilter = (input: string) => {
    const sortByObj = sortByOptions.find(opt => opt.value === input);
    console.log(sortByObj);
    const { markets } = this.props;
    const { selectedTab } = this.state;
    const filteredData = this.filterDisputingMarkets(
      markets,
      selectedTab === 'current'
    );

    console.log(filteredData.sort(sortByObj.comp));
  }

  applySort = (filteredData: Array<Market>) => {
    const { sortBy } = this.state;
    // filterData
  }

  selectTab = (selectedTab: string) => {
    const { markets } = this.props;
    const { tabs } = this.state;
    // let filteredData = this.applySearch(data, this.state.search, data[tab]);
    // filteredData = this.applySortBy(this.state.sortBy, dataFiltered);
    const filteredData = this.filterDisputingMarkets(
      markets,
      selectedTab === 'current'
    );
    const updatedTabs = tabs;
    if (selectedTab === 'current') {
      updatedTabs[0].num = filteredData.length;
    } else {
      updatedTabs[1].num = filteredData.length;
    }
    // @ts-ignore
    this.setState({ selectedTab, filteredData, tabs: updatedTabs });
  };

  onSearchChange = (input: string) => {
    const { markets } = this.props;
    const { selectedTab } = this.state;
    const filteredData = this.filterDisputingMarkets(
      markets,
      selectedTab === 'current'
    );
    // const tabData = data[selectedTab];
    // const filteredData = this.applySearch(data, input, tabData);
    this.setState({ filteredData, search: input });
  };

  toggleOnlyMyPortfolio = () => {
    const { didCheck, selectedTab } = this.state;
    const { markets } = this.props;
    let filteredData;

    if (didCheck) {
      filteredData = this.filterDisputingMarkets(markets, selectedTab === 'current');
    }
    this.setState({ didCheck: !didCheck, filteredData })
  }

  render() {
    const { selectedTab, tabs, search, filteredData, didCheck } = this.state;
    const { isLogged } = this.props;
    const checkBox = {
      label: 'Only Markets In My Portfolio',
      action: v => {
        this.setState({ didCheck: !didCheck });
      },
      didCheck,
    };
    return (
      <QuadBox
        title="Markets In Dispute"
        switchHeaders={true}
        showFilterSearch={true}
        onSearchChange={(search) => console.log(search)}
        sortByOptions={sortByOptions}
        updateDropdown={this.updateFilter}
        bottomBarContent={
          <SwitchLabelsGroup
            tabs={tabs}
            selectedTab={selectedTab}
            selectTab={this.selectTab}
            checkBox={isLogged && checkBox}
          />
        }
        content={
          <>
            {filteredData.length === 0 && (
              <EmptyDisplay
                selectedTab="Currently Disputing"
                filterLabel={''}
                search={search}
              />
            )}
            {filteredData.length > 0 &&
              filteredData.map(market => (
                <MarketCard key={market.id} market={market} />
              ))}
          </>
        }
      />
    );
  }
}
