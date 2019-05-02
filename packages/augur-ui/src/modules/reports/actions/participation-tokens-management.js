import noop from "utils/noop";
import speedomatic from "speedomatic";
import logError from "utils/log-error";
import { augur } from "services/augurjs";
import { UNIVERSE_ID } from "modules/common-elements/constants";
import { formatGasCostToEther } from "utils/format-number";
import { closeModal } from "modules/modal/actions/close-modal";
import { loadReportingWindowBounds } from "modules/reports/actions/load-reporting-window-bounds";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";

export const UPDATE_PARTICIPATION_TOKENS_DATA =
  "UPDATE_PARTICIPATION_TOKENS_DATA";
export const UPDATE_PARTICIPATION_TOKENS_BALANCE =
  "UPDATE_PARTICIPATION_TOKENS_BALANCE";

export const updateParticipationTokensData = participationTokensDataUpdated => ({
  type: UPDATE_PARTICIPATION_TOKENS_DATA,
  data: { participationTokensDataUpdated }
});
export const updateParticipationTokenBalance = (feeWindowID, balance) => ({
  type: UPDATE_PARTICIPATION_TOKENS_BALANCE,
  data: {
    feeWindowID,
    balance
  }
});

// TODO: is this even in use? on a search, i never see it imported...
export const loadParticipationTokens = (
  includeCurrent = true,
  callback = logError
) => (dispatch, getState) => {
  const { loginAccount, universe } = getState();
  const universeID = universe.id || UNIVERSE_ID;

  augur.augurNode.submitRequest(
    "getFeeWindows",
    { universe: universeID, account: loginAccount.address, includeCurrent },
    (err, feeWindowsWithUnclaimedTokens) => {
      if (err) return callback(err);
      dispatch(updateParticipationTokensData(feeWindowsWithUnclaimedTokens));
      Object.keys(feeWindowsWithUnclaimedTokens).forEach(feeWindowID => {
        augur.api.FeeWindow.withdrawInEmergency({
          tx: { estimateGas: true, to: feeWindowID },
          meta: loginAccount.meta,
          onSent: noop,
          onSuccess: noop,
          onFailed: callback
        });
      });
      callback(null, feeWindowsWithUnclaimedTokens);
    }
  );
};

export const purchaseParticipationTokens = (
  amount,
  estimateGas = false,
  callback = logError
) => (dispatch, getState) => {
  const { universe } = getState();
  augur.reporting.getFeeWindowCurrent(
    { universe: universe.id },
    (err, currFeeWindowInfo) => {
      if (err) return callback(err);
      let methodFunc = augur.api.FeeWindow.buy;
      let address = currFeeWindowInfo ? currFeeWindowInfo.feeWindow : null;
      if (address == null) {
        methodFunc = augur.api.Universe.buyParticipationTokens;
        address = universe.id;
      }
      return dispatch(
        callMethod(methodFunc, amount, address, estimateGas, callback)
      );
    }
  );
};

const callMethod = (method, amount, address, estimateGas = false, callback) => (
  dispatch,
  getState
) => {
  const { loginAccount } = getState();
  method({
    tx: {
      to: address,
      estimateGas
    },
    meta: loginAccount.meta,
    _attotokens: speedomatic.fix(amount, "hex"),
    onSent: () => {
      // need fee window to do gas estimate
      if (!estimateGas) dispatch(closeModal());
    },
    onSuccess: res => {
      if (estimateGas) {
        const gasPrice = getGasPrice(getState());
        return callback(
          null,
          formatGasCostToEther(res, { decimalsRounded: 4 }, gasPrice)
        );
      }
      dispatch(loadReportingWindowBounds());
      return callback(null, res);
    },
    onFailed: err => callback(err)
  });
};
