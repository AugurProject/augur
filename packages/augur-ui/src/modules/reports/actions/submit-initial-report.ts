import { REPORTING_REPORT_MARKETS } from "modules/routes/constants/views";
import makePath from "modules/routes/helpers/make-path";
import logError from "utils/log-error";
import { getPayoutNumerators } from "modules/reports/selectors/get-payout-numerators";
import { augur } from "services/augurjs";
import { AppState } from "store";

export const submitInitialReport = ({
  estimateGas,
  marketId,
  selectedOutcome,
  invalid,
  history,
  returnPath = REPORTING_REPORT_MARKETS,
  callback = logError
}: any) => (dispatch: Function, getState: () => AppState) => {
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

  augur.api.Market.doInitialReport({
    meta: loginAccount.meta,
    tx: { to: marketId, estimateGas },
    _invalid: invalid,
    _payoutNumerators: payoutNumerators,
    onSent: (res: any) => {
      if (!estimateGas) {
        history.push(makePath(returnPath));
      }
    },
    onSuccess: (gasCost: any) => {
      if (estimateGas) {
        callback(null, gasCost);
      } else {
        callback(null);
      }
    },
    onFailed: (err: any) => callback(err)
  });
};
