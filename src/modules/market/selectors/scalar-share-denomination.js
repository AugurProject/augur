import store from '../../../store';
import { updateScalarMarketShareDenomination } from '../../market/actions/update-scalar-market-share-denomination';

import { SHARE, MILLI_SHARE, MICRO_SHARE } from '../../market/constants/share-denominations';

export default function () {
	const { scalarMarketsShareDenomination } = store.getState();

	return {
		denominations,
		markets: scalarMarketsShareDenomination,
		updateSelectedShareDenomination: selectShareDenomination
	};
}

const denominations = [
	{
		label: 'Share',
		value: SHARE
	},
	{
		label: 'mShare',
		value: MILLI_SHARE
	},
	{
		label: 'μShare',
		value: MICRO_SHARE
	}
];

function selectShareDenomination(marketID, denomination) {
	store.dispatch(updateScalarMarketShareDenomination(marketID, denomination));
}
