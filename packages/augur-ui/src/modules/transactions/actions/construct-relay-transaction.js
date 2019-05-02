import { constructBasicTransaction } from "modules/transactions/actions/construct-transaction";
import unpackTransactionParameters from "modules/transactions/helpers/unpack-transaction-parameters";
import { addAlert } from "modules/alerts/actions/alerts";
import { selectCurrentTimestampInSeconds } from "src/select-state";

import makePath from "modules/routes/helpers/make-path";

import { TRANSACTIONS } from "modules/routes/constants/views";

export const constructRelayTransaction = tx => (dispatch, getState) => {
  const { alerts } = getState();
  const { hash, status } = tx;
  const unpackedParams = unpackTransactionParameters(tx);
  const timestamp =
    tx.response.timestamp || selectCurrentTimestampInSeconds(getState());
  const blockNumber =
    tx.response.blockNumber && parseInt(tx.response.blockNumber, 16);
  if (!alerts.filter(alert => alert.id === hash).length) {
    dispatch(
      addAlert({
        id: hash,
        timestamp,
        blockNumber,
        params: unpackedParams,
        status,
        title: unpackedParams.type,
        description: "",
        linkPath: makePath(TRANSACTIONS),
        to: tx.data.to
      })
    );
  }
  return {
    [hash]: constructBasicTransaction({
      eventName: unpackedParams.type,
      hash,
      blockNumber,
      timestamp,
      message: "",
      description: unpackedParams._description || "",
      gasFees: tx.response.gasFees,
      status
    })
  };
};
