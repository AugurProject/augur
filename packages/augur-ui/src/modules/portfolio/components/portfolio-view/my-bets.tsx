import React, { useReducer } from 'react';
import classNames from 'classnames';

import Styles from 'modules/portfolio/components/portfolio-view/my-bets.styles.less';
import {
  ExternalLinkButton,
  PrimaryButton,
  FilterButton,
} from 'modules/common/buttons';
import { PillSelection, SquareDropdown } from 'modules/common/selection';
import FilterSearch from 'modules/filter-sort/containers/filter-search';
import { HelmetTag } from 'modules/seo/helmet-tag';
import { PORTFOLIO_VIEW_HEAD_TAGS } from 'modules/seo/helmet-configs';
import {
  SPORTS_MARKET_TYPES,
  MY_BETS_VIEW_BY,
  MY_BETS_MARKET_STATUS,
  MY_BETS_BET_DATE,
  GAMES,
  EVENT,
  MARKET_STATE_TYPES,
} from 'modules/common/constants';
import { MARKETS } from 'modules/routes/constants/views';
import { FilterNotice } from 'modules/common/filter-notice';
import { EmptyMagnifyingGlass } from 'modules/common/icons';
import {
  MOCK_GAMES_DATA,
  MOCK_FUTURES_DATA,
  MOCK_OUTCOMES_DATA,
  MY_BETS_ACTIONS,
  VIEW_BY,
  ROWS,
  SELECTED_MARKET_CARD_TYPE,
  SELECTED_MARKET_STATE_TYPE,
  BET_DATE,
  MARKET_STATUS,
} from 'modules/trading/store/constants';
import { Game, Outcomes } from '../common/common';

const {
  SET_VIEW_BY,
  SET_SELECTED_MARKET_CARD_TYPE,
  SET_SELECTED_MARKET_STATE_TYPE,
  SET_BET_DATE,
  SET_MARKET_STATUS,
} = MY_BETS_ACTIONS;

export function MyBetsReducer(state, action) {
  const updatedState = { ...state };
  switch (action.type) {
    case SET_VIEW_BY: {
      updatedState[VIEW_BY] = action.viewBy;
      updatedState[ROWS] =
        MY_BETS_VIEW_BY[action.viewBy].label === EVENT
          ? MOCK_GAMES_DATA
          : MOCK_OUTCOMES_DATA;
      break;
    }
    case SET_SELECTED_MARKET_CARD_TYPE: {
      updatedState[SELECTED_MARKET_CARD_TYPE] = action.selectedMarketCardType;
      updatedState[ROWS] =
        SPORTS_MARKET_TYPES[action.selectedMarketCardType].label === GAMES
          ? MOCK_GAMES_DATA
          : MOCK_FUTURES_DATA;
      break;
    }
    case SET_SELECTED_MARKET_STATE_TYPE: {
      updatedState[SELECTED_MARKET_STATE_TYPE] = action.selectedMarketStateType;
      break;
    }
    case SET_BET_DATE: {
      updatedState[BET_DATE] = action.betDate;
      break;
    }
    case SET_MARKET_STATUS: {
      updatedState[MARKET_STATUS] = action.marketStatus;
      break;
    }
    default:
      throw new Error(`Error: ${action.type} not caught by My Bets reducer.`);
  }
  return updatedState;
}

export const MyBets = () => {
  const [state, dispatch] = useReducer(MyBetsReducer, {
    selectedMarketCardType: SPORTS_MARKET_TYPES[0].id,
    viewBy: MY_BETS_VIEW_BY[0].value,
    marketStatus: MY_BETS_MARKET_STATUS[0].value,
    betDate: MY_BETS_BET_DATE[0].value,
    rows: MOCK_GAMES_DATA,
    selectedMarketStateType: MARKET_STATE_TYPES[0].id,
  });

  const {
    viewBy,
    rows,
    selectedMarketCardType
  } = state;
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
              <span>
                You have <b>$200.00</b> in winnings to claim.
              </span>
              <PrimaryButton text={'Claim Bets'} action={null} />
            </div>
          }
        />
        <div>
          <span>
            View by
            <SquareDropdown
              options={MY_BETS_VIEW_BY}
              defaultValue={MY_BETS_VIEW_BY[0].value}
              onChange={viewBy =>
                dispatch({ type: SET_VIEW_BY, viewBy })
              }
              minimalStyle
            />
          </span>
          {showEvents && (
            <span>
              Market Status:
              <SquareDropdown
                options={MY_BETS_MARKET_STATUS}
                defaultValue={MY_BETS_MARKET_STATUS[0].value}
                onChange={marketStatus =>
                  dispatch({
                    type: SET_MARKET_STATUS,
                    marketStatus
                  })
                }
                minimalStyle
              />
            </span>
          )}
          {!showEvents && (
            <span>
              Bet Date:
              <SquareDropdown
                options={MY_BETS_BET_DATE}
                defaultValue={MY_BETS_BET_DATE[0].value}
                onChange={betDate =>
                  dispatch({
                    type: SET_BET_DATE,
                    betDate
                  })
                }
                minimalStyle
              />
            </span>
          )}
        </div>
        {showEvents && (
          <PillSelection
            options={SPORTS_MARKET_TYPES}
            defaultSelection={0}
            large
            onChange={selectedMarketCardType =>
              dispatch({
                type: SET_SELECTED_MARKET_CARD_TYPE,
                selectedMarketCardType
              })
            }
          />
        )}
        {!showEvents && (
          <PillSelection
            options={MARKET_STATE_TYPES}
            defaultSelection={0}
            large
            onChange={selectedMarketStateType =>
              dispatch({
                type: SET_SELECTED_MARKET_STATE_TYPE,
                selectedMarketStateType
              })
            }
          />
        )}
        <FilterSearch
          placeholder={'Search markets & outcomes...'}
          search=""
          isSearchingMarkets={false}
        />
        <FilterButton title="Filters" />
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
        {showEvents &&
          rows.map(row => (
            <Game row={row} type={SPORTS_MARKET_TYPES[selectedMarketCardType].label} />
          ))}
        {rows.length > 0 && !showEvents && <Outcomes rows={rows} />}
      </div>
    </div>
  );
};
