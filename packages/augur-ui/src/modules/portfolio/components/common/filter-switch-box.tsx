import React, { ReactNode, useEffect, useState } from 'react';
import { MarketData } from 'modules/types';
import EmptyDisplay from 'modules/portfolio/components/common/empty-display';
import Styles from 'modules/portfolio/components/common/quad-box.styles.less';
import QuadBox, { QuadBoxProps } from 'modules/portfolio/components/common/quad-box';
import classNames from 'classnames';

export interface FilterSwitchBoxProps extends QuadBoxProps {
  data: MarketData[];
  filterComp: Function;
  filterLabel: string;
  renderRows: Function;
  switchView?: Function;
  showDropdown?: boolean;
  emptyDisplayConfig?: {
    emptyTitle?: string;
    emptyText?: string;
    icon?: ReactNode;
    button?: ReactNode;
  }
}

const FilterSwitchBox = ({
  title,
  headerComplement,
  subheader,
  footer,
  customClass,
  sortByOptions,
  data,
  filterComp,
  filterLabel,
  renderRows,
  switchView,
  showDropdown,
  emptyDisplayConfig,
  toggle,
  hide,
  extend,
}: FilterSwitchBoxProps) => {
  const [search, setSearch] = useState('');
  const [view, setView] = useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const thereIsData = filteredData.length > 0;

  useEffect(() => {
    let filteredData = data;
    if (search !== '') {
      filteredData = applySearch(search, data);
    }
    setFilteredData(filteredData);
  }, [data]);

  const onSearchChange = (input: string) => {
    setSearch(input);
    const filteredData = applySearch(input, data);
    setFilteredData(filteredData);
  };

  const applySearch = (input: string, filteredData: MarketData[]) => {
    return filteredData.filter(filterComp.bind(applySearch, input));
  };

  const updateView = () => {
    if (switchView) {
      switchView();
    }
    setView(!view);
  };

  return (
    <QuadBox
      title={title}
      headerComplement={
        <>
          {thereIsData && (
            <div className={Styles.Count}>{filteredData.length}</div>
          )}
          {headerComplement}
        </>
      }
      search={search}
      customClass={classNames(customClass, {
        [Styles.DisabledSearch]: !thereIsData,
        [Styles.DisabledFilters]: !thereIsData,
      })}
      setSearch={onSearchChange}
      sortByOptions={sortByOptions}
      updateDropdown={showDropdown && updateView}
      subheader={subheader}
      footer={footer}
      toggle={toggle}
      hide={hide}
      extend={extend}
      content={
        <>
          {thereIsData ? (
            filteredData.map(data => renderRows(data))
          ) : (
            <EmptyDisplay
              selectedTab=""
              filterLabel={filterLabel}
              search={search}
              title={title}
              {...emptyDisplayConfig}
            />
          )}
        </>
      }
    />
  );
};

export default FilterSwitchBox;
