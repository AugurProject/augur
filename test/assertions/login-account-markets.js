import { assert } from 'chai';
import assertFormattedNumber from '../../test/assertions/common/formatted-number';
import assertEndDate from '../../test/assertions/common/end-date';

export default function (loginAccountMarkets){
	describe(`augur-ui-react-components loginAccountMarket's shape`, () => {
		assert.isDefined(loginAccountMarkets);
		assert.isObject(loginAccountMarkets);

		it('markets', () => {
			assert.isDefined(loginAccountMarkets.markets);

			loginAccountMarkets.markets.forEach(market => { assertMyMarkets(market) });
		});

		it('summary', () => {
			assert.isDefined(loginAccountMarkets.summary);

			assertMyMarketsSummary(loginAccountMarkets.summary);
		});
	});
};

export function assertMyMarkets(market){
	describe(`market's shape`, () => {
		it('id', () => {
			assert.isDefined(market.id);
			assert.isString(market.id);
		});

		it('description', () => {
			assert.isDefined(market.description);
			assert.isString(market.description);
		});

		it('endDate', () => {
			assert.isDefined(market.endDate);

			assertEndDate(market.endDate, 'loginAccountMarkets.endDate');
		});

		it('fees', () => {
			assert.isDefined(market.fees);

			assertFormattedNumber(market.fees, 'loginAccountMarkets.fees');
		});

		it('volume', () => {
			assert.isDefined(market.volume);

			assertFormattedNumber(market.volume, 'loginAccountMarkets.volume');
		});

		it('numberOfTrades', () => {
			assert.isDefined(market.numberOfTrades);

			assertFormattedNumber(market.numberOfTrades, 'loginAccountMarkets.numberOfTrades');
		});

		it('averageTradeSize', () => {
			assert.isDefined(market.averageTradeSize);

			assertFormattedNumber(market.averageTradeSize, 'loginAccountMarkets.averageTradeSize');
		});

		it('openVolume', () => {
			assert.isDefined(market.openVolume);

			assertFormattedNumber(market.openVolume, 'loginAccountMarkets.openVolume');
		});
	});
};

export function assertMyMarketsSummary(summary){
	describe(`summary's shape`, () => {
		assert.isDefined(summary);
		assert.isObject(summary);

		it('numMarkets', () => {
			assert.isDefined(summary.numMarkets);
			assert.isNumber(summary.numMarkets);
		});

		it('totalValue', () => {
			assert.isDefined(summary.totalValue);
			assert.isNumber(summary.totalValue);
		});
	});
};
