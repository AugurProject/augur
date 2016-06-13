import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mockStore from '../../mockStore';
import filteredMarkets from './markets-filtered-test';

let filters;
describe(`modules/markets/selectors/filters.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	let selector, out, test;
	let { state, store } = mockStore.default;

	let mockFilter = {
		toggleFilter: () => {}
	};
	let mockTag = {
		toggleTag: () => {}
	};
	sinon.stub(mockFilter, 'toggleFilter', (arg) => {
		return {
			type: 'TOGGLE_FILTER',
			filter: arg
		}
	});
	sinon.stub(mockTag, 'toggleTag', (arg) => {
		const obj = {
			type: 'TOGGLE_TAG',
			tag: arg
		};
		return obj;
	});
	let markets = filteredMarkets();
	let mockSelector = {
		filteredMarkets: markets
	};

	selector = proxyquire('../../../src/modules/markets/selectors/filters.js', {
		'../../../store': store,
		'../../markets/actions/toggle-filter': mockFilter,
		'../../markets/actions/toggle-tag': mockTag,
		'../../../selectors': mockSelector
	});

	filters = selector.default;

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	it(`should adjust and return filters props`, () => {
		test = selector.default();

		out = [{
			title: 'Status',
			className: 'status',
			options: [{
				name: 'Open',
				value: 'Open',
				numMatched: 2,
				isSelected: true,
				onClick: test[0].options[0].onClick
			}, {
				name: 'Expired',
				value: 'Expired',
				numMatched: 2,
				isSelected: false,
				onClick: test[0].options[1].onClick
			}, {
				name: 'Reported / Missed',
				value: 'Reported / Missed',
				numMatched: 2,
				isSelected: false,
				onClick: test[0].options[2].onClick
			}]
		}, {
			title: 'Type',
			className: 'type',
			options: [{
				name: 'Yes / No',
				value: 'Yes / No',
				numMatched: 0,
				isSelected: false,
				onClick: test[1].options[0].onClick
			}, {
				name: 'Categorical',
				value: 'Categorical',
				numMatched: 0,
				isSelected: false,
				onClick: test[1].options[1].onClick
			}, {
				name: 'Numerical',
				value: 'Numerical',
				numMatched: 0,
				isSelected: false,
				onClick: test[1].options[2].onClick
			}]
		}, {
			className: 'tags',
			title: 'Tags',
			options: [{
				isSelected: true,
				name: 'tag',
				numMatched: 2,
				onClick: test[2].options[0].onClick,
				value: 'tag'
			}, {
				isSelected: true,
				name: 'testtag',
				numMatched: 2,
				onClick: test[2].options[1].onClick,
				value: 'testtag'
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

export default filters;
