import { LOAD_USER_SHARE_BALANCES } from "modules/positions/actions/load-user-share-balances";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { AccountShareBalances, BaseAction } from "modules/types";

const DEFAULT_STATE: AccountShareBalances = {};

export default function(
  accountShareBalances: AccountShareBalances = DEFAULT_STATE,
  { type, data }: BaseAction
) {
  switch (type) {
    case LOAD_USER_SHARE_BALANCES: {
      return {
        ...accountShareBalances,
        ...data,
      };
    }
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return accountShareBalances;
  }
}
