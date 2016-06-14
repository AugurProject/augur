import { formatNumber, formatPercent } from '../../../../utils/format-number';
import { formatDate } from '../../../../utils/format-date';

import { MILLIS_PER_BLOCK } from '../../../app/constants/network';
import { BINARY, CATEGORICAL, SCALAR } from '../../../markets/constants/market-types';
import { EXPIRY_SOURCE_SPECIFIC } from '../../../create-market/constants/market-values-constraints';

import { submitNewMarket } from '../../../create-market/actions/submit-new-market';

export const select = (formState, currentBlockNumber, currentBlockMillisSinceEpoch, dispatch) => {
	const o = { ...formState };

	o.type = formState.type;
	o.endDate = formatDate(formState.endDate);
	o.endBlock = selectEndBlockFromEndDate(
								formState.endDate.getTime(),
								currentBlockNumber,
								currentBlockMillisSinceEpoch);

	o.tradingFee = formState.tradingFeePercent / 100;
	o.tradingFeePercent = formatPercent(formState.tradingFeePercent);
	o.makerFee = formState.makerFee / 100;
	o.makerFeePercent = formatPercent(formState.makerFee);
	o.takerFeePercent = formatPercent(100 - formState.makerFee);
	o.volume = formatNumber(0);
	o.expirySource = formState.expirySource === EXPIRY_SOURCE_SPECIFIC ? formState.expirySourceUrl : formState.expirySource;

	o.outcomes = selectOutcomesFromForm(
		formState.type,
		formState.categoricalOutcomes,
		formState.scalarSmallNum,
		formState.scalarBigNum);
	o.isFavorite = false;

	let formattedFairPrices = [];

	o.initialFairPrices.values.map((cV, i) => {
		formattedFairPrices[i] = formatNumber(cV.value, { decimals: 2, minimized: true, denomination: `ETH | ${cV.label}` })
	});

	o.initialFairPrices = {
		...o.initialFairPrices,
		formatted: formattedFairPrices
	};

	o.bestStartingQuantityFormatted = formatNumber(o.bestStartingQuantity, { denomination: 'Shares' });
	o.startingQuantityFormatted = formatNumber(o.startingQuantity, { denomination: 'Shares' });
	o.priceWidthFormatted = formatNumber(o.priceWidth, { decimals: 2, minimized: true, denomination: 'ETH' });

	o.onSubmit = () => dispatch(submitNewMarket(o));

	return o;
};

export const selectEndBlockFromEndDate = (
	endDateMillisSinceEpoch,
	currentBlockNumber,
	currentBlockMillisSinceEpoch) =>
		currentBlockNumber + Math.ceil((endDateMillisSinceEpoch
		- currentBlockMillisSinceEpoch) / MILLIS_PER_BLOCK);


export const selectOutcomesFromForm = (
	type,
	categoricalOutcomes,
	scalarSmallNum,
	scalarBigNum) => {
	switch (type) {
	case BINARY:
		return [{ id: 1, name: 'No' }, { id: 2, name: 'Yes' }];
	case CATEGORICAL:
		return categoricalOutcomes.map((outcome, i) => {
			const obj = { id: i, name: outcome };
			return obj;
		});
	case SCALAR:
		return [{ id: 1, name: scalarSmallNum }, { id: 2, name: scalarBigNum }];
	default:
		break;
	}
};
