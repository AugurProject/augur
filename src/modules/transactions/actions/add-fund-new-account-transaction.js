import { fundNewAccount } from '../../auth/actions/fund-new-account';
import { FUND_ACCOUNT } from '../../transactions/constants/types';
import { addTransaction } from '../../transactions/actions/add-transactions';

export const makeAddFundTransaction = (address, dispatch) => {
	const addFundingObject = {
		type: FUND_ACCOUNT,
		address,
		message: 'Preparing to sending a request to fund your account.',
		action: (transactionID) => dispatch(fundNewAccount(transactionID, address))
	};
	return addFundingObject;
};

export const addFundNewAccount = (address) =>
	(dispatch, getState) =>
		dispatch(addTransaction(makeAddFundTransaction(address, dispatch)));
