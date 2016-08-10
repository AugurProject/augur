import {
	assert
} from 'chai';
import {
	UPDATE_REPORTS,
	CLEAR_REPORTS
} from '../../../src/modules/reports/actions/update-reports';
import testState from '../../testState';
import reducer from '../../../src/modules/reports/reducers/reports';

describe(`modules/reports/reducers/reports.js`, () => {
	let action, out, test;
	let state = Object.assign({}, testState);

	it(`should update reports`, () => {
		action = {
			type: UPDATE_REPORTS,
			reports: {
				[testState.branch.id]: {
					test: {
						example: 'example'
					},
					example: {
						test: 'test'
					}
				}
			}
		};
		out = {
			[testState.branch.id]: {
				test: {
					example: 'example'
				},
				example: {
					test: 'test'
				}
			},
			testEventID: { isUnethical: false }
		};

		test = reducer(state.reports, action);

		assert.deepEqual(test, out, `Didn't Updated Report Information`);
	});

	it(`should clear reports`, () => {
		action = {
			type: CLEAR_REPORTS
		};
		let fakeState = {
			test: {
				example: 'example'
			},
			example: {
				test: 'test'
			}
		};

		test = reducer(fakeState, action);

		assert.deepEqual(test, {}, `Didn't clear reports correctly`);
	});
});
