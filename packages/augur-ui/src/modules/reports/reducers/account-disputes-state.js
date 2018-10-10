import {
  REMOVE_ACCOUNT_DISPUTE,
  UPDATE_ACCOUNT_DISPUTE,
  CLEAR_ACCOUNT_DISPUTES
} from "modules/reports/actions/update-account-disputes";
import { RESET_STATE } from "modules/app/actions/reset-state";

export default function(accountDisputes = {}, { type, data }) {
  switch (type) {
    case REMOVE_ACCOUNT_DISPUTE: {
      const { accountDisputesData } = data;
      return Object.keys(accountDisputes)
        .filter(d => d !== accountDisputesData.marketId)
        .reduce((p, d) => {
          p[d] = accountDisputes[d];
          return p;
        }, {});
    }
    case UPDATE_ACCOUNT_DISPUTE: {
      const { accountDisputesData } = data;
      accountDisputes[accountDisputesData.marketId] = {
        ...accountDisputesData
      };
      return accountDisputes;
    }
    case RESET_STATE:
    case CLEAR_ACCOUNT_DISPUTES:
      return {};
    default:
      return accountDisputes;
  }
}
