import {assert} from 'chai';

export default function (marketDataUpdater) {
	describe('augur-ui-react-components marketDataUpdater', () => {
		it('marketDataUpdater', () => {
			assert.isObject(marketDataUpdater);
		});

		it('marketDataUpdater.update', () => {
			assert.isFunction(marketDataUpdater.update);
		});

		it('marketDataUpdater.updateIntervalSecs', () => {
			assert.isNumber(marketDataUpdater.updateIntervalSecs);
		});
	});
}
