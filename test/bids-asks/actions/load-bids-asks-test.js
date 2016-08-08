import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import mocks from '../../mockStore';

describe(`modules/bids-asks/actions/load-bids-asks.js`, () => {
	proxyquire.noPreserveCache().noCallThru();

	const getOrderBookStub = sinon.stub();
	getOrderBookStub.withArgs('testMarketID', { minValue: 1, maxValue: 2 }).callsArgWith(2, {});
	getOrderBookStub.withArgs('nonExistingMarketID', {}).callsArgWith(2, null);
	const augurJsMock = {
		getOrderBook: getOrderBookStub
	};
	const updateMarketOrderBookModule = {
		updateMarketOrderBook: mocks.actionCreator()
	};
	const store = mocks.store;
	const loadBidsAsksModule = proxyquire('../../../src/modules/bids-asks/actions/load-bids-asks', {
		'../../../services/augurjs': augurJsMock,
		'../../bids-asks/actions/update-market-order-book': updateMarketOrderBookModule,
		'../../market/selectors/market': proxyquire('../../../src/modules/market/selectors/market', {
			'../../../store': store
		})
	});

	beforeEach(() => {
		store.clearActions();
		augurJsMock.getOrderBook.reset();
		updateMarketOrderBookModule.updateMarketOrderBook.reset();
	});

	describe('loadBidsAsks', () => {
		it(`should load orders for a market`, () => {
			store.dispatch(loadBidsAsksModule.loadBidsAsks('testMarketID'));

			sinon.assert.calledOnce(augurJsMock.getOrderBook);
			sinon.assert.calledWith(augurJsMock.getOrderBook, 'testMarketID', { minValue: 1, maxValue: 2 });
			assert.lengthOf(augurJsMock.getOrderBook.getCall(0).args, 3);
			sinon.assert.calledOnce(updateMarketOrderBookModule.updateMarketOrderBook);
		});

		it(`shouldn't load orders for a market where there are no orders`, () => {
			store.dispatch(loadBidsAsksModule.loadBidsAsks('nonExistingMarketID'));

			sinon.assert.calledOnce(augurJsMock.getOrderBook);
			sinon.assert.calledWith(augurJsMock.getOrderBook, 'nonExistingMarketID', {});
			assert.lengthOf(augurJsMock.getOrderBook.getCall(0).args, 3);
			sinon.assert.notCalled(updateMarketOrderBookModule.updateMarketOrderBook);
		});
	});
});
