import { BINARY, CATEGORICAL } from '../../markets/constants/market-types';
import { BINARY_NO_ID, BINARY_NO_OUTCOME_NAME, BINARY_YES_ID, BINARY_YES_OUTCOME_NAME } from '../../markets/constants/market-outcomes';

export const selectReportableOutcomes = (type, outcomes) => {
	switch (type) {
		case BINARY:
			return [
				{
					id: `${BINARY_NO_ID}`,
					name: BINARY_NO_OUTCOME_NAME
				},
				{
					id: `${BINARY_YES_ID}`,
					name: BINARY_YES_OUTCOME_NAME
				}
			];
		case CATEGORICAL:
			return outcomes.slice();
		default:
			return [];
	}
};
