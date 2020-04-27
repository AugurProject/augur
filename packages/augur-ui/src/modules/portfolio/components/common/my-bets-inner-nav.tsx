import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import {
  MOBILE_MENU_STATES,
  MY_BETS_VIEW_BY,
  MY_BETS_MARKET_STATUS,
  SPORTS_MARKET_TYPES,
  EVENT,
} from 'modules/common/constants';
import { XIcon } from 'modules/common/icons';

import Styles from 'modules/app/components/inner-nav/inner-nav.styles.less';
import { RadioBarGroup } from 'modules/common/form';
import { PillSelection } from 'modules/common/selection';
import {
  PrimaryButton,
} from 'modules/common/buttons';
import { useMyBetsStore } from 'modules/portfolio/store/my-bets';

interface MyBetsInnerNavProps {
  mobileMenuState: number;
  updateMobileMenuState: Function;
}

export const MyBetsInnerNav = ({
  mobileMenuState,
  updateMobileMenuState,
}: MyBetsInnerNavProps) => {
  const showMainMenu = mobileMenuState >= MOBILE_MENU_STATES.FIRSTMENU_OPEN;
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

  const {
    selectedMarketCardTypeLocal,
    viewByLocal,
    marketStatusLocal,
    betDateLocal,
    selectedMarketStateTypeLocal,
  } = state;

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
              updateMobileMenuState(MOBILE_MENU_STATES.CLOSED);
            }}
          >
            {XIcon}
          </button>
        </div>
      )}
      <ul className={classNames(Styles.InnerNav__menu)}>
        <span>View By</span>
        <RadioBarGroup
          radioButtons={MY_BETS_VIEW_BY}
          defaultSelected={viewByLocal}
          onChange={(viewByLocal) => setState({...state, viewByLocal})}
        />
        <span>Status</span>
        <RadioBarGroup
          radioButtons={MY_BETS_MARKET_STATUS}
          defaultSelected={marketStatusLocal}
          onChange={(marketStatusLocal) => setState({...state, marketStatusLocal})}
        />
        <span>Show</span>
        <PillSelection
          options={SPORTS_MARKET_TYPES}
          defaultSelection={selectedMarketStateTypeLocal}
          large
          onChange={(selectedMarketStateTypeLocal) => setState({...state, selectedMarketStateTypeLocal})}
        />
        <PrimaryButton text={'Apply filters'} action={() => null} />
      </ul>
    </aside>
  );
};
