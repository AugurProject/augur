import * as AugurJS from '../../../services/augurjs';

import { BRANCH_ID } from '../../app/constants/network';

import { updateMarketsData } from '../../markets/actions/update-markets-data';

export function loadMarkets() {
	const chunkSize = 10;

	return (dispatch, getState) => {
		const { branch } = getState();
		AugurJS.loadMarkets(branch.id || BRANCH_ID, chunkSize, true, (err, marketsData) => {
			if (err) {
				console.log('ERROR loadMarkets()', err);
				return;
			}
			if (!marketsData) {
				console.log('WARN loadMarkets()', 'no markets data returned');
				return;
			}
			dispatch(updateMarketsData(marketsData));
		});
	};
}
