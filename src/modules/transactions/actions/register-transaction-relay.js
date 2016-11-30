import { augur, rpc } from '../../../services/augurjs';
import { formatDate } from '../../../utils/format-date';
import { formatRealEther, formatRealEtherEstimate } from '../../../utils/format-number';
import { updateTransactionsData } from '../../transactions/actions/update-transactions-data';

export function registerTransactionRelay() {
	return (dispatch, getState) => {
		rpc.registerTxRelay((tx) => {
			if (tx && tx.response && tx.response.hash) {
				const timestamp = tx.response.timestamp ?
					formatDate(new Date(tx.response.timestamp * 1000)) :
					formatDate(new Date());
				const gasFees = tx.response.gasFees ?
					formatRealEther(tx.response.gasFees) :
					formatRealEtherEstimate(augur.getTxGasEth({
						...tx.payload
					}, rpc.gasPrice));
				dispatch(updateTransactionsData({
					[tx.response.hash]: { ...tx, timestamp, gasFees }
				}));
			}
		});
	};
}
