import noop from "utils/noop";
import * as speedomatic from "speedomatic";
import logError from "utils/log-error";
import { UNIVERSE_ID } from "modules/common/constants";
import { formatGasCostToEther } from "utils/format-number";
import { closeModal } from "modules/modal/actions/close-modal";
import { loadReportingWindowBounds } from "modules/reports/actions/load-reporting-window-bounds";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";
import { AppState } from "store";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

export const purchaseParticipationTokens = (
  amount: string,
  estimateGas = false,
  callback: NodeStyleCallback = logError,
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { universe } = getState();
  // TODO: will need to use dispute window as part of the reporting redesign
  /*
  reporting.getFeeWindowCurrent(
    { universe: universe.id },
    (err: any, currFeeWindowInfo: any) => {
      if (err) return callback(err);
      let methodFunc = .api.FeeWindow.buy;
      let address = currFeeWindowInfo ? currFeeWindowInfo.feeWindow : null;
      if (address == null) {
        methodFunc = .api.Universe.buyParticipationTokens;
        address = universe.id;
      }
      return dispatch(
        callMethod(methodFunc, amount, address, estimateGas, callback),
      );
    },
  );
  */
};

const callMethod = (
  method: Function,
  amount: string,
  address: string,
  estimateGas: boolean = false,
  callback: NodeStyleCallback,
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { loginAccount } = getState();
  method({
    tx: {
      to: address,
      estimateGas,
    },
    meta: loginAccount.meta,
    _attotokens: speedomatic.fix(amount, "hex"),
    onSent: () => {
      // need fee window to do gas estimate
      if (!estimateGas) dispatch(closeModal());
    },
    onSuccess: (res: any) => {
      if (estimateGas) {
        const gasPrice = getGasPrice(getState());
        return callback(
          null,
          formatGasCostToEther(res, { decimalsRounded: 4 }, gasPrice),
        );
      }
      dispatch(loadReportingWindowBounds());
      return callback(null, res);
    },
    onFailed: (err: any) => callback(err),
  });
};
