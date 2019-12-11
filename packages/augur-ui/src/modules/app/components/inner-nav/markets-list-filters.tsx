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
      filterOptionsFromQuery.selectedFee &&
      filterOptionsFromQuery.selectedFee !== props.maxLiquiditySpread
    ) {
      props.updateMaxSpread(filterOptionsFromQuery.selectedSpread);
    }
    if (
      filterOptionsFromQuery.templateFilter &&
      filterOptionsFromQuery.templateFilter !== props.allTemplateFilter
    ) {
      props.updateTemplateFilter(filterOptionsFromQuery.templateFilter);
    }
  }, [props.location.search]);

  if (!props.maxLiquiditySpread) return null;

  return (
    <div className={Styles.Filters}>
      <div
        className={classNames(Styles.FiltersGroup, {
          [Styles.Searching]: props.isSearching,
        })}
      >
        <div>
          {FilterIcon}
          Filters
        </div>

        <div className={Styles.Filter}>
          <span>Markets</span>
          {templateFilterTooltip()}
        </div>

        <RadioBarGroup
          radioButtons={templateFilterValues}
          defaultSelected={props.allTemplateFilter}
          onChange={(value: string) => {
            updateQuery(TEMPLATE_FILTER, value, props.location, props.history);
            props.updateTemplateFilter(value);
          }}
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
          onChange={(value: string) => {
            updateQuery(
              MAXFEE_PARAM_NAME,
              value,
              props.location,
              props.history
            );
            props.updateMaxFee(value);
          }}
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
          onChange={(value: string) => {
            updateQuery(
              SPREAD_PARAM_NAME,
              value,
              props.location,
              props.history
            );
            props.updateMaxSpread(value);
          }}
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
          onChange={(value: string) => {
            updateQuery(
              SHOW_INVALID_MARKETS_PARAM_NAME,
              value,
              props.location,
              props.history
            );
            props.updateShowInvalid(value);
          }}
        />
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
