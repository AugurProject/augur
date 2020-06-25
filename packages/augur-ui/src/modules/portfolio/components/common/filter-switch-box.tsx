import React, { ReactNode } from 'react';

import QuadBox from 'modules/portfolio/components/common/quad-box';
import { NameValuePair, Market } from 'modules/portfolio/types';
import EmptyDisplay from 'modules/portfolio/components/common/empty-display';

export interface MarketsByReportingState {
  [type: string]: Array<Market>;
}

export interface FilterBoxProps {
  title: string;
  bottomBarContent?: ReactNode;
  sortByOptions?: Array<NameValuePair>;
  data: Array<Market>;
  filterComp: Function;
  showFilterSearch?: boolean;
  switchView?: Function;
  noSwitch?: boolean;
  renderRows: Function;
  filterLabel: string;
  sortByStyles?: object;
  noBackgroundBottom?: boolean;
  normalOnMobile?: boolean;
  toggle?: Function;
  extend?: boolean;
  hide?: boolean;
  customClass?: string;
  showHeaderOnMobile?: boolean;
  footer?: ReactNode;
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
    search: '',
    filteredData: this.props.data,
    view: false,
  };

  componentDidUpdate(prevProps: FilterBoxProps, prevState: FilterBoxState) {
    const { data } = prevProps;
    const { view } = prevState;
    if (
      JSON.stringify(data) !== JSON.stringify(this.props.data) ||
      this.state.view !== view
    ) {
      let filteredData = this.props.data;
      if (this.state.search !== '') {
        filteredData = this.applySearch(this.state.search, this.props.data);
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
    if (this.props.switchView) {
      this.props.switchView();
    }
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
      noBackgroundBottom,
      normalOnMobile,
      toggle,
      extend,
      hide,
      customClass,
      showHeaderOnMobile,
      footer,
    } = this.props;

    const { search, filteredData } = this.state;

    return (
      <QuadBox
        title={title}
        showFilterSearch={showFilterSearch}
        search={search}
        customClass={customClass}
        onSearchChange={this.onSearchChange}
        sortByOptions={sortByOptions}
        sortByStyles={sortByStyles}
        updateDropdown={!noSwitch && this.updateView}
        bottomBarContent={bottomBarContent}
        noBackgroundBottom={noBackgroundBottom}
        normalOnMobile={normalOnMobile}
        toggle={toggle}
        extend={extend}
        hide={hide}
        showHeaderOnMobile={showHeaderOnMobile}
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
            {footer ? footer : null}
          </>
        }
      />
    );
  }
}
