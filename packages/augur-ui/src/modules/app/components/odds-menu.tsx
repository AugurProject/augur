import React, { useState } from 'react';
import classNames from 'classNames';

import { Gear, CheckMark } from 'modules/common/icons';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { ODDS_TYPE } from 'modules/common/constants';

import Styles from 'modules/app/components/odds-menu.styles';

const { DECIMAL, FRACTIONAL, AMERICAN, PERCENT } = ODDS_TYPE;

const Odds = [DECIMAL, FRACTIONAL, AMERICAN, PERCENT];

export const OddsMenu = () => {
  const [open, setOpen] = useState(false);
  const { oddsType, actions: { setOdds } } = useAppStatusStore();

  return (
    <div className={classNames(Styles.OddsMenu, { [Styles.Open]: open })}>
      <button onClick={() => setOpen(!open)}>{Gear}</button>
      <ul>
        <li>
          <h4>Odds Settings</h4>
        </li>
        <li className={classNames({ [Styles.Selected]: Odds[0] === oddsType })}>
          <button
            onClick={() => Odds[0] !== oddsType && setOdds(Odds[0])}
          >
            {Odds[0]} {CheckMark}
          </button>
        </li>
        <li className={classNames({ [Styles.Selected]: Odds[1] === oddsType })}>
          <button
            onClick={() => Odds[1] !== oddsType && setOdds(Odds[1])}
          >
            {Odds[1]} {CheckMark}
          </button>
        </li>
        <li className={classNames({ [Styles.Selected]: Odds[2] === oddsType })}>
          <button
            onClick={() => Odds[2] !== oddsType && setOdds(Odds[2])}
          >
            {Odds[2]} {CheckMark}
          </button>
        </li>
        <li className={classNames({ [Styles.Selected]: Odds[3] === oddsType })}>
          <button
            onClick={() => Odds[3] !== oddsType && setOdds(Odds[3])}
          >
            0% - 100% {CheckMark}
          </button>
        </li>
      </ul>
    </div>
  );
};
