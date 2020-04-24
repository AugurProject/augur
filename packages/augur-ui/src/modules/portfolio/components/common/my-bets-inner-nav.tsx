import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import {
  MAXFEE_PARAM_NAME,
  MOBILE_MENU_STATES,
  SHOW_INVALID_MARKETS_PARAM_NAME,
  SPREAD_PARAM_NAME,
  TEMPLATE_FILTER,
} from 'modules/common/constants';
import { XIcon } from 'modules/common/icons';
import MarketsListFilters from 'modules/app/containers/markets-list-filters';
import MarketsListSortBy from 'modules/app/containers/markets-list-sortBy';
import CategoryFilters from 'modules/app/containers/category-filters';
import { PrimaryButton } from 'modules/common/buttons';

import Styles from 'modules/app/components/inner-nav/inner-nav.styles.less';
import { FilterSortOptions } from 'modules/types';
import updateMultipleQueries from 'modules/routes/helpers/update-multiple-queries';

interface MyBetsInnerNavProps {
  mobileMenuState: number;
}

export const MyBetsInnerNav = ({
  mobileMenuState,
}: MyBetsInnerNavProps) => {
  const showMainMenu = mobileMenuState >= MOBILE_MENU_STATES.FIRSTMENU_OPEN;

  return (
    <aside
      className={classNames(Styles.InnerNav, {
        [Styles.mobileShow]: showMainMenu,
      })}
    >
      {showMainMenu && (
        <div>
          <span>Categories & Filters</span>
        </div>
      )}
    </aside>
  );
};
