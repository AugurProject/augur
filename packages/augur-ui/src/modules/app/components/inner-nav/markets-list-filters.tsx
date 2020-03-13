import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import {
  feeFilters,
  spreadFilters,
  invalidFilters,
  templateFilterValues,
  MAXFEE_PARAM_NAME,
  SPREAD_PARAM_NAME,
  SHOW_INVALID_MARKETS_PARAM_NAME,
  TEMPLATE_FILTER,
} from 'modules/common/constants';
import Styles from 'modules/app/components/inner-nav/markets-list-filters.styles.less';
import { helpIcon, FilterIcon } from 'modules/common/icons';
import { RadioBarGroup } from 'modules/common/form';
import ReactTooltip from 'react-tooltip';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import parseQuery from 'modules/routes/helpers/parse-query';
import updateQuery from 'modules/routes/helpers/update-query';
import { INVALID_OPTIONS } from 'modules/types';
import ChevronFlip from 'modules/common/chevron-flip';

interface MarketsListFiltersProps {
  maxFee: string;
  maxLiquiditySpread: string;
  includeInvalidMarkets: INVALID_OPTIONS;
  allTemplateFilter: string;
  isSearching: boolean;
  updateMaxFee: Function;
  updateMaxSpread: Function;
  updateShowInvalid: Function;
  updateTemplateFilter: Function;
  history: History;
  location: Location;
}

const MarketsListFilters = (props: MarketsListFiltersProps) => {
  useEffect(() => {
    const filterOptionsFromQuery = parseQuery(props.location.search);
    if (
      filterOptionsFromQuery.maxFee &&
      filterOptionsFromQuery.maxFee !== props.maxFee
    ) {
      props.updateMaxFee(filterOptionsFromQuery.maxFee);
    }
    if (
      filterOptionsFromQuery.spread &&
      filterOptionsFromQuery.spread !== props.maxLiquiditySpread
    ) {
      props.updateMaxSpread(filterOptionsFromQuery.spread);
    }
    if (
      filterOptionsFromQuery.templateFilter &&
      filterOptionsFromQuery.templateFilter !== props.allTemplateFilter
    ) {
      props.updateTemplateFilter(filterOptionsFromQuery.templateFilter);
    }
    if (
      filterOptionsFromQuery.showInvalid &&
      filterOptionsFromQuery.showInvalid !== props.includeInvalidMarkets
    ) {
      props.updateShowInvalid(filterOptionsFromQuery.showInvalid);
    }
  }, [props.location.search]);

  const [showFilters, setShowFilters] = useState(false);

  if (!props.maxLiquiditySpread) return null;

  function updateFilter (value: string, whichFilterToUpdate: string) {
    updateQuery(
      whichFilterToUpdate,
      value,
      props.location,
      props.history
    );

    switch (whichFilterToUpdate) {
      case TEMPLATE_FILTER:
        props.updateTemplateFilter(value);
        break;
      case MAXFEE_PARAM_NAME:
        props.updateMaxFee(value);
        break;
      case SPREAD_PARAM_NAME:
        props.updateMaxSpread(value);
        break;
      case SHOW_INVALID_MARKETS_PARAM_NAME:
        props.updateShowInvalid(value);
        break;
    }
  };

  return (
    <div className={Styles.Filters}>
      <div
        className={classNames(Styles.FiltersGroup, {
          [Styles.Searching]: props.isSearching,
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
              defaultSelected={props.allTemplateFilter}
              onChange={(value: string) => updateFilter(value, TEMPLATE_FILTER)}
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
              defaultSelected={props.maxFee}
              onChange={(value: string) => updateFilter(value, MAXFEE_PARAM_NAME)}
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
              defaultSelected={props.maxLiquiditySpread}
              onChange={(value: string) => updateFilter(value, SPREAD_PARAM_NAME)}
            />

            <div className={Styles.Filter}>
              <span>Invalid Markets</span>
              {generateTooltip(
                'Filters markets where the current best bid/offer would profit as a result of a market resolving as invalid',
                'invalid'
              )}
            </div>

            <RadioBarGroup
              radioButtons={invalidFilters}
              defaultSelected={String(props.includeInvalidMarkets)}
              onChange={(value: string) => updateFilter(value, SHOW_INVALID_MARKETS_PARAM_NAME)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MarketsListFilters;

const generateTooltip = (tipText: string, key: string) => {
  return (
    <span className={Styles.Filter_TooltipContainer}>
      <label
        className={classNames(
          TooltipStyles.TooltipHint,
          Styles.Filter_TooltipHint
        )}
        data-tip
        data-for={key}
      >
        {helpIcon}
      </label>
      <ReactTooltip
        id={key}
        className={TooltipStyles.Tooltip}
        effect="solid"
        place="top"
        type="light"
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
      >
        {helpIcon}
      </label>
      <ReactTooltip
        id={'template'}
        className={TooltipStyles.Tooltip}
        effect="solid"
        place="top"
        type="light"
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
