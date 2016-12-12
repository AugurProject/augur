import { processTransferFunds } from '../../auth/actions/process-transfer-funds';
import { TRANSFER_FUNDS } from '../../transactions/constants/types';
import { addTransaction } from '../../transactions/actions/add-transactions';

export const addTransferFunds = (amount, currency, toAddress) => (
	(dispatch, getState) => {
		const fromAddress = getState().loginAccount.address;
		dispatch(addTransaction(makeAddTransferFundsTransaction(fromAddress, currency, amount, toAddress, dispatch)));
	}
);

export const makeAddTransferFundsTransaction = (fromAddress, currency, amount, toAddress, dispatch) => {
	const addFundingObject = {
		type: TRANSFER_FUNDS,
		fromAddress,
		currency,
		amount,
		toAddress,
		action: transactionID => dispatch(processTransferFunds(transactionID, fromAddress, amount, currency, toAddress))
	};
	return addFundingObject;
};
