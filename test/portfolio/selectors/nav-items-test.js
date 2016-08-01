import { assert } from 'chai';
import { assertions } from 'augur-ui-react-components';

import proxyquire from 'proxyquire';

import { MY_POSITIONS, MY_MARKETS, MY_REPORTS } from '../../../src/modules/app/constants/pages';

describe('modules/portfolio/selectors/nav-items', () => {

	let actual, expected;
	let stubbedSelectors = {
		links: {
			myPositionsLink: {
				test: 'test'
			},
			myMarketsLink: {
				test: 'test'
			},
			myReportsLink: {
				test: 'test'
			}
		}
	};

	let proxiedSelector = proxyquire('../../../src/modules/portfolio/selectors/nav-items', {
		'../../../selectors': stubbedSelectors
	});

	actual = proxiedSelector.default();

	expected = [
		{
			label: 'My Positions',
			link: {
				test: 'test'
			},
			page: MY_POSITIONS
		},
		{
			label: 'My Markets',
			link: {
				test: 'test'
			},
			page: MY_MARKETS
		},
		{
			label: 'My Reports',
			link: {
				test: 'test'
			},
			page: MY_REPORTS
		}
	];

	it('should return the expected array', () => {
		assert.deepEqual(expected, actual, `Didn't return the expected array`);
	});
});