import * as AugurJS from '../../../services/augurjs';

import { parseMarketsData } from '../../../utils/parse-market-data';

import { BRANCH_ID } from '../../app/constants/network';

import { updateMarketsData } from '../../markets/actions/update-markets-data';
import { loadReports } from '../../reports/actions/load-reports';
import { penalizeWrongReports } from '../../reports/actions/penalize-wrong-reports';
import { closeMarkets } from '../../reports/actions/close-markets';

export function loadMarkets() {
	const chunkSize = 10;

	return (dispatch, getState) => {
		AugurJS.loadNumMarkets(BRANCH_ID, (err, numMarkets) => {
			if (err) {
				return console.log('ERR loadNumMarkets()', err);
			}
// numMarkets = 70; // TEMPORARY OVERRIDE
			AugurJS.loadMarkets(BRANCH_ID, chunkSize, numMarkets, true, (err, marketsData) => {
				if (err) {
					console.log('ERROR loadMarkets()', err);
					return;
				}
				if (!marketsData) {
					console.log('WARN loadMarkets()', 'no markets data returned');
					return;
				}

				const marketsDataOutcomesData = parseMarketsData(marketsData);
console.log(marketsData);
				dispatch(updateMarketsData(marketsDataOutcomesData));

				dispatch(loadReports(marketsDataOutcomesData.marketsData));
				dispatch(penalizeWrongReports(marketsDataOutcomesData.marketsData));
				dispatch(closeMarkets(marketsDataOutcomesData.marketsData));
			});
		});
	};
}
