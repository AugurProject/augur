import React, { ReactNode } from "react";

import QuadBox from "modules/portfolio/components/common/quads/quad-box";
import { NameValuePair, Market } from "modules/portfolio/types";
import EmptyDisplay from "modules/portfolio/components/common/tables/empty-display";
import { isEqual } from "lodash";

export interface MarketsByReportingState {
  [type: string]: Array<Market>;
}

export interface FilterBoxProps {
  title: string;
  bottomBarContent?: ReactNode;
  sortByOptions: Array<NameValuePair>;
  data: Array<Market>;
  filterComp: Function;
  showFilterSearch?: Boolean;
  switchView: Function;
  noSwitch?: Boolean;
  renderRows: Function;
  filterLabel: string;
  sortByStyles?: Object;
  noBackgroundBottom?: Boolean;
}

interface FilterBoxState {
  search: string;
  filteredData: Array<Market>;
  view: boolean;
}

export default class FilterSwitchBox extends React.Component<
  FilterBoxProps,
  FilterBoxState
> {
  state: FilterBoxState = {
    search: "",
    filteredData: this.props.data,
    view: false
  };

  componentWillUpdate(nextProps: FilterBoxProps, nextState: FilterBoxState) {
    if (
      !isEqual(nextProps.data, this.props.data) ||
      this.state.view !== nextState.view
    ) {
      let filteredData = nextProps.data;
      if (nextState.search !== "") {
        filteredData = this.applySearch(nextState.search, nextProps.data);
      }
      this.updateFilteredData(filteredData);
    }
  }

  onSearchChange = (input: string) => {
    this.setState({ search: input });

    const { data } = this.props;
    const filteredData = this.applySearch(input, data);

    this.updateFilteredData(filteredData);
  };

  applySearch = (input: string, filteredData: Array<Market>) => {
    const { filterComp } = this.props;

    return filteredData.filter(filterComp.bind(this, input));
  };

  updateView = () => {
    this.props.switchView();
    this.setState({ view: !this.state.view });
  };

  updateFilteredData = (filteredData: Array<Market>) => {
    this.setState({ filteredData });
  };

  render() {
    const {
      title,
      bottomBarContent,
      sortByOptions,
      showFilterSearch,
      noSwitch,
      renderRows,
      filterLabel,
      sortByStyles,
      noBackgroundBottom
    } = this.props;

    const { search, filteredData } = this.state;

    return (
      <QuadBox
        title={title}
        showFilterSearch={showFilterSearch}
        search={search}
        onSearchChange={this.onSearchChange}
        sortByOptions={sortByOptions}
        sortByStyles={sortByStyles}
        updateDropdown={!noSwitch && this.updateView}
        bottomBarContent={bottomBarContent}
        noBackgroundBottom={noBackgroundBottom}
        content={
          <>
            {filteredData.length === 0 && (
              <EmptyDisplay
                selectedTab=""
                filterLabel={filterLabel}
                search={search}
              />
            )}
            {filteredData.length > 0 &&
              filteredData.map(data => renderRows(data))}
          </>
        }
      />
    );
  }
}
