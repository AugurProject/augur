import React, {Fragment} from 'react';
import ReactTooltip from 'react-tooltip';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import makePath from 'modules/routes/helpers/make-path';
import {
  SecondaryButton,
  ExternalLinkText,
  ProcessingButton,
} from 'modules/common/buttons';
import GlobalChat from 'modules/global-chat/containers/global-chat' ;
import { NavMenuItem, AccountBalances, FormattedNumber } from 'modules/types';
import { helpIcon, Dot } from 'modules/common/icons';
import {
  TRANSACTIONS,
  MIGRATE_FROM_LEG_REP_TOKEN,
  TOTAL_FUNDS_TOOLTIP,
} from 'modules/common/constants';
import {
  CREATE_MARKET
} from 'modules/routes/constants/views';
import Styles from 'modules/app/components/top-nav/top-nav.styles.less';
import { LinearPropertyLabelUnderlineTooltip, LinearPropertyLabel } from 'modules/common/labels';
import { formatNumber } from 'utils/format-number';

interface TopNavProps {
  isLogged: boolean;
  menuData: NavMenuItem[];
  currentBasePath: string;
  migrateV1Rep: Function;
  showMigrateRepButton: boolean;
  walletBalances: AccountBalances;
  updateModal: Function;
  disableMarketCreation: boolean;
}

const SPREAD_INDEX = 3;

const TopNav = ({
  isLogged,
  menuData,
  currentBasePath,
  migrateV1Rep,
  showMigrateRepButton = false,
  walletBalances,
  disableMarketCreation,
}: TopNavProps) => {
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
                <Link to={item.route || !item.disabled ? makePath(item.route) : null}>
                  <SecondaryButton
                    disabled={item.disabled || disableMarketCreation}
                    text={'Create Market'}
                    action={() => null}
                  />
                </Link>
              </li>
            );
          }
          return (
            <Fragment key={index}>
              {index === SPREAD_INDEX && (
                <li key='fill-space' className={Styles.FillSpace} />
              )}

              <div className={Styles.ToolTip}>
                <LinearPropertyLabel
                  {...(formatNumber(0))}
                  highlightAlternateBolded
                />
              </div>

              {index === SPREAD_INDEX && showMigrateRepButton && (
                <li key='migrate-rep-button'>
                  <div className={Styles.MigrateRep}>
                    <ProcessingButton
                        text={'Migrate REP to REPv2'}
                        action={() => migrateV1Rep()}
                        queueName={TRANSACTIONS}
                        queueId={MIGRATE_FROM_LEG_REP_TOKEN}
                        primaryButton
                      />
                  </div>
                  <span>
                    <label
                      className={classNames(TooltipStyles.TooltipHint)}
                      data-tip
                      data-for={'tooltip--migrateRep'}
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
                        {
                          Number(walletBalances.legacyRep) > 0
                            ? 'You have V1 REP in your trading account. Migrate it to V2 REP to use it in Augur V2.'
                            : 'You have V1 REP in your wallet. Migrate it to V2 REP to use it in Augur V2.'
                        }
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
              title={''}
              label={''}
              URL={''}
            />
          </div>
        )}
      </ul>
      <GlobalChat />
    </aside>
  );
};

export default TopNav;
