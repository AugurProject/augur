import * as AugurJS from '../../../services/augurjs';

import { ParseMarketsData } from '../../../utils/parse-market-data';

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
			AugurJS.loadMarkets(BRANCH_ID, chunkSize, numMarkets, true, (error, marketsData) => {
				if (error) {
					console.log('ERROR loadMarkets()', error);
					return;
				}
				if (!marketsData) {
					console.log('WARN loadMarkets()', 'no markets data returned');
					return;
				}

				const marketsDataOutcomesData = new ParseMarketsData(marketsData);

				dispatch(updateMarketsData(marketsDataOutcomesData));

				dispatch(loadReports(marketsDataOutcomesData.marketsData));
				dispatch(penalizeWrongReports(marketsDataOutcomesData.marketsData));
				dispatch(closeMarkets(marketsDataOutcomesData.marketsData));
			});
		});
	};
}
