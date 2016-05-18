import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/markets/selectors/filters.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, selector, out, test;
	let state = Object.assign({}, testState);
	store = mockStore(state);
	let mockFilter = {
		toggleFilter: () => {}
	};
	sinon.stub(mockFilter, 'toggleFilter', (arg) => {
		return {
			type: 'TOGGLE_FILTER',
			filter: arg
		}
	});

	selector = proxyquire('../../../src/modules/markets/selectors/filters.js', {
		'../../../store': store,
		'../../markets/actions/toggle-filter': mockFilter
	});

	it(`should adjust and return filters props`, () => {
		test = selector.default();

		out = [{
			title: 'Status',
			options: [{
				name: 'Open',
				value: 'Open',
				numMatched: 1,
				isSelected: true,
				onClick: test[0].options[0].onClick
			}, {
				name: 'Expired',
				value: 'Expired',
				numMatched: 1,
				isSelected: false,
				onClick: test[0].options[1].onClick
			}, {
				name: 'Reported / Missed',
				value: 'Reported / Missed',
				numMatched: 1,
				isSelected: false,
				onClick: test[0].options[2].onClick
			}]
		}, {
			title: 'Type',
			options: [{
				name: 'Yes / No',
				value: 'Yes / No',
				numMatched: 145,
				isSelected: false,
				onClick: test[1].options[0].onClick
			}, {
				name: 'Categorical',
				value: 'Categorical',
				numMatched: 124,
				isSelected: false,
				onClick: test[1].options[1].onClick
			}, {
				name: 'Numerical',
				value: 'Numerical',
				numMatched: 70,
				isSelected: false,
				onClick: test[1].options[2].onClick
			}]
		}];

		let outActions = [{
			type: 'TOGGLE_FILTER',
			filter: 'isOpen'
		}, {
			type: 'TOGGLE_FILTER',
			filter: 'isExpired'
		}, {
			type: 'TOGGLE_FILTER',
			filter: 'isMissedOrReported'
		}, {
			type: 'TOGGLE_FILTER',
			filter: 'isBinary'
		}, {
			type: 'TOGGLE_FILTER',
			filter: 'isCategorical'
		}, {
			type: 'TOGGLE_FILTER',
			filter: 'isScalar'
		}];

		test[0].options[0].onClick();
		test[0].options[1].onClick();
		test[0].options[2].onClick();
		test[1].options[0].onClick();
		test[1].options[1].onClick();
		test[1].options[2].onClick();

		assert.equal(mockFilter.toggleFilter.callCount, 6, `The Filter OnClick functions didn't dispatch the number of actions they should have`);
		assert.deepEqual(test, out, `Didn't return the expected selector object`);
		assert.deepEqual(store.getActions(), outActions, `Didn't dispatch the expected action objects`);
	});
});
