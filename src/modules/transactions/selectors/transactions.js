import memoizerific from 'memoizerific';
import { formatShares, formatEther, formatRep } from '../../../utils/format-number';

import { PENDING, SUCCESS, FAILED } from '../../transactions/constants/statuses';

import store from '../../../store';

export default function() {
	var { transactions } = store.getState();
	return selectTransactions(transactions);
}

export const selectTransactions = memoizerific(1)(function(transactionsCollection) {
    return Object.keys(transactionsCollection || {}).sort((a, b) => parseFloat(b) - parseFloat(a)).map(id => transactionsCollection[id]);
});

export const selectNewTransaction = function(type, gas, sharesChange, etherChangeWithoutGas, repChange, data, action) {
    return {
        type,
        status: PENDING,
        gas: formatEther(gas),
        ether: formatEther(etherChangeWithoutGas),
        shares: formatShares(sharesChange),
        rep: formatRep(repChange),
        data: data,
        action: action
    };
};