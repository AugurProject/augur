import { processTransferFunds } from '../../auth/actions/process-transfer-funds';
import { TRANSFER_FUNDS } from '../../transactions/constants/types';
import { addTransaction } from '../../transactions/actions/add-transactions';

export const addTransferFunds = (amount, toAddress) => (
	(dispatch, getState) => {
		const fromAddress = getState().loginAccount.id;
		dispatch(addTransaction(makeAddTransferFundsTransaction(fromAddress, amount, toAddress, dispatch)));
	}
);

export const makeAddTransferFundsTransaction = (fromAddress, amount, toAddress, dispatch) => {
	const addFundingObject = {
		type: TRANSFER_FUNDS,
		fromAddress,
		amount,
		toAddress,
		action: (transactionID) => dispatch(processTransferFunds(transactionID, fromAddress, amount, toAddress))
	};
	return addFundingObject;
};
