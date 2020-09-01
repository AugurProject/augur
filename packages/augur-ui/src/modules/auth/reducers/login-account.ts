import { RESET_STATE, SWITCH_UNIVERSE } from 'modules/app/actions/reset-state';
import {
  UPDATE_LOGIN_ACCOUNT,
  CLEAR_LOGIN_ACCOUNT,
} from 'modules/account/actions/login-account';
import { LoginAccount, BaseAction } from 'modules/types';
import { ZERO } from 'modules/common/constants';
import { formatAttoDai } from 'utils/format-number';

const DEFAULT_STATE: LoginAccount = {
  currentOnboardingStep: 0,
  balances: {
    eth: '0',
    rep: '0',
    dai: '0',
    legacyRep: '0',
    attoRep: '0',
    legacyAttoRep: '0',
    signerBalances: {
      eth: null,
      rep: '0',
      dai: '0',
      legacyRep: '0',
    }
  },
  reporting: {
    profitLoss: ZERO,
    profitAmount: ZERO,
    reporting: null,
    disputing: null,
    participationTokens: null,
  },
  tradingApproved: false,
  totalOpenOrdersFrozenFunds: '0',
  tradingPositionsTotal: {
    unrealizedRevenue24hChangePercent: '0',
  },
  settings: {
    showInvalidMarketsBannerFeesOrLiquiditySpread: true,
    showInvalidMarketsBannerHideOrShow: true,
    templateFilter: null,
    maxFee: null,
    spread: null,
    showInvalid: null,
    marketTypeFilter: null,
    marketFilter: null,
    sortBy: null,
  },
  timeframeData: {
    positions: 0,
    numberOfTrades: 0,
    marketsCreated: 0,
    marketsTraded: 0,
    successfulDisputes: 0,
    redeemedPositions: 0,
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
