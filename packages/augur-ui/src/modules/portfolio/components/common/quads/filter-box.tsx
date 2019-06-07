import React, { Component, ReactNode } from "react";

import { find } from "lodash";
import { ALL_MARKETS, END_TIME } from "modules/common/constants";
import QuadBox from "modules/portfolio/components/common/quads/quad-box";
import { SwitchLabelsGroup } from "modules/common/switch-labels-group";
import { NameValuePair, Market, Tab} from "modules/portfolio/types";
import MarketRow from "modules/portfolio/components/common/rows/market-row";
import EmptyDisplay from "modules/portfolio/components/common/tables/empty-display";
import { createTabsInfo } from "modules/portfolio/helpers/create-tabs-info";
import { isEqual } from "lodash";

export interface MarketsByReportingState {
  [type: string]: Array<Market>;
}

export interface FilterBoxProps {
  title: string;
  sortByOptions: Array<NameValuePair>;
  filteredData: Array<Market>;
  data: MarketsByReportingState;
  filterComp: Function;
  bottomRightContent?: ReactNode;
  rightContent?: Function;
  dataObj: object;
  noToggle?: boolean;
  renderToggleContent?: Function;
  filterLabel: string;
  sortByStyles?: object;
  currentAugurTimestamp: number;
  renderRightContent?: Function;
}

interface FilterBoxState {
  search: string;
  sortBy: string;
  selectedTab: string;
  tabs: Array<Tab>;
  filteredData: Array<Market>;
}

export default class FilterBox extends React.Component<FilterBoxProps, FilterBoxState>  {
  state: FilterBoxState = {
    search: "",
    selectedTab: ALL_MARKETS,
    tabs: createTabsInfo(this.props.data),
    sortBy: this.props.sortByOptions && this.props.sortByOptions[0].value,
    filteredData: this.props.data[ALL_MARKETS],
  };

  componentDidMount() {
    const filteredData = this.applySearch(this.props.data, this.state.search, this.props.data[this.state.selectedTab]);
    this.setState({ filteredData });
  }

  componentWillUpdate(nextProps) {
    if (!isEqual(nextProps.data[this.state.selectedTab], this.props.data[this.state.selectedTab])) {
      const filteredData = this.applySearch(nextProps.data, this.state.search, nextProps.data[this.state.selectedTab]);
      this.setState({ filteredData });
    }
  }

  calculateTabNums = (data: MarketsByReportingState, input: string) => {
   const { filterComp } = this.props;
   const { tabs } = this.state;

   for (var i = 0; i < tabs.length; i++) {
      const length = data[tabs[i].key].filter(filterComp.bind(this, input)).length;
      tabs[i].num = length
    }

    this.setState({ tabs });
  }

  updateSortBy = (value: string) => {
    this.setState({sortBy: value});

    let { filteredData } = this.state;
    filteredData = this.applySortBy(value, filteredData);

    this.setState({ filteredData });
  }

  onSearchChange = (input: string) => {
    this.setState({search: input});

    const { data } = this.props;
    const { selectedTab } = this.state;
    const tabData =  data[selectedTab];
    const filteredData = this.applySearch(data, input, tabData);

    this.setState({ filteredData });
  }

  selectTab = (tab: string) => {
    this.setState({selectedTab: tab})

    const { data } = this.props;
    let dataFiltered = this.applySearch(data, this.state.search, data[tab]);
    dataFiltered = this.applySortBy(this.state.sortBy, dataFiltered);

    // @ts-ignore
    this.setState({filteredData: dataFiltered, tab });

  }

  applySearch = (data: MarketsByReportingState, input: string, filteredData: Array<Market>) => {
    const { filterComp } = this.props;
    const { sortBy } = this.state;

    filteredData = filteredData.filter(filterComp.bind(this, input));
    filteredData = this.applySortBy(sortBy, filteredData);

    this.calculateTabNums(data, input);

    return filteredData;
  }

  applySortBy = (value: string, data: Array<Market>) => {
    const valueObj = find(this.props.sortByOptions, { value });
    let comp: any;

    if (valueObj && valueObj.comp) {
      comp = valueObj.comp;
    }
    const { currentAugurTimestamp } = this.props;

    if (valueObj && valueObj.value === END_TIME) {
      comp = (marketA, marketB)  => {
          if (
            marketA.endTime.timestamp < currentAugurTimestamp &&
            marketB.endTime.timestamp < currentAugurTimestamp
          ) {
            return marketB.endTime.timestamp - marketA.endTime.timestamp;
          }
          if (marketA.endTime.timestamp < currentAugurTimestamp) {
            return 1;
          }
          if (marketB.endTime.timestamp < currentAugurTimestamp) {
            return -1;
          }
          return marketA.endTime.timestamp - marketB.endTime.timestamp;
        };
    }
    data = data.sort(comp);

    return data;
  }

  render() {
    const {
      title,
      sortByOptions,
      bottomRightContent,
      noToggle,
      renderRightContent,
      dataObj,
      renderToggleContent,
      filterLabel,
      sortByStyles,
    } = this.props;

    const { filteredData, search, selectedTab, tabs } = this.state;

    let selectedLabel: any = find(tabs, { key: selectedTab });

    if (selectedLabel) {
      selectedLabel = selectedLabel.label.toLowerCase();
    }

    return (
      <QuadBox
        title={title}
        switchHeaders={true}
        showFilterSearch={true}
        onSearchChange={this.onSearchChange}
        sortByOptions={sortByOptions}
        sortByStyles={sortByStyles}
        updateDropdown={this.updateSortBy}
        bottomRightBarContent={bottomRightContent && bottomRightContent}
        bottomBarContent={
          <SwitchLabelsGroup tabs={tabs} selectedTab={selectedTab} selectTab={this.selectTab}/>
        }
        content={
          <>
            {filteredData.length === 0 && (
              <EmptyDisplay selectedTab={selectedTab !== ALL_MARKETS ? selectedLabel + " " : ""} filterLabel={filterLabel} search={search} />
            )}
            {filteredData.length > 0 && filteredData.map(
                  (market: any) =>
                    dataObj[market.id] ? (
                      <MarketRow
                        key={"position_" + market.id}
                        market={dataObj[market.id]}
                        showState={selectedTab === ALL_MARKETS}
                        noToggle={noToggle}
                        toggleContent={renderToggleContent && renderToggleContent(dataObj[market.id])}
                        rightContent={renderRightContent && renderRightContent(dataObj[market.id])}
                      />
                    ) : null,
               )}
          </>
        }
        search={search}
      />
    );
  }
}
