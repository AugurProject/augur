import * as AugurJS from '../../../services/augurjs';

import { BRANCH_ID } from '../../app/constants/network';

import { isMarketDataPreviousReportPeriod } from '../../../utils/is-market-data-open';

import { updateMarketData } from '../../markets/actions/update-markets-data';

export function closeMarkets(marketsData) {
	return function (dispatch, getState) {
		var { loginAccount, blockchain, branch } = getState(),
			unparsedMarkets;

		if (blockchain.isReportConfirmationPhase || !loginAccount.ether) {
			return;
		}

		unparsedMarkets = Object.keys(marketsData)
			.filter(marketID => isMarketDataPreviousReportPeriod(marketsData[marketID], blockchain.currentPeriod, branch.periodLength))
			.map(marketID => marketsData[marketID]);

		if (!unparsedMarkets || !unparsedMarkets.length) {
			return;
		}

		(function process() {
			var unparsedMarket = unparsedMarkets.pop();

			// check if this market has been determined and closed
			AugurJS.getOutcome(unparsedMarket.eventID, reportedOutcome => {

				// if a reported outcome exists, that means market has been determined and closed
				if (reportedOutcome !== '0') {
					dispatch(updateMarketData({ id: unparsedMarket._id, isClosed: true }));
					return next();
				}

				AugurJS.closeMarket(BRANCH_ID, unparsedMarket._id, (err, res) => {
					if (err) {
						console.log('ERROR closeMarkets()', err);
						return next();
					}
					dispatch(updateMarketData({ id: unparsedMarket._id, isClosed: true }));
console.log('------> closed market', res);
					return next();
				});
			});

			function next() {
				if (unparsedMarkets.length) {
					setTimeout(process, 2000);
				}
			}
		})();
	};
}