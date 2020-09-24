import React from 'react';
import MarketRow from 'modules/portfolio/components/common/market-row';
import { MovementLabel } from 'modules/common/labels';
import { ActiveMarketsIcon } from 'modules/common/icons';
import { FormattedNumber, MarketData, SizeTypes } from 'modules/types';
import { THEMES } from 'modules/common/constants';
import { formatNumber } from 'utils/format-number';
import { useAppStatusStore } from 'modules/app/store/app-status';
import getLoginAccountPositionsMarkets from 'modules/positions/selectors/login-account-positions-markets';

import Styles from 'modules/account/components/open-markets.styles.less';
import FilterSwitchBox from 'modules/portfolio/components/common/filter-switch-box';

function filterComp(input: any, market: any) {
  return market && market.description
    ? market.description.toLowerCase().indexOf(input.toLowerCase()) >= 0
    : true;
}

interface OpenMarketsProps {
  toggle: Function;
}

interface LoginAcccountPositionsMarketsInfo {
  markets: MarketData[];
  marketsObj: object;
  totalPercentage: FormattedNumber;
}

const OpenMarkets = ({ toggle }: OpenMarketsProps) => {
  const {
    markets,
    marketsObj,
    totalPercentage,
  }: LoginAcccountPositionsMarketsInfo = getLoginAccountPositionsMarkets();
  const { theme } = useAppStatusStore();
  const isTrading = theme === THEMES.TRADING;
  let customClass = Styles.OpenMarkets;
  if (!isTrading && markets.length === 0) {
    customClass = Styles.OpenMarketsEmptyDisplay;
  }
  let marketsToShow = markets;
  if (theme === THEMES.SPORTS) {
    marketsToShow = marketsToShow.filter(market => !!market?.sportsBook?.groupId);
  }

  function renderRows(market: Partial<MarketData>) {
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
            showBrackets={isTrading}
            useFull
            showIcon
            showPlusMinus
            value={positionValueChange}
            size={isTrading ? SizeTypes.LARGE : SizeTypes.NORMAL}
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
                    showBrackets={isTrading}
                    useFull
                    showIcon
                    showPlusMinus
                    value={position.unrealized24HrPercent}
                    size={isTrading ? SizeTypes.SMALL : SizeTypes.NORMAL}
                  />
                </div>
              ))}
          </div>
        }
      />
    );
  }

  return (
    <FilterSwitchBox
      filterLabel="markets"
      title="My Active Markets"
      data={marketsToShow}
      customClass={customClass}
      filterComp={filterComp}
      toggle={toggle}
      subheader={
        markets.length === 0 ? null : <div className={Styles.BottomBar}>
          <span>{!isTrading ? '24H change' : '24hr'}</span>
          <MovementLabel
            showIcon
            showBracket={isTrading}
            showPlusMinus
            value={totalPercentage}
            useFull
            size={!isTrading ? SizeTypes.NORMAL : SizeTypes.SMALL}
          />
        </div>
      }
      renderRows={renderRows}
      emptyDisplayConfig={{
        emptyTitle: isTrading ? null : "No Active Markets",
        emptyText: isTrading ? null : "You don't have any active markets yet!",
        icon: ActiveMarketsIcon,
      }}
    />
  );
};

export default OpenMarkets;
