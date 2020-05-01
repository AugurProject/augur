import React, { Component } from 'react';

import FilterSwitchBox from 'modules/portfolio/components/common/filter-switch-box';
import MarketRow from 'modules/portfolio/containers/market-row';
import { MovementLabel } from 'modules/common/labels';
import { SizeTypes, FormattedNumber, MarketData } from 'modules/types';

import Styles from 'modules/account/components/open-markets.styles.less';
import { formatNumber } from 'utils/format-number';

function filterComp(input: any, market: any) {
  return market && market.description
    ? market.description.toLowerCase().indexOf(input.toLowerCase()) >= 0
    : true;
}

interface OpenMarketsProps {
  markets: MarketData[];
  marketsObj: object;
  totalPercentage: FormattedNumber;
  toggle: Function;
}

const OpenMarkets = ({
  markets,
  marketsObj,
  totalPercentage,
  toggle,
}: OpenMarketsProps) => {
  const renderRows = (market: Partial<MarketData>) => {
    const positionValueChange =
      (marketsObj[market.id] &&
        marketsObj[market.id].myPositionsSummary &&
        marketsObj[market.id].myPositionsSummary.valueChange24Hr) ||
      formatNumber(0);
    return (
      <MarketRow
        key={'position_' + market.id}
        market={marketsObj[market.id]}
        showState={false}
        addedClass={Styles.OpenMarketsRow}
        rightContent={
          <MovementLabel
            showBrackets
            useFull
            showIcon
            showPlusMinus
            value={positionValueChange}
            size={SizeTypes.LARGE}
          />
        }
        toggleContent={
          <div className={Styles.ExpandedContent}>
            {marketsObj[market.id] &&
              marketsObj[market.id].userPositions &&
              marketsObj[market.id].userPositions.map((position: any) => (
                <div key={position.outcomeId}>
                  <span>{position.outcomeName}</span>
                  <MovementLabel
                    showBrackets
                    useFull
                    showIcon
                    showPlusMinus
                    value={position.unrealized24HrPercent}
                    size={SizeTypes.SMALL}
                  />
                </div>
              ))}
          </div>
        }
      />
    );
  };

  return (
    <FilterSwitchBox
      filterLabel="markets"
      title="My Active Markets"
      showFilterSearch
      data={markets}
      customClass={Styles.OpenMarkets}
      filterComp={filterComp}
      noBackgroundBottom
      toggle={toggle}
      bottomBarContent={
        <div className={Styles.BottomBar}>
          <span>24hr</span>
          <MovementLabel
            showIcon
            showBrackets
            showPlusMinus
            value={totalPercentage}
            useFull
            size={SizeTypes.SMALL}
          />
        </div>
      }
      noSwitch
      renderRows={renderRows}
    />
  );
};

export default OpenMarkets;
