import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import {
  MOBILE_MENU_STATES,
  SHOW_INVALID_MARKETS_PARAM_NAME,
  MAXFEE_PARAM_NAME,
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
import updateQuery from 'modules/routes/helpers/update-query';
import updateMultipleQueries from 'modules/routes/helpers/update-multiple-queries';

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
  const [showInvalidFilter, setShowInvalidFilter] = useState();
  const [templateOrCustomFilter, setTemplateOrCustomFilter] = useState();
  const [sortOptions, setSortOptions] = useState();

  const filterProps = {
    setMaxFeeFilter,
    setMaxSpreadFilter,
    setShowInvalidFilter,
    setTemplateOrCustomFilter,
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

      changedFilters.forEach(({ value, filterType }) => {
        switch (filterType) {
          case TEMPLATE_FILTER:
            updateTemplateFilter(value);
            break;
          case MAXFEE_PARAM_NAME:
            updateMaxFee(value);
            break;
          case SPREAD_PARAM_NAME:
            updateMaxSpread(value);
            break;
          case SHOW_INVALID_MARKETS_PARAM_NAME:
            updateShowInvalid(value);
            break;
        }
      });
    }

    sortOptions && updateMarketsSortBy(sortOptions);
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
                updateMarketsSortBy(originalFilterSortOptions.marketSort);
                updateMaxFee(originalFilterSortOptions.maxFee);
                updateMaxSpread(originalFilterSortOptions.maxLiquiditySpread);
                updateShowInvalid(
                  originalFilterSortOptions.includeInvalidMarkets
                );
                updateTemplateFilter(originalFilterSortOptions.templateFilter);

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
          Styles['InnerNav__menu--main']
        )}
      >
        <CategoryFilters />
        <MarketsListSortBy {...sortProps} /> {/* MOBILE ONLY */}
        <MarketsListFilters {...filterProps} />
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
