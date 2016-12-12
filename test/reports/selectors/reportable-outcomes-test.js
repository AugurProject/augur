import { describe, it } from 'mocha';
import { assert } from 'chai';
import reportableOutcomesAssertions from 'assertions/reportable-outcomes';

import { selectReportableOutcomes } from '../../../src/modules/reports/selectors/reportable-outcomes';
import { BINARY, CATEGORICAL } from '../../../src/modules/markets/constants/market-types';
import { BINARY_NO_ID, BINARY_NO_OUTCOME_NAME, BINARY_YES_ID, BINARY_YES_OUTCOME_NAME } from '../../../src/modules/markets/constants/market-outcomes';

describe('modules/reports/selectors/reportable-outcomes.js', () => {
	let actual;
	let expected;

	it('should return the correct array for a BINARY market', () => {
		actual = selectReportableOutcomes(BINARY);
		expected = [
			{
				id: `${BINARY_NO_ID}`,
				name: BINARY_NO_OUTCOME_NAME
			},
			{
				id: `${BINARY_YES_ID}`,
				name: BINARY_YES_OUTCOME_NAME
			}
		];

		assert.deepEqual(actual, expected, `expected array for a BINARY market was not returned`);
		// assertions.reportableOutcomes(actual);
	});

	it('should return the correct array for a CATEGORICAL market', () => {
		const outcomes = [
			{
				id: '3',
				name: 'out3'
			},
			{
				id: '1',
				name: 'out1'
			},
			{
				id: '2',
				name: 'out2'
			}
		];

		actual = selectReportableOutcomes(CATEGORICAL, outcomes);
		expected = [
			{
				id: '3',
				name: 'out3'
			},
			{
				id: '1',
				name: 'out1'
			},
			{
				id: '2',
				name: 'out2'
			}
		];

		assert.deepEqual(actual, expected, `expected array for a CATEGORICAL market was not returned`);
		reportableOutcomesAssertions(actual);
	});

	it('should return the correct array for DEFAULT case', () => {
		actual = selectReportableOutcomes(null);
		expected = [];

		assert.deepEqual(actual, expected, `expected array for a DEFAULT case was not returned`);
	});
});
