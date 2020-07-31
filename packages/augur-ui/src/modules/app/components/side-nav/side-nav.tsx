import React, { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import makePath from 'modules/routes/helpers/make-path';
import ConnectDropdown from 'modules/auth/containers/connect-dropdown';
import { Dot, helpIcon } from 'modules/common/icons';
import { AccountBalances, CoreStats, NavMenuItem, FormattedNumber } from 'modules/types';
import Styles from 'modules/app/components/side-nav/side-nav.styles.less';
import { HelpIcon, HelpMenuList } from 'modules/app/components/help-resources';
import {
  ChatButton,
  PrimaryButton,
  ProcessingButton,
  SecondaryButton,
} from 'modules/common/buttons';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import {
  MIGRATE_FROM_LEG_REP_TOKEN,
  MODAL_ADD_FUNDS,
  MODAL_HELP,
  TRANSACTIONS,
} from 'modules/common/constants';
import { Stats } from '../top-bar';
import { MARKETS } from 'modules/routes/constants/views';
import Logo from 'modules/app/components/logo';

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
  walletBalances: AccountBalances;
  isHelpMenuOpen: boolean;
  updateHelpMenuState: Function;
  updateConnectionTray: Function;
  updateModal: Function;
  createFundedGsnWallet: Function;
  restoredAccount: boolean;
  stats: CoreStats;
  whichChatPlugin: string;
  isMobile: string;
  tradingAccountCreated: boolean;
}

const SideNav = ({
  isLogged,
  defaultMobileClick,
  menuData,
  isConnectionTrayOpen,
  currentBasePath,
  showNav,
  showGlobalChat,
  migrateV1Rep,
  showMigrateRepButton,
  walletBalances,
  isHelpMenuOpen,
  updateHelpMenuState,
  updateConnectionTray,
  updateModal,
  stats,
  restoredAccount,
  whichChatPlugin,
  isMobile,
  tradingAccountCreated,
}: SideNavProps) => {
  useEffect(() => {
    if (isHelpMenuOpen) {
      updateConnectionTray(false);
    }
  }, [isHelpMenuOpen]);

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
        <Stats
          isLogged={isLogged}
          stats={stats}
          restoredAccount={restoredAccount}
          isMobile={true}
          tradingAccountCreated={tradingAccountCreated}
        />
      </div>
      <div className={Styles.SideNav__container}>
        <div>
          {isConnectionTrayOpen && <ConnectDropdown />}
          <ul
            className={classNames({
              [Styles.accountDetailsOpen]: isConnectionTrayOpen,
            })}
          >
            {isHelpMenuOpen && <HelpMenuList />}
              <div>
                <Link to={makePath(MARKETS)}>
                  <Logo />
                </Link>
                {isLogged && (
                  <PrimaryButton
                    action={() => updateModal({ type: MODAL_ADD_FUNDS })}
                    text="Add Funds"
                  />
                )}
              </div>
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
                    text={'Migrate REP to REPv2'}
                    action={() => migrateV1Rep()}
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
                        Number(walletBalances.legacyRep)
                          ? 'You have V1 REP in your trading account. Migrate it to V2 REP to use it in Augur V2.'
                          : 'You have V1 REP in your wallet. Migrate it to V2 REP to use it in Augur V2.'
                      }
                    </p>
                  </ReactTooltip>
                </span>
              )}
            </div>
          </ul>
          <footer>
            {isLogged && (
              <HelpIcon
                isHelpMenuOpen={isHelpMenuOpen}
                updateHelpMenuState={() => {
                  if (isMobile) {
                    updateModal({ type: MODAL_HELP });
                  } else {
                    updateHelpMenuState();
                  }
                }}
              />
            )}
            {((isLogged && whichChatPlugin) || whichChatPlugin === 'orbit') && (
                <ChatButton action={showGlobalChat} />
              )}
          </footer>
        </div>
      </div>
    </aside>
  );
};

export default SideNav;
