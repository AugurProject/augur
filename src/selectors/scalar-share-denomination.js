import { SHARE, MILLI_SHARE, MICRO_SHARE } from 'modules/market/constants/share-denominations';

export default {
	markets: {},
	denominations: [
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
	],
	updateSelectedShareDenomination: (id, selection) => {
		require('../selectors').update({
			scalarMarketShareDenomination: {
				...require('../selectors').scalarShareDenomination,
				markets: {
					...require('../selectors').scalarShareDenomination.markets,
					[id]: selection
				}
			}
		});
	}
};
