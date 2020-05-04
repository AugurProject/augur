import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import {
  MOBILE_MENU_STATES,
  MY_BETS_VIEW_BY,
  MY_BETS_MARKET_STATUS,
  SPORTS_MARKET_TYPES,
  EVENT,
  MY_BETS_BET_DATE,
  MARKET_STATE_TYPES,
} from 'modules/common/constants';
import { XIcon } from 'modules/common/icons';

import Styles from 'modules/app/components/inner-nav/inner-nav.styles.less';
import { RadioBarGroup } from 'modules/common/form';
import { PillSelection } from 'modules/common/selection';
import { SecondaryButton } from 'modules/common/buttons';
import { useMyBetsStore } from 'modules/portfolio/store/my-bets';
import { useAppStatusStore } from 'modules/app/store/app-status';

export const MyBetsInnerNav = () => {
  const { mobileMenuState, actions: { setMobileMenuState } } = useAppStatusStore();
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

  const [state, setState] = useState({
    selectedMarketCardTypeLocal: selectedMarketCardType,
    viewByLocal: viewBy,
    marketStatusLocal: marketStatus,
    betDateLocal: betDate,
    selectedMarketStateTypeLocal: selectedMarketStateType,
  });

  useEffect(() => {
    setState({
      ...state,
      selectedMarketCardTypeLocal: selectedMarketCardType,
      viewByLocal: viewBy,
      marketStatusLocal: marketStatus,
      betDateLocal: betDate,
      selectedMarketStateTypeLocal: selectedMarketStateType,
    });
  }, [
    viewBy,
    marketStatus,
    betDate,
    selectedMarketCardType,
    selectedMarketStateType,
  ]);

  const {
    selectedMarketCardTypeLocal,
    viewByLocal,
    marketStatusLocal,
    betDateLocal,
    selectedMarketStateTypeLocal,
  } = state;

  const showMainMenu = mobileMenuState >= MOBILE_MENU_STATES.FIRSTMENU_OPEN;
  const showEvents = MY_BETS_VIEW_BY[viewByLocal].label === EVENT;

  return (
    <aside
      className={classNames(Styles.InnerNav, Styles.MyBets, {
        [Styles.mobileShow]: showMainMenu,
      })}
    >
      {showMainMenu && (
        <div>
          <span>Filters</span>
          <button
            onClick={() => {
              setMobileMenuState(MOBILE_MENU_STATES.CLOSED);
            }}
          >
            {XIcon}
          </button>
        </div>
      )}
      <ul className={classNames(Styles.InnerNav__menu)}>
        <div>
          <span>View By</span>
          <RadioBarGroup
            radioButtons={MY_BETS_VIEW_BY}
            defaultSelected={viewByLocal}
            onChange={viewByLocal => setState({ ...state, viewByLocal })}
            light
          />
          {showEvents && (
            <>
              <span>Status</span>
              <RadioBarGroup
                radioButtons={MY_BETS_MARKET_STATUS}
                defaultSelected={marketStatusLocal}
                onChange={marketStatusLocal =>
                  setState({ ...state, marketStatusLocal })
                }
                light
              />
              <span>Show</span>
              <PillSelection
                options={SPORTS_MARKET_TYPES}
                defaultSelection={selectedMarketCardTypeLocal}
                large
                onChange={selectedMarketCardTypeLocal =>
                  setState({ ...state, selectedMarketCardTypeLocal })
                }
              />
            </>
          )}
          {!showEvents && (
            <>
              <span>bet date</span>
              <RadioBarGroup
                radioButtons={MY_BETS_BET_DATE}
                defaultSelected={betDateLocal}
                onChange={betDateLocal => setState({ ...state, betDateLocal })}
                light
              />
              <span>Show</span>
              <PillSelection
                options={MARKET_STATE_TYPES}
                defaultSelection={selectedMarketStateTypeLocal}
                large
                onChange={selectedMarketStateTypeLocal =>
                  setState({ ...state, selectedMarketStateTypeLocal })
                }
              />
            </>
          )}
        </div>

        <SecondaryButton
          text={'Apply filters'}
          action={() => {
            setViewBy(viewByLocal);
            if (showEvents) {
              setMarketStatus(marketStatusLocal);
              setSelectedMarketCardType(selectedMarketCardTypeLocal);
            } else {
              setBetDate(betDateLocal);
              setSelectedMarketStateType(selectedMarketStateTypeLocal);
            }
            setMobileMenuState(MOBILE_MENU_STATES.CLOSED);
          }}
        />
      </ul>
    </aside>
  );
};
