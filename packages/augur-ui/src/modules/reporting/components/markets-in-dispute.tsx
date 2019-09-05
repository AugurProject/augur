import React, { Component } from 'react';
import QuadBox from "modules/portfolio/components/common/quad-box";
import EmptyDisplay from "modules/portfolio/components/common/empty-display";
import { SwitchLabelsGroup } from "modules/common/switch-labels-group";

interface MarketsInDisputeProps {
  markets: any;
  sortByOptions: any;
}

interface MarketsInDisputeState {
  search: string;
  // sortBy: string;
  selectedTab: string;
  tabs: Array<Tab>;
  // filteredData: Array<Market>;
}

function filterComp(input, market) {
  if (!market) return false;
  return true;
}

export default class MarketsInDispute extends Component<MarketsInDisputeProps, MarketsInDisputeState> {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "dispute",
      tabs: [
        {
          key: "dispute",
          label: "dispute",
          num: 0,
        },
        {
          key: "disputeSoon",
          label: "dispute soon",
          num: 1,
        }
      ],
      search: "dispute"
    }
  }

  selectTab = (tab: string) => {
    this.setState({ selectedTab: tab });
    // const { data } = this.props;
    // let dataFiltered = this.applySearch(data, this.state.search, data[tab]);
    // dataFiltered = this.applySortBy(this.state.sortBy, dataFiltered);

    // @ts-ignore
    // this.setState({ tab });
  };

  render() {
    const { selectedTab, tabs, search } = this.state;
    const { markets, sortByOptions } = this.props;
    
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
            <EmptyDisplay
              selectedTab="disputes tab"
              filterLabel={"hello world"}
              search={search}
            />
          </>
        }
      />
    );
  }
}
