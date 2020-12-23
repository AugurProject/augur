import React from 'react';
import Styles from 'modules/common/top-nav.styles.less';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import { MARKETS, PORTFOLIO, SIDEBAR_TYPES } from 'modules/constants';
import makePath from 'modules/routes/helpers/make-path';
import Logo from 'modules/common/logo';
import parsePath from 'modules/routes/helpers/parse-path';
import classNames from 'classnames';
import { GearIcon, ThreeLinesIcon } from 'modules/common/icons';
import { useAppStatusStore } from 'modules/stores/app-status';
import ConnectAccount from 'modules/ConnectAccount/index';

export const TopNav = () => {
  const location = useLocation();
  const path = parsePath(location.pathname)[0];
  const {
    isMobile,
    loginAccount,
    actions: { setSidebar, updateLoginAccount },
  } = useAppStatusStore();

  const handleAccountUpdate = (activeWeb3) => {
    if (activeWeb3) {
      if (loginAccount && loginAccount.account) {
        if (loginAccount.account !== activeWeb3.account) {
          updateLoginAccount(activeWeb3);
        }
      } else {
        updateLoginAccount(activeWeb3);
      }
    }
  }

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
        <ConnectAccount updateLoginAccount={handleAccountUpdate} darkMode={false} />
        {!isMobile && (
          <button
            title="This doesn't do anything yet!"
            onClick={() => alert('TODO: Make this work.')}
          >
            {GearIcon}
          </button>
        )}
        {isMobile && (
          <button
            title="This doesn't do anything yet!"
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
