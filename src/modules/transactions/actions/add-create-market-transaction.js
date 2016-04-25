import { CREATE_MARKET } from '../../transactions/constants/types';

import { createMarket } from '../../create-market/actions/submit-new-market';
import { addTransaction } from '../../transactions/actions/add-transactions';

export const addCreateMarketTransaction = function(marketData, gas, etherWithoutGas) {
    return function(dispatch, getState) {
        dispatch(addTransaction(makeCreateMarketTransaction(marketData, gas, etherWithoutGas, dispatch)));
    };
};

export const makeCreateMarketTransaction = function(marketData, gas, etherWithoutGas, dispatch) {
    return {
        type: CREATE_MARKET,
        gas,
        ether: etherWithoutGas,
        data: marketData,
        action: (transactionID) => dispatch(createMarket(transactionID, marketData))
    };
};