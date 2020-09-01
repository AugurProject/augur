import React, { ReactNode, useEffect, useState } from 'react';

import { ALL_MARKETS, END_TIME, THEMES } from 'modules/common/constants';
import { SquareDropdown } from 'modules/common/selection';
import { SwitchLabelsGroup } from 'modules/common/switch-labels-group';
import { Market } from 'modules/portfolio/types';
import MarketRow from 'modules/portfolio/components/common/market-row';
import EmptyDisplay from 'modules/portfolio/components/common/empty-display';
import { createTabsInfo } from 'modules/portfolio/helpers/create-tabs-info';
import { useAppStatusStore } from 'modules/app/store/app-status';
import Styles from 'modules/portfolio/components/common/quad-box.styles.less';
import { createMarketsStateObject } from 'modules/portfolio/helpers/create-markets-state-object';
import QuadBox, {
  QuadBoxProps,
} from 'modules/portfolio/components/common/quad-box';

export interface FilterBoxProps extends QuadBoxProps {
  filterComp: (input: string, market: Market) => boolean;
  filterLabel: string;
  renderRightContent?: Function;
  renderToggleContent?: Function;
  showLiquidityDepleted?: boolean;
  showPending?: Boolean;
  markets: any;
  pickVariables: any;
  emptyDisplayConfig?: {
    emptyTitle?: string;
    emptyText?: string;
    icon?: ReactNode;
    button?: ReactNode;
  };
}

function pick(object, keys) {
  return keys.reduce((obj, key) => {
    if (object && object.hasOwnProperty(key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
}

const FilterBox = ({
  title,
  headerComplement,
  subheader,
  footer,
  customClass,
  sortByOptions,
  filterComp,
  filterLabel,
  renderRightContent,
  renderToggleContent,
  showLiquidityDepleted,
  showPending,
  markets,
  pickVariables,
  emptyDisplayConfig,
  toggle,
  hide,
  extend,
}: FilterBoxProps) => {
  const marketsObj = markets.reduce((obj, market) => {
    obj[market.id] = market;
    return obj;
  }, {});

  const marketsPick =
    markets && markets.map((market) => pick(market, pickVariables));

  const data = createMarketsStateObject(marketsPick);
  const dataObj = marketsObj;
  const [search, setSearch] = useState('');
  const [selectedTab, setSelectedTab] = useState(ALL_MARKETS);
  const [sortBy, setSortBy] = useState(
    (sortByOptions && sortByOptions[0].value) || ''
  );
  const [filteredData, setFilteredData] = useState(data[ALL_MARKETS]);
  const [tabs, setTabs] = useState(createTabsInfo(data));
  const {
    theme,
    blockchain: { currentAugurTimestamp },
  } = useAppStatusStore();
  const noData = !Boolean(data[ALL_MARKETS].length);

  useEffect(() => {
    applySearchAndSort();
  }, [
    search,
    sortBy,
    selectedTab,
    data.all,
    data.closed,
    data.open,
    data.reporting,
  ]);

  const applySearchAndSort = () => {
    let nextFilteredData = data[selectedTab];
    let updateFilteredData = false;
    // filter markets
    nextFilteredData = nextFilteredData.filter((market) =>
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
    // if number of markets changes or if the market info isn't loaded yet (no id) then we need to update until it is.
    if (
      filteredData.length !== nextFilteredData.length ||
      !!filteredData.find((market) => market.id === undefined)
    )
      updateFilteredData = true;
    const nextTabs = [...tabs];
    let updateTabs = false;
    for (let i = 0; i < tabs.length; i++) {
      const numOfMarkets = data[tabs[i].key].filter((market) =>
        filterComp(search, market)
      ).length;
      if (tabs[i].num !== numOfMarkets) updateTabs = true;
      nextTabs[i] = {
        ...nextTabs[i],
        num: numOfMarkets,
      };
    }
    if (updateTabs) setTabs(nextTabs);
    if (updateFilteredData) setFilteredData(nextFilteredData);
  };

  return (
    <QuadBox
      title={title}
      headerComplement={
        <>
          {filteredData.length > 0 && (
            <div className={Styles.Count}>{filteredData.length}</div>
          )}
          {headerComplement}
        </>
      }
      customClass={customClass}
      sortByOptions={sortByOptions}
      updateDropdown={sortBy => setSortBy(sortBy)}
      search={search}
      setSearch={setSearch}
      tabs={tabs}
      setSelectedTab={tab => setSelectedTab(tab)}
      toggle={toggle}
      hide={hide}
      extend={extend}
      subheader={
        <>
          {theme === THEMES.TRADING ? (
            <SwitchLabelsGroup
              tabs={tabs}
              selectedTab={selectedTab}
              selectTab={(tab) => {
                setSelectedTab(tab);
              }}
            />
          ) : (
            <div>
              <span>Status:</span>
              <SquareDropdown
                defaultValue={selectedTab}
                options={tabs}
                onChange={(tab) => {
                  setSelectedTab(tab);
                }}
                disabled={noData}
              />
              <span>Sort by:</span>
              <SquareDropdown
                defaultValue={sortByOptions[0].value}
                options={sortByOptions}
                onChange={(sortBy) => setSortBy(sortBy)}
                disabled={noData}
              />
            </div>
          )}
          {subheader}
        </>
      }
      footer={footer}
      content={
        <>
          {filteredData.length === 0 && (
            <EmptyDisplay
              selectedTab={''}
              filterLabel={filterLabel}
              search={search}
              title={title}
              {...emptyDisplayConfig}
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
                  // noToggle={noToggle}
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
    />
  );
};

export default FilterBox;
