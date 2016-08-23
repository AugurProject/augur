import { augur } from '../../../services/augurjs';
import { formatPercent } from '../../../utils/format-number';
import { formatDate } from '../../../utils/format-date';
import store from '../../../store';
import memoizerific from 'memoizerific';

export default function () {
	// const { accountReports } = store.getState();
    //
	// if(accountReports){
	// 	// return generateReportObjects(accountReports);
	// 	return [];
	// }

	return [];

	// Req'd object:
	/*
		[
			{
				eventId: <string>,
				marketId: <string>,
				description: <string>, // Req MarketID
				outcome: <string>,
				outcomePercentage: <formattedNumber>,
				reported: <string>,
				isReportEqual: <bool>,
				feesEarned: <formattedNumber>, // Req MarketID
				repEarned: <formattedNumber>,
				endDate: <formattedDate>,
				isChallenged: <bool>, // TODO
				isChallengeable: <bool> // TODO
			}
		]
	 */

// Whether it's been challanged -- def getRoundTwo(event):
// Whether it's already been challanged -- def getFinal(event):
}
