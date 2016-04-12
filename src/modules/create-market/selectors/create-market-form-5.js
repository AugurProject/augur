import { formatNumber, formatPercent, formatDate } from '../../../utils/format-number';

import { MILLIS_PER_BLOCK } from '../../app/constants/network';
import { BINARY, CATEGORICAL, SCALAR, COMBINATORIAL } from '../../markets/constants/market-types';
import { EXPIRY_SOURCE_GENERIC, EXPIRY_SOURCE_SPECIFIC } from '../../create-market/constants/market-values-constraints';

import * as CreateMarketActions from '../../create-market/actions/create-market-actions';

import store from '../../../store';

export default function() {
	var { createMarketInProgress, blockchain } = store.getState(),
		marketFromForm = selectMarketFromForm(createMarketInProgress, blockchain.currentBlockNumber, blockchain.currentBlockMillisSinceEpoch);

	marketFromForm.onSubmit = () => store.dispatch(CreateMarketActions.submitNewMarketTransaction(marketFromForm));

	return marketFromForm;
};

export const selectMarketFromForm = function(formState, currentBlockNumber, currentBlockMillisSinceEpoch) {
	var o = { ...formState };

	o.type = formState.type;
	o.endDate = formatDate(formState.endDate);
	o.endBlock = selectEndBlockFromEndDate(formState.endDate.getTime(), currentBlockNumber, currentBlockMillisSinceEpoch);

	o.tradingFee = formState.tradingFeePercent / 100;
	o.tradingFeePercent = formatPercent(formState.tradingFeePercent, true);
	o.volume = formatNumber(0);
	o.expirySource = formState.expirySource === EXPIRY_SOURCE_SPECIFIC ? formState.expirySourceUrl : formState.expirySource;

	o.outcomes = selectOutcomesFromForm(formState.type, formState.categoricalOutcomes, formState.scalarSmallNum, formState.scalarBigNum);
	o.isFavorite = false;

	return o;
};

export const selectEndBlockFromEndDate = function(endDateMillisSinceEpoch, currentBlockNumber, currentBlockMillisSinceEpoch) {
	return currentBlockNumber + Math.ceil((endDateMillisSinceEpoch - currentBlockMillisSinceEpoch) / MILLIS_PER_BLOCK);
};

export const selectOutcomesFromForm = function(type, categoricalOutcomes, scalarSmallNum, scalarBigNum) {
	switch (type) {
		case BINARY:
			return [{ id: 1, name: 'No' }, { id: 2, name: 'Yes' }];
		case CATEGORICAL:
			return categoricalOutcomes.map((outcome, i) => { return { id: i, name: outcome }});
		case SCALAR:
			return [{ id: 1, name: scalarSmallNum }, { id: 2, name: scalarBigNum }];
	}
}