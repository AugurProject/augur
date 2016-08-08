import * as AugurJS from '../../../services/augurjs';
import { isMarketDataPreviousReportPeriod } from '../../../utils/is-market-data-open';

export function penalizeWrongReports(marketsData) {
	return (dispatch, getState) => {
		const { blockchain, loginAccount, branch } = getState();
		const branchID = branch.id;

		if (blockchain.isReportConfirmationPhase || !loginAccount.rep) {
			return;
		}

		const eventIDs = Object.keys(marketsData)
			.filter(marketID => marketsData[marketID].eventID &&
			!isMarketDataPreviousReportPeriod(
				marketsData[marketID],
				blockchain.currentBlockNumber
			))
			.map(marketID => marketsData[marketID].eventID);
		console.log('penalizeWrong events:', eventIDs);

		(function process() {
			// if there are more event ids, continue
			function next() {
				if (eventIDs.length) {
					setTimeout(process, 1000);
				}
			}
			const eventID = eventIDs.pop();
			AugurJS.penalizeWrong(branchID, eventID, (err, res) => {
				if (err) {
					console.log('ERROR penalizeWrong()', err);
					return next();
				}
				console.log('penalizeWrong', res);
				return next();
			});
		}());
	};
}
