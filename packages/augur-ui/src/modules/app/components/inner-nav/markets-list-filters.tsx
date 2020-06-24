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
import { INVALID_OPTIONS, LoginAccountSettings } from 'modules/types';
import ChevronFlip from 'modules/common/chevron-flip';

interface MarketsListFiltersProps {
  maxFee: string;
  maxLiquiditySpread: string;
  includeInvalidMarkets: INVALID_OPTIONS;
  allTemplateFilter: string;
  marketTypeFilter: string;
  isSearching: boolean;
  updateMaxFee: Function;
  updateMaxSpread: Function;
  updateShowInvalid: Function;
  updateTemplateFilter: Function;
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
  updateMarketTypeFilter: Function
}

const MarketsListFilters = ({
  maxFee,
  maxLiquiditySpread,
  includeInvalidMarkets,
  allTemplateFilter,
  marketTypeFilter,
  isSearching,
  updateMaxFee,
  updateMaxSpread,
  updateMarketTypeFilter,
  updateShowInvalid,
  updateTemplateFilter,
  history,
  location,
  setMaxFeeFilter,
  setMaxSpreadFilter,
  setMarketTypeFilter,
  setShowInvalidFilter,
  setTemplateOrCustomFilter,
  settings,
  isMobile,
  updateSelectedCategories,
}: MarketsListFiltersProps) => {
  useEffect(() => {
    const filterOptionsFromQuery = parseQuery(location.search);

    const newMaxFee =
      filterOptionsFromQuery.maxFee ||
      settings.maxFee;
    const newSpread =
      filterOptionsFromQuery.spread ||
      settings.spread;
    const newTemplateFilter =
      filterOptionsFromQuery.templateFilter ||
      settings.templateFilter;
    const newShowInvalid =
      filterOptionsFromQuery.showInvalid ||
      settings.showInvalid;
    const categories =
      filterOptionsFromQuery.category;
    const newMarketTypeFilter = filterOptionsFromQuery.type ||
      settings.marketTypeFilter;

    if (newMaxFee && newMaxFee !== maxFee) {
      updateMaxFee(newMaxFee);
    }
    if (newSpread && newSpread !== maxLiquiditySpread) {
      updateMaxSpread(newSpread);
    }
    if (newTemplateFilter && newTemplateFilter !== allTemplateFilter) {
      updateTemplateFilter(newTemplateFilter);
    }
    if (newMarketTypeFilter && newMarketTypeFilter !== marketTypeFilter) {
      updateMarketTypeFilter(newMarketTypeFilter);
    }
    if (newShowInvalid && newShowInvalid !== includeInvalidMarkets) {
      updateShowInvalid(newShowInvalid);
    }
    categories
      ? updateSelectedCategories(categories.split(','))
      : updateSelectedCategories([]);
  }, [location.search, settings]);

  const [showFilters, setShowFilters] = useState(false);

  if (!maxLiquiditySpread) return null;

  const updateFilter = (value: string, whichFilterToUpdate: string) => {
    updateQuery(
      whichFilterToUpdate,
      value,
      location,
      history
    );

    switch (whichFilterToUpdate) {
      case TEMPLATE_FILTER:
        updateTemplateFilter(value);
        break;
      case MAXFEE_PARAM_NAME:
        updateMaxFee(value);
        break;
      case SPREAD_PARAM_NAME:
        updateMaxSpread(value);
        break;
      case MARKET_TYPE_PARAM_NAME:
        updateMarketTypeFilter(value);
        break;
      case SHOW_INVALID_MARKETS_PARAM_NAME:
        updateShowInvalid(value);
        break;
    }
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
              defaultSelected={allTemplateFilter}
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
              defaultSelected={maxFee}
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
              defaultSelected={maxLiquiditySpread}
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
              defaultSelected={marketTypeFilter}
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
              defaultSelected={String(includeInvalidMarkets)}
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
