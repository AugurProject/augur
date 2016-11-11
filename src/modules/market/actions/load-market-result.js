import { updateMarketsData } from '../../markets/actions/update-markets-data';

import { augur } from '../../../services/augurjs';
import getValue from '../../../utils/get-value';

export function loadMarketResult(marketID) {
	return (dispatch, getState) => {
		const { marketsData } = getState(); // eventID is part of the marketData object AFTER the initial load (parsed from the `events` array inside the markets-data reducer)

		const eventID = getValue(marketsData, `${marketID}.eventID`);
		const result = getValue(marketsData, `${marketID}.result`);
		const newResult = Object.assign({}, result);

		if (eventID) {
			augur.getOutcome(eventID, (outcomeID) => {
				if (outcomeID !== '0') {
					newResult[outcomeID] = outcomeID;
					augur.proportionCorrect(eventID, (proportionCorrect) => {
						if (proportionCorrect !== '0') {
							newResult[proportionCorrect] = proportionCorrect;
						}
						dispatch(updateMarketsData({
							[marketID]: {
								result: newResult
							}
						}));
					});
				}
			});
		}
	};
}
