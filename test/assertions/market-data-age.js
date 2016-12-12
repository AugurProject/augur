import { describe, it } from 'mocha';
import { assert } from 'chai';

export default function (marketDataAge) {
	describe('augur-ui-react-components marketDataAge', () => {
		it('marketDataAge', () => {
			assert.isObject(marketDataAge);
		});

		it('marketDataAge.lastUpdatedBefore', () => {
			assert.isString(marketDataAge.lastUpdatedBefore);
		});

		it('marketDataAge.isMarketDataLoading', () => {
			assert.isBoolean(marketDataAge.isMarketDataLoading);
		});
	});
}
