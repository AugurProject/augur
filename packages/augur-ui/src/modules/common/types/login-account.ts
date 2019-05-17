export const LOGIN_ACTIONS = {
  UPDATE_LOGIN_ACCOUNT: "UPDATE_LOGIN_ACCOUNT",
  CLEAR_LOGIN_ACCOUNT: "CLEAR_LOGIN_ACCOUNT",
};

export interface UnrealizedRevenue {
  unrealizedRevenue24hChangePercent: string;
}

export interface LoginAccount {
  address: string;
  displayAddress: string;
  meta: { accontType: string; address: string; signer: object | null };
  totalFrozenFunds: string;
  tradingPositionsTotal: UnrealizedRevenue;
  eth: string;
  rep: string;
  dai: string;
}

export interface LoginAccountAction {
  type: string;
  data: LoginAccount;
}

export function updateLoginAccountAction(
  data: LoginAccount,
): LoginAccountAction {
  return {
    type: LOGIN_ACTIONS.UPDATE_LOGIN_ACCOUNT,
    data,
  };
}

export function clearLoginAccountAction(
  data: LoginAccount,
): LoginAccountAction {
  return {
    type: LOGIN_ACTIONS.CLEAR_LOGIN_ACCOUNT,
    data,
  };
}
