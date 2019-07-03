import makePath from "modules/routes/helpers/make-path";
import logError from "utils/log-error";
import { getPayoutNumerators } from "modules/reports/selectors/get-payout-numerators";
import { removeAccountDispute } from "modules/reports/actions/update-account-disputes";
import { REPORTING_DISPUTE_MARKETS } from "modules/routes/constants/views";
import { AppState } from "store";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

export const submitMarketContribute = ({
  estimateGas,
  marketId,
  selectedOutcome,
  invalid,
  amount,
  history,
  returnPath = REPORTING_DISPUTE_MARKETS,
  callback: NodeStyleCallback = logError
}: any) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { loginAccount, marketInfos } = getState();
  const outcome = parseFloat(selectedOutcome);

  if (!marketId || (isNaN(outcome) && !invalid)) return callback(null);

  const market = marketInfos[marketId];
  if (!market) return callback("Market not found");
  const payoutNumerators = getPayoutNumerators(
    market,
    selectedOutcome,
    invalid
  );
    // TODO: allow user to dispute as part of the reporting redsign
    /*
  .api.Market.contribute({
    meta: loginAccount.meta,
    tx: { to: marketId, estimateGas },
    _invalid: !!invalid,
    _payoutNumerators: payoutNumerators,
    _amount: amount,
    onSent: (res: any) => {
      if (!estimateGas) {
        history.push(makePath(returnPath));
      }
    },
    onSuccess: (gasCost: any) => {
      if (estimateGas) {
        callback(null, gasCost);
      } else {
        dispatch(removeAccountDispute({ marketId }));
        callback(null);
      }
    },
    onFailed: (err: any) => {
      callback(err);
    }
  });
  */
};
