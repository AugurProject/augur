import { describe, it } from 'mocha';
import { assert } from 'chai';
import testState from 'test/testState';
import {
	UPDATE_BLOCKCHAIN
} from 'modules/app/actions/update-blockchain';
import reducer from 'modules/app/reducers/blockchain';

describe(`modules/app/reducers/blockchain.js`, () => {
	const thisTestState = Object.assign({}, testState);

	it(`should update the blockchain in state`, () => {
		const action = {
			type: UPDATE_BLOCKCHAIN,
			data: {
				currentPeriod: 21,
				reportPeriod: 20,
				currentBlockNumber: 833340
			}
		};
		const expectedOutput = Object.assign({}, thisTestState.blockchain, action.data);
		assert.deepEqual(reducer(thisTestState.blockchain, action), expectedOutput, `Didn't update the blockchain information`);
	});
});
