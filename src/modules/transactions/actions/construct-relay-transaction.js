import { constructBasicTransaction } from "modules/transactions/actions/construct-transaction";
import unpackTransactionParameters from "modules/transactions/helpers/unpack-transaction-parameters";
import { addNotification } from "modules/notifications/actions/notifications";
import { selectCurrentTimestampInSeconds } from "src/select-state";

import makePath from "modules/routes/helpers/make-path";

import { TRANSACTIONS } from "modules/routes/constants/views";

export const constructRelayTransaction = tx => (dispatch, getState) => {
  const { notifications } = getState();
  const { hash, status } = tx;
  const unpackedParams = unpackTransactionParameters(tx);
  const timestamp =
    tx.response.timestamp || selectCurrentTimestampInSeconds(getState());
  const blockNumber =
    tx.response.blockNumber && parseInt(tx.response.blockNumber, 16);
  if (!notifications.filter(notification => notification.id === hash).length) {
    dispatch(
      addNotification({
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
    [hash]: constructBasicTransaction(
      unpackedParams.type,
      hash,
      blockNumber,
      timestamp,
      "",
      unpackedParams._description || "",
      tx.response.gasFees,
      status
    )
  };
};
