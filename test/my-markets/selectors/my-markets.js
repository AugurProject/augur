import { assert } from 'chai';
import assertions from 'augur-ui-react-components/lib/assertions';
import * as mockStore from '../../mockStore';

import { formatNumber, formatShares, formatEther } from '../../../src/utils/format-number';
import { formatDate } from '../../../src/utils/format-date';

import sinon from 'sinon';
import proxyquire from 'proxyquire';

describe('modules/portfolio/selectors/login-account-markets', () => {
	proxyquire.noPreserveCache().noCallThru();

	let actual, expected;
	const { store } = mockStore.default;
	const { loginAccount, allMarkets } = store.getState();

	let stubbedAugurJS = {
		augur: { getMarketCreatorFeesCollected: () => {} },
		abi: { bignum: (n) => { return n; } }
	};
	sinon.stub(stubbedAugurJS.augur, 'getMarketCreatorFeesCollected', () => 10);

	let stubbedSelectors = {
		loginAccount,
		allMarkets
	};

	let proxiedSelector = proxyquire('../../../src/modules/my-markets/selectors/my-markets', {
		'../../../services/augurjs': stubbedAugurJS,
		'../../../selectors': stubbedSelectors,
		'../../../store': store
	});

	actual = proxiedSelector.default();

	expected = [
		{
			id: '0xMARKET1',
			description: 'test-market-1',
			endDate: formatDate(new Date('2017/12/12')),
			volume: formatNumber(100),
			fees: formatEther(stubbedAugurJS.augur.getMarketCreatorFeesCollected()),
			numberOfTrades: formatNumber(8),
			averageTradeSize: formatNumber(15),
			openVolume: formatNumber(80)
		},
		{
			id: '0xMARKET2',
			description: 'test-market-2',
			endDate: formatDate(new Date('2017/12/12')),
			volume: formatNumber(100),
			fees: formatEther(stubbedAugurJS.augur.getMarketCreatorFeesCollected()),
			numberOfTrades: formatNumber(8),
			averageTradeSize: formatNumber(15),
			openVolume: formatNumber(80)
		}
	];

	it('should return the expected array', () => {
		assert.deepEqual(expected, actual, `Didn't return the expected array`);
	});

	it('should deliver the expected shape to augur-ui-react-components', () => {
		assertions.myMarkets(actual);
	});
});
