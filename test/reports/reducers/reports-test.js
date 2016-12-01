import { describe, it, afterEach } from 'mocha';
import { assert } from 'chai';
import {
	UPDATE_REPORTS,
	CLEAR_REPORTS
} from '../../../src/modules/reports/actions/update-reports';
import testState from '../../testState';
import reducer from '../../../src/modules/reports/reducers/reports';

describe(`modules/reports/reducers/reports.js`, () => {
	let action;
	let test;
	const testStateReports = Object.assign({}, testState.reports[testState.branch.id]);
	const state = Object.assign({}, testState);

	afterEach(() => {
		testState.reports[testState.branch.id] = Object.assign({}, testStateReports);
	});

	it(`should update reports`, () => {
		action = {
			type: UPDATE_REPORTS,
			reports: {
				[testState.branch.id]: {
					test: {
						eventID: 'test',
						example: 'example',
						isScalar: false,
						isIndeterminate: false,
						isUnethical: false,
						isRevealed: false
					},
					example: {
						eventID: 'example',
						test: 'test',
						isScalar: false,
						isIndeterminate: false,
						isUnethical: false,
						isRevealed: false
					}
				}
			}
		};
		const out = {
			[testState.branch.id]: {
				test: {
					eventID: 'test',
					example: 'example',
					isScalar: false,
					isIndeterminate: false,
					isUnethical: false,
					isRevealed: false
				},
				example: {
					eventID: 'example',
					test: 'test',
					isScalar: false,
					isIndeterminate: false,
					isUnethical: false,
					isRevealed: false
				},
				testEventID: {
					eventID: 'testEventID',
					isScalar: false,
					isIndeterminate: false,
					isUnethical: false,
					isRevealed: false
				}
			}
		};

		test = reducer(state.reports, action);

		assert.deepEqual(test, out, `Didn't update report information`);
	});

	it(`should clear reports`, () => {
		action = {
			type: CLEAR_REPORTS
		};
		const fakeState = {
			[testState.branch.id]: {
				test: {
					eventID: 'test',
					example: 'example',
					isScalar: false,
					isIndeterminate: false,
					isUnethical: false,
					isRevealed: false
				},
				example: {
					eventID: 'example',
					test: 'test',
					isScalar: false,
					isIndeterminate: false,
					isUnethical: false,
					isRevealed: false
				}
			}
		};

		test = reducer(fakeState, action);

		assert.deepEqual(test, {}, `Didn't clear reports correctly`);
	});
});
