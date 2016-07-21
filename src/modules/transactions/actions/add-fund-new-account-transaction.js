import { fundNewAccount } from '../../auth/actions/fund-new-account';
import { FUND_ACCOUNT } from '../../transactions/constants/types';
import { addTransaction } from '../../transactions/actions/add-transactions';

export const addFundNewAccount = (address) =>
	(getState, dispatch) =>
		dispatch(addTransaction({
			type: FUND_ACCOUNT,
			action: (transactionID) => dispatch(fundNewAccount(transactionID, address))
		}));
