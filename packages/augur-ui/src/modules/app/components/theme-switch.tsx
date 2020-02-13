import React from 'react';
import classNames from 'classnames';
import { THEMES } from 'modules/common/constants';
import Styles from 'modules/app/components/theme-switch.styles';

interface ThemeSwitchProps {
  theme: string;
  setTheme: Function;
}

export const ThemeSwitch = ({ theme, setTheme }: ThemeSwitchProps) => (
  <ul className={Styles.ThemeSwitch}>
    <li>
      <button
        className={classNames({ [Styles.Active]: theme === THEMES.TRADING })}
        onClick={() => setTheme(THEMES.TRADING)}
      >
        Trading
      </button>
    </li>
    <li>
      <button
        className={classNames({ [Styles.Active]: theme === THEMES.BETTING })}
        onClick={() => setTheme(THEMES.BETTING)}
      >
        Betting Exchange
      </button>
    </li>
  </ul>
);
