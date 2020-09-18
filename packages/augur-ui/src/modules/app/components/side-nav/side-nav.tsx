import React from 'react';
import ReactTooltip from 'react-tooltip';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { ThemeSwitch } from 'modules/app/components/theme-switch';
import makePath from 'modules/routes/helpers/make-path';
import ConnectDropdown from 'modules/auth/connect-dropdown';
import { Dot, helpIcon, MobileNavCloseIcon, LogoutIcon, AddIcon, ShortChevron } from 'modules/common/icons';
import { NavMenuItem } from 'modules/types';
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
  MODAL_GLOBAL_CHAT,
  MODAL_MIGRATE_REP,
  MOBILE_MENU_STATES,
} from 'modules/common/constants';
import { Stats } from 'modules/app/components/top-bar';
import { NewLogo } from 'modules/app/components/logo';
import { OddsMenu } from 'modules/app/components/odds-menu';
import { logout } from 'modules/auth/actions/logout';
import CategoryFilters from '../inner-nav/category-filters';

interface SideNavProps {
  isLogged: boolean;
  menuData: NavMenuItem[];
  showNav: boolean;
}

const SideNav = ({
  isLogged,
  menuData,
  showNav,
}: SideNavProps) => {
  const {
    pendingQueue,
    loginAccount: { balances },
    env,
    currentBasePath,
    isHelpMenuOpen,
    isConnectionTrayOpen,
    theme,
    mobileMenuState,
    actions: { setIsHelpMenuOpen, setModal, setMobileMenuState, closeAppMenus },
  } = useAppStatusStore();
  const pending =
    pendingQueue[TRANSACTIONS] &&
    pendingQueue[TRANSACTIONS][MIGRATE_FROM_LEG_REP_TOKEN];
  const showMigrateRepButton =
    balances?.legacyRep !== "0" || balances?.legacyAttoRep !== "0" || !!pending;
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
                    setMobileMenuState(MOBILE_MENU_STATES.CLOSED);
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
                    text='Migrate V1 to V2 REP'
                    action={() => setModal({ type: MODAL_MIGRATE_REP })}
                    queueName={TRANSACTIONS}
                    queueId={MIGRATE_FROM_LEG_REP_TOKEN}
                    primaryButton
                  />
                  <label
                    className={classNames(Styles.SideNavMigrateTooltipHint)}
                    data-tip
                    data-for={'tooltip--mobileMigrateRep'}
                    data-iscapture={true}
                  >
                    {helpIcon}
                  </label>
                  <ReactTooltip
                    id={'tooltip--mobileMigrateRep'}
                    className={TooltipStyles.Tooltip}
                    effect="solid"
                    place="top"
                    type="light"
                    event="mouseover mouseenter"
                    eventOff="mouseleave mouseout scroll mousewheel blur"
                  >
                    <p>
                      {
                        Number(balances.legacyRep)
                          ? 'You have V1 REP in your trading account. Migrate it to V2 REP to use it in Augur V2.'
                          : 'You have V1 REP in your wallet. Migrate it to V2 REP to use it in Augur V2.'
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
                    action={() => setModal({ type: MODAL_GLOBAL_CHAT })}
                    text="Global Chat"
                    icon={Chevron}
                  />
                </div>
              }
              <button onClick={() => logout()}>
                Logout {LogoutIcon}
              </button>
            </footer>
          )}

          {!isTrading &&
            <CategoryFilters />
          }

          {!isTrading && (
            <footer>
              <HelpIcon
                isHelpMenuOpen={isHelpMenuOpen}
                updateHelpMenuState={() => setModal({ type: MODAL_HELP })}
              />
              <OddsMenu />
              {whichChatPlugin &&
                <div className={Styles.GlobalChat}>
                  <SecondaryButton
                    action={() => setModal({ type: MODAL_GLOBAL_CHAT })}
                    text="Global Chat"
                    icon={ShortChevron}
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
