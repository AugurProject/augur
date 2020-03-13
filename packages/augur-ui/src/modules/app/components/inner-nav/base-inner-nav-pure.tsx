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
  const [maxFeeFilter, setMaxFeeFilter] = useState();
  const [maxSpreadFilter, setMaxSpreadFilter] = useState();
  const [showInvalidFilter, setShowInvalidFilter] = useState();
  const [templateFilter, setTemplateFilter] = useState();
  const [sortOptions, setSortOptions] = useState();

  const filterProps = {
    setMaxFeeFilter,
    setMaxSpreadFilter,
    setShowInvalidFilter,
    setTemplateFilter,
  };

  const sortProps = {
    setSortOptions,
  };

  const getFilters = () => {
    return [
      {
        filterType: TEMPLATE_FILTER,
        value: templateFilter,
      },
      {
        filterType: MAXFEE_PARAM_NAME,
        value: maxFeeFilter,
      },
      {
        filterType: SPREAD_PARAM_NAME,
        value: maxSpreadFilter,
      },
      {
        filterType: SHOW_INVALID_MARKETS_PARAM_NAME,
        value: showInvalidFilter,
      },
    ]
  };

  useEffect(() => {
    setShowApply(
      selectedCategories.toString() !== originalSelectedCategories.toString() ||
        JSON.stringify(filterSortOptions) !== JSON.stringify(originalFilterSortOptions)
    );
  }, [selectedCategories, filterSortOptions]);

  useEffect(() => {
    setShowApply(true);
  }, [templateFilter, maxFeeFilter, maxSpreadFilter, showInvalidFilter]);

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
        <MarketsListSortBy {...sortProps} /> {/* MOBILE ONLY */}
        <MarketsListFilters {...filterProps} />
      </ul>
      {showMainMenu && showApply && (
        <div>
          <PrimaryButton
            text="Apply"
            action={() => {
              updateMobileMenuState(MOBILE_MENU_STATES.CLOSED);
              updateMultipleQueries(getFilters(), location, history);
            }}
          />
        </div>
      )}
    </aside>
  );
};

export default BaseInnerNavPure;
