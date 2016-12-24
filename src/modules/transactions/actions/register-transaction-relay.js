import { abi, augur, rpc } from '../../../services/augurjs';
import { NO_RELAY } from '../../transactions/constants/no-relay';
import { formatDate } from '../../../utils/format-date';
import { formatRealEther, formatRealEtherEstimate } from '../../../utils/format-number';
import { updateTransactionsData } from '../../transactions/actions/update-transactions-data';

export function registerTransactionRelay() {
	return (dispatch, getState) => {
		rpc.excludeFromTxRelay(NO_RELAY);
		rpc.registerTxRelay((tx) => {
			if (tx && tx.response && tx.data) {
				const hash = tx.response.hash;
				const { transactionsData } = getState();
				if (hash && (!transactionsData[hash] || transactionsData[hash].status !== 'success')) {
					if (!tx.data.description && tx.data.inputs) {
						const params = tx.data.params.slice();
						if (tx.data.fixed) {
							const numFixed = tx.data.fixed.length;
							for (let i = 0; i < numFixed; ++i) {
								params[tx.data.fixed[i]] = abi.unfix(params[tx.data.fixed[i]], 'string');
							}
						}
						tx.data.description = tx.data.inputs.map((input, i) => `${input}: ${params[i]}`).join('\n');
					}
					const timestamp = tx.response.timestamp ?
						formatDate(new Date(tx.response.timestamp * 1000)) :
						formatDate(new Date());
					const gasFees = tx.response.gasFees ?
						formatRealEther(tx.response.gasFees) :
						formatRealEtherEstimate(augur.getTxGasEth({
							...tx.data
						}, rpc.gasPrice));
					if (transactionsData[hash] && transactionsData[hash].disableAutoMessage) {
						return dispatch(updateTransactionsData({
							[hash]: { ...tx, timestamp, gasFees, hash }
						}));
					}
					let message;
					if (tx.response.callReturn && (
						tx.response.callReturn.constructor === Array ||
						tx.response.callReturn.constructor === Object)
					) {
						message = JSON.stringify(tx.response.callReturn);
					} else {
						message = tx.response.callReturn;
					}
					dispatch(updateTransactionsData({
						[hash]: { ...tx, message, timestamp, gasFees, hash }
					}));
				}
			}
		});
	};
}
