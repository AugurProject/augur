import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/my-positions/selectors/shares-purchased.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, selector, expected, actual;
	let state = Object.assign({}, testState, {
		outcomesData: {
			"0x80e1010e1cbf1c4b74bb574f1b9e7b4bfc42463f8131c5bad48e636448379a26": {
				"1": {
					outstandingShares: "100156",
					price: "0.656",
					sharesPurchased: "1",
					name: "London"
				},
				"2": {
					outstandingShares: "100156",
					price: "0.23125",
					sharesPurchased: "1",
					name: "New York"
				},
				"3": {
					outstandingShares: "100156",
					price: "0.2875",
					sharesPurchased: "1",
					name: "Los Angeles"
				},
				"4": {
					outstandingShares: "100156",
					price: "0.65625",
					sharesPurchased: "1",
					name: "San Francisco"
				},
				"5": {
					outstandingShares: "100156",
					price: "0.5",
					sharesPurchased: "1",
					name: "Tokyo"
				},
				"6": {
					outstandingShares: "100156",
					price: "0.4",
					sharesPurchased: "1",
					name: "Palo Alto"
				},
				"7": {
					outstandingShares: "100156",
					price: "0.34375",
					sharesPurchased: "0",
					name: "Hong Kong"
				},
				"8": {
					outstandingShares: "100156",
					price: "0.34375",
					sharesPurchased: "1",
					name: "other"
				}
			},
			"0xbcec0378dfeeb59908c886aff93b0e820bb579f63acaeb4b3d4004ec01153115": {
				"1": {
					outstandingShares: "100010001385.270847192461884438",
					price: "0.4",
					sharesPurchased: "12.1",
					name: "cancer"
				},
				"2": {
					outstandingShares: "100010001385.270847192461884438",
					price: "0.5",
					sharesPurchased: "0",
					name: "heart attacks"
				},
				"3": {
					outstandingShares: "100010001385.270847192461884438",
					price: "0.3",
					sharesPurchased: "0",
					name: "infectious diseases"
				},
				"4": {
					outstandingShares: "100010001385.270847192461884438",
					price: "0.9375",
					sharesPurchased: "0",
					name: "starvation"
				},
				"5": {
					outstandingShares: "100010001385.270847192461884438",
					price: "0.11875",
					sharesPurchased: "0",
					name: "lava"
				},
				"6": {
					outstandingShares: "100010001385.270847192461884438",
					price: "0.115",
					sharesPurchased: "0",
					name: "other"
				}
			},
			"0xf65cc5688447795ef1f5d6fbff5ec1816a5c35c61d0b7e2a2dec0281d17ac559": {
				"1": {
					outstandingShares: "20045.018838304552590267",
					price: "0.34375",
					sharesPurchased: "0",
					name: "Atlanta Falcons"
				},
				"2": {
					outstandingShares: "20045.018838304552590267",
					price: "0.4",
					sharesPurchased: "0",
					name: "Miami Dolphins"
				},
				"3": {
					outstandingShares: "20045.018838304552590267",
					price: "0.7125",
					sharesPurchased: "1.010268312243633766",
					name: "tie"
				}
			},
			"0xa9e6547e9c57fdbed3ea10c39001207e69a496a8934e2fb09e9ba46858ed8799": {
				"2": {
					id: 2,
					outstandingShares: "10245",
					price: "0.25",
					sharesPurchased: "10",
					name: "Yes"
				}
			},
			"0x1caa9c830ce779288309ecd55ea9d2177efba163de2be8999eba8acb895fc03f": {
				"1": {
					outstandingShares: "5141",
					price: "0.938",
					sharesPurchased: "10",
					name: "Clinton"
				},
				"2": {
					outstandingShares: "5141",
					price: "0.0625",
					sharesPurchased: "0",
					name: "Trump"
				},
				"3": {
					outstandingShares: "5141",
					price: "0.175",
					sharesPurchased: "10",
					name: "Johnson"
				},
				"4": {
					outstandingShares: "5141",
					price: "0.23125",
					sharesPurchased: "10",
					name: "Stein"
				}
			},
			"0x463d7058a7553f193bedb6ae89e2844fdd6f968fde85e6dd3ffd2939d317bbc7": {
				"1": {
					outstandingShares: "1661.02",
					price: "0.6",
					sharesPurchased: "0",
					name: "Hillary Clinton"
				},
				"2": {
					outstandingShares: "1661.02",
					price: "0.4",
					sharesPurchased: "0",
					name: "Donald Trump"
				},
				"3": {
					outstandingShares: "1661.02",
					price: "0",
					sharesPurchased: "0",
					name: "Gary Johnson"
				},
				"4": {
					outstandingShares: "1661.02",
					price: "0.4",
					sharesPurchased: "0",
					name: "Jill Stein"
				},
				"5": {
					outstandingShares: "1661.02",
					price: "0",
					sharesPurchased: "0",
					name: "someone else"
				}
			},
			"0x77442ed21cc574082f69af69807b3e0d75ada5a0b68d04d354e4ed6e79d6aefd": {
				"2": {
					id: 2,
					outstandingShares: "1045",
					price: "0.01",
					sharesPurchased: "0",
					name: "Yes"
				}
			},
			"0xfb48cc8d7d82133928fb48cd4a316cb7a6d0906d9e6b7e210a1de0ffe32e180e": {
				"2": {
					id: 2,
					outstandingShares: "480",
					price: "0.27",
					sharesPurchased: "0",
					name: "Yes"
				}
			},
			"0x2bd51e25dd52f2fd0f572dcf60d70e304745c4218fb282f67042543b93b7fc1b": {
				"1": {
					outstandingShares: "201",
					price: "0",
					sharesPurchased: "0",
					name: "shake"
				},
				"2": {
					outstandingShares: "201",
					price: "0",
					sharesPurchased: "0",
					name: "hop"
				},
				"3": {
					outstandingShares: "201",
					price: "0",
					sharesPurchased: "0",
					name: "whisper"
				},
				"4": {
					outstandingShares: "201",
					price: "0.5",
					sharesPurchased: "0",
					name: "cheep"
				},
				"5": {
					outstandingShares: "201",
					price: "0",
					sharesPurchased: "0",
					name: "roll"
				},
				"6": {
					outstandingShares: "201",
					price: "0",
					sharesPurchased: "0",
					name: "swim"
				},
				"7": {
					outstandingShares: "201",
					price: "0",
					sharesPurchased: "0",
					name: "laugh"
				}
			},
			"0xd89683ba75d49b200aefd416ce0b9f1fe7c904af7ade8da45d5e723024d9778": {
				"2": {
					id: 2,
					outstandingShares: "1455.9",
					price: "0.15",
					sharesPurchased: "0",
					name: "Yes"
				}
			}
		} 
	});
	store = mockStore(state);

	selector = proxyquire('../../../src/modules/my-positions/selectors/shares-purchased', {
		'../../../store': store
	});

	it(`should return data on all shares purchased`, () => {
		actual = selector.default();
		assert.isArray(actual);
		assert.strictEqual(actual.length, 10);
		actual.forEach(market => {
			assert.isString(market.id);
			assert.isArray(market.outcomes);
			assert.isAbove(market.outcomes.length, 0);
	        market.outcomes.forEach(outcome => {
	            assert.isString(outcome.id);
	            assert.isString(outcome.shares);
	            assert.isAbove(parseInt(outcome.id), 0);
	            assert.isAtLeast(parseFloat(outcome.id), 0);
	        });
	    });
	});
});
