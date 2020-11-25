import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useLocation, useHistory } from 'react-router';
import {
  MAXFEE_PARAM_NAME,
  MOBILE_MENU_STATES,
  SHOW_INVALID_MARKETS_PARAM_NAME,
  SPREAD_PARAM_NAME,
  TEMPLATE_FILTER,
  MARKET_TYPE_PARAM_NAME,
  THEMES,
} from 'modules/common/constants';
import { XIcon } from 'modules/common/icons';
import MarketsListFilters from 'modules/app/components/inner-nav/markets-list-filters';
import MarketsListSortBy from 'modules/app/components/inner-nav/markets-list-sortBy';
import CategoryFilters from 'modules/app/components/inner-nav/category-filters';
import { PrimaryButton } from 'modules/common/buttons';

import Styles from 'modules/app/components/inner-nav/inner-nav.styles.less';
import updateMultipleQueries from 'modules/routes/helpers/update-multiple-queries';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { MARKET_SORT, MARKET_MAX_FEES, MARKET_MAX_SPREAD, MARKET_SHOW_INVALID } from 'modules/app/store/constants';

const BaseInnerNavPure = () => {
  const location = useLocation();
  const history = useHistory();
  const {
    filterSortOptions,
    mobileMenuState,
    theme,
    marketsList: { selectedCategories },
    actions: {
      setMobileMenuState,
      updateMarketsList,
      updateFilterSortOptions,
    },
  } = useAppStatusStore();
  const [originalSelectedCategories, setOriginalSelectedCategories] = useState(
    selectedCategories
  );
  const [originalFilterSortOptions, setOriginalFilterSortOptions] = useState(
    filterSortOptions
  );
  const [showApply, setShowApply] = useState(false);
  const [filterSortState, setFilterSortState] = useState(filterSortOptions);
  const filterProps = {
    setFilterSortState: updates => setFilterSortState({ ...filterSortState, ...updates }),
  };

  const sortProps = {
    setFilterSortState: updates => setFilterSortState({ ...filterSortState, ...updates }),
  };
  const showMainMenu = mobileMenuState >= MOBILE_MENU_STATES.FIRSTMENU_OPEN && mobileMenuState <= MOBILE_MENU_STATES.SUBMENU_OPEN;

  const getFilters = (originalFilters = false) => {
    const filters = [
      {
        filterType: TEMPLATE_FILTER,
        value: originalFilters
          ? originalFilterSortOptions.templateFilter
          : filterSortState.templateFilter,
      },
      {
        filterType: MAXFEE_PARAM_NAME,
        value: originalFilters
          ? originalFilterSortOptions.maxFee
          : filterSortState.maxFee,
      },
      {
        filterType: SPREAD_PARAM_NAME,
        value: originalFilters
          ? originalFilterSortOptions.maxLiquiditySpread
          : filterSortState.maxLiquiditySpread,
      },
      {
        filterType: MARKET_TYPE_PARAM_NAME,
        value: originalFilters
          ? originalFilterSortOptions.marketTypeFilter
          : filterSortState.marketTypeFilter,
      },
      {
        filterType: SHOW_INVALID_MARKETS_PARAM_NAME,
        value: originalFilters
          ? originalFilterSortOptions.includeInvalidMarkets
          : filterSortState.includeInvalidMarkets,
      },
    ];
    return filters.filter(({ value }) => !!value);
  };

  const applyFilters = () => {
    const changedFilters = getFilters();

    setMobileMenuState(MOBILE_MENU_STATES.CLOSED);

    const filterUpdates = {};
    if (filterSortState.sortBy) {
      filterUpdates[MARKET_SORT] = filterSortState.sortBy;
    }
    if (changedFilters.length > 0) {
      updateMultipleQueries(changedFilters, location, history);
      changedFilters.forEach(({ value, filterType }) => {
        switch (filterType) {
          case TEMPLATE_FILTER:
            filterUpdates[TEMPLATE_FILTER] = value;
            break;
          case MAXFEE_PARAM_NAME:
            filterUpdates[MARKET_MAX_FEES] = value;
            break;
          case SPREAD_PARAM_NAME:
            filterUpdates[MARKET_MAX_SPREAD] = value;
            break;
          case SHOW_INVALID_MARKETS_PARAM_NAME:
            filterUpdates[MARKET_SHOW_INVALID] = value;
            break;
        }
      });
    }
    if (Object.keys(filterUpdates).length > 0) {
      updateFilterSortOptions(filterUpdates);
      setFilterSortState({ ...filterSortState, ...filterUpdates });
    }
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
    filterSortState
  ]);

  useEffect(() => {
    if (showMainMenu) {
      setOriginalFilterSortOptions(filterSortOptions);
      setOriginalSelectedCategories(selectedCategories);
      setShowApply(false);
    }
  }, [showMainMenu]);

  const isTrading = theme === THEMES.TRADING;

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
                updateMarketsList({
                  selectedCategories: originalSelectedCategories || [],
                  selectedCategory: originalSelectedCategories.length ? originalSelectedCategories[originalSelectedCategories.length - 1] : null,
                })
                updateFilterSortOptions(originalFilterSortOptions);
                setFilterSortState(originalFilterSortOptions);
                updateMultipleQueries(getFilters(true), location, history);
              }

              setMobileMenuState(MOBILE_MENU_STATES.CLOSED);
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
