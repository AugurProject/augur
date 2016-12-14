import { processFundNewAccount } from '../../auth/actions/process-fund-new-account';
import { FUND_ACCOUNT } from '../../transactions/constants/types';
import { addTransaction } from '../../transactions/actions/add-transactions';

export const addFundNewAccount = address => (
	(dispatch, getState) => (
		dispatch(addTransaction(makeAddFundTransaction(address, dispatch)))
	)
);

export const makeAddFundTransaction = (address, dispatch) => {
	const addFundingObject = {
		type: FUND_ACCOUNT,
		address,
		action: transactionID => dispatch(processFundNewAccount(transactionID, address))
	};
	return addFundingObject;
};
