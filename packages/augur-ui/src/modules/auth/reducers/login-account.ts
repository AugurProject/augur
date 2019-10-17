import { RESET_STATE, SWITCH_UNIVERSE } from 'modules/app/actions/reset-state';
import {
  UPDATE_LOGIN_ACCOUNT,
  CLEAR_LOGIN_ACCOUNT,
} from 'modules/account/actions/login-account';
import { LoginAccount, BaseAction } from 'modules/types';
import { ZERO } from 'modules/common/constants';
import { formatAttoDai } from 'utils/format-number';

const DEFAULT_STATE: LoginAccount = {
  balances: {
    eth: 0,
    rep: 0,
    dai: 0,
  },
  reporting: {
    profitLoss: ZERO,
    profitAmount: ZERO,
    reporting: null,
    disputing: null,
    participationTokens: null,
  },
  allowance: ZERO,
  allowanceFormatted: formatAttoDai(ZERO),
  tradingPositionsTotal: {
    unrealizedRevenue24hChangePercent: "0",
  },
  settings: {
    showInvalidMarketsBannerFeesOrLiquiditySpread: true,
    showInvalidMarketsBannerHideOrShow: true,
  }
};

export default function(
  loginAccount: LoginAccount = DEFAULT_STATE,
  { type, data }: BaseAction
): LoginAccount {
  switch (type) {
    case UPDATE_LOGIN_ACCOUNT:
      return {
        ...loginAccount,
        ...(data || {}),
      };
    case SWITCH_UNIVERSE:
      delete loginAccount.reporting;
      delete loginAccount.allowance;
      delete loginAccount.tradingPositionsTotal;
      return {
        ...loginAccount
      }
    case RESET_STATE:
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE;
    default:
      return loginAccount;
  }
}
