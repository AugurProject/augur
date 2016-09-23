import {assert} from 'chai';

export default function (marketDataAge) {
	describe('augur-ui-react-components marketDataAge', () => {
		it('marketDataAge', () => {
			assert.isObject(marketDataAge);
		});

		it('marketDataAge.lastUpdatedBefore', () => {
			assert.isString(marketDataAge.lastUpdatedBefore);
		});

		it('marketDataAge.isUpdateButtonDisabled', () => {
			assert.isBoolean(marketDataAge.isUpdateButtonDisabled);
		});
	});
}
