import { describe, it } from 'mocha';
import { assert } from 'chai';
import testState from '../../testState';
import {
	UPDATE_TRANSACTIONS_DATA
} from '../../../src/modules/transactions/actions/update-transactions-data';
import {
	CLEAR_LOGIN_ACCOUNT
} from '../../../src/modules/auth/actions/update-login-account';
import reducer from '../../../src/modules/transactions/reducers/transactions-data';

describe(`modules/transactions/reducers/transactions-data.js`, () => {
	let action;
	let out;
	let test;

	const state = Object.assign({}, testState);

	it(`should update transactions data in state`, () => {
		action = {
			type: UPDATE_TRANSACTIONS_DATA,
			transactionsData: {
				test: {
					example: 'example'
				},
				example: {
					test: 'test'
				}
			}
		};
		out = { ...state.transactionsData,
			test: {
				example: 'example',
				id: 'test'
			},
			example: {
				test: 'test',
				id: 'example'
			}
		};

		test = reducer(state.transactionsData, action);

		assert.deepEqual(test, out, `Didn't update transactionData as expected`);

	});

	it(`should clear transactions on clear login account`, () => {
		action = {
			type: CLEAR_LOGIN_ACCOUNT
		};
		out = {};
		test = reducer(state.transactionsData, action);

		assert.deepEqual(test, out, `Didn't clear transactionsData when clearing the login account`);
	});

});
