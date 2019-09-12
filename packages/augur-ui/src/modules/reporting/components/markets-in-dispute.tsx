import React, { Component } from 'react';
import QuadBox from 'modules/portfolio/components/common/quad-box';
import EmptyDisplay from 'modules/portfolio/components/common/empty-display';
import { Market, Tab } from 'modules/portfolio/types';
import { SwitchLabelsGroup } from 'modules/common/switch-labels-group';
import { REPORTING_STATE } from 'modules/common/constants';
import MarketCard from 'modules/market-cards/containers/market-card';
import { convertMarketInfoToMarketData } from 'utils/convert-marketInfo-marketData';
import { createBigNumber } from 'utils/create-big-number';
import { Checkbox } from 'modules/common/form';

import Styles from 'modules/reporting/components/markets-in-dispute.styles.less';

interface MarketsInDisputeProps {
  markets: Object;
  address: string;
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
    label: 'Amount REP Staked',
    value: 'repStaked',
    comp(marketA, marketB) {
      return (
        createBigNumber(marketB.disputeInfo.stakeCompletedTotal).minus(
        createBigNumber(marketA.disputeInfo.stakeCompletedTotal))
      );
    },
  },
  {
    label: 'Dispute Round',
    value: 'disputeRound',
    comp(marketA, marketB) {
      return (
        createBigNumber(marketB.disputeInfo.disputeWindow.disputeRound).minus(createBigNumber(marketA.disputeInfo.disputeWindow.disputeRound))
      );
    },
  },
];

const { CROWDSOURCING_DISPUTE, AWAITING_NEXT_WINDOW } = REPORTING_STATE;

export default class MarketsInDispute extends Component<
  MarketsInDisputeProps,
  MarketsInDisputeState
> {
  constructor(props) {
    super(props);
    // default to current
    const updatedData = this.getFilteredData(
      props.markets,
      sortByOptions[0].value,
      '',
      false
    );
    this.state = {
      search: '',
      selectedTab: 'current',
      onlyMyMarkets: false,
      sortBy: sortByOptions[0].value,
      tabs: [
        {
          key: 'current',
          label: 'Currently Disputing',
          num: updatedData.current.length,
        },
        {
          key: 'awaiting',
          label: 'Awaiting Next Dispute',
          num: updatedData.awaiting.length,
        },
      ],
      filteredData: updatedData.current,
      didCheck: false,
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

  updateFilter = (input: string) => {
    const { markets } = this.props;
    const { selectedTab, sortBy, search, didCheck, tabs } = this.state;
    const updatedData = this.getFilteredData(markets, sortBy, search, didCheck);
    const updatedTabs = this.getUpdatedTabs(
      updatedData.current.length,
      updatedData.awaiting.length,
      tabs
    );
    this.setState({
      filteredData: updatedData[selectedTab],
      sortBy: input,
      tabs: updatedTabs,
    });
  };

  applyOnlyMyMarkets = (filteredData: Array<Market>) => {
    const { address } = this.props;
    return filteredData.filter(market => {
      if (market.author === address || market.designatedReporter === address) {
        return true;
      } else {
        return false;
      }
    });
  };

  applySort = (filteredData: Array<Market>, sortBy) => {
    const sortByObj = sortByOptions.find(opt => opt.value === sortBy);
    return filteredData.sort(sortByObj.comp);
  };

  applySearch = (filteredData: Array<Market>, search: string) => {
    if (search.length > 0)
      return filteredData.filter(item =>
        item.description.toLowerCase().includes(search.toLowerCase())
      );
    return filteredData;
  };

  getFilteredData = (markets, sortBy, search, didCheck) => {
    let current = this.applySort(
      this.applySearch(this.filterDisputingMarkets(markets, true), search),
      sortBy
    );
    let awaiting = this.applySort(
      this.applySearch(this.filterDisputingMarkets(markets), search),
      sortBy
    );
    if (didCheck) {
      current = this.applyOnlyMyMarkets(current);
      awaiting = this.applyOnlyMyMarkets(awaiting);
    }
    return { current, awaiting };
  };

  selectTab = (selectedTab: string) => {
    const { markets } = this.props;
    const { tabs, sortBy, search, didCheck } = this.state;
    const updatedData = this.getFilteredData(markets, sortBy, search, didCheck);
    const updatedTabs = this.getUpdatedTabs(
      updatedData.current.length,
      updatedData.awaiting.length,
      tabs
    );
    // @ts-ignore
    this.setState({
      selectedTab,
      filteredData: updatedData[selectedTab],
      tabs: updatedTabs,
    });
  };

  getUpdatedTabs = (currentLength, awaitingLength, tabs) => {
    const updatedTabs = tabs;
    updatedTabs[0].num = currentLength;
    updatedTabs[1].num = awaitingLength;
    return updatedTabs;
  };

  onSearchChange = (input: string) => {
    const { markets } = this.props;
    const { tabs, selectedTab, sortBy, didCheck } = this.state;
    const updatedData = this.getFilteredData(markets, sortBy, input, didCheck);
    const updatedTabs = this.getUpdatedTabs(
      updatedData.current.length,
      updatedData.awaiting.length,
      tabs
    );
    this.setState({
      filteredData: updatedData[selectedTab],
      search: input,
      tabs: updatedTabs,
    });
  };

  toggleOnlyMyPortfolio = () => {
    const { didCheck, selectedTab, sortBy, search, tabs } = this.state;
    const { markets } = this.props;
    const updatedData = this.getFilteredData(markets, sortBy, search, !didCheck);
    const updatedTabs = this.getUpdatedTabs(
      updatedData.current.length,
      updatedData.awaiting.length,
      tabs
    );
    this.setState({
      didCheck: !didCheck,
      filteredData: updatedData[selectedTab],
      tabs: updatedTabs,
    });
  };

  render() {
    const { selectedTab, tabs, search, filteredData, didCheck } = this.state;
    const { label } = tabs.find(tab => tab.key === selectedTab);
    const { address } = this.props;
    const checkBox = {
      label: 'Only Markets In My Portfolio',
      action: this.toggleOnlyMyPortfolio,
      didCheck,
    };
    return (
      <QuadBox
        title="Markets In Dispute"
        switchHeaders={true}
        showFilterSearch={true}
        onSearchChange={this.onSearchChange}
        sortByOptions={sortByOptions}
        updateDropdown={this.updateFilter}
        bottomBarContent={
          <SwitchLabelsGroup
            tabs={tabs}
            selectedTab={selectedTab}
            selectTab={this.selectTab}
            checkBox={address && checkBox}
          />
        }
        leftContent={
          address && (
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
