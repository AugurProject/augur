import React from 'react';
import { useLocation, useHistory } from 'react-router';
import classNames from 'classnames';
import { THEMES } from 'modules/common/constants';
import { useAppStatusStore } from 'modules/app/store/app-status';

import Styles from 'modules/app/components/theme-switch.styles.less';
import makePath from 'modules/routes/helpers/make-path';
import { MARKETS, CREATE_MARKET } from 'modules/routes/constants/views';
import parsePath from 'modules/routes/helpers/parse-path';

export const ThemeSwitch = () => {
  const location = useLocation();
  const history = useHistory();
  const {
    theme,
    actions: { setTheme },
  } = useAppStatusStore();
  const notMarkets = parsePath(location.pathname)[0] !== MARKETS;
  const disabled = parsePath(location.pathname)[0] === CREATE_MARKET;
  const marketsPath = { pathname: makePath(MARKETS, null) };
  return (
    <ul className={Styles.ThemeSwitch}>
      <li>
        <button
          className={classNames({ [Styles.Active]: theme === THEMES.TRADING })}
          onClick={() => {
            if (theme !== THEMES.TRADING) {
              setTheme(THEMES.TRADING);
              if (notMarkets) history.push(marketsPath);
            }
          }}
          disabled={disabled}
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
          onClick={() => {
            if (theme !== THEMES.SPORTS) {
              setTheme(THEMES.SPORTS);
              if (notMarkets) history.push(marketsPath);
            }
          }}
          disabled={disabled}
        >
          Sportsbook
        </button>
      </li>
    </ul>
  );
};
