import React from 'react';
import classNames from 'classnames';
import { THEMES } from 'modules/common/constants';
import { useAppStatusStore } from 'modules/app/store/app-status';

import Styles from 'modules/app/components/theme-switch.styles';

export const ThemeSwitch = () => {
  const { theme, actions: { setTheme } } = useAppStatusStore();
  return (
    <ul className={Styles.ThemeSwitch}>
      <li>
        <button
          className={classNames({ [Styles.Active]: theme === THEMES.TRADING })}
          onClick={() => setTheme(THEMES.TRADING)}
        >
          Trading
        </button>
      </li>
      {/* <li>
        <button
          className={classNames({ [Styles.Active]: theme === THEMES.BETTING })}
          onClick={() => setTheme(THEMES.BETTING)}
        >
          Betting Exchange
        </button>
      </li> */}
      <li>
        <button
          className={classNames({ [Styles.Active]: theme === THEMES.SPORTS })}
          onClick={() => setTheme(THEMES.SPORTS)}
        >
          Sportsbook
        </button>
      </li>
    </ul>
  );
};