import React from 'react';
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

export const TopNav = () => {
  const location = useLocation();
  const path = parsePath(location.pathname)[0];
  const {
    isMobile,
    actions: { setSidebar },
  } = useAppStatusStore();

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
        <button
          title="This doesn't do anything yet!"
          onClick={() => alert('TODO: Make this work.')}
        >
          Connect Account
        </button>
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
