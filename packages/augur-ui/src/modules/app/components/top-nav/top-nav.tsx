import React from 'react';
import ReactTooltip from 'react-tooltip';
import TooltipStyles from 'modules/common/tooltip.styles.less';

import { Link } from 'react-router-dom';
import classNames from 'classnames';
import makePath from 'modules/routes/helpers/make-path';
import { SecondaryButton, PrimaryButton } from 'modules/common/buttons';
import { GlobalChat } from 'modules/global-chat/components/global-chat';

import Styles from 'modules/app/components/top-nav/top-nav.styles.less';
import { NavMenuItem } from 'modules/types';
import { helpIcon } from 'modules/common/icons';
import { log } from 'util';

interface TopNavProps {
  isLogged: boolean;
  menuData: NavMenuItem[];
  currentBasePath: string;
  isDisabled?: boolean;
  migrateV1Rep: Function;
  showMigrateRepButton: boolean;
}

const TopNav = ({
  isLogged,
  isDisabled = false,
  menuData,
  currentBasePath,
  migrateV1Rep,
  showMigrateRepButton = false,
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
        {accessFilteredMenu.map(item => {
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
            <li
              className={classNames({
                [Styles['Selected']]: selected,
              })}
              key={item.title}
            >
              <Link to={item.route ? makePath(item.route) : null}>
                <span>{item.title}</span>
              </Link>
            </li>
          );
        })}
        {showMigrateRepButton && (
          <PrimaryButton
            text='Migrate V1 to V2 REP'
            action={() => migrateV1Rep()}
          />
        )}
        {showMigrateRepButton && (
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
      </ul>
      <GlobalChat show={false} numberOfPeers={15} />
    </aside>
  );
};

export default TopNav;
