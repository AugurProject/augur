import { assert } from 'chai';
import mocks from '../../../mockStore'

describe('modules/market/selectors/helpers/get-outstanding-shares.js', () => {
	const getOutstandingShares = require('../../../../src/modules/market/selectors/helpers/get-outstanding-shares').default;
	it('should return outstanding shares', () => {
		const outstandingShares = getOutstandingShares(mocks.state.outcomesData['testMarketID']);

		assert.strictEqual(outstandingShares, 372);
	});
});
