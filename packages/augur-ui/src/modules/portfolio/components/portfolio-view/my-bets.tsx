import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import Styles from 'modules/portfolio/components/portfolio-view/my-bets.styles.less';
import { ExternalLinkButton, PrimaryButton, FilterButton } from 'modules/common/buttons';
import { PillSelection, SquareDropdown } from 'modules/common/selection';
import FilterSearch from 'modules/filter-sort/containers/filter-search';
import { HelmetTag } from 'modules/seo/helmet-tag';
import { PORTFOLIO_VIEW_HEAD_TAGS } from 'modules/seo/helmet-configs';
import {
  SPORTS_MARKET_TYPES,
  MY_BETS_VIEW_BY,
  MY_BETS_MARKET_STATUS,
  INVALID_BEST_BID_ALERT_VALUE,
  MY_BETS_BET_DATE,
  GAMES,
  FUTURES,
  EVENT,
  OUTCOMES,
  MARKET_STATE_TYPES,
} from 'modules/common/constants';
import { MARKETS } from 'modules/routes/constants/views';
import { FilterNotice } from 'modules/common/filter-notice';
import { EmptyMagnifyingGlass } from 'modules/common/icons';
import {
  MOCK_GAMES_DATA,
  MOCK_FUTURES_DATA,
  MOCK_OUTCOMES_DATA,
} from 'modules/trading/store/constants';
import { Game, Outcomes } from '../common/common';

export const MyBets = () => {
  const [state, setState] = useState({
    selectedMarketCardType: SPORTS_MARKET_TYPES[0].id,
    viewBy: MY_BETS_VIEW_BY[0].value,
    marketStatus: MY_BETS_MARKET_STATUS[0].value,
    betDate: MY_BETS_BET_DATE[0].value,
    rows: MOCK_GAMES_DATA,
    selectedMarketStateType: MARKET_STATE_TYPES[0].id,
  });

  const {
    selectedMarketCardType,
    viewBy,
    marketStatus,
    betDate,
    rows,
    selectedMarketStateType,
  } = state;

  useEffect(() => {
    if (MY_BETS_VIEW_BY[viewBy].label === EVENT) {
      setState({ ...state, rows: MOCK_GAMES_DATA });
    } else if (MY_BETS_VIEW_BY[viewBy].label === OUTCOMES) {
      setState({ ...state, rows: MOCK_OUTCOMES_DATA });
    }
  }, [viewBy]);

  useEffect(() => {
    if (
      MY_BETS_VIEW_BY[viewBy].label === EVENT &&
      SPORTS_MARKET_TYPES[selectedMarketCardType].label === GAMES
    ) {
      setState({ ...state, rows: MOCK_GAMES_DATA });
    } else if (
      MY_BETS_VIEW_BY[viewBy].label === EVENT &&
      SPORTS_MARKET_TYPES[selectedMarketCardType].label === FUTURES
    ) {
      setState({ ...state, rows: MOCK_FUTURES_DATA });
    }
  }, [selectedMarketCardType, viewBy]);

  const showEvents = MY_BETS_VIEW_BY[viewBy].label === EVENT;

  return (
    <div className={classNames(Styles.MyBets)}>
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
            label={'go to trading'}
          />
        </div>
        <FilterNotice
          showDismissButton={false}
          show
          color="active"
          content={
            <div className={Styles.ClaimWinnings}>
              <span>You have <b>$200.00</b> in winnings to claim.</span>
              <PrimaryButton text={'Claim Bets'} action={null} />
            </div>
          }
        />
        <div>
          <span>
            View by{' '}
            <SquareDropdown
              options={MY_BETS_VIEW_BY}
              defaultValue={MY_BETS_VIEW_BY[0].value}
              onChange={selected =>
                setState({
                  ...state,
                  viewBy: selected,
                  rows:
                    MY_BETS_VIEW_BY[selected].label === EVENT
                      ? MOCK_GAMES_DATA
                      : MOCK_OUTCOMES_DATA,
                })
              }
              minimalStyle
            />
          </span>
          {showEvents ? (
            <span>
              Market Status:{' '}
              <SquareDropdown
                options={MY_BETS_MARKET_STATUS}
                defaultValue={MY_BETS_MARKET_STATUS[0].value}
                onChange={selected =>
                  setState({ ...state, marketStatus: selected })
                }
                minimalStyle
              />
            </span>
          ) : (
            <span>
              Bet Date:{' '}
              <SquareDropdown
                options={MY_BETS_BET_DATE}
                defaultValue={MY_BETS_BET_DATE[0].value}
                onChange={selected => setState({ ...state, betDate: selected })}
                minimalStyle
              />
            </span>
          )}
        </div>
        {showEvents ? (
          <PillSelection
            options={SPORTS_MARKET_TYPES}
            defaultSelection={selectedMarketCardType}
            large
            onChange={selected =>
              setState({ ...state, selectedMarketCardType: selected })
            }
          />
        ) : (
          <PillSelection
            options={MARKET_STATE_TYPES}
            defaultSelection={selectedMarketStateType}
            large
            onChange={selected =>
              setState({ ...state, selectedMarketStateType: selected })
            }
          />
        )}
        <FilterSearch
          placeholder={'Search markets & outcomes...'}
          search=""
          isSearchingMarkets={false}
        />
        <FilterButton title='Filters' action={null}/>
      </div>
      <div>
        {rows.length === 0 && (
          <section>
            {EmptyMagnifyingGlass}
            <span>No events found</span>
            <span>
              Try a different date range. <b>Clear Filter</b>
            </span>
          </section>
        )}
        {rows.length > 0 &&
          showEvents &&
          rows.map(row => (
            <Game
              row={row}
              type={SPORTS_MARKET_TYPES[selectedMarketCardType].label}
            />
          ))}
        {rows.length > 0 && !showEvents && <Outcomes rows={rows} />}
      </div>
    </div>
  );
};
