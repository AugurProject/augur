import { LOAD_USER_SHARE_BALANCES } from "modules/positions/actions/load-user-share-balances";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {};

export default function(accountShareBalances = DEFAULT_STATE, { type, data }) {
  switch (type) {
    case LOAD_USER_SHARE_BALANCES: {
      return {
        ...accountShareBalances,
        ...data
      };
    }
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return accountShareBalances;
  }
}
