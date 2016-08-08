import { assert } from 'chai';
import { assertions } from 'augur-ui-react-components';

import proxyquire from 'proxyquire';

import { MY_POSITIONS, MY_MARKETS, MY_REPORTS } from '../../../src/modules/app/constants/pages';

import * as selector from '../../../src/modules/portfolio/selectors/portfolio-nav-items';

describe('modules/portfolio/selectors/nav-items', () => {
	let actual, expected;

	it('should return the expected array', () => {
		proxyquire.noPreserveCache().noCallThru();

		let stubbedSelectors = {
			links: {
				myPositionsLink: {
					label: 'test',
					link: {
						href: 'test',
						onClick: 'fake function'
					},
					page: 'test'
				},
				myMarketsLink: {
					label: 'test',
					link: {
						href: 'test',
						onClick: 'fake function'
					},
					page: 'test'
				},
				myReportsLink: {
					label: 'test',
					link: {
						href: 'test',
						onClick: 'fake function'
					},
					page: 'test'
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
					label: 'test',
					link: {
						href: 'test',
						onClick: 'fake function'
					},
					page: 'test'
				},
				page: MY_POSITIONS
			},
			{
				label: 'My Markets',
				link: {
					label: 'test',
					link: {
						href: 'test',
						onClick: 'fake function'
					},
					page: 'test'
				},
				page: MY_MARKETS
			},
			{
				label: 'My Reports',
				link: {
					label: 'test',
					link: {
						href: 'test',
						onClick: 'fake function'
					},
					page: 'test'
				},
				page: MY_REPORTS
			}
		];

		assert.deepEqual(expected, actual, `Didn't return the expected array`);
	});

	it('should deliver the expected shape to augur-ui-react-components', () => {
		actual = selector.default();

		assertions.portfolioNavItems(actual);
	});
});