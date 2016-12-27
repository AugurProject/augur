import { CREATE_MARKET } from '../../transactions/constants/types';
import { createMarket } from '../../create-market/actions/submit-new-market';
import { addTransaction } from '../../transactions/actions/add-transactions';

export const makeCreateMarketTransaction = (marketData, gas, etherWithoutGas, dispatch) => {
	const obj = {
		type: CREATE_MARKET,
		gas,
		ether: etherWithoutGas,
		data: marketData,
		description: marketData.description,
		action: transactionID => dispatch(createMarket(transactionID, marketData))
	};
	return obj;
};

export const addCreateMarketTransaction = (marketData, gas, etherWithoutGas) =>
	(dispatch, getState) =>
		dispatch(
			addTransaction(
				makeCreateMarketTransaction(
					marketData,
					gas,
					etherWithoutGas,
					dispatch
				)
			)
		);
