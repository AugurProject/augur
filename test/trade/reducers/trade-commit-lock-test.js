import { describe, it } from 'mocha';
import { assert } from 'chai';
import reducer from '../../../src/modules/trade/reducers/trade-commit-lock';
import { UPDATE_TRADE_COMMIT_LOCK } from '../../../src/modules/trade/actions/update-trade-commit-lock';

describe('src/modules/trade/reducers/trade-commit-lock.js', () => {
	it('should handle flipping the trade commit lock', () => {
		const startState = { isLocked: false };
		const testAction = { type: UPDATE_TRADE_COMMIT_LOCK, isLocked: true };
		const testAction2 = { type: UPDATE_TRADE_COMMIT_LOCK, isLocked: false };
		const expectedOutput = { isLocked: true };

		assert.deepEqual(reducer(startState, testAction), expectedOutput, `Didn't properly flip the isLocked switch as expected`);
		assert.deepEqual(reducer(undefined, testAction), expectedOutput, `Didn't properly flip the isLocked switch as expected`);
		assert.deepEqual(reducer(expectedOutput, testAction2), startState, `Didn't properly flip the isLocked switch as expected`);
		assert.deepEqual(reducer(undefined, testAction2), startState, `Didn't properly flip the isLocked switch as expected`);
	});

	it('should not flip the trade commit block if it matches action', () => {
		const startState = { isLocked: false };
		const testAction = { type: UPDATE_TRADE_COMMIT_LOCK, isLocked: true };
		const testAction2 = { type: UPDATE_TRADE_COMMIT_LOCK, isLocked: false };
		const expectedOutput = { isLocked: true };

		assert.deepEqual(reducer(expectedOutput, testAction), expectedOutput, `Didn't properly return isLocked unchanged as expected`);
		assert.deepEqual(reducer(startState, testAction2), startState, `Didn't properly return isLocked unchanged as expected`);
	});

	it('should return the default case if unreconized type is passed as action', () => {
		const startState = { isLocked: false };
		const testAction = { type: 'not a type', isLocked: true };
		const testAction2 = { type: 'not a type', isLocked: false };
		const expectedOutput = { isLocked: true };

		assert.deepEqual(reducer(startState, testAction), startState, `Didn't properly return the default case`);
		assert.deepEqual(reducer(undefined, testAction), {}, `Didn't properly return the default case`);
		assert.deepEqual(reducer(expectedOutput, testAction2), expectedOutput, `Didn't properly return the default case`);
		assert.deepEqual(reducer(undefined, testAction2), {}, `Didn't properly return the default case`);
	});
});
