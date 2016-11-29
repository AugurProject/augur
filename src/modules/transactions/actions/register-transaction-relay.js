import { rpc } from '../../../services/augurjs';
// import { updateTransactionsData } from '../../transactions/actions/update-transactions-data';

export function registerTransactionRelay() {
	return (dispatch, getState) => {
		rpc.registerTxRelay((tx) => {
			console.debug('rpc.txRelay:', tx);
			// if (tx && tx.response && tx.response.hash) {
			// 	dispatch(updateTransactionsData({ [tx.response.hash]: tx }));
			// }
		});
	};
}
