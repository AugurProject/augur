import { augur } from "services/augurjs";
import { NO_RELAY, SUCCESS } from "modules/common-elements/constants";
import { formatEther } from "utils/format-number";
import { updateTransactionsData } from "modules/transactions/actions/update-transactions-data";
import { constructRelayTransaction } from "modules/transactions/actions/construct-relay-transaction";

const blacklist = ["publicCreateOrder"];

export const handleRelayTransaction = tx => (dispatch, getState) => {
  if (tx && tx.response && tx.data) {
    const { hash, type } = tx;
    if (!hash) return console.error("uncaught relayed transaction", tx);
    const { loginAccount, transactionsData } = getState();
    if (tx.data.from === loginAccount.address) {
      // const gasPrice = augur.rpc.gasPrice || augur.constants.DEFAULT_GASPRICE
      // const gasFees = tx.response.gasFees || augur.trading.simulation.getTxGasEth({ ...tx.data }, gasPrice).toFixed()
      const gasFees = tx.response.gasFees || 0;
      const isBlacklisted = blacklist.includes(type);
      if (hash) {
        if (transactionsData[hash] && !isBlacklisted) {
          dispatch(constructRelayTransaction(tx));
          dispatch(
            updateTransactionsData({
              [hash]: {
                ...transactionsData[hash],
                gasFees: formatEther(gasFees)
              }
            })
          );
        }
        if (
          !transactionsData[hash] ||
          transactionsData[hash].status !== SUCCESS
        ) {
          const relayTransaction = dispatch(constructRelayTransaction(tx));
          if (relayTransaction && !isBlacklisted) {
            dispatch(updateTransactionsData(relayTransaction));
          }
        }
      }
    }
  }
};

export const registerTransactionRelay = () => dispatch => {
  augur.rpc.excludeFromTransactionRelay(NO_RELAY);
  augur.rpc.registerTransactionRelay(transaction =>
    dispatch(handleRelayTransaction(transaction))
  );
};
