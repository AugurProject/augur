import React from 'react';
import classNames from 'classnames';
import { MOBILE_MENU_STATES } from 'modules/common/constants';
import { XIcon } from 'modules/common/icons';
import MarketsListFilters from 'modules/app/containers/markets-list-filters';
import CategoryFilters from 'modules/app/containers/category-filters';

import Styles from 'modules/app/components/inner-nav/inner-nav.styles.less';

interface BaseInnerNavPureProps {
  mobileMenuState: number;
  updateMobileMenuState: Function;
}

const BaseInnerNavPure = ({
  mobileMenuState,
  updateMobileMenuState,
}: BaseInnerNavPureProps) => {
  const showMainMenu = mobileMenuState >= MOBILE_MENU_STATES.FIRSTMENU_OPEN;

  return (
    <aside
      className={classNames(Styles.InnerNav, {
        [Styles.mobileShow]: showMainMenu,
      })}
    >
      {showMainMenu && (
        <div>
          <button
            onClick={() => updateMobileMenuState(MOBILE_MENU_STATES.CLOSED)}
          >
            {XIcon}
          </button>
        </div>
      )}
      <ul
        className={classNames(
          Styles.InnerNav__menu,
          Styles['InnerNav__menu--main']
        )}
      >
        <CategoryFilters />
        <MarketsListFilters />
      </ul>
    </aside>
  );
};

export default BaseInnerNavPure;
