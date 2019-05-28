import { augur } from "services/augurjs";
import logError from "utils/log-error";
import { formatGasCostToEther } from "utils/format-number";
import { closeModal } from "modules/modal/actions/close-modal";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";

export const migrateMarketThroughFork = (
  marketId: string,
  estimateGas: Boolean = false,
  callback: Function = logError
) => (dispatch: Function, getState: Function) => {
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
          formatGasCostToEther(res, { decimalsRounded: 4 }, gasPrice)
        );
      }
      return callback(null, res);
    },
    onFailed: (err: any) => callback(err)
  });
};
