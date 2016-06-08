import * as AugurJS from '../../../services/augurjs';

import { BRANCH_ID } from '../../app/constants/network';

import { updateMarketsData } from '../../markets/actions/update-markets-data';
import { loadMarketsInfo } from '../../markets/actions/load-markets-info';

/*
import { loadReports } from '../../reports/actions/load-reports';
import { penalizeWrongReports } from '../../reports/actions/penalize-wrong-reports';
import { closeMarkets } from '../../reports/actions/close-markets';
*/

export function loadMarkets() {
	const chunkSize = 10;

	return (dispatch, getState) => {
		AugurJS.loadMarkets(BRANCH_ID, chunkSize, true, (err, marketsData) => {
			if (err) {
				console.log('ERROR loadMarkets()', err);
				return;
			}
			if (!marketsData) {
				console.log('WARN loadMarkets()', 'no markets data returned');
				return;
			}

			dispatch(updateMarketsData(marketsData));
			dispatch(loadMarketsInfo(Object.keys(marketsData)));

			/*
			dispatch(loadReports(marketsData));
			dispatch(penalizeWrongReports(marketsData));
			dispatch(closeMarkets(marketsData));
			*/
		});
	};
}
