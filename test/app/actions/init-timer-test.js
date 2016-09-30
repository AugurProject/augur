/*
 * Author: priecint
 */
import {
	assert
} from 'chai';
import sinon from 'sinon';
import mocks from '../../mockStore';

describe(`modules/app/actions/init-augur.js`, () => {
	let initTimer;
	const { store } = mocks;

	let clock;
	beforeEach(() => {
		clock = sinon.useFakeTimers();
	});

	afterEach(() => {
		clock.restore();
	});

	initTimer = require('../../../src/modules/app/actions/init-timer.js').default;

	it('should initiate timer', () => {
		store.dispatch(initTimer());
		assert.deepEqual(store.getActions(), []);

		clock.tick(1000);
		assert.deepEqual(store.getActions(), [{
			meta: {
				ignore: true
			},
			now: 1000,
			type: 'TICK'
		}
		]);

		clock.tick(1000);
		assert.deepEqual(store.getActions(), [{
			meta: {
				ignore: true
			},
			now: 1000,
			type: 'TICK'
		}, {
			meta: {
				ignore: true
			},
			now: 2000,
			type: 'TICK'
		}
		]);
	});
});
