import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import makePath from 'modules/routes/helpers/make-path';
import ConnectDropdown from 'modules/auth/containers/connect-dropdown';
import ConnectAccount from 'modules/auth/containers/connect-account';
import { LogoutIcon } from 'modules/common/icons';
import { NavMenuItem } from 'modules/types';
import Styles from 'modules/app/components/side-nav/side-nav.styles.less';
import HelpResources from 'modules/app/containers/help-resources';
import { SecondaryButton } from 'modules/common/buttons';
import { Chevron } from 'modules/common/icons';

interface SideNavProps {
  defaultMobileClick: Function;
  isLogged: boolean;
  menuData: NavMenuItem[];
  currentBasePath: string;
  isConnectionTrayOpen: boolean;
  logout: Function;
  showNav: boolean;
  showGlobalChat: Function;
}

const SideNav = ({
  isLogged,
  defaultMobileClick,
  menuData,
  isConnectionTrayOpen,
  logout,
  currentBasePath,
  showNav,
  showGlobalChat,
}: SideNavProps) => {
  const accessFilteredMenu = menuData.filter(
    item => !(item.requireLogin && !isLogged)
  );

  return (
    <aside
      className={classNames(Styles.SideNav, {
        [Styles.showNav]: showNav,
      })}
    >
      <div>
        <ConnectAccount />
      </div>

      <div className={Styles.SideNav__container}>
        <div>
          {isConnectionTrayOpen && <ConnectDropdown />}
          <ul
            className={classNames({
              [Styles.accountDetailsOpen]: isConnectionTrayOpen,
            })}
          >
            {accessFilteredMenu.map((item, idx) => (
              <li
                key={idx}
                className={classNames({
                  [Styles.disabled]: item.disabled,
                  [Styles.selected]: item.route === currentBasePath,
                })}
              >
                <Link
                  to={item.route ? makePath(item.route) : null}
                  onClick={() => defaultMobileClick()}
                >
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>

          <footer>
            <div className={Styles.GlobalChat}>
              <SecondaryButton
                action={showGlobalChat}
                text='Global Chat'
                icon={Chevron}
              />
            </div>
            {isLogged && (
              <>
                <div onClick={() => logout()}>Logout {LogoutIcon()}</div>
                <HelpResources />
              </>
            )}
          </footer>
        </div>
      </div>
    </aside>
  );
};

export default SideNav;
