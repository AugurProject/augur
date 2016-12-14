import { describe, it, beforeEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import mocks from 'test/mockStore';

describe(`modules/bids-asks/actions/load-bids-asks.js`, () => {
	proxyquire.noPreserveCache().noCallThru();

	const getOrderBookStub = sinon.stub();
	getOrderBookStub.withArgs({ market: 'testMarketID', offset: 0, numTradesToLoad: 1, scalarMinMax: { minValue: 1, maxValue: 2 } }).callsArgWith(1, {});
	getOrderBookStub.withArgs({ market: 'nonExistingMarketID', offset: 0, numTradesToLoad: 0 }, {}).callsArgWith(1, null);
	const getTotalTradesStub = sinon.stub();
	getTotalTradesStub.withArgs('testMarketID').callsArgWith(1, 1);
	getTotalTradesStub.withArgs('nonExistingMarketID').callsArgWith(1, null);
	const augurJsMock = {
		augur: { getOrderBook: getOrderBookStub, get_total_trades: getTotalTradesStub }
	};
	const updateMarketOrderBookModule = {
		updateMarketOrderBook: mocks.actionCreator(),
		clearMarketOrderBook: mocks.actionCreator()
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
		augurJsMock.augur.getOrderBook.reset();
		augurJsMock.augur.get_total_trades.reset();
		updateMarketOrderBookModule.updateMarketOrderBook.reset();
		updateMarketOrderBookModule.clearMarketOrderBook.reset();
	});

	describe('loadBidsAsks', () => {
		it(`should load orders for a market`, () => {
			store.dispatch(loadBidsAsksModule.loadBidsAsks('testMarketID'));

			sinon.assert.calledOnce(augurJsMock.augur.get_total_trades);
			sinon.assert.calledOnce(augurJsMock.augur.getOrderBook);
			sinon.assert.calledWith(augurJsMock.augur.getOrderBook, { market: 'testMarketID', offset: 0, numTradesToLoad: 1, scalarMinMax: { minValue: 1, maxValue: 2 } });
			assert.lengthOf(augurJsMock.augur.getOrderBook.getCall(0).args, 2);
			sinon.assert.calledOnce(updateMarketOrderBookModule.updateMarketOrderBook);
			sinon.assert.calledOnce(updateMarketOrderBookModule.clearMarketOrderBook);
		});

		it(`shouldn't load orders for a market where there are no orders`, () => {
			store.dispatch(loadBidsAsksModule.loadBidsAsks('nonExistingMarketID'));

			sinon.assert.calledOnce(augurJsMock.augur.get_total_trades);
			sinon.assert.calledWith(augurJsMock.augur.get_total_trades, 'nonExistingMarketID');
			assert.lengthOf(augurJsMock.augur.get_total_trades.getCall(0).args, 2);
			sinon.assert.notCalled(updateMarketOrderBookModule.updateMarketOrderBook);
			sinon.assert.notCalled(updateMarketOrderBookModule.clearMarketOrderBook);
		});
	});
});
