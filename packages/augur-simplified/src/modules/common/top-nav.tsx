import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import Styles from 'modules/common/top-nav.styles.less';
import { Link } from 'react-router-dom';
import { MARKETS, PORTFOLIO, SIDEBAR_TYPES } from 'modules/constants';
import makePath from 'modules/routes/helpers/make-path';
import Logo from 'modules/common/logo';
import parsePath from 'modules/routes/helpers/parse-path';
import classNames from 'classnames';
import { GearIcon, ThreeLinesIcon } from 'modules/common/icons';
import { useAppStatusStore } from 'modules/stores/app-status';
import { useLocalStorage } from 'modules/stores/local-storage';
import ConnectAccount from 'modules/ConnectAccount/index';
import { useActiveWeb3React } from 'modules/ConnectAccount/hooks';

export const SettingsButton = () => {
  const {
    actions: { updateSettings },
  } = useAppStatusStore();
  const [open, setOpened] = useState(false);
  return (
    <React.Fragment key="settingsButton">
      <button
        className={Styles.SettingsButton}
        title="Augur Settings"
        onClick={() => setOpened(!open)}
      >
        {GearIcon}
      </button>
      {open && (
        <ul className={Styles.SettingsMenu}>
          <li>
            <h2>Settings</h2>
          </li>
          <li>
            <label>Slippage Tolerance</label>
            <ul>
              <li>
                <button onClick={() => updateSettings({ slippage: '0.1' })}>
                  0.1%
                </button>
              </li>
              <li>
                <button onClick={() => updateSettings({ slippage: '0.5' })}>
                  0.5%
                </button>
              </li>
              <li>
                <button onClick={() => updateSettings({ slippage: '1' })}>
                  1%
                </button>
              </li>
            </ul>
          </li>
        </ul>
      )}
    </React.Fragment>
  );
};

export const TopNav = () => {
  const location = useLocation();
  const path = parsePath(location.pathname)[0];
  const {
    isMobile,
    actions: { setSidebar },
  } = useAppStatusStore();
  const activeWeb3 = useActiveWeb3React();
  const [user, setUser] = useLocalStorage('user', null);

  useEffect(() => {
    if (
      activeWeb3?.library?.provider?.isMetaMask &&
      user?.account !== activeWeb3?.account &&
      activeWeb3?.account
    ) {
      setUser({ account: activeWeb3.account });
    } else if (!activeWeb3.active && !!user?.account) {
      setUser({});
    }
  }, [activeWeb3, user, setUser]);

  const autoLogin = user?.account || null;

  return (
    <nav
      className={classNames(Styles.TopNav, {
        [Styles.TwoTone]: path !== MARKETS,
      })}
    >
      <section>
        <Logo />
        {!isMobile && (
          <ol>
            <li className={classNames({ [Styles.Active]: path === MARKETS })}>
              <Link to={makePath(MARKETS)}>Markets</Link>
            </li>
            <li className={classNames({ [Styles.Active]: path === PORTFOLIO })}>
              <Link to={makePath(PORTFOLIO)}>Portfolio</Link>
            </li>
          </ol>
        )}
      </section>
      <section>
        <ConnectAccount autoLogin={autoLogin} darkMode={false} />
        {!isMobile && <SettingsButton />}
        {isMobile && (
          <button
            title="Augur Menu"
            onClick={() => setSidebar(SIDEBAR_TYPES.NAVIGATION)}
          >
            {ThreeLinesIcon}
          </button>
        )}
      </section>
    </nav>
  );
};

export default TopNav;
