import {
	assert
} from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';
import * as action from '../../../src/modules/bids-asks/actions/load-bids-asks';

describe(`modules/bids-asks/actions/load-bids-asks.js`, () => {
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);

	let thisTestState = Object.assign({}, testState);
	let store = mockStore(thisTestState);

	beforeEach(() => {
		store.clearActions();
	});

	it(`[UNDER CONSTRUCTION] - should load bids-asks for a market`);
});
