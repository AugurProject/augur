import * as AugurJS from '../../../services/augurjs';
import { BRANCH_ID } from '../../app/constants/network';
import { makeTransactionID } from '../../transactions/actions/add-transactions';
import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { updateTransactionsData } from '../../transactions/actions/update-transactions-data';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';

export function fundNewAccount() {
	// return (dispatch, getState) => {
	// 	const transactionID = makeTransactionID();
	// 	const { loginAccount } = getState();
	//
	// 	AugurJS.fundNewAccount(loginAccount.address, BRANCH_ID, onSent, onSuccess, onFailed);
	// };
}
