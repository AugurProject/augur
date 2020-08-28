import React, { ReactNode } from 'react';

import QuadBox from 'modules/portfolio/components/common/quad-box';
import { NameValuePair, Market } from 'modules/portfolio/types';
import EmptyDisplay from 'modules/portfolio/components/common/empty-display';
import Styles from 'modules/portfolio/components/common/quad-box.styles.less';

export interface MarketsByReportingState {
  [type: string]: Array<Market>;
}

export interface FilterBoxProps {
  bottomBarContent?: ReactNode;
  bottomContent?: ReactNode;
  customClass?: string;
  data: Array<Market>;
  emptyDisplayButton?: ReactNode;
  emptyDisplayIcon: any;
  emptyDisplayText?: string,
  emptyDisplayTitle?: string,
  extend?: boolean;
  filterComp: Function;
  filterLabel: string;
  footer?: ReactNode;
  hide?: boolean;
  noBackgroundBottom?: boolean;
  normalOnMobile?: boolean;
  noSwitch?: boolean;
  renderRows: Function;
  showFilterSearch?: boolean;
  showHeaderOnMobile?: boolean;
  sortByOptions?: Array<NameValuePair>;
  sortByStyles?: object;
  switchView?: Function;
  title: string;
  toggle?: Function;
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
      bottomContent,
      emptyDisplayTitle,
      emptyDisplayText,
      emptyDisplayIcon,
      emptyDisplayButton,
      footer,
    } = this.props;

    const { search, filteredData } = this.state;

    return (
      <QuadBox
        title={title}
        leftContent={filteredData.length > 0 &&
          <div className={Styles.Count}>{filteredData.length}</div>
        }
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
        bottomContent={bottomContent}
        content={
          <>
            {filteredData.length === 0 && (
              <EmptyDisplay
                selectedTab=""
                filterLabel={filterLabel}
                search={search}
                title={title}
                emptyTitle={emptyDisplayTitle}
                emptyText={emptyDisplayText}
                icon={emptyDisplayIcon}
                button={emptyDisplayButton}
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
