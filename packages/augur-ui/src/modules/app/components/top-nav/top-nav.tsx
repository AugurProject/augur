import React, { Fragment } from 'react';
import ReactTooltip from 'react-tooltip';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import makePath from 'modules/routes/helpers/make-path';
import {
  SecondaryButton,
  ExternalLinkText,
  ProcessingButton,
  AddFundsButton,
} from 'modules/common/buttons';
import { GlobalChat } from 'modules/global-chat/components/global-chat.tsx';
import { NavMenuItem } from 'modules/types';
import { helpIcon, Dot } from 'modules/common/icons';
import {
  TRANSACTIONS,
  MIGRATE_FROM_LEG_REP_TOKEN,
  TOTAL_FUNDS_TOOLTIP,
  MODAL_MIGRATE_REP,
  THEMES,
} from 'modules/common/constants';
import { CREATE_MARKET } from 'modules/routes/constants/views';
import { useAppStatusStore } from 'modules/app/store/app-status';
import Styles from 'modules/app/components/top-nav/top-nav.styles.less';
import { LinearPropertyLabelUnderlineTooltip } from 'modules/common/labels';
import { formatNumber } from 'utils/format-number';
import ButtonStyles from 'modules/common/buttons.styles.less';

interface TopNavProps {
  isLogged: boolean;
  menuData: NavMenuItem[];
}

const SPREAD_INDEX = 3;

const TopNav = ({ isLogged, menuData }: TopNavProps) => {
  const {
    env: { ui: { reportingOnly: disableMarketCreation } },
    currentBasePath,
    pendingQueue,
    loginAccount: { balances: walletBalances },
    actions: { setModal },
    theme
  } = useAppStatusStore();
  const pending =
    pendingQueue[TRANSACTIONS] &&
    pendingQueue[TRANSACTIONS][MIGRATE_FROM_LEG_REP_TOKEN];
  const showMigrateRepButton =
    walletBalances.legacyRep !== '0' ||
    walletBalances.signerBalances.legacyRep !== '0' ||
    !!pending;
  const isCurrentItem = item => {
    if (item.route === 'markets' && currentBasePath === 'market') return true;
    return item.route === currentBasePath;
  };

  const accessFilteredMenu = menuData.filter(
    item => !(item.requireLogin && !isLogged)
  );

  return (
    <aside className={Styles.TopNav}>
      <ul>
        {accessFilteredMenu.map((item, index) => {
          const selected = isCurrentItem(item);
          if (item.route === CREATE_MARKET) {
            return (
              <li className={Styles.CreateButton} key={item.title}>
                <Link
                  to={
                    item.route || !item.disabled ? makePath(item.route) : null
                  }
                >
                  <SecondaryButton
                    disabled={item.disabled || disableMarketCreation}
                    text="Create Market"
                    action={() => null}
                  />
                </Link>
              </li>
            );
          }
          return (
            <Fragment key={item.title}>
              {index === SPREAD_INDEX && (
                <li key="fill-space" className={Styles.FillSpace} />
              )}

              {index === SPREAD_INDEX && showMigrateRepButton && (
                <li className={Styles.MigrateRepItem} key="migrate-rep-button">
                  <div className={Styles.MigrateRep}>
                    <ProcessingButton
                      text="Migrate V1 to V2 REP"
                      action={() => setModal({ type: MODAL_MIGRATE_REP })}
                      queueName={TRANSACTIONS}
                      queueId={MIGRATE_FROM_LEG_REP_TOKEN}
                      primaryButton
                      className={ButtonStyles.ProcessingSpinnerButton}
                    />
                  </div>
                  <span>
                    <label
                      className={classNames(TooltipStyles.TooltipHint)}
                      data-tip
                      data-for="tooltip--migrateRep"
                    >
                      {helpIcon}
                    </label>
                    <ReactTooltip
                      id={'tooltip--migrateRep'}
                      className={TooltipStyles.Tooltip}
                      effect="solid"
                      place="top"
                      type="light"
                      event="mouseover mouseenter"
                      eventOff="mouseleave mouseout scroll mousewheel blur"
                    >
                      <p>
                        {walletBalances.legacyRep > 0
                          ? 'You have V1 REP in your User account address. Migrate it to V2 REP to use it in Augur V2.'
                          : 'You have V1 REP in your wallet. Migrate it to V2 REP to use it in Augur V2.'}
                      </p>
                    </ReactTooltip>
                  </span>
                </li>
              )}
              <li
                className={classNames({
                  [Styles['Selected']]: selected,
                  [Styles['AlternateStyle']]: item.alternateStyle,
                })}
                key={item.title}
              >
                <Link to={item.route ? makePath(item.route) : null}>
                  <span>{item.title}</span>
                  {item.showAlert && Dot}
                </Link>
              </li>
            </Fragment>
          );
        })}

        {!isLogged && (
          <div className={Styles.BettingUI}>
            <ExternalLinkText
              title="Betting UI"
              label=" - Coming Soon!"
              URL="https://augur.net"
            />
          </div>
        )}
        {isLogged && theme === THEMES.SPORTS && (
          <AddFundsButton />
        )}
      </ul>
      <GlobalChat />
    </aside>
  );
};

export default TopNav;
