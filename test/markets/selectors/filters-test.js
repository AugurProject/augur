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

	let mockTag = {
		toggleTag: () => {}
	};
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

	selector = proxyquire('../../../src/modules/markets/selectors/filter-sort.js', {
		'../../../store': store,
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

		console.log('test -- ', test);

		out = [
			{
				className: 'tags',
				title: 'Tags',
				options: [
					{
						isSelected: true,
						name: 'tag',
						numMatched: 2,
						onClick: test[0].options[0].onClick,
						value: 'tag'
					},
					{
						isSelected: true,
						name: 'testtag',
						numMatched: 2,
						onClick: test[0].options[1].onClick,
						value: 'testtag'
					}
				]
			}
		];

		test[0].options[0].onClick();
		test[0].options[1].onClick();

		assert.deepEqual(test, out, `Didn't return the expected selector object`);
	});
});

export default filters;
