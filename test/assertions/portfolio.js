import { assert } from 'chai';
import assertNavItem from '../../test/assertions/common/nav-item';
import assertFormattedNumber from '../../test/assertions/common/formatted-number';
import assertEndDate from '../../test/assertions/common/end-date';

export default function (portfolio){
	describe('augur-ui-react-components portfolio state', () => {
		it('portfolio', () => {
			assert.isDefined(portfolio);
			assert.isObject(portfolio);
		});

		it('navItems', () => {
			assert.isDefined(portfolio.navItems);
			assert.isArray(portfolio.navItems);

			portfolio.navItems.forEach(navItem => { assertNavItem(navItem, 'portfolio') });
		});

		it('summaries', () => {
			assert.isDefined(portfolio.summaries);
			assert.isArray(portfolio.summaries);

			portfolio.summaries.forEach(summary => { assertSummary(summary) });
		});

		it('loginAccountMarkets', () => {
			assert.isDefined(portfolio.loginAccountMarkets);
			assert.isArray(portfolio.loginAccountMarkets);

			portfolio.loginAccountMarkets.forEach(market => { assertLoginAccountMarket(market) })
		});
	});
};

function assertSummary(summary){
	describe(`summary's shape`, () => {
		it('label', () => {
			assert.isDefined(summary.label);
			assert.isString(summary.label);
		});

		it('value', () => {
			assert.isDefined(summary.value);
			assert.isString(summary.value);
		});
	});
};

function assertLoginAccountMarket(market){
	describe(`loginAccountMarket's shape`, () => {
		it('description', () => {
			assert.isDefined(market.description);
			assert.isString(market.description);
		});

		it('endDate', () => {
			assert.isDefined(market.endDate);

			assertEndDate(market.endDate);
		});

		it('fees', () => {
			assert.isDefined(market.fees);

			assertFormattedNumber(market.fees);
		});

		it('volume', () => {
			assert.isDefined(market.volume);

			assertFormattedNumber(market.volume);
		});

		it('numberOfTrades', () => {
			assert.isDefined(market.numberOfTrades);

			assertFormattedNumber(market.numberOfTrades);
		});

		it('averageTradeSize', () => {
			assert.isDefined(market.averageTradeSize);

			assertFormattedNumber(market.averageTradeSize);
		});

		it('openVolume', () => {
			assert.isDefined(market.openVolume);

			assertFormattedNumber(market.openVolume);
		});
	});
};