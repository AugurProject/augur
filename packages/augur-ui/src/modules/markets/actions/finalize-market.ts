import logError from "utils/log-error";
import noop from "utils/noop";
import { ThunkDispatch } from "redux-thunk";
import { NodeStyleCallback } from "modules/types";
import { Action } from "redux";
import { AppState } from "store";
import { augurSdk } from "services/augursdk";
import { claimMarketsProceeds } from 'modules/contracts/actions/contractCalls';

export const sendFinalizeMarket = (marketId, callback: NodeStyleCallback = logError) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState,
) => {
  console.log("finalize market called");
  await claimMarketsProceeds(
    ['0x46b65A442EF149e046428589C8552744bC861A8d'],
    '0xbd355A7e5a7ADb23b51F54027E624BfE0e238DF6',
    '0x0000000000000000000000000000000000000000'
  );

  // TODO call contract to finalize market
  /*
  const { loginAccount } = getState();
  if (!loginAccount.address) return callback(null);
  api.Market.finalize({
    tx: { to: marketId },
    meta: loginAccount.meta,
    onSent: noop,
    onSuccess: () => {
      callback(null);
    },
    onFailed: err => callback(err)
  });
  */
};
