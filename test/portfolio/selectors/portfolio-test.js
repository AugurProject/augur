import { assert } from 'chai';
import { assertions } from 'augur-ui-react-components';

import { formatDate } from '../../../src/utils/format-date';
import { formatEther, formatNumber } from '../../../src/utils/format-number';

import proxyquire from 'proxyquire';
import sinon from 'sinon';

import * as selectPortfolioNavItems from '../../../src/modules/portfolio/selectors/nav-items';
import * as selectPortfolioSummaries from '../../../src/modules/portfolio/selectors/summaries';
import * as selectLoginAccountMarkets from '../../../src/modules/portfolio/selectors/login-account-markets';

describe('modules/portfolio/selectors/portfolio', () => {
	proxyquire.noPreserveCache().noCallThru();

	let actual;
	const expected = {
		navItems: [
			{ label: 'My Positions', link: {}, page: 'my-positions' },
			{ label: 'My Markets', link: {}, page: 'my-markets' },
			{ label: 'My Reports', link: {}, page: 'my-reports' }
		],
		summaries: [],
		loginAccountMarkets: [
			{ 	description: 'Will the shoop, shoop de woop?',
				endDate: formatDate(new Date('2017/12/12')),
				fees: formatEther(10),
				volume: formatNumber(100),
				numberOfTrades: formatNumber(1000),
				averageTradeSize: formatEther(100),
				openVolume: formatNumber(10000)
			},
			{ 	description: 'When will the first zipline span the San Francisco Bay?',
				endDate: formatDate(new Date('2017/12/12')),
				fees: formatEther(10),
				volume: formatNumber(100),
				numberOfTrades: formatNumber(1000),
				averageTradeSize: formatEther(100),
				openVolume: formatNumber(10000)
			},
			{ 	description: 'When will I stop balding?',
				endDate: formatDate(new Date('2017/12/12')),
				fees: formatEther(10),
				volume: formatNumber(100),
				numberOfTrades: formatNumber(1000),
				averageTradeSize: formatEther(100),
				openVolume: formatNumber(10000)
			}
		]
	};

	const stubbedNavItems = sinon.stub(selectPortfolioNavItems, 'default', () => ([
		{ label: 'My Positions', link: {}, page: 'my-positions' },
		{ label: 'My Markets', link: {}, page: 'my-markets' },
		{ label: 'My Reports', link: {}, page: 'my-reports' }
	]));
	const stubbedPortfolioSummaries = sinon.stub(selectPortfolioSummaries, 'default', () => ([]));
	const stubbedLoginAccountMarkets = sinon.stub(selectLoginAccountMarkets, 'default', () => ([
		{
			description: 'Will the shoop, shoop de woop?',
			endDate: formatDate(new Date('2017/12/12')),
			fees: formatEther(10),
			volume: formatNumber(100),
			numberOfTrades: formatNumber(1000),
			averageTradeSize: formatEther(100),
			openVolume: formatNumber(10000)
		},
		{
			description: 'When will the first zipline span the San Francisco Bay?',
			endDate: formatDate(new Date('2017/12/12')),
			fees: formatEther(10),
			volume: formatNumber(100),
			numberOfTrades: formatNumber(1000),
			averageTradeSize: formatEther(100),
			openVolume: formatNumber(10000)
		},
		{
			description: 'When will I stop balding?',
			endDate: formatDate(new Date('2017/12/12')),
			fees: formatEther(10),
			volume: formatNumber(100),
			numberOfTrades: formatNumber(1000),
			averageTradeSize: formatEther(100),
			openVolume: formatNumber(10000)
		}
	]));

	let proxiedSelector = proxyquire('../../../src/modules/portfolio/selectors/portfolio', {
		'../../../modules/portfolio/selectors/summaries': stubbedPortfolioSummaries,
		'../../../modules/portfolio/selectors/login-account-markets': stubbedLoginAccountMarkets,
		'../../../modules/portfolio/selectors/nav-items': stubbedNavItems
	});

	before(() => {
		actual = proxiedSelector.default();
	});

	after(() => {
		selectPortfolioNavItems.default.restore();
		selectPortfolioSummaries.default.restore();
		selectLoginAccountMarkets.default.restore();
	});

	it(`should call selectPortfolioNavItems once`, () => {
		assert(stubbedNavItems.calledOnce, `Didn't call selectPortfolioNavItems once as expected`);
	});

	it(`should call 'selectPortfolioSummaries' once`, () => {
		assert(stubbedPortfolioSummaries.calledOnce, `Didn't call 'selectPortfolioSummaries once as expected`);
	});

	it(`should call 'selectLoginAccountMarkets' once`, () => {
		assert(stubbedLoginAccountMarkets.calledOnce, `Didn't call 'selectLoginAccountMarkets once as expected`);
	});
});