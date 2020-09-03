import React from 'react';
import FilterSwitchBox from 'modules/portfolio/components/common/filter-switch-box';
import MarketRow from 'modules/portfolio/components/common/market-row';
import { MovementLabel } from 'modules/common/labels';
import { ActiveMarketsIcon } from 'modules/common/icons';
import { SizeTypes, FormattedNumber, MarketData } from 'modules/types';
import { THEMES } from 'modules/common/constants';
import { formatNumber } from 'utils/format-number';
import { useAppStatusStore } from 'modules/app/store/app-status';
import getLoginAccountPositionsMarkets from 'modules/positions/selectors/login-account-positions-markets';

import Styles from 'modules/account/components/open-markets.styles.less';

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
  }

  return (
    <FilterSwitchBox
      filterLabel="markets"
      title="My Active Markets"
      showFilterSearch
      data={marketsToShow}
      customClass={customClass}
      filterComp={filterComp}
      noBackgroundBottom
      toggle={toggle}
      bottomBarContent={
        markets.length === 0 ? null : <div className={Styles.BottomBar}>
          <span>24hr {isTrading && ' change'}</span>
          <MovementLabel
            showIcon
            showBracket={isTrading}
            showPlusMinus
            value={formatNumber(2)}
            useFull
            size={SizeTypes.SMALL}
          />
        </div>
      }
      noSwitch
      renderRows={renderRows}
      emptyDisplayTitle={isTrading ? null : 'No Active Markets'}
      emptyDisplayText={
        isTrading ? null : "You don't have any active markets yet!"
      }
      emptyDisplayIcon={ActiveMarketsIcon}
    />
  );
};

export default OpenMarkets;
