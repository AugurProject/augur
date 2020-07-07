import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import {
  MAXFEE_PARAM_NAME,
  MOBILE_MENU_STATES,
  SHOW_INVALID_MARKETS_PARAM_NAME,
  SPREAD_PARAM_NAME,
  TEMPLATE_FILTER,
  MARKET_TYPE_PARAM_NAME,
} from 'modules/common/constants';
import { XIcon } from 'modules/common/icons';
import MarketsListFilters from 'modules/app/containers/markets-list-filters';
import MarketsListSortBy from 'modules/app/containers/markets-list-sortBy';
import CategoryFilters from 'modules/app/containers/category-filters';
import { PrimaryButton } from 'modules/common/buttons';

import Styles from 'modules/app/components/inner-nav/inner-nav.styles.less';
import { FilterSortOptions } from 'modules/types';
import updateMultipleQueries from 'modules/routes/helpers/update-multiple-queries';
import { MARKET_SORT, MARKET_MAX_FEES, MARKET_MAX_SPREAD, MARKET_SHOW_INVALID } from 'modules/filter-sort/actions/update-filter-sort-options';

interface BaseInnerNavPureProps {
  mobileMenuState: number;
  updateMobileMenuState: Function;
  selectedCategories: String[];
  filterSortOptions: FilterSortOptions;
  updateSelectedCategories: Function;
  history: History;
  location: Location;
  updateFilterSortOptionsSettings: Function;
}

const BaseInnerNavPure = ({
  mobileMenuState,
  updateMobileMenuState,
  selectedCategories,
  filterSortOptions,
  updateSelectedCategories,
  updateFilterSortOptionsSettings,
  location,
  history,
}: BaseInnerNavPureProps) => {
  const showMainMenu = mobileMenuState >= MOBILE_MENU_STATES.FIRSTMENU_OPEN;

  const [originalSelectedCategories, setOriginalSelectedCategories] = useState(
    selectedCategories
  );
  const [originalFilterSortOptions, setOriginalFilterSortOptions] = useState(
    filterSortOptions
  );
  const [showApply, setShowApply] = useState(false);
  const [maxFeeFilter, setMaxFeeFilter] = useState();
  const [maxSpreadFilter, setMaxSpreadFilter] = useState();
  const [marketTypeFilter, setMarketTypeFilter] = useState();
  const [showInvalidFilter, setShowInvalidFilter] = useState();
  const [templateOrCustomFilter, setTemplateOrCustomFilter] = useState();
  const [sortOptions, setSortOptions] = useState();

  const filterProps = {
    setMaxFeeFilter,
    setMaxSpreadFilter,
    setShowInvalidFilter,
    setTemplateOrCustomFilter,
    setMarketTypeFilter,
  };

  const sortProps = {
    setSortOptions,
  };

  const getFilters = (originalFilters = false) => {
    const filters = [
      {
        filterType: TEMPLATE_FILTER,
        value: originalFilters
          ? originalFilterSortOptions.templateFilter
          : templateOrCustomFilter,
      },
      {
        filterType: MAXFEE_PARAM_NAME,
        value: originalFilters
          ? originalFilterSortOptions.maxFee
          : maxFeeFilter,
      },
      {
        filterType: SPREAD_PARAM_NAME,
        value: originalFilters
          ? originalFilterSortOptions.maxLiquiditySpread
          : maxSpreadFilter,
      },
      {
        filterType: MARKET_TYPE_PARAM_NAME,
        value: originalFilters
          ? originalFilterSortOptions.marketTypeFilter
          : marketTypeFilter,
      },
      {
        filterType: SHOW_INVALID_MARKETS_PARAM_NAME,
        value: originalFilters
          ? originalFilterSortOptions.includeInvalidMarkets
          : showInvalidFilter,
      },
    ];

    return filters.filter(({ value }) => !!value);
  };

  const applyFilters = () => {
    const changedFilters = getFilters();

    updateMobileMenuState(MOBILE_MENU_STATES.CLOSED);

    if (changedFilters.length > 0) {
      updateMultipleQueries(changedFilters, location, history);
      const newSettings = {};

      changedFilters.forEach(({ value, filterType }) => {
        newSettings[filterType] = value;
        updateFilterSortOptionsSettings({[filterType]: value});
      });
    }

    sortOptions && updateFilterSortOptionsSettings({[MARKET_SORT]: sortOptions});
  };

  useEffect(() => {
    setShowApply(
      selectedCategories.toString() !== originalSelectedCategories.toString() ||
        JSON.stringify(filterSortOptions) !==
          JSON.stringify(originalFilterSortOptions)
    );
  }, [selectedCategories, filterSortOptions]);

  useEffect(() => {
    setShowApply(true);
  }, [
    templateOrCustomFilter,
    maxFeeFilter,
    maxSpreadFilter,
    showInvalidFilter,
    marketTypeFilter,
    sortOptions,
  ]);

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
          <span>Categories & Filters</span>
          <button
            onClick={() => {
              if (showMainMenu) {
                updateSelectedCategories(originalSelectedCategories);
                updateFilterSortOptionsSettings({
                  [MARKET_SORT]: originalFilterSortOptions.sortBy,
                  [MARKET_MAX_FEES]: originalFilterSortOptions.maxFee,
                  [MARKET_MAX_SPREAD]: originalFilterSortOptions.maxLiquiditySpread,
                  [MARKET_SHOW_INVALID]: originalFilterSortOptions.includeInvalidMarkets,
                  [TEMPLATE_FILTER]: originalFilterSortOptions.templateFilter,
                });
                updateMultipleQueries(getFilters(true), location, history);
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
          Styles['InnerNav__menu--main'],
          {
            [Styles.ExtraPaddingBottom]: (showMainMenu && showApply)
          }
        )}
      >
        <CategoryFilters />
        <MarketsListSortBy {...sortProps} /> {/* MOBILE ONLY */}
        <MarketsListFilters {...filterProps} />
        {/* This div is needed for Firefox not to glitch */
          <div></div>
        }
      </ul>
      {showMainMenu && showApply && (
        <div>
          <PrimaryButton text="Apply" action={() => applyFilters()} />
        </div>
      )}
    </aside>
  );
};

export default BaseInnerNavPure;
