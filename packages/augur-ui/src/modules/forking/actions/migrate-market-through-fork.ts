import { augur } from "services/augurjs";
import logError from "utils/log-error";
import { formatGasCostToEther } from "utils/format-number";
import { closeModal } from "modules/modal/actions/close-modal";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";
import { AppState } from "store";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

export const migrateMarketThroughFork = (
  marketId: string,
  estimateGas: boolean = false,
  callback: NodeStyleCallback = logError,
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { loginAccount } = getState();
  augur.api.Market.migrateThroughOneFork({
    tx: {
      to: marketId,
      estimateGas
    },
    meta: loginAccount.meta,
    onSent: () => {
      // if we aren't estimatingGas, close the modal once the transaction is sent.
      if (!estimateGas) dispatch(closeModal());
    },
    onSuccess: (res: any) => {
      if (estimateGas) {
        // if just a gas estimate, return the gas cost.
        const gasPrice = getGasPrice(getState());
        return callback(
          null,
          formatGasCostToEther(res, { decimalsRounded: 4 }, gasPrice.toString())
        );
      }
      return callback(null, res);
    },
    onFailed: (err: any) => callback(err)
  });
};
