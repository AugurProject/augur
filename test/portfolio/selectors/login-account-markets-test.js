import { assert } from 'chai';
import { assertions } from 'augur-ui-react-components';
import * as mockStore from '../../mockStore';

import { formatNumber, formatShares, formatEther } from '../../../src/utils/format-number';
import { formatDate } from '../../../src/utils/format-date';

import sinon from 'sinon';
import proxyquire from 'proxyquire';

describe('modules/portfolio/selectors/login-account-markets', () => {
	proxyquire.noPreserveCache().noCallThru();

	let actual, expected;
	const { store } = mockStore.default;
	const { loginAccount } = store.getState();

	let stubbedAugurJS = {
		getFees: () => {}
	};
	sinon.stub(stubbedAugurJS, 'getFees', () => 10);

	let stubbedSelectors = {
		allMarkets: [
			{
				id: '0xMARKET1',
				author: '0xtest123',
				description: 'test-market-1',
				endDate: formatDate(new Date('2017/12/12')),
				volume: formatNumber(100),
				marketPriceHistory: {
					0: [
						{
							shares: 10
						},
						{
							shares: 20
						}
					],
					1: [
						{
							shares: 10
						},
						{
							shares: 20
						}
					]
				},
				outcomes: [
					{
						orderBook: {
							bid: [
								{
									shares: formatShares(10)
								},
								{
									shares: formatShares(10)
								},
							],
							ask: [
								{
									shares: formatShares(10)
								},
								{
									shares: formatShares(10)
								},
							]
						}
					},
					{
						orderBook: {
							bid: [
								{
									shares: formatShares(10)
								},
								{
									shares: formatShares(10)
								},
							],
							ask: [
								{
									shares: formatShares(10)
								},
								{
									shares: formatShares(10)
								},
							]
						}
					}
				]
			},
			{
				id: '0xMARKET2',
				author: '0xtest123',
				description: 'test-market-2',
				endDate: formatDate(new Date('2017/12/12')),
				volume: formatNumber(100),
				marketPriceHistory: {
					0: [
						{
							shares: 10
						},
						{
							shares: 20
						}
					],
					1: [
						{
							shares: 10
						},
						{
							shares: 20
						}
					]
				},
				outcomes: [
					{
						orderBook: {
							bid: [
								{
									shares: formatShares(10)
								},
								{
									shares: formatShares(10)
								},
							],
							ask: [
								{
									shares: formatShares(10)
								},
								{
									shares: formatShares(10)
								},
							]
						}
					},
					{
						orderBook: {
							bid: [
								{
									shares: formatShares(10)
								},
								{
									shares: formatShares(10)
								},
							],
							ask: [
								{
									shares: formatShares(10)
								},
								{
									shares: formatShares(10)
								},
							]
						}
					}
				]
			},
			{
				id: '0xMARKET3',
				author: '0xtest456'
			},
			{
				id: '0xMARKET4',
				author: '0xtest456'
			}
		],
		loginAccount
	};

	let proxiedSelector = proxyquire('../../../src/modules/portfolio/selectors/login-account-markets', {
		'../../../services/augurjs': stubbedAugurJS,
		'../../../selectors': stubbedSelectors,
		'../../../store': store
	});

	actual = proxiedSelector.default();

	expected = [
		{
			description: 'test-market-1',
			endDate: formatDate(new Date('2017/12/12')),
			volume: formatNumber(100),
			fees: formatEther(stubbedAugurJS.getFees()),
			numberOfTrades: formatNumber(8),
			averageTradeSize: formatNumber(15),
			openVolume: formatNumber(80)
		},
		{
			description: 'test-market-2',
			endDate: formatDate(new Date('2017/12/12')),
			volume: formatNumber(100),
			fees: formatEther(stubbedAugurJS.getFees()),
			numberOfTrades: formatNumber(8),
			averageTradeSize: formatNumber(15),
			openVolume: formatNumber(80)
		}
	];

	it('should return the expected array', () => {
		assert.deepEqual(expected, actual, `Didn't return the expected array`);
	});

	it('should deliver the expected shape to augur-ui-react-components', () => {
		assertions.loginAccountMarkets(actual);
	});
});