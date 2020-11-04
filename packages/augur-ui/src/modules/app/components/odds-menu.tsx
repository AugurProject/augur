import React, { useState } from 'react';
import classNames from 'classnames';

import { Gear, CheckMark } from 'modules/common/icons';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { ODDS_TYPE, MODAL_ODDS, TIME_FORMATS } from 'modules/common/constants';

import Styles from 'modules/app/components/odds-menu.styles.less';
import {
  SecondaryButton,
  PrimaryButton,
} from 'modules/common/buttons';

const { DECIMAL, FRACTIONAL, AMERICAN, PERCENT } = ODDS_TYPE;

const Odds = [DECIMAL, FRACTIONAL, AMERICAN, PERCENT];

const { TWENTY_FOUR, AM_PM } = TIME_FORMATS;

const TimeFormats = [TWENTY_FOUR, AM_PM];

export const OddsMenu = () => {
  const {
    isOddsMenuOpen,
    isMobile,
    actions: { setIsOddsMenuOpen, setModal },
  } = useAppStatusStore();

  return (
    <div
      className={classNames(Styles.OddsMenu, { [Styles.Open]: isOddsMenuOpen })}
    >
      <button
        onClick={() =>
          isMobile
            ? setModal({ type: MODAL_ODDS })
            : setIsOddsMenuOpen(!isOddsMenuOpen)
        }
      >
        {Gear}
      </button>
      <OptionsMenus />
    </div>
  );
};

export const OptionsMenus = ({ showConfirm, closeAction }) => {
  const {
    oddsType,
    timeFormat,
    actions: { setOdds, setTimeFormat },
  } = useAppStatusStore();
  const [oddsTypeState, setOddsState] = useState(oddsType);
  const [timeFormatState, setTimeFormatState] = useState(timeFormat);

  return (
    <div className={Styles.OptionsMenu}>
      <OddsOptions
        confirm={showConfirm}
        oddsType={showConfirm ? oddsTypeState : oddsType}
        setOdds={showConfirm ? setOddsState : setOdds}
      />
      <TimeOptions
        confirm={showConfirm}
        timeFormat={showConfirm ? timeFormatState : timeFormat}
        setTimeFormat={showConfirm ? setTimeFormatState : setTimeFormat}
      />
      {showConfirm && (
        <div>
          <SecondaryButton text="Cancel" action={() => closeAction()} />
          <PrimaryButton
            text="Confirm"
            action={() => {
              closeAction();
              setOdds(oddsTypeState);
              setTimeFormat(timeFormatState);
            }}
          />
        </div>
      )}
    </div>
  );
};

export const OddsOptions = ({ setOdds, oddsType }) => {
  return (
    <ul className={Styles.OddsOptions}>
      <li>
        <h4>Odds Settings</h4>
      </li>
      <li className={classNames({ [Styles.Selected]: Odds[0] === oddsType })}>
        <button onClick={() => Odds[0] !== oddsType && setOdds(Odds[0])}>
          {Odds[0]} {CheckMark}
        </button>
      </li>
      <li className={classNames({ [Styles.Selected]: Odds[1] === oddsType })}>
        <button onClick={() => Odds[1] !== oddsType && setOdds(Odds[1])}>
          {Odds[1]} {CheckMark}
        </button>
      </li>
      <li className={classNames({ [Styles.Selected]: Odds[2] === oddsType })}>
        <button onClick={() => Odds[2] !== oddsType && setOdds(Odds[2])}>
          {Odds[2]} {CheckMark}
        </button>
      </li>
      <li className={classNames({ [Styles.Selected]: Odds[3] === oddsType })}>
        <button onClick={() => Odds[3] !== oddsType && setOdds(Odds[3])}>
          0% - 100% {CheckMark}
        </button>
      </li>
    </ul>
  );
};

export const TimeOptions = ({ setTimeFormat, timeFormat }) => {
  return (
    <ul className={Styles.OddsOptions}>
      <li>
        <h4>Time Format</h4>
      </li>
      <li
        className={classNames({
          [Styles.Selected]: TimeFormats[0] === timeFormat,
        })}
      >
        <button
          onClick={() =>
            TimeFormats[0] !== timeFormat && setTimeFormat(TimeFormats[0])
          }
        >
          {TimeFormats[0]} {CheckMark}
        </button>
      </li>
      <li
        className={classNames({
          [Styles.Selected]: TimeFormats[1] === timeFormat,
        })}
      >
        <button
          onClick={() =>
            TimeFormats[1] !== timeFormat && setTimeFormat(TimeFormats[1])
          }
        >
          {TimeFormats[1]} {CheckMark}
        </button>
      </li>
    </ul>
  );
};
