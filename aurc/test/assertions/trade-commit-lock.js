import { assert } from 'chai';

export default function (tradeCommitLock) {
	assert.isDefined(tradeCommitLock, 'tradeCommitLock is not defined');
	assert.isObject(tradeCommitLock, 'tradeCommitLock is not an object');

	it('isLocked', () => {
		assert.isDefined(tradeCommitLock.isLocked, `'tradeCommitLock.isLocked' is not defined`);
		assert.isBoolean(tradeCommitLock.isLocked, `'tradeCommitLock.isLocked' is not a boolean`);
	});
}