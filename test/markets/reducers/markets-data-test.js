import { describe, it } from 'mocha';
import { assert } from 'chai';
import reducer from '../../../src/modules/markets/reducers/markets-data';
import { UPDATE_MARKETS_DATA } from '../../../src/modules/markets/actions/update-markets-data';

describe(`modules/markets/reducers/markets-data.js`, () => {
	it(`should update Markets Data`, () => {
		const marketsData = {
			'0x4be50f6303babc4e5400a6ebfaa77a8a76f620dd9f6394466e552842f585801': {
				id: 2,
				outcomeID: 'someoutcome',
				details: {
					example: 'test'
				}
			}
		};
		const marketsData2 = {
			'0x131d98e878803e113e2accc457ad57f5b97a87910be31d60e931c08ca4d5ef1': {
				id: 1,
				outcomeID: 'an outcomeID',
				details: {
					test: 'example'
				}
			},
			'0x4be50f6303babc4e5400a6ebfaa77a8a76f620dd9f6394466e552842f585801': {
				id: 2,
				outcomeID: 'someoutcome',
				details: {
					example: 'test'
				}
			}
		};
		const curMarketsData1 = {
			'0x0131d98e878803e113e2accc457ad57f5b97a87910be31d60e931c08ca4d5ef1': {
				id: 1,
				outcomeID: 'an outcomeID',
				isLoadedMarketInfo: false,
				details: {
					test: 'example'
				}
			}
		};
		const curMarketsData2 = {
			'0x0131d98e878803e113e2accc457ad57f5b97a87910be31d60e931c08ca4d5ef1': {
				id: 1,
				outcomeID: 'an outcomeID',
				isLoadedMarketInfo: false,
				details: {
					test: 'example'
				}
			},
			'0x04be50f6303babc4e5400a6ebfaa77a8a76f620dd9f6394466e552842f585801': {
				id: 2,
				outcomeID: 'a different outcome',
				details: {
					example: 'test2'
				}
			}
		};
		const expectedOutput = {
			'0x0131d98e878803e113e2accc457ad57f5b97a87910be31d60e931c08ca4d5ef1': {
				id: 1,
				outcomeID: 'an outcomeID',
				isLoadedMarketInfo: false,
				details: {
					test: 'example'
				}
			},
			'0x04be50f6303babc4e5400a6ebfaa77a8a76f620dd9f6394466e552842f585801': {
				id: 2,
				outcomeID: 'someoutcome',
				isLoadedMarketInfo: false,
				details: {
					example: 'test'
				}
			}
		};
		const action = {
			type: UPDATE_MARKETS_DATA,
			marketsData
		};
		const action2 = {
			type: UPDATE_MARKETS_DATA,
			marketsData: marketsData2
		};

		assert.deepEqual(reducer(curMarketsData1, action), expectedOutput, `didn't add a new market to markets data`);
		assert.deepEqual(reducer(curMarketsData2, action), expectedOutput, `didn't update a market in markets data`);
		assert.deepEqual(reducer(undefined, action2), expectedOutput, `didn't get the correct output when marketsData is empty`);
	});
});
