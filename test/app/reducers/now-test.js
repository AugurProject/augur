/*
 * Author: priecint
 */

import { assert } from 'chai';
import sinon from 'sinon';
import nowReducer from '../../../src/modules/app/reducers/now';
import { TICK } from '../../../src/modules/app/actions/init-timer';

describe('modules/app/reducers/now.js', () => {
	let clock;
	before(()  => {
		clock = sinon.useFakeTimers();
	});

	after(()  => {
		clock.restore();
	});

	it('should react to default action', () => {
		const newState = nowReducer(undefined, {
			type: '@@INIT'
		});

		assert.deepEqual(newState, 0);
	});

	it('should react to TICK action', () => {
		const currentState = {};

		const newState = nowReducer(currentState, {
			type: TICK,
			now: 10000
		});

		assert.deepEqual(newState, 10000);
		assert.notStrictEqual(currentState, newState);
	});
});
