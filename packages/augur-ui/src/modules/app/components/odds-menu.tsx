import React from 'react';
import classNames from 'classNames';

import { Gear, CheckMark } from 'modules/common/icons';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { ODDS_TYPE, MODAL_ODDS, TIME_FORMATS } from 'modules/common/constants';

import Styles from 'modules/app/components/odds-menu.styles';

const { DECIMAL, FRACTIONAL, AMERICAN, PERCENT } = ODDS_TYPE;

const Odds = [DECIMAL, FRACTIONAL, AMERICAN, PERCENT];

const { TWENTY_FOUR, AM_PM } = TIME_FORMATS;

const TimeFormats = [TWENTY_FOUR, AM_PM];

export const OddsMenu = () => {
  const { isOddsMenuOpen, isMobile, actions: { setIsOddsMenuOpen, setModal } } = useAppStatusStore();

  return (
    <div className={classNames(Styles.OddsMenu, { [Styles.Open]: isOddsMenuOpen })}>
      <button onClick={() => isMobile ? setModal({type: MODAL_ODDS}) : setIsOddsMenuOpen(!isOddsMenuOpen)}>{Gear}</button>
      <OddsOptions />
      <TimeOptions />
    </div>
  );
};

export const OddsOptions = () => {
  const { oddsType, actions: { setOdds } } = useAppStatusStore();
  return (
    <ul className={Styles.OddsOptions}>
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
  );
}


export const TimeOptions = () => {
  const { timeFormat, actions: { setTimeFormat } } = useAppStatusStore();
  return (
    <ul className={Styles.OddsOptions}>
        <li>
          <h4>Time Format</h4>
        </li>
        <li className={classNames({ [Styles.Selected]: TimeFormats[0] === timeFormat })}>
          <button
            onClick={() => TimeFormats[0] !== timeFormat && setTimeFormat(TimeFormats[0])}
          >
            {TIME_FORMATS[0]} {CheckMark}
          </button>
        </li>
        <li className={classNames({ [Styles.Selected]: TimeFormats[1] === timeFormat })}>
          <button
            onClick={() => TimeFormats[1] !== timeFormat && setTimeFormat(TimeFormats[1])}
          >
            {TimeFormats[1]} {CheckMark}
          </button>
        </li>
      </ul>
  );
}
