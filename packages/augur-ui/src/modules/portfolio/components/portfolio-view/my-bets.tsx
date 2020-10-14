import React, { useMemo, useState } from 'react';
import classNames from 'classnames';

import Styles from 'modules/portfolio/components/portfolio-view/my-bets.styles.less';
import {
  ExternalLinkButton,
  PrimaryButton,
  FilterButton,
} from 'modules/common/buttons';
import { PillSelection, SquareDropdown } from 'modules/common/selection';
import { HelmetTag } from 'modules/seo/helmet-tag';
import { PORTFOLIO_VIEW_HEAD_TAGS } from 'modules/seo/helmet-configs';
import {
  SPORTS_MARKET_TYPES,
  MY_BETS_VIEW_BY,
  MY_BETS_MARKET_STATUS,
  MY_BETS_BET_DATE,
  EVENT,
  MARKET_STATE_TYPES,
  RESOLVED,
  REPORTING_STATE,
  MARKET_OPEN,
  MARKET_REPORTING,
  MARKET_CLOSED,
  SPORTS_GROUP_TYPES,
} from 'modules/common/constants';
import { MARKETS } from 'modules/routes/constants/views';
import { EmptyMagnifyingGlass, BetsIcon } from 'modules/common/icons';
import { Game, Outcomes, ClaimWinnings } from '../common/common';
import { useMyBetsStore } from 'modules/portfolio/store/my-bets';
import { FilterSearchPure } from 'modules/filter-sort/filter-search';
import { AppStatus } from 'modules/app/store/app-status';
import { useMarketsStore } from 'modules/markets/store/markets';
import { useBetslipStore } from 'modules/trading/store/betslip';
import {
  convertInputs,
  findStartTime,
} from 'modules/market/components/common/market-title';
import EmptyDisplay from '../common/empty-display';
import { getOutcomeNameWithOutcome } from 'utils/get-outcome';

export const outcomesData = myBets =>
  myBets.reduce(
    (p, game) => [
      ...p,
      ...Object.values(game.orders).map(outcome => {
        return {
          ...game,
          outcomes: null,
          ...outcome,
          outcomeName: getOutcomeNameWithOutcome(
            game,
            outcome.outcomeId,
            false,
            false
          ),
        };
      }),
    ],
    []
  );

export function processRows(
  viewBy,
  marketStatus,
  betDate,
  selectedMarketCardType,
  selectedMarketStateType,
  search,
  myBets,
  marketInfos
) {
  let myBetsArray = Object.keys(myBets).map(function(key) {
    const marketInfo = marketInfos[key];

    const convertedInputs =
      marketInfo?.template && convertInputs(marketInfo.template.inputs);
    const estDateTime = convertedInputs && findStartTime(convertedInputs);
    return {
      ...myBets[key],
      ...marketInfo,
      startTime: estDateTime?.timestamp,
      marketId: key,
    };
  });
  let futureRows = myBetsArray.filter(market => {
    return market?.sportsBook?.groupType === SPORTS_GROUP_TYPES.FUTURES;
  });
  let dailyRows = myBetsArray.filter(market => {
    return market?.sportsBook?.groupType !== SPORTS_GROUP_TYPES.FUTURES;
  });
  let rows = futureRows;

  if (MY_BETS_VIEW_BY[viewBy].label === EVENT) {
    rows =
      SPORTS_MARKET_TYPES[selectedMarketCardType].header ===
      SPORTS_GROUP_TYPES.DAILY
        ? dailyRows
        : futureRows;
    rows = rows
      .filter(data => {
        const { reportingState } = data;
        const marketStatusLabel = MY_BETS_MARKET_STATUS[marketStatus].label;
        if (marketStatusLabel === MARKET_OPEN) {
          return reportingState === REPORTING_STATE.PRE_REPORTING;
        } else if (marketStatusLabel === MARKET_REPORTING) {
          return (
            reportingState === REPORTING_STATE.DESIGNATED_REPORTING ||
            reportingState === REPORTING_STATE.OPEN_REPORTING ||
            reportingState === REPORTING_STATE.AWAITING_NEXT_WINDOW ||
            reportingState === REPORTING_STATE.CROWDSOURCING_DISPUTE
          );
        } else if (marketStatusLabel === MARKET_CLOSED) {
          return reportingState === REPORTING_STATE.FINALIZED;
        } else {
          return true;
        }
      })
      .filter(
        data =>
          data.description.toLowerCase().indexOf(search.toLowerCase()) >= 0
      )
      .sort((a, b) => b.startTime - a.startTime);
    if (
      SPORTS_MARKET_TYPES[selectedMarketCardType].header ===
      SPORTS_GROUP_TYPES.DAILY
    ) {
      let updatedRows = [];
      rows.forEach(row => {
        const existing = updatedRows.filter(v => {
          return v.sportsBook?.groupId === row.sportsBook?.groupId;
        });
        if (existing.length > 0) {
          const existingIndex = updatedRows.indexOf(existing[0]);
          updatedRows[existingIndex].orders = updatedRows[
            existingIndex
          ].orders.concat(row.orders);
        } else {
          updatedRows.push(row);
        }
      });
      rows = updatedRows;
    }
  } else {
    rows = outcomesData(myBetsArray).filter(data =>
      MARKET_STATE_TYPES[selectedMarketStateType].label === RESOLVED
        ? data.reportingState === REPORTING_STATE.FINALIZED
        : data.reportingState !== REPORTING_STATE.FINALIZED
    );

    const {
      blockchain: { currentAugurTimestamp },
    } = AppStatus.get();
    rows = rows
      .filter(data => {
        const interval = MY_BETS_BET_DATE[betDate].periodInterval;
        return currentAugurTimestamp / 1000 - data.dateUpdated < interval;
      })
      .filter(
        data =>
          data.outcomeName.toLowerCase().indexOf(search.toLowerCase()) >= 0
      )
      .sort((a, b) => b.dateUpdated - a.dateUpdated);
  }
  return rows;
}
export const MyBets = () => {
  const {
    viewBy,
    marketStatus,
    betDate,
    selectedMarketCardType,
    selectedMarketStateType,
    actions: {
      setViewBy,
      setMarketStatus,
      setBetDate,
      setSelectedMarketCardType,
      setSelectedMarketStateType,
    },
  } = useMyBetsStore();

  const [search, setSearch] = useState('');

  const { matched } = useBetslipStore();
  const { marketInfos } = useMarketsStore();

  const rows = useMemo(
    () =>
      processRows(
        viewBy,
        marketStatus,
        betDate,
        selectedMarketCardType,
        selectedMarketStateType,
        search,
        matched.items,
        marketInfos
      ),
    [
      viewBy,
      marketStatus,
      betDate,
      selectedMarketCardType,
      selectedMarketStateType,
      search,
      matched.items,
    ]
  );

  const showEvents = MY_BETS_VIEW_BY[viewBy].label === EVENT;

  return (
    <div
      className={classNames(Styles.MyBets, {
        [Styles.Searching]: search !== '' && search !== undefined,
      })}
    >
      <HelmetTag {...PORTFOLIO_VIEW_HEAD_TAGS} />
      <div>
        <div>
          <span>My Bets</span>
          <span>To view your unmatched bets, go to Trading.</span>
          <ExternalLinkButton
            condensedStyle
            customLink={{
              pathname: MARKETS,
            }}
            label="go to trading"
          />
        </div>
        <ClaimWinnings />
        <div>
          <SquareDropdown
            options={MY_BETS_VIEW_BY}
            defaultValue={viewBy}
            onChange={viewBy => setViewBy(viewBy)}
            preLabel="view by"
            minimalStyle
            dontCheckInvalid
          />
          {showEvents && (
            <SquareDropdown
              options={MY_BETS_MARKET_STATUS}
              defaultValue={marketStatus}
              onChange={marketStatus => setMarketStatus(marketStatus)}
              minimalStyle
              preLabel="market status"
              dontCheckInvalid
            />
          )}
          {!showEvents && (
            <SquareDropdown
              options={MY_BETS_BET_DATE}
              defaultValue={betDate}
              onChange={betDate => setBetDate(betDate)}
              minimalStyle
              preLabel="Bet Date"
              dontCheckInvalid
            />
          )}
        </div>
        {showEvents && (
          <PillSelection
            options={SPORTS_MARKET_TYPES}
            defaultSelection={selectedMarketCardType}
            large
            onChange={selectedMarketCardType =>
              setSelectedMarketCardType(selectedMarketCardType)
            }
          />
        )}
        {!showEvents && (
          <PillSelection
            options={MARKET_STATE_TYPES}
            defaultSelection={selectedMarketStateType}
            large
            onChange={selectedMarketStateType =>
              setSelectedMarketStateType(selectedMarketStateType)
            }
          />
        )}
        <FilterSearchPure
          placeholder="Search markets & outcomes..."
          search={search}
          onChange={search => setSearch(search)}
        />
        <FilterButton title="Filters" />
      </div>
      <div>
        {rows.length === 0 && (
          <EmptyDisplay
            selectedTab=""
            search={search}
            notTradingEmptyTitle="You don't have any bets"
            emptyText="Once you start betting your bets will appear in this page"
            icon={BetsIcon}
            filterLabel="events"
            searchObject="events"
            actionable={
              search && { text: 'Clear Search', action: () => setSearch('') }
            }
          />
        )}
        {showEvents &&
          rows.map((row, index) => (
            <Game
              row={row}
              key={`${row.marketId}_${index}`}
              type={SPORTS_MARKET_TYPES[selectedMarketCardType].header}
            />
          ))}
        {rows.length > 0 && !showEvents && <Outcomes rows={rows} />}
      </div>
    </div>
  );
};
