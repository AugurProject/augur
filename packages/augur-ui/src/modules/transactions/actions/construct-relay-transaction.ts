import { constructBasicTransaction } from "modules/transactions/actions/construct-transaction";
import unpackTransactionParameters from "modules/transactions/helpers/unpack-transaction-parameters";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { AppState } from "appStore";
import { AppStatus } from 'modules/app/store/app-status';

export const constructRelayTransaction = (tx: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState,
) => {
  const { blockchain: { currentAugurTimestamp }} = AppStatus.get();
  const { hash, status } = tx;
  const unpackedParams = unpackTransactionParameters(tx);
  const timestamp =
    tx.response.timestamp || currentAugurTimestamp;
  const blockNumber =
    tx.response.blockNumber && parseInt(tx.response.blockNumber, 16);

  return {
    [hash]: constructBasicTransaction({
      // @ts-ignore
      eventName: unpackedParams.type,
      hash,
      blockNumber,
      timestamp,
      message: "",
      // @ts-ignore
      description: unpackedParams._description || "",
      gasFees: tx.response.gasFees,
      status,
    }),
  };
};
