import React from 'react';
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
import { GlobalChat } from 'modules/global-chat/components/global-chat';
import { NavMenuItem, AccountBalances } from 'modules/types';
import { helpIcon, Dot } from 'modules/common/icons';
import { TRANSACTIONS, MIGRATE_FROM_LEG_REP_TOKEN } from 'modules/common/constants';

import Styles from 'modules/app/components/top-nav/top-nav.styles.less';

interface TopNavProps {
  isLogged: boolean;
  menuData: NavMenuItem[];
  currentBasePath: string;
  isDisabled?: boolean;
  migrateV1Rep: Function;
  showMigrateRepButton: boolean;
  walletBalances: AccountBalances;
  updateModal: Function;
}

const SPREAD_INDEX = 3;

const TopNav = ({
  isLogged,
  isDisabled = false,
  menuData,
  currentBasePath,
  migrateV1Rep,
  showMigrateRepButton = false,
  walletBalances,
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
          if (item.title === 'Create') {
            return (
              <li className={Styles.CreateButton} key={item.title}>
                <Link to={item.route ? makePath(item.route) : null}>
                  <SecondaryButton
                    disabled={isDisabled}
                    text={'Create Market'}
                    action={() => null}
                  />
                </Link>
              </li>
            );
          }
          return (
            <>
              {index === SPREAD_INDEX && (
                <li key={index} className={Styles.FillSpace} />
              )}
              {index === SPREAD_INDEX && showMigrateRepButton && (
                <li>
                  <div className={Styles.MigrateRep}>
                    <ProcessingButton
                        text={'Migrate V1 to V2 REP'}
                        action={() => migrateV1Rep()}
                        queueName={TRANSACTIONS}
                        queueId={MIGRATE_FROM_LEG_REP_TOKEN}
                        secondaryButton
                      />
                  </div>
                  <span>
                    <label
                      className={classNames(TooltipStyles.TooltipHint)}
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
                          walletBalances.legacyRep > 0
                            ? 'You have V1 REP in your Augur account address. Migrate it to V2 REP to use it in Augur V2.'
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
            </>
          );
        })}
        {!isLogged && (
          <div className={Styles.BettingUI}>
            <ExternalLinkText
              title={'Betting UI'}
              label={' - Coming Soon!'}
              URL={'https://augur.net'}
            />
          </div>
        )}
      </ul>
      <GlobalChat show={false} numberOfPeers={15} />
    </aside>
  );
};

export default TopNav;
