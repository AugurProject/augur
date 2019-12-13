import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { MOBILE_MENU_STATES, SHOW_INVALID_MARKETS_PARAM_NAME, MAXFEE_PARAM_NAME, SPREAD_PARAM_NAME, TEMPLATE_FILTER } from 'modules/common/constants';
import { XIcon } from 'modules/common/icons';
import MarketsListFilters from 'modules/app/containers/markets-list-filters';
import MarketsListSortBy from 'modules/app/containers/markets-list-sortBy';
import CategoryFilters from 'modules/app/containers/category-filters';
import { PrimaryButton } from 'modules/common/buttons';

import Styles from 'modules/app/components/inner-nav/inner-nav.styles.less';
import { FilterSortOptions } from 'modules/types';
import updateQuery from 'modules/routes/helpers/update-query';

interface BaseInnerNavPureProps {
  mobileMenuState: number;
  updateMobileMenuState: Function;
  selectedCategories: String[];
  filterSortOptions: FilterSortOptions;
  updateMarketsListMeta: Function;
  updateMarketsSortBy: Function;
  updateMaxFee: Function;
  updateMaxSpread: Function;
  updateShowInvalid: Function;
  updateTemplateFilter: Function;
  updateSelectedCategories: Function;
  history: History;
  location: Location;
}

const BaseInnerNavPure = ({
  mobileMenuState,
  updateMobileMenuState,
  selectedCategories,
  filterSortOptions,
  updateMarketsListMeta,
  updateMarketsSortBy,
  updateMaxFee,
  updateMaxSpread,
  updateShowInvalid,
  updateTemplateFilter,
  updateSelectedCategories,
  location,
  history
}: BaseInnerNavPureProps) => {
  const showMainMenu = mobileMenuState >= MOBILE_MENU_STATES.FIRSTMENU_OPEN;

  const [originalSelectedCategories, setOriginalSelectedCategories] = useState(
    selectedCategories
  );
  const [originalFilterSortOptions, setOriginalFilterSortOptions] = useState(
    filterSortOptions
  );
  const [showApply, setShowApply] = useState(false);

  useEffect(() => {
    setShowApply(
      selectedCategories.toString() !== originalSelectedCategories.toString() ||
        JSON.stringify(filterSortOptions) !==
          JSON.stringify(originalFilterSortOptions)
    );
  }, [selectedCategories, filterSortOptions]);

  useEffect(() => {
    if (showMainMenu) {
      setOriginalFilterSortOptions(filterSortOptions);
      setOriginalSelectedCategories(selectedCategories);
      setShowApply(false);
    }
  }, [showMainMenu]);

  return (
    <aside
      className={classNames(Styles.InnerNav, {
        [Styles.mobileShow]: showMainMenu,
      })}
    >
      {showMainMenu && (
        <div>
          <span>Filters</span>
          <button
            onClick={() => {
              if (showMainMenu) {
                updateSelectedCategories(originalSelectedCategories);
                updateMarketsSortBy(originalFilterSortOptions.marketSort);
 

                updateMaxFee(originalFilterSortOptions.maxFee);
                updateQuery(
                  MAXFEE_PARAM_NAME,
                  originalFilterSortOptions.templateFilter,
                  location,
                  history
                );

                updateMaxSpread(originalFilterSortOptions.maxLiquiditySpread);
                updateQuery(
                  SPREAD_PARAM_NAME,
                  originalFilterSortOptions.templateFilter,
                  location,
                  history
                );
  
                updateShowInvalid(
                  originalFilterSortOptions.includeInvalidMarkets
                );
                updateQuery(
                  SHOW_INVALID_MARKETS_PARAM_NAME,
                  originalFilterSortOptions.includeInvalidMarkets,
                  location,
                  history
                );
                
                updateTemplateFilter(originalFilterSortOptions.templateFilter);
                updateQuery(
                  TEMPLATE_FILTER,
                  originalFilterSortOptions.templateFilter,
                  location,
                  history
                );
              }
              
              updateMobileMenuState(MOBILE_MENU_STATES.CLOSED);
            }}
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
        <MarketsListSortBy /> {/* MOBILE ONLY */}
        <MarketsListFilters />
      </ul>
      {showMainMenu && showApply && (
        <div>
          <PrimaryButton
            text="Apply"
            action={() => {
              updateMobileMenuState(MOBILE_MENU_STATES.CLOSED);
            }}
          />
        </div>
      )}
    </aside>
  );
};

export default BaseInnerNavPure;
