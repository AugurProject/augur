import React from 'react';
import ReactTooltip from 'react-tooltip';
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
import TooltipStyles from 'modules/common/tooltip.styles.less';
import { helpIcon, Chevron } from 'modules/common/icons';

interface SideNavProps {
  defaultMobileClick: Function;
  isLogged: boolean;
  menuData: NavMenuItem[];
  currentBasePath: string;
  isConnectionTrayOpen: boolean;
  logout: Function;
  showNav: boolean;
  showGlobalChat: Function;
  migrateV1Rep: Function;
  showMigrateRepButton: boolean;
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
  migrateV1Rep,
  showMigrateRepButton,
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
        {isLogged && <HelpResources />}
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

            <div>
              {showMigrateRepButton && (
                <span className={Styles.SideNavMigrateRep}>
                  <SecondaryButton
                    text='Migrate V1 to V2 REP'
                    action={() => migrateV1Rep()}
                  />
                </span>
              )}

              {showMigrateRepButton && (
                <span>
                  <label
                    className={classNames(Styles.SideNavMigrateTooltipHint)}
                    data-tip
                    data-for={'migrateRep'}
                  >
                    {helpIcon}
                  </label>
                  <ReactTooltip
                    id={'migrateRep'}
                    className={TooltipStyles.Tooltip}
                    effect="solid"
                    place="top"
                    type="light"
                  >
                    <p>
                      {
                        'You have V1 REP in your wallet. Migrate it to V2 REP to use it in Augur V2'
                      }
                    </p>
                  </ReactTooltip>
                </span>
              )}
            </div>
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
              <div onClick={() => logout()}>Logout {LogoutIcon()}</div>
            )}
          </footer>
        </div>
      </div>
    </aside>
  );
};

export default SideNav;
