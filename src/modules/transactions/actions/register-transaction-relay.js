import { augur, rpc } from '../../../services/augurjs';
import { SUBMITTED, SUCCESS } from '../../transactions/constants/statuses';
import { NO_RELAY } from '../../transactions/constants/no-relay';
import { formatRealEther } from '../../../utils/format-number';
import { updateTransactionsData } from '../../transactions/actions/update-transactions-data';
import { constructRelayTransaction } from '../../transactions/actions/construct-relay-transaction';

export const handleRelayTransaction = tx => (dispatch, getState) => {
	if (tx && tx.response && tx.data) {
		// console.log('txRelay:', JSON.stringify(tx, null, 4));
		const hash = tx.response.hash;
		const { loginAccount, transactionsData } = getState();
		if (hash && tx.data.from === loginAccount.address) {
			if (!transactionsData[hash] || transactionsData[hash].status !== SUCCESS) {
				const status = tx.response.blockHash ? SUCCESS : SUBMITTED;
				const relayTransaction = dispatch(constructRelayTransaction(tx, status));
				if (relayTransaction) {
					if (relayTransaction.constructor === Object) {
						return dispatch(updateTransactionsData(relayTransaction));
					} else if (relayTransaction.constructor === Array) {
						const numTransactions = relayTransaction.length;
						for (let i = 0; i < numTransactions; ++i) {
							dispatch(updateTransactionsData(relayTransaction[i]));
						}
					}
				}
			} else if (transactionsData[hash]) {
				const gasFees = tx.response.gasFees || augur.getTxGasEth({ ...tx.data }, rpc.gasPrice).toFixed();
				dispatch(updateTransactionsData({
					[hash]: { ...transactionsData[hash], gasFees: formatRealEther(gasFees) }
				}));
			}
		}
	}
};

export const registerTransactionRelay = () => (dispatch) => {
	rpc.excludeFromTxRelay(NO_RELAY);
	rpc.registerTxRelay(tx => dispatch(handleRelayTransaction(tx)));
};
