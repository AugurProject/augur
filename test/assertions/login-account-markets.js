import { assert } from 'chai';
import assertFormattedNumber from '../../test/assertions/common/formatted-number';
import assertEndDate from '../../test/assertions/common/end-date';

export default function (loginAccountMarkets){
	describe(`augur-ui-react-components loginAccountMarket's shape`, () => {
		assert.isDefined(loginAccountMarkets);
		assert.isArray(loginAccountMarkets);

		loginAccountMarkets.forEach(market => { assertLoginAccountMarkets(market) });
	});
};

export function assertLoginAccountMarkets(market) {
	describe(`markets's shape`, () => {
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
