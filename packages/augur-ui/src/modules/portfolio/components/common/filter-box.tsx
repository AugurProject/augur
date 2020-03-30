import React, { ReactNode } from 'react';

import { ALL_MARKETS, END_TIME } from 'modules/common/constants';
import QuadBox from 'modules/portfolio/components/common/quad-box';
import { SwitchLabelsGroup } from 'modules/common/switch-labels-group';
import { NameValuePair, Market, Tab } from 'modules/portfolio/types';
import MarketRow from 'modules/portfolio/containers/market-row';
import EmptyDisplay from 'modules/portfolio/components/common/empty-display';
import { createTabsInfo } from 'modules/portfolio/helpers/create-tabs-info';
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
  currentAugurTimestamp: number;
  renderRightContent?: Function;
  showPending?: Boolean;
  toggle: Function;
  hide: boolean;
  extend: boolean;
  customClass?: string;
  showLiquidityDepleted?: boolean;
}

interface FilterBoxState {
  search: string;
  sortBy: string;
  selectedTab: string;
  tabs: Array<Tab>;
  filteredData: Array<Market>;
}

const FilterBox: React.FC<FilterBoxProps> = props => {
  const {
    title,
    sortByOptions,
    currentAugurTimestamp,
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
    showLiquidityDepleted
  } = props;

  // states
  const [search, setSearch] = React.useState('');
  const [selectedTab, setSelectedTab] = React.useState(ALL_MARKETS);
  const [sortBy, setSortBy] = React.useState(
    (sortByOptions && sortByOptions[0].value) || ''
  );
  const [filteredData, setFilteredData] = React.useState(data[ALL_MARKETS]);
  const [tabs, setTabs] = React.useState(createTabsInfo(data));

  // refs
  const dataRef = React.useRef(null);

  // funcs
  const applySearchAndSort = () => {
    let nextFilteredData = data[selectedTab];
    // filter markets
    nextFilteredData = nextFilteredData.filter(market =>
      filterComp(search, market)
    );

    // sort markets
    const sortOption = sortByOptions.find(option => option.value === sortBy);

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

  // effects

  // for:
  // - component did mount
  // - search, sortBy, selectedTab, data did change
  React.useEffect(() => {
    applySearchAndSort();
  }, [search, sortBy, selectedTab, data]);

  // for: - maintain dataRef
  React.useEffect(() => {
    dataRef.current = data;
  }, [data]);

  return (
    <QuadBox
      title={title}
      customClass={customClass}
      switchHeaders={true}
      showFilterSearch={true}
      onSearchChange={(search) => setSearch(search)}
      sortByOptions={sortByOptions}
      sortByStyles={sortByStyles}
      updateDropdown={(sortBy) => setSortBy(sortBy)}
      bottomRightBarContent={bottomRightContent && bottomRightContent}
      toggle={toggle}
      hide={hide}
      extend={extend}
      bottomBarContent={
        <SwitchLabelsGroup
          tabs={tabs}
          selectedTab={selectedTab}
          selectTab={(tab) => {
            setSelectedTab(tab)
          }}
        />
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
            {filteredData.length > 0 &&
              filteredData.map((market: any, index: number) =>
                dataObj[market.id] ? (
                  <MarketRow
                    key={`position_${market.id}_${index}`}
                    market={dataObj[market.id]}
                    showState
                    showLiquidityDepleted={showLiquidityDepleted}
                    noToggle={noToggle}
                    showPending={showPending}
                    toggleContent={
                      renderToggleContent &&
                      renderToggleContent(dataObj[market.id])
                    }
                    rightContent={
                      renderRightContent && renderRightContent(dataObj[market.id])
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
