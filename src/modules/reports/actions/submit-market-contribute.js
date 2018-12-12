import makePath from "modules/routes/helpers/make-path";
import logError from "utils/log-error";
import { getPayoutNumerators } from "modules/reports/selectors/get-payout-numerators";
import { removeAccountDispute } from "modules/reports/actions/update-account-disputes";
import { augur } from "services/augurjs";
import { REPORTING_DISPUTE_MARKETS } from "modules/routes/constants/views";

export const submitMarketContribute = ({
  estimateGas,
  marketId,
  selectedOutcome,
  invalid,
  amount,
  history,
  returnPath = REPORTING_DISPUTE_MARKETS,
  callback = logError
}) => (dispatch, getState) => {
  const { loginAccount, marketsData } = getState();
  const outcome = parseFloat(selectedOutcome);

  if (!marketId || (isNaN(outcome) && !invalid)) return callback(null);

  const market = marketsData[marketId];
  if (!market) return callback("Market not found");
  const payoutNumerators = getPayoutNumerators(
    market,
    selectedOutcome,
    invalid
  );

  augur.api.Market.contribute({
    meta: loginAccount.meta,
    tx: { to: marketId, estimateGas },
    _invalid: !!invalid,
    _payoutNumerators: payoutNumerators,
    _amount: amount,
    onSent: res => {
      if (!estimateGas) {
        history.push(makePath(returnPath));
      }
    },
    onSuccess: gasCost => {
      if (estimateGas) {
        callback(null, gasCost);
      } else {
        dispatch(removeAccountDispute({ marketId }));
        callback(null);
      }
    },
    onFailed: err => {
      callback(err);
    }
  });
};
