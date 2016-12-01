import { describe, it } from 'mocha';
import { assert } from 'chai';
import { updateTradeCommitLock, UPDATE_TRADE_COMMIT_LOCK } from '../../../src/modules/trade/actions/update-trade-commit-lock.js';

describe('modules/trade/actions/update-trade-commit-lock.js', () => {
	it('should return an UPDATE_TRADE_COMMIT_LOCK action object', () => {
		assert.deepEqual(updateTradeCommitLock(true), { type: UPDATE_TRADE_COMMIT_LOCK, isLocked: true }, `didn't produce the expected action object`);
		assert.deepEqual(updateTradeCommitLock(false), { type: UPDATE_TRADE_COMMIT_LOCK, isLocked: false }, `didn't produce the expected action object`);
	});
});
