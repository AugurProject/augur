import React from 'react';

import { LinearPropertyLabel } from 'modules/common/labels';
import {
  AVAILABLE_TRADING_BALANCE,
  TOTAL_FROZEN_FUNDS,
  TOTAL_ACCOUNT_VALUE_IN_DAI, THEMES, AVAILABLE_BETTING_BALANCE, TOTAL_EXPOSURE,
} from 'modules/common/constants';
import { MODAL_FROZEN_FUNDS } from 'modules/common/constants';
import Styles from 'modules/account/components/funds.styles.less';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { formatPercent, formatDai } from 'utils/format-number';
import {
  getAccountFunds,
} from "modules/auth/helpers/login-account";

const Funds = () => {
  const {
    env: { paraDeploys, paraDeploy },
    loginAccount,
    theme,
    actions: { setModal },
  } = useAppStatusStore();
  const {
    totalFrozenFunds,
    totalAvailableTradingBalance,
    totalAccountValue,
  } = getAccountFunds(loginAccount, paraDeploys[paraDeploy].name);
  return (
    <section className={Styles.Funds}>
      <h4>{TOTAL_ACCOUNT_VALUE_IN_DAI}</h4>
      <div>{formatDai(totalAccountValue, { removeComma: true }).full}</div>
      <LinearPropertyLabel
        value={formatDai(totalAvailableTradingBalance, { removeComma: true }).full}
        label={theme === THEMES.TRADING ? AVAILABLE_TRADING_BALANCE : AVAILABLE_BETTING_BALANCE}
      />
      <LinearPropertyLabel
        value={formatDai(totalFrozenFunds, { removeComma: true }).full}
        underline
        label={theme === THEMES.TRADING ? TOTAL_FROZEN_FUNDS : TOTAL_EXPOSURE}
        onValueClick={() => setModal({ type: MODAL_FROZEN_FUNDS })}
      />
    </section>
  );
};

export default Funds;
