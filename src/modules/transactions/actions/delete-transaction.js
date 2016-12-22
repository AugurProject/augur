export const DELETE_TRANSACTION = 'DELETE_TRANSACTION';

export function deleteTransaction(transactionID) {
	return { type: DELETE_TRANSACTION, transactionID };
}
