import React from 'react';

import { LinearPropertyLabel } from 'modules/common/labels';
import {
  AVAILABLE_TRADING_BALANCE,
  TOTAL_FROZEN_FUNDS,
  TOTAL_ACCOUNT_VALUE_IN_DAI,
} from 'modules/common/constants';
import { FormattedNumber } from 'modules/types';

import Styles from 'modules/account/components/funds.styles.less';

export interface FundsProps {
  totalFrozenFunds: FormattedNumber;
  totalAvailableTradingBalance: FormattedNumber;
  totalAccountValue: FormattedNumber;
  frozenFundsModal: Function;
}

const Funds = ({
  totalFrozenFunds,
  totalAvailableTradingBalance,
  totalAccountValue,
  frozenFundsModal,
}: FundsProps) => {
  return (
    <section className={Styles.Funds}>
      <h4>{TOTAL_ACCOUNT_VALUE_IN_DAI}</h4>
      <div>{totalAccountValue.full}</div>
      <LinearPropertyLabel
        value={totalAvailableTradingBalance.full}
        label={AVAILABLE_TRADING_BALANCE}
      />
      <LinearPropertyLabel
        value={totalFrozenFunds.full}
        underline
        label={TOTAL_FROZEN_FUNDS}
        onValueClick={frozenFundsModal}
      />
    </section>
  );
};

export default Funds;
