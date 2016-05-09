import * as AugurJS from '../../../services/augurjs';
import { isMarketDataPreviousReportPeriod } from '../../../utils/is-market-data-open';

import { BRANCH_ID } from '../../app/constants/network';

export function penalizeWrongReports(marketsData) {
	return function (dispatch, getState) {
		var { blockchain, loginAccount } = getState(),
			branchID = BRANCH_ID,
			prevPeriod = blockchain.reportPeriod - 1,
			eventIDs;

		if (blockchain.isReportConfirmationPhase || !loginAccount.rep) {
			return;
		}

		eventIDs = Object.keys(marketsData)
			.filter(marketID => marketsData[marketID].eventID && !isMarketDataPreviousReportPeriod(marketsData[marketID], blockchain.currentBlockNumber))
			.map(marketID => marketsData[marketID].eventID);

		(function process() {
			var eventID = eventIDs.pop();
			AugurJS.penalizeWrong(branchID, prevPeriod, eventID, (err, res) => {
				if (err) {
					console.log('ERROR penalizeWrong()', err);
					return next();
				}
console.log('------> penalizeWrong', res);
				return next();
			});

			// if there are more event ids, continue
			function next() {
				if (eventIDs.length) {
					setTimeout(process, 1000);
				}
			}
		})();
	};
}
