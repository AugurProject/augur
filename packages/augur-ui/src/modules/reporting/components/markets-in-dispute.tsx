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
  sortByOptions: Object;
}

interface MarketsInDisputeState {
  search: string;
  // sortBy: string;
  selectedTab: string;
  tabs: Array<Tab>;
  filteredData: Array<Market>;
}

function filterComp(input, market) {
  if (!market) return false;
  return true;
}

const { CROWDSOURCING_DISPUTE, AWAITING_NEXT_WINDOW } = REPORTING_STATE;

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
    };
  }

  filterDisputingMarkets = (markets: Object, onlySlow = false) => {
    const filteredData = [];
    for (let [key, value] of Object.entries(markets)) {
      if (
        (value.reportingState === CROWDSOURCING_DISPUTE && onlySlow) ||
        value.reportingState === AWAITING_NEXT_WINDOW
      ) {
        filteredData.push(convertMarketInfoToMarketData(value));
      }
    }
    return filteredData;
  };

  selectTab = (selectedTab: string) => {
    this.setState({ selectedTab });
    const { markets } = this.props;
    // let filteredData = this.applySearch(data, this.state.search, data[tab]);
    // filteredData = this.applySortBy(this.state.sortBy, dataFiltered);
    const filteredData = this.filterDisputingMarkets(
      markets,
      selectedTab === "current"
    );

    // @ts-ignore
    this.setState({ filteredData });
  };

  onSearchChange = (input: string) => {
    this.setState({ search: input });

    const { markets } = this.props;
    const { selectedTab } = this.state;
    const filteredData = this.filterDisputingMarkets(markets, selectedTab === "current");
    // const tabData = data[selectedTab];
    // const filteredData = this.applySearch(data, input, tabData);

    this.setState({ filteredData });
  };

  render() {
    const { selectedTab, tabs, search, filteredData } = this.state;
    const { sortByOptions } = this.props;
    return (
      <QuadBox
        title="Markets In Dispute"
        switchHeaders={true}
        showFilterSearch={true}
        onSearchChange={filterComp}
        sortByOptions={sortByOptions}
        updateDropdown={filterComp}
        bottomBarContent={
          <SwitchLabelsGroup
            tabs={tabs}
            selectedTab={selectedTab}
            selectTab={this.selectTab}
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
