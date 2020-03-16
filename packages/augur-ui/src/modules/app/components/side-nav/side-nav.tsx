import React, { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import ThemeSwitch from 'modules/app/containers/theme-switch';
import makePath from 'modules/routes/helpers/make-path';
import ConnectDropdown from 'modules/auth/containers/connect-dropdown';
import ConnectAccount from 'modules/auth/containers/connect-account';
import { LogoutIcon, PlusCircleIcon } from 'modules/common/icons';
import { NavMenuItem, AccountBalances } from 'modules/types';
import Styles from 'modules/app/components/side-nav/side-nav.styles.less';
import { HelpIcon, HelpMenuList } from 'modules/app/components/help-resources';
import { SecondaryButton, ProcessingButton } from 'modules/common/buttons';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import { helpIcon, Chevron, Dot } from 'modules/common/icons';
import { MODAL_ADD_FUNDS, MIGRATE_FROM_LEG_REP_TOKEN, TRANSACTIONS, CREATEAUGURWALLET } from 'modules/common/constants';

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
  showCreateAccountButton: boolean;
  createFundedGsnWallet: Function;
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
  walletBalances,
  isHelpMenuOpen,
  updateHelpMenuState,
  updateConnectionTray,
  updateModal,
  showCreateAccountButton,
  createFundedGsnWallet
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
        {isLogged && (
          <HelpIcon
            isHelpMenuOpen={isHelpMenuOpen}
            updateHelpMenuState={updateHelpMenuState}
          />
        )}
        <ConnectAccount />
      </div>
      <div className={Styles.Container}>
        <div>
          {isConnectionTrayOpen && <ConnectDropdown />}
          {isHelpMenuOpen && <HelpMenuList />}
          <ThemeSwitch />
          <ul
            className={Styles.MainMenu}
          >
            {isLogged && (
              <SecondaryButton
                action={() => updateModal({ type: MODAL_ADD_FUNDS })}
                text="Add Funds"
                icon={PlusCircleIcon}
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
                  >
                    {helpIcon}
                  </label>
                  <ReactTooltip
                    id={'migrateRep'}
                    className={TooltipStyles.Tooltip}
                    effect='solid'
                    place='top'
                    type='light'
                  >
                    <p>
                      {
                        'You have V1 REP in your wallet. Migrate it to V2 REP to use it in Augur V2'
                      }
                    </p>
                  </ReactTooltip>
                </span>
              )}
              {showCreateAccountButton && (
                <span className={Styles.SideNavMigrateRep}>
                  <ProcessingButton
                    text={walletBalances.dai === 0 ? 'Waiting for Funding' : 'Initiaize GSN Wallet'}
                    action={() => createFundedGsnWallet()}
                    disabled={walletBalances.dai === 0}
                    queueName={CREATEAUGURWALLET}
                    queueId={CREATEAUGURWALLET}
                  />
                  <label
                    className={classNames(Styles.SideNavMigrateTooltipHint)}
                    data-tip
                    data-for={'accountCreation'}
                  >
                    {helpIcon}
                  </label>
                  <ReactTooltip
                    id={'accountCreation'}
                    className={TooltipStyles.Tooltip}
                    effect='solid'
                    place='top'
                    type='light'
                  >
                    <p>
                      {
                        'Account used to interact with Augur, needs to be funded before created'
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
                text="Global Chat"
                icon={Chevron}
              />
            </div>
            {isLogged && (
              <button onClick={() => logout()}>Logout {LogoutIcon}</button>
            )}
          </footer>
        </div>
      </div>
    </aside>
  );
};

export default SideNav;
