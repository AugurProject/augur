import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import {
  feeFilters,
  invalidFilters,
  MAXFEE_PARAM_NAME,
  SHOW_INVALID_MARKETS_PARAM_NAME,
  SPREAD_PARAM_NAME,
  spreadFilters,
  TEMPLATE_FILTER,
  templateFilterValues,
  marketTypeFilterValues,
  INVALID_OUTCOME_LABEL,
  MARKET_TYPE_PARAM_NAME,
} from 'modules/common/constants';
import Styles from 'modules/app/components/inner-nav/markets-list-filters.styles.less';
import { FilterIcon, helpIcon } from 'modules/common/icons';
import { RadioBarGroup } from 'modules/common/form';
import ReactTooltip from 'react-tooltip';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import parseQuery from 'modules/routes/helpers/parse-query';
import updateQuery from 'modules/routes/helpers/update-query';
import { INVALID_OPTIONS, LoginAccountSettings, FilterSortOptions } from 'modules/types';
import ChevronFlip from 'modules/common/chevron-flip';
import { MARKET_MAX_FEES, MARKET_MAX_SPREAD, MARKET_SHOW_INVALID, MARKET_TYPE_FILTER, MARKET_SORT, MARKET_LIMIT, MARKET_OFFSET, MARKET_FILTER } from 'modules/filter-sort/actions/update-filter-sort-options';

interface MarketsListFiltersProps {
  maxFee: string;
  maxLiquiditySpread: string;
  includeInvalidMarkets: INVALID_OPTIONS;
  allTemplateFilter: string;
  marketTypeFilter: string;
  isSearching: boolean;
  history: History;
  location: Location;
  setMaxFeeFilter: Function;
  setMaxSpreadFilter: Function;
  setShowInvalidFilter: Function;
  setTemplateOrCustomFilter: Function;
  settings: LoginAccountSettings;
  isMobile: boolean;
  updateSelectedCategories: Function;
  setMarketTypeFilter: Function;
  updateFilterSortOptionsSettings: Function;
  sortBy: string,
  marketLimit: number,
  marketOffset: number,
  marketFilter: string,
  filterSortOptions: FilterSortOptions,
}

const MarketsListFilters = ({
  isSearching,
  history,
  location,
  setMaxFeeFilter,
  setMaxSpreadFilter,
  setMarketTypeFilter,
  setShowInvalidFilter,
  setTemplateOrCustomFilter,
  isMobile,
  updateSelectedCategories,
  updateFilterSortOptionsSettings,
  filterSortOptions
}: MarketsListFiltersProps) => {
  useEffect(() => {
    const filterOptionsFromQuery = parseQuery(location.search);

    const newMaxFee =
      filterOptionsFromQuery.maxFee;
    const newSpread =
      filterOptionsFromQuery.spread;
    const newTemplateFilter =
      filterOptionsFromQuery.templateFilter;
    const newMarketFilter =
      filterOptionsFromQuery.marketFilter;
    const newShowInvalid =
      filterOptionsFromQuery.showInvalid;
    const categories =
      filterOptionsFromQuery.category;
    const newMarketTypeFilter = filterOptionsFromQuery.type;
    const newMarketSort = filterOptionsFromQuery.sort;
    const newMarketLimit = filterOptionsFromQuery.limit;
    const newMarketOffset = filterOptionsFromQuery.offset

    let filterOptions = {}
    if (newMaxFee && newMaxFee !== filterSortOptions.maxFee) {
      filterOptions={...filterOptions, [MARKET_MAX_FEES]: newMaxFee};
    }
    if (newSpread && newSpread !== filterSortOptions.maxLiquiditySpread) {
      filterOptions={...filterOptions, [MARKET_MAX_SPREAD]: newSpread};
    }
    if (newTemplateFilter && newTemplateFilter !== filterSortOptions.templateFilter) {
      filterOptions={...filterOptions, [TEMPLATE_FILTER]: newTemplateFilter};
    }
    if (newMarketTypeFilter && newMarketTypeFilter !== filterSortOptions.marketTypeFilter) {
      filterOptions={...filterOptions, [MARKET_TYPE_FILTER]: newMarketTypeFilter};
    }
    if (newShowInvalid && newShowInvalid !== filterSortOptions.includeInvalidMarkets) {
      filterOptions={...filterOptions, [MARKET_SHOW_INVALID]: newShowInvalid};
    }
    if (newMarketLimit && newMarketLimit !== filterSortOptions.limit) {
      filterOptions={...filterOptions, [MARKET_LIMIT]: newMarketLimit};
    }
    if (newMarketSort && newMarketSort !== filterSortOptions.sortBy) {
      filterOptions={...filterOptions, [MARKET_SORT]: newMarketSort};
    }
    if (newMarketOffset && newMarketOffset !== filterSortOptions.offset) {
      filterOptions={...filterOptions, [MARKET_OFFSET]: newMarketOffset};
    }
    if (newMarketFilter && newMarketFilter !== filterSortOptions.marketFilter) {
      filterOptions={...filterOptions, [MARKET_FILTER]: newMarketFilter};
    }
    if(Object.keys(filterOptions).length) updateFilterSortOptionsSettings(filterOptions);

    categories
      ? updateSelectedCategories(categories.split(','))
      : updateSelectedCategories([]);
  }, [location.search]);

  const [showFilters, setShowFilters] = useState(false);

  if (!filterSortOptions.maxLiquiditySpread) return null;

  const updateFilter = (value: string, whichFilterToUpdate: string) => {
    updateQuery(
      whichFilterToUpdate,
      value,
      location,
      history
    );
    updateFilterSortOptionsSettings({[whichFilterToUpdate]: value});
  };

  return (
    <div className={Styles.Filters}>
      <div
        className={classNames(Styles.FiltersGroup, {
          [Styles.Searching]: isSearching,
        })}
      >
        <div onClick={() => setShowFilters(!showFilters)}>
          {FilterIcon}
          Filters
          <ChevronFlip
            pointDown={showFilters}
            stroke="#D7DDE0"
            filledInIcon
            quick
          />
        </div>
        {showFilters && (
          <>
            <div className={Styles.Filter}>
              <span>Markets</span>
              {templateFilterTooltip()}
            </div>

            <RadioBarGroup
              radioButtons={templateFilterValues}
              defaultSelected={filterSortOptions.templateFilter}
              onChange={(value: string) => isMobile ? setTemplateOrCustomFilter(value) : updateFilter(value, TEMPLATE_FILTER)}
            />

            <div className={Styles.Filter}>
              <span>Fees</span>
              {generateTooltip(
                'Filters markets based on estimated total fees paid to market creators and reporters',
                'fees'
              )}
            </div>

            <RadioBarGroup
              radioButtons={feeFilters}
              defaultSelected={filterSortOptions.maxFee}
              onChange={(value: string) => isMobile ? setMaxFeeFilter(value) : updateFilter(value, MAXFEE_PARAM_NAME)}
            />

            <div className={Styles.Filter}>
              <span>Liquidity Spread</span>
              {generateTooltip(
                'Filters markets based on how wide a bid/offer spread is and the depth of volume',
                'liquidity'
              )}
            </div>

            <RadioBarGroup
              radioButtons={spreadFilters}
              defaultSelected={filterSortOptions.maxLiquiditySpread}
              onChange={(value: string) => isMobile ? setMaxSpreadFilter(value) : updateFilter(value, SPREAD_PARAM_NAME)}
            />

            <div className={Styles.Filter}>
              <span>Market Type</span>
              {generateTooltip(
                'Filters markets based on market type',
                'type'
              )}
            </div>

            <RadioBarGroup
              radioButtons={marketTypeFilterValues}
              defaultSelected={filterSortOptions.marketTypeFilter}
              onChange={(value: string) => isMobile ? setMarketTypeFilter(value) : updateFilter(value, MARKET_TYPE_PARAM_NAME)}
            />


            <div className={Styles.Filter}>
              <span>Invalid Markets</span>
              {generateTooltip(
                'Filters markets where the current best bid/offer would profit as a result of a market resolving as invalid',
                INVALID_OUTCOME_LABEL
              )}
            </div>

            <RadioBarGroup
              radioButtons={invalidFilters}
              defaultSelected={String(filterSortOptions.includeInvalidMarkets)}
              onChange={(value: string) => isMobile ? setShowInvalidFilter(value) : updateFilter(value, SHOW_INVALID_MARKETS_PARAM_NAME)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MarketsListFilters;

export const generateTooltip = (tipText: string, key: string) => {
  return (
    <span className={Styles.Filter_TooltipContainer}>
      <label
        className={classNames(
          TooltipStyles.TooltipHint,
          Styles.Filter_TooltipHint
        )}
        data-tip
        data-for={key}
        data-iscapture={true}
      >
        {helpIcon}
      </label>
      <ReactTooltip
        id={key}
        className={TooltipStyles.Tooltip}
        effect="solid"
        place="top"
        type="light"
        event="mouseover mouseenter"
        eventOff="mouseleave mouseout scroll mousewheel blur"
      >
        <p>{tipText}</p>
      </ReactTooltip>
    </span>
  );
};

const templateFilterTooltip = () => {
  return (
    <span className={Styles.Filter_TooltipContainer}>
      <label
        className={classNames(
          TooltipStyles.TooltipHint,
          Styles.Filter_TooltipHint
        )}
        data-tip
        data-for={'template'}
        data-iscapture={true}
      >
        {helpIcon}
      </label>
      <ReactTooltip
        id={'template'}
        className={TooltipStyles.Tooltip}
        effect="solid"
        place="top"
        type="light"
        event="mouseover mouseenter"
        eventOff="mouseleave mouseout scroll mousewheel blur"
      >
        <>
          <p>
            <b>Augur templates</b> provide market creators with a set structure
            for popular markets that reduce the potential for error during
            market creation.
          </p>
          <p>
            <b>Custom markets</b> are fully open and don't follow a set
            pattern/structure, as a result they are more likely to contain
            potential issues and should be examined carefully before betting.
          </p>
        </>
      </ReactTooltip>
    </span>
  );
};
