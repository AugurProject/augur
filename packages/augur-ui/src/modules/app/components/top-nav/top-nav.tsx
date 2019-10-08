import React, { ReactNode } from 'react';

import { Link } from 'react-router-dom';
import classNames from 'classnames';
import makePath from 'modules/routes/helpers/make-path';
import { SecondaryButton } from 'modules/common/buttons';

import Styles from 'modules/app/components/top-nav/top-nav.styles.less';
import { NavMenuItem } from 'modules/types';

interface TopNavProps {
  isLogged: boolean;
  menuData: NavMenuItem[];
  currentBasePath: string;
  isDisabled?: boolean;
}

const TopNav = ({ isLogged, isDisabled = false, menuData, currentBasePath }: TopNavProps) => {

  const isCurrentItem = item => {
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
              <div className={Styles.CreateButton} key={item.title}>
                <Link to={item.route ? makePath(item.route) : null}>
                  <SecondaryButton
                    disabled={isDisabled}
                    text={'Create Market'}
                    action={() => null}
                  />
                </Link>
              </div>
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
      </ul>
    </aside>
  );
};

export default TopNav;
