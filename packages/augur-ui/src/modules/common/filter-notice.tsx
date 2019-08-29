import React from 'react';
import Styles from 'modules/common/filter-notice.styles.less';
import { ExclamationCircle } from 'modules/common/icons';

interface FilterNoticeProps {
  color?: string;
  content: JSX.Element;
  show: boolean;
}

export const FilterNotice = (props: FilterNoticeProps) => {
  // const { maxFee, maxLiquiditySpread } = props;

  // let displayFee = null;
  // let displayLiquiditySpread = null;

  // if (maxFee === MAX_FEE_02_PERCENT) {
  //   displayFee = '0-2%';
  // } else if (maxFee === MAX_FEE_05_PERCENT) {
  //   displayFee = '0-5%';
  // } else if (maxFee === MAX_FEE_10_PERCENT) {
  //   displayFee = '0-10%';
  // }

  // if (maxLiquiditySpread === MAX_SPREAD_10_PERCENT) {
  //   displayLiquiditySpread = 'Less than 10%';
  // } else if (maxLiquiditySpread === MAX_SPREAD_15_PERCENT) {
  //   displayLiquiditySpread = 'Less than 15%';
  // } else if (maxLiquiditySpread === MAX_SPREAD_20_PERCENT) {
  //   displayLiquiditySpread = 'Less than 20%';
  // }

  // let feesLiquidityMessage = '';


  // if (!displayFee && !displayLiquiditySpread) {
  //   feesLiquidityMessage = '“Fee” and “Liquidity Spread” filters are set to “All”. This puts you at risk of trading on invalid markets.';
  // }
  // else if (!displayFee || !displayLiquiditySpread) {
  //   feesLiquidityMessage = `The ${!displayFee ? '“Fee”' : '“Liquidity Spread”'} filter is set to “All”. This puts you at risk of trading on invalid markets.`;
  // }

  return (
    <div className={Styles.filterNotice}>
      { props.show
        ? <div>
            <span className={props.color === 'red' ? Styles.red : Styles.grey}>{ExclamationCircle}</span>
            {props.content}
          </div>
        : null
      }
    </div>
  );
};
