import React, { ReactNode, useEffect, useState } from 'react';
import { Market } from 'modules/portfolio/types';
import EmptyDisplay from 'modules/portfolio/components/common/empty-display';
import Styles from 'modules/portfolio/components/common/new-quad-box.styles.less';
import NewQuadBox, { NewQuadBoxProps } from 'modules/portfolio/components/common/new-quad-box';

export interface NewFilterSwitchBoxProps extends NewQuadBoxProps {
  data: Market[];
  filterComp: Function;
  filterLabel: string;
  renderRows: Function;
  emptyDisplayConfig?: {
    emptyTitle?: string;
    emptyText?: string;
    icon?: ReactNode;
    button?: ReactNode;
  }
}

const NewFilterSwitchBox = ({
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
  emptyDisplayConfig,
  toggle,
  hide,
  extend,
}: NewFilterSwitchBoxProps) => {
  const [search, setSearch] = useState('');
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

  const applySearch = (input: string, filteredData: Market[]) => {
    return filteredData.filter(filterComp.bind(applySearch, input));
  };

  return (
    <NewQuadBox
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
      customClass={customClass}
      setSearch={onSearchChange}
      sortByOptions={sortByOptions}
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

export default NewFilterSwitchBox;
