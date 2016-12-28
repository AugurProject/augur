import { augur } from '../../../services/augurjs';
import { BINARY, CATEGORICAL, SCALAR } from '../../markets/constants/market-types';
import { BINARY_NO_ID, BINARY_NO_OUTCOME_NAME, BINARY_YES_ID, BINARY_YES_OUTCOME_NAME, CATEGORICAL_SCALAR_INDETERMINATE_OUTCOME_ID, INDETERMINATE_OUTCOME_NAME } from '../../markets/constants/market-outcomes';

export const selectReportableOutcomes = (type, outcomes) => {
	switch (type) {
		case BINARY:
			return [{
				id: `${BINARY_NO_ID}`,
				name: BINARY_NO_OUTCOME_NAME
			}, {
				id: `${BINARY_YES_ID}`,
				name: BINARY_YES_OUTCOME_NAME
			}];
		case CATEGORICAL:
			return outcomes.slice();
		default:
			return [];
	}
};

export function selectOutcomeName(outcomeID, eventType, outcomesData = {}) {
	let outcomeName;
	if (eventType === BINARY) {
		if (outcomeID === '1') {
			outcomeName = BINARY_NO_OUTCOME_NAME;
		} else if (outcomeID === '2') {
			outcomeName = BINARY_YES_OUTCOME_NAME;
		} else {
			outcomeName = INDETERMINATE_OUTCOME_NAME;
		}
	} else if (outcomeID === CATEGORICAL_SCALAR_INDETERMINATE_OUTCOME_ID) {
		outcomeName = INDETERMINATE_OUTCOME_NAME;
	} else if (eventType === SCALAR) {
		outcomeName = outcomeID;
	} else {
		outcomeName = outcomesData[outcomeID] ? outcomesData[outcomeID].name : outcomeID;
	}
	return outcomeName;
}

export function formatReportedOutcome(rawReportedOutcome, ethics, minValue, maxValue, eventType, outcomesData = {}) {
	const isEthical = ethics !== '0' && ethics !== 0 && ethics !== false;
	const report = augur.unfixReport(rawReportedOutcome, minValue, maxValue, eventType);
	if (report.isIndeterminate) return INDETERMINATE_OUTCOME_NAME;
	const outcomeName = selectOutcomeName(report.report, eventType, outcomesData || {});
	if (isEthical) return outcomeName;
	return `${outcomeName} and Unethical`;
}
