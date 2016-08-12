import { assert } from 'chai';
import assertions from 'augur-ui-react-components/lib/assertions';

import sinon from 'sinon';
import proxyquire from 'proxyquire';

import { MY_POSITIONS, MY_MARKETS, MY_REPORTS } from '../../../src/modules/app/constants/pages';

import { formatNumber, formatEther } from '../../../src/utils/format-number';

import * as selector from '../../../src/modules/portfolio/selectors/portfolio-nav-items';

describe('modules/portfolio/selectors/nav-items', () => {
	proxyquire.noPreserveCache().noCallThru();

	let actual, expected;

	const stubbedSelectors = {
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

	const selectors = {
		selectMyPositionsSummary: () => {},
		selectMyMarketsSummary: () => {}
	};

	const stubbedMyPositionsSummary = sinon.stub(selectors, 'selectMyPositionsSummary', () => (
		{
			numPositions: formatNumber(10, { denomination: 'positions' }),
			netChange: formatEther(2)
		}
	));
	const stubbedMyMarketsSummary = sinon.stub(selectors, 'selectMyMarketsSummary', () => (
		{
			numMarkets: 30,
			totalValue: 10
		}
	));

	const proxiedSelector = proxyquire('../../../src/modules/portfolio/selectors/portfolio-nav-items', {
		'../../../modules/my-positions/selectors/my-positions-summary': stubbedMyPositionsSummary,
		'../../../modules/my-markets/selectors/my-markets-summary': stubbedMyMarketsSummary,
		'../../../selectors': stubbedSelectors
	});

	expected = [
		{
			label: 'Positions',
			link: {
				label: 'test',
				link: {
					href: 'test',
					onClick: 'fake function'
				},
				page: 'test'
			},
			page: MY_POSITIONS,
			leadingTitle: 'Total Positions',
			leadingValue: formatNumber(10, { denomination: 'positions' }),
			trailingTitle: 'Total Gain/Loss',
			trailingValue: formatEther(2)
		},
		{
			label: 'Markets',
			link: {
				label: 'test',
				link: {
					href: 'test',
					onClick: 'fake function'
				},
				page: 'test'
			},
			page: MY_MARKETS,
			leadingTitle: 'Total Markets',
			leadingValue: formatNumber(30, { denomination: 'markets' }),
			trailingTitle: 'Total Gain/Loss',
			trailingValue: formatEther(10)
		},
		{
			label: 'Reports',
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

	before(() => {
		actual = proxiedSelector.default();
	});

	it(`should call 'selectMyPositionsSummary' once`, () => {
		assert(stubbedMyPositionsSummary.calledOnce, `Didn't call 'selectMyPositionsSummary' once as expected`);
	});

	it(`should call 'selectMyMarketsSummary' once`, () => {
		assert(stubbedMyMarketsSummary.calledOnce, `Didn't call 'selectMyMarketsSummary' once as expected`);
	});

	it('should return the expected array', () => {
		assert.deepEqual(expected, actual, `Didn't return the expected array`);
	});

	it('should deliver the expected shape to augur-ui-react-components', () => {
		actual = selector.default();

		assertions.portfolioNavItems(actual);
	});
});
