import { assert } from 'chai';
import proxyquire from 'proxyquire';
import * as fakeStore from '../../mockStore';

describe('modules/trade/selectors/trade-commit-lock.js', () => {
	proxyquire.noPreserveCache().noCallThru();
	let expected, actual, selector;
	const { state, mockStore } = fakeStore.default;
	state.tradeCommitLock = { isLocked: true };
	const store = mockStore(state);

	selector = proxyquire('../../../src/modules/trade/selectors/trade-commit-lock.js', {
		'../../../store': store
	});

	it('should return the trade commit lock object', () => {
		assert.deepEqual(selector.default(), { isLocked: true }, `Didn't return the tradeCommitLock as expected`);
	});
});
