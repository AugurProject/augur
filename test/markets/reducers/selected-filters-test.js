// AFAIK, this was never fully implemented
// Leaving here for reference until the updated `filter-sort` and related actions / reducers hit parity w/ what was going to be handled here

// import {
// 	assert
// } from 'chai';
// import {
// 	TOGGLE_FILTER
// } from '../../../src/modules/markets/actions/toggle-filter';
// import {
// 	UPDATE_URL
// } from '../../../src/modules/link/actions/update-url';
// import reducer from '../../../src/modules/markets/reducers/selected-filters';
// import testState from '../../testState';
//
// describe(`modules/markets/reducers/selected-filters.js`, () => {
// 	let action, expectedOutput, test;
// 	let thisTestState = Object.assign({}, testState);
//
// 	it(`should handle a toggle filter action and change the selected filter`, () => {
// 		action = {
// 			type: TOGGLE_FILTER,
// 			filterID: 'test'
// 		};
// 		expectedOutput = {
// 			'isOpen': true,
// 			'test': true
// 		};
// 		test = reducer(thisTestState.selectedFilters, action);
// 		assert.deepEqual(test, expectedOutput, `Didn't add a new filter`);
// 		// prove that it can unselect the filter by feeding it the past response
// 		test = reducer(test, action);
// 		assert.deepEqual(test, thisTestState.selectedFilters, `Didn't remove the test filter`);
// 	});
//
// 	it(`should handle a UPDATE_URL action by adding selectedFilters if need be`, () => {
// 		action = {
// 			type: UPDATE_URL,
// 			parsedURL: {
// 				searchParams: {
// 					isOpen: 'true',
// 					isBinary: 'true',
// 					isExpired: 'true',
// 					isPendingReport: 'true',
// 					isMissedOrReported: 'true',
// 					isCategorical: 'true',
// 					isScalar: 'true'
// 				}
// 			}
// 		};
// 		expectedOutput = {
// 			isOpen: true,
// 			isBinary: true,
// 			isExpired: true,
// 			isPendingReport: true,
// 			isMissedOrReported: true,
// 			isCategorical: true,
// 			isScalar: true
// 		};
// 		test = reducer(thisTestState.selectedFilters, action);
// 		assert.deepEqual(test, expectedOutput, `Didn't add selectedFilters`);
// 	});
//
// });
