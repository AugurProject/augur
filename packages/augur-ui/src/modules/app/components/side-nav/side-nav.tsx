import React from 'react';
import ReactTooltip from 'react-tooltip';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { ThemeSwitch } from 'modules/app/components/theme-switch';
import makePath from 'modules/routes/helpers/make-path';
import ConnectDropdown from 'modules/auth/containers/connect-dropdown';
import { LogoutIcon } from 'modules/common/icons';
import { NavMenuItem, AccountBalances, CoreStats } from 'modules/types';
import Styles from 'modules/app/components/side-nav/side-nav.styles.less';
import { HelpIcon, HelpMenuList } from 'modules/app/components/help-resources';
import { SecondaryButton, ProcessingButton } from 'modules/common/buttons';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import { helpIcon, Chevron, Dot } from 'modules/common/icons';
import { useAppStatusStore } from 'modules/app/store/app-status';
import {
  MODAL_ADD_FUNDS,
  MIGRATE_FROM_LEG_REP_TOKEN,
  TRANSACTIONS,
} from 'modules/common/constants';
import { Stats } from '../top-bar';

interface SideNavProps {
  defaultMobileClick: Function;
  isLogged: boolean;
  menuData: NavMenuItem[];
  logout: Function;
  showNav: boolean;
  showGlobalChat: Function;
  migrateV1Rep: Function;
  showMigrateRepButton: boolean;
  walletBalances: AccountBalances;
  stats: CoreStats;
}

const SideNav = ({
  isLogged,
  defaultMobileClick,
  menuData,
  logout,
  showNav,
  showGlobalChat,
  migrateV1Rep,
  showMigrateRepButton,
  stats,
}: SideNavProps) => {
  const {
    restoredAccount,
    currentBasePath,
    isHelpMenuOpen,
    isConnectionTrayOpen,
    actions: { setIsHelpMenuOpen, setGSNEnabled, setModal },
  } = useAppStatusStore();

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
        {isLogged && (
          <HelpIcon
            isHelpMenuOpen={isHelpMenuOpen}
            updateHelpMenuState={setIsHelpMenuOpen}
          />
        )}
        <Stats
          isLogged={isLogged}
          stats={stats}
          restoredAccount={restoredAccount}
        />
      </div>
      <div className={Styles.Container}>
        <div>
          {isConnectionTrayOpen && <ConnectDropdown />}
          {isHelpMenuOpen && <HelpMenuList />}
          <ThemeSwitch />
          <ul className={Styles.MainMenu}>
            {isLogged && (
              <SecondaryButton
                action={() => setModal({ type: MODAL_ADD_FUNDS })}
                text="Add Funds"
              />
            )}
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
                  onClick={() => {
                    setIsHelpMenuOpen(false);
                    defaultMobileClick();
                  }}
                >
                  {item.button ? (
                    <SecondaryButton text={item.title} action={null} />
                  ) : (
                    <span>{item.title}</span>
                  )}
                  {item.showAlert && Dot}
                </Link>
              </li>
            ))}

            <div>
              {showMigrateRepButton && (
                <span className={Styles.SideNavMigrateRep}>
                  <ProcessingButton
                    text={'Migrate V1 to V2 REP'}
                    action={() => migrateV1Rep()}
                    queueName={TRANSACTIONS}
                    queueId={MIGRATE_FROM_LEG_REP_TOKEN}
                    secondaryButton
                  />
                  <label
                    className={classNames(Styles.SideNavMigrateTooltipHint)}
                    data-tip
                    data-for={'migrateRep'}
                    data-iscapture={true}
                  >
                    {helpIcon}
                  </label>
                  <ReactTooltip
                    id={'migrateRep'}
                    className={TooltipStyles.Tooltip}
                    effect="solid"
                    place="top"
                    type="light"
                    event="mouseover mouseenter"
                    eventOff="mouseleave mouseout scroll mousewheel blur"
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
          {isLogged && (
            <footer>
              <div className={Styles.GlobalChat}>
                <SecondaryButton
                  action={showGlobalChat}
                  text="Global Chat"
                  icon={Chevron}
                />
              </div>
              <button onClick={() => logout(setGSNEnabled)}>
                Logout {LogoutIcon}
              </button>
            </footer>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SideNav;
