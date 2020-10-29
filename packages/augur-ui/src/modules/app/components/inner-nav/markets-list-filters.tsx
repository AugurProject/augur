import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useLocation, useHistory } from 'react-router';
import {
  feeFilters,
  invalidFilters,
  MAXFEE_PARAM_NAME,
  SHOW_INVALID_MARKETS_PARAM_NAME,
  SPREAD_PARAM_NAME,
  spreadFilters,
  TEMPLATE_FILTER,
  MARKET_TYPE_FILTER,
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
import ChevronFlip from 'modules/common/chevron-flip';
import { useAppStatusStore } from 'modules/app/store/app-status';
import {
  MARKET_SHOW_INVALID,
  MARKET_MAX_FEES,
  MARKET_MAX_SPREAD,
  MARKET_LIMIT,
  MARKET_SORT,
  MARKET_OFFSET,
  MARKET_FILTER,
} from 'modules/app/store/constants';

interface MarketsListFiltersProps {
  setFilterSortState: Function;
}

const MarketsListFilters = ({
  setFilterSortState,
}: MarketsListFiltersProps) => {
  const history = useHistory();
  const location = useLocation();
  const {
    isMobile,
    marketsList: { isSearching },
    loginAccount: { settings },
    filterSortOptions,
    actions: { updateFilterSortOptions, updateMarketsList },
  } = useAppStatusStore();
  const {
    maxFee,
    maxLiquiditySpread,
    includeInvalidMarkets,
    templateFilter: allTemplateFilter,
    marketTypeFilter,
    limit,
    sortBy,
    offset,
    marketFilter,
  } = filterSortOptions;
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const filterOptionsFromQuery = parseQuery(location.search);

    const newMaxFee = filterOptionsFromQuery.maxFee;
    const newSpread = filterOptionsFromQuery.spread;
    const newTemplateFilter = filterOptionsFromQuery.templateFilter;
    const newMarketFilter = filterOptionsFromQuery.marketFilter;
    const newShowInvalid = filterOptionsFromQuery.showInvalid;
    const categories = filterOptionsFromQuery.category;
    const newMarketTypeFilter = filterOptionsFromQuery.type;
    const newMarketSort = filterOptionsFromQuery.sort;
    const newMarketLimit = filterOptionsFromQuery.limit;
    const newMarketOffset = filterOptionsFromQuery.offset;

    let filterUpdates = {};
    if (newMaxFee && newMaxFee !== maxFee) {
      filterUpdates[MARKET_MAX_FEES] = newMaxFee;
    }
    if (newSpread && newSpread !== maxLiquiditySpread) {
      filterUpdates[MARKET_MAX_SPREAD] = newSpread;
    }
    if (newTemplateFilter && newTemplateFilter !== allTemplateFilter) {
      filterUpdates[TEMPLATE_FILTER] = newTemplateFilter;
    }
    if (newMarketTypeFilter && newMarketTypeFilter !== marketTypeFilter) {
      filterUpdates[MARKET_TYPE_FILTER] = newMarketTypeFilter;
    }
    if (newShowInvalid && newShowInvalid !== includeInvalidMarkets) {
      filterUpdates[MARKET_SHOW_INVALID] = newShowInvalid;
    }
    if (newMarketLimit && newMarketLimit !== limit) {
      filterUpdates[MARKET_LIMIT] = newMarketLimit;
    }
    if (newMarketSort && newMarketSort !== sortBy) {
      filterUpdates[MARKET_SORT] = newMarketSort;
    }
    if (newMarketOffset && newMarketOffset !== offset) {
      filterUpdates[MARKET_OFFSET] = newMarketOffset;
    }
    if (newMarketFilter && newMarketFilter !== marketFilter) {
      filterUpdates[MARKET_FILTER] = newMarketFilter;
    }
    if (Object.keys(filterUpdates).length > 0) {
      updateFilterSortOptions(filterUpdates);
      setFilterSortState(filterUpdates);
    }
    const categoriesUpdate = categories ? categories.split(',') : [];
    updateMarketsList({
      selectedCategories: categoriesUpdate || [],
      selectedCategory: categoriesUpdate.length
        ? categoriesUpdate[categoriesUpdate.length - 1]
        : null,
    });
  }, [
    location.search,
    settings.maxFee,
    settings.maxLiquiditySpread,
    settings.templateFilter,
    settings.includeInvalidMarkets,
  ]);

  if (!filterSortOptions.maxLiquiditySpread) return null;

  const updateFilter = (value: string, whichFilterToUpdate: string) => {
    updateQuery(whichFilterToUpdate, value, location, history);
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
            noHardStroke
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
              light
              radioButtons={templateFilterValues}
              defaultSelected={allTemplateFilter}
              onChange={(value: string) =>
                isMobile
                  ? setFilterSortState({ [TEMPLATE_FILTER]: value })
                  : updateFilter(value, TEMPLATE_FILTER)
              }
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
              light
              defaultSelected={maxFee}
              onChange={(value: string) =>
                isMobile
                  ? setFilterSortState({ [MARKET_MAX_FEES]: value })
                  : updateFilter(value, MAXFEE_PARAM_NAME)
              }
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
              light
              defaultSelected={maxLiquiditySpread}
              onChange={(value: string) =>
                isMobile
                  ? setFilterSortState({ [MARKET_MAX_SPREAD]: value })
                  : updateFilter(value, SPREAD_PARAM_NAME)
              }
            />

            <div className={Styles.Filter}>
              <span>Market Type</span>
              {generateTooltip('Filters markets based on market type', 'type')}
            </div>

            <RadioBarGroup
              radioButtons={marketTypeFilterValues}
              light
              defaultSelected={filterSortOptions.marketTypeFilter}
              onChange={(value: string) =>
                isMobile
                  ? setMarketTypeFilter(value)
                  : updateFilter(value, MARKET_TYPE_PARAM_NAME)
              }
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
              light
              defaultSelected={String(includeInvalidMarkets)}
              onChange={(value: string) =>
                isMobile
                  ? setFilterSortState({ [MARKET_SHOW_INVALID]: value })
                  : updateFilter(value, SHOW_INVALID_MARKETS_PARAM_NAME)
              }
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
