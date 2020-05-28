import React from 'react';
import ReactTooltip from 'react-tooltip';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { ThemeSwitch } from 'modules/app/components/theme-switch';
import makePath from 'modules/routes/helpers/make-path';
import ConnectDropdown from 'modules/auth/components/connect-dropdown/connect-dropdown';
import { Dot, helpIcon, MobileNavCloseIcon, LogoutIcon, AddIcon } from 'modules/common/icons';
import { AccountBalances, NavMenuItem } from 'modules/types';
import Styles from 'modules/app/components/side-nav/side-nav.styles.less';
import { HelpIcon } from 'modules/app/components/help-resources';
import {
  SecondaryButton,
  ProcessingButton,
  PrimaryButton,
} from 'modules/common/buttons';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import { helpIcon, Chevron, Dot } from 'modules/common/icons';
import { useAppStatusStore } from 'modules/app/store/app-status';
import {
  MIGRATE_FROM_LEG_REP_TOKEN,
  TRANSACTIONS,
  MODAL_HELP,
  MODAL_ADD_FUNDS,
  THEMES,
} from 'modules/common/constants';
import { Stats } from '../top-bar';
import { NewLogo } from '../logo';
import { OddsMenu } from '../odds-menu';

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
}: SideNavProps) => {
  const {
    env,
    currentBasePath,
    isHelpMenuOpen,
    isConnectionTrayOpen,
    theme,
    mobileMenuState,
    actions: { setIsHelpMenuOpen, setGSNEnabled, setModal, setMobileMenuState, closeAppMenus },
  } = useAppStatusStore();
  const whichChatPlugin = env.plugins?.chat;
  const accessFilteredMenu = menuData.filter(
    item => !(item.requireLogin && !isLogged)
  );
  const isTrading = theme === THEMES.TRADING;
  return (
    <aside
      className={classNames(Styles.SideNav, {
        [Styles.showNav]: showNav,
      })}
    >
      <div>
      <button
          type="button"
          onClick={() => {
            closeAppMenus();
            setMobileMenuState(mobileMenuState - 1);
          }}
        >
          <MobileNavCloseIcon />
        </button>
        {isTrading && (
          <>
            {isLogged && (
              <HelpIcon
                isHelpMenuOpen={isHelpMenuOpen}
                updateHelpMenuState={() => setModal({ type: MODAL_HELP })}
              />
            )}
            <Stats />
          </>
        )}
        {!isTrading && (
          <>
            <NewLogo />
            {isLogged && (
              <PrimaryButton
                action={() => setModal({ type: MODAL_ADD_FUNDS })}
                text="Add Funds"
                icon={AddIcon}
              />
            )}
          </>
        )}
      </div>
      <div className={Styles.Container}>
        <div>
          {isConnectionTrayOpen && <ConnectDropdown />}
          <ThemeSwitch />
          <ul className={Styles.MainMenu}>
            {isLogged && isTrading && (
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
          {isLogged && isTrading && (
            <footer>
              {whichChatPlugin &&
                <div className={Styles.GlobalChat}>
                  <SecondaryButton
                    action={showGlobalChat}
                    text="Global Chat"
                    icon={Chevron}
                  />
                </div>
              }
              <button onClick={() => logout(setGSNEnabled)}>
                Logout {LogoutIcon}
              </button>
            </footer>
          )}
          {isLogged && !isTrading && (
            <footer>
              <HelpIcon
                isHelpMenuOpen={isHelpMenuOpen}
                updateHelpMenuState={() => setModal({ type: MODAL_HELP })}
              />
              <OddsMenu />
              {whichChatPlugin &&
                <div className={Styles.GlobalChat}>
                  <SecondaryButton
                    action={showGlobalChat}
                    text="Global Chat"
                    icon={Chevron}
                  />
                </div>
              }
            </footer>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SideNav;
