import React, { ReactNode, useState, useEffect, useRef } from 'react';

import { ALL_MARKETS, END_TIME } from 'modules/common/constants';
import QuadBox from 'modules/portfolio/components/common/quad-box';
import { SquareDropdown } from 'modules/common/selection';
import { SwitchLabelsGroup } from 'modules/common/switch-labels-group';
import { NameValuePair, Market, Tab } from 'modules/portfolio/types';
import MarketRow from 'modules/portfolio/containers/market-row';
import EmptyDisplay from 'modules/portfolio/components/common/empty-display';
import { createTabsInfo } from 'modules/portfolio/helpers/create-tabs-info';
import { THEMES } from 'modules/common/constants';
import { useAppStatusStore } from 'modules/app/store/app-status';
import Styles from 'modules/portfolio/components/common/quad-box.styles.less';

export interface MarketsByReportingState {
  [type: string]: Array<Market>;
}

export interface FilterBoxProps {
  title: string;
  sortByOptions: Array<NameValuePair>;
  filteredData: Array<Market>;
  data: MarketsByReportingState;
  filterComp: (input: string, market: Market) => boolean;
  bottomRightContent?: ReactNode;
  rightContent?: Function;
  dataObj: object;
  noToggle?: boolean;
  renderToggleContent?: Function;
  filterLabel: string;
  sortByStyles?: object;
  renderRightContent?: Function;
  showPending?: Boolean;
  toggle: Function;
  hide: boolean;
  extend: boolean;
  customClass?: string;
  showLiquidityDepleted?: boolean;
}

const FilterBox: React.FC<FilterBoxProps> = ({
  title,
  sortByOptions,
  bottomRightContent,
  noToggle,
  renderRightContent,
  dataObj,
  renderToggleContent,
  filterLabel,
  sortByStyles,
  showPending,
  filterComp,
  toggle,
  hide,
  extend,
  data,
  customClass,
  showLiquidityDepleted,
}) => {
  const [search, setSearch] = useState('');
  const [selectedTab, setSelectedTab] = useState(ALL_MARKETS);
  const [sortBy, setSortBy] = useState(
    (sortByOptions && sortByOptions[0].value) || ''
  );
  const [filteredData, setFilteredData] = useState(data[ALL_MARKETS]);
  const [tabs, setTabs] = useState(createTabsInfo(data));
  const dataRef = useRef(null);
  const { theme, blockchain: { currentAugurTimestamp } } = useAppStatusStore();

  useEffect(() => {
    applySearchAndSort();
  }, [search, sortBy, selectedTab, data]);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const applySearchAndSort = () => {
    let nextFilteredData = data[selectedTab];
    // filter markets
    nextFilteredData = nextFilteredData.filter(market =>
      filterComp(search, market)
    );

    // sort markets
    const sortOption = sortByOptions.find(({ value }) => value === sortBy);

    if (sortOption) {
      let comp: Function;

      if (sortOption.comp) {
        comp = sortOption.comp;
      }

      if (sortOption.value === END_TIME) {
        comp = (marketA, marketB) => {
          // Not found endTime prop in Market interface
          if (
            marketA.endTime < currentAugurTimestamp &&
            marketB.endTime < currentAugurTimestamp
          ) {
            return marketB.endTime - marketA.endTime;
          }

          if (marketA.endTime < currentAugurTimestamp) {
            return 1;
          }

          if (marketB.endTime < currentAugurTimestamp) {
            return -1;
          }

          return marketA.endTime - marketB.endTime;
        };
      }

      nextFilteredData = nextFilteredData.sort((a, b) => comp(a, b));
    }

    const nextTabs = [...tabs];

    for (let i = 0; i < tabs.length; i++) {
      const numOfMarkets = data[tabs[i].key].filter(market =>
        filterComp(search, market)
      ).length;

      nextTabs[i] = {
        ...nextTabs[i],
        num: numOfMarkets,
      };
    }

    setTabs(nextTabs);
    setFilteredData(nextFilteredData);
  };

  return (
    <QuadBox
      title={title}
      leftContent={<div className={Styles.Count}>{filteredData.length}</div>}
      customClass={customClass}
      switchHeaders={true}
      showFilterSearch={true}
      onSearchChange={search => setSearch(search)}
      sortByOptions={sortByOptions}
      sortByStyles={sortByStyles}
      updateDropdown={sortBy => setSortBy(sortBy)}
      bottomRightBarContent={bottomRightContent}
      toggle={toggle}
      hide={hide}
      extend={extend}
      bottomBarContent={
        theme === THEMES.TRADING ? (
          <SwitchLabelsGroup
            tabs={tabs}
            selectedTab={selectedTab}
            selectTab={tab => {
              setSelectedTab(tab);
            }}
          />
        ) : (
          <div>
            <span>Status:</span>
            <SquareDropdown
              defaultValue={selectedTab}
              options={tabs}
              onChange={tab => {
                setSelectedTab(tab);
              }}
            />
            <span>Sort by:</span>
            <SquareDropdown
              defaultValue={sortByOptions[0].value}
              options={sortByOptions}
              onChange={sortBy => setSortBy(sortBy)}
              sortByStyles={sortByStyles}
            />
          </div>
        )
      }
      content={
        <>
          {filteredData.length === 0 && (
            <EmptyDisplay
              selectedTab={''}
              filterLabel={filterLabel}
              search={search}
            />
          )}
          <div className={Styles.MarketBox}>
            {filteredData.map(({ id }: any, index: number) =>
              dataObj[id] ? (
                <MarketRow
                  key={`position_${id}_${index}`}
                  market={dataObj[id]}
                  showState
                  showLiquidityDepleted={showLiquidityDepleted}
                  noToggle={noToggle}
                  showPending={showPending}
                  toggleContent={
                    renderToggleContent && renderToggleContent(dataObj[id])
                  }
                  rightContent={
                    renderRightContent && renderRightContent(dataObj[id])
                  }
                />
              ) : null
            )}
          </div>
        </>
      }
      search={search}
    />
  );
};

export default FilterBox;
