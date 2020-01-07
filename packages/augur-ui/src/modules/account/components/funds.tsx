import React from 'react';

import { MovementLabel, LinearPropertyLabel } from 'modules/common/labels';
import {
  AVAILABLE_TRADING_BALANCE,
  TOTAL_FROZEN_FUNDS,
  TOTAL_ACCOUNT_VALUE_IN_DAI,
} from 'modules/common/constants';
import { SizeTypes } from 'modules/types';

import Styles from 'modules/account/components/funds.styles.less';

export interface FundsProps {
  totalFrozenFunds: FormattedNumber;
  totalAvailableTradingBalance: FormattedNumber;
  totalAccountValue: FormattedNumber;
  realizedPLPercent: string;
}

const Funds = ({
  totalFrozenFunds,
  totalAvailableTradingBalance,
  totalAccountValue,
  realizedPLPercent,
}: FundsProps) => {
  return (
    <section className={Styles.Funds}>
      <h4>{TOTAL_ACCOUNT_VALUE_IN_DAI}</h4>
      <MovementLabel
        showColors
        size={SizeTypes.LARGE}
        showPlusMinus
        showPercent
        showIcon
        showBrackets
        value={Number(realizedPLPercent)}
      />
      <div>{totalAccountValue.full}</div>
      <LinearPropertyLabel
        value={totalAvailableTradingBalance.full}
        label={AVAILABLE_TRADING_BALANCE}
      />
      <LinearPropertyLabel
        value={totalFrozenFunds.full}
        label={TOTAL_FROZEN_FUNDS}
      />
    </section>
  );
};

export default Funds;
