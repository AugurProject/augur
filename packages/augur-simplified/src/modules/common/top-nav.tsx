import React from 'react';
import * as Styles from 'modules/common/top-nav.styles.less';
import { Link } from 'react-router-dom';
import { MARKETS, PORTFOLIO } from 'modules/constants';
import makePath from 'modules/routes/helpers/make-path';
import Logo from 'modules/common/logo';

export const TopNav = () => {
  return (
    <nav className={Styles.TopNav}>
      <Logo />
      <ol>
        <li><Link to={makePath(MARKETS)}>Markets</Link></li>
        <li><Link to={makePath(PORTFOLIO)}>Portfolio</Link></li>
      </ol>
      <button title="This doesn't do anything yet!" onClick={() => alert('TODO: Make this work.')}>
        Account
      </button>
    </nav>
  )
}

export default TopNav;