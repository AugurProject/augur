import React from 'react';
import {
  MAXFEE_PARAM_NAME,
  SPREAD_PARAM_NAME,
  MAX_FEE_100_PERCENT,
  MAX_SPREAD_ALL_SPREADS,
  MAX_FEE_02_PERCENT,
  MAX_FEE_05_PERCENT,
  MAX_FEE_10_PERCENT,
  MAX_SPREAD_10_PERCENT,
  MAX_SPREAD_15_PERCENT,
  MAX_SPREAD_20_PERCENT,
} from 'modules/common/constants';
import Styles from 'modules/common/filter-tags.styles.less';
import { XIcon } from 'modules/common/icons';

interface FilterTagsProps {
  maxFee: string;
  maxLiquiditySpread: string;
  removeFeeFilter: Function;
  removeLiquiditySpreadFilter: Function;
  updateQuery: Function;
}

export const FilterTags = (props: FilterTagsProps) => {
  const { maxFee, maxLiquiditySpread } = props;

  let displayFee = null;
  let displayLiquiditySpread = null;

  if (maxFee === MAX_FEE_02_PERCENT) {
    displayFee = '0-2%';
  } else if (maxFee === MAX_FEE_05_PERCENT) {
    displayFee = '0-5%';
  } else if (maxFee === MAX_FEE_10_PERCENT) {
    displayFee = '0-10%';
  }

  if (maxLiquiditySpread === MAX_SPREAD_10_PERCENT) {
    displayLiquiditySpread = 'Less than 10%';
  } else if (maxLiquiditySpread === MAX_SPREAD_15_PERCENT) {
    displayLiquiditySpread = 'Less than 15%';
  } else if (maxLiquiditySpread === MAX_SPREAD_20_PERCENT) {
    displayLiquiditySpread = 'Less than 20%';
  }

  return (
    <div className={Styles.filterTags}>
      {displayFee && (
        <div>
          <span>Fees: {displayFee}</span>
          <span
            onClick={() => {
              props.updateQuery(MAXFEE_PARAM_NAME, MAX_FEE_100_PERCENT);
              props.removeFeeFilter();
            }}
          >
            {XIcon}
          </span>
        </div>
      )}

      {displayLiquiditySpread && (
        <div>
          <span>Liquidity spread: {displayLiquiditySpread}</span>
          <span
            onClick={() => {
              props.updateQuery(SPREAD_PARAM_NAME, MAX_SPREAD_ALL_SPREADS);
              props.removeLiquiditySpreadFilter();
            }}
          >
            {XIcon}
          </span>
        </div>
      )}
    </div>
  );
};
