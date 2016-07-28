import { assert } from 'chai';
import assertFormattedNumber from '../../test/assertions/common/formatted-number';
import assertEndDate from '../../test/assertions/common/end-date';

export default function (loginAccountMarkets){
	loginAccountMarkets.forEach(market => {
		describe('augur-ui-react-components loginAccountMarkets state', () => {
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
	});
};