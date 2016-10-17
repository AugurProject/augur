import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';
import { augur } from '../../../src/services/augurjs';
import { BINARY, BUY, SELL, tradeShapeAssertion } from './constants';


describe(`Binary Trading Tests`, () => {
	proxyquire.noPreserveCache();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	const state = Object.assign({}, testState, {
		loginAccount: {
			address: '0x00000000000000000000000000000000000user1',
			id: '0x00000000000000000000000000000000000user1',
			name: 'test',
			loginID: 'longLoginID',
			localNode: false,
			prettyAddress: '0000...ser1',
			prettyLoginID: 'long...inID',
			ether: '10000.00',
			realEther: '5.0',
			rep: '50.0',
			keystore: { id: '0x00000000000000000000000000000000000user1' }
		},
		selectedMarketID: '0x000000000000000000000000000000000binary1',
		marketsData: {
			'0x000000000000000000000000000000000binary1': {
				author: '0x000000000000000000000000000000000author1',
				branchID: '0x010101',
				creationFee: '22.5',
				creationTime: 1475951522,
				cumulativeScale: '1',
				description: 'test binary market?',
				endDate: 1495317600,
				eventID: '0x0000000000000000000000000000000000event1',
				isEthical: undefined,
				isLoadedMarketInfo: true,
				makerFee: '0.002',
				maxValue: '2',
				minValue: '1',
				network: '2',
				numEvents: 1,
				numOutcomes: 2,
				reportedOutcome: undefined,
				sortOrder: 0,
				tags: [ 'binary', 'markets', null ],
				takerFee: '0.01',
				tradingFee: '0.008',
				tradingPeriod: 8653,
				type: BINARY,
				volume: '3030',
				winningOutcomes: []
			}
		}, outcomesData: {
			'0x000000000000000000000000000000000binary1': {
				'2': {
					id: 2,
 					name: 'Yes',
					outstandingShares: '1005',
					price: '0.5',
					sharesPurchased: '0'
				}
			}
		},
		tradesInProgress: {}
	});
	const store = mockStore(state);
	const mockAugurJS = { augur: {...augur} };
	mockAugurJS.augur.getParticipantSharesPurchased = sinon.stub().yields("0");
	const mockSelectMarket = {};
	mockSelectMarket.selectMarket = sinon.stub().returns(state.marketsData['0x000000000000000000000000000000000binary1']);

	const action = proxyquire('../../../src/modules/trade/actions/update-trades-in-progress', {
		'../../../store': store,
		'../../../services/augurjs': mockAugurJS,
		'../../market/selectors/market': mockSelectMarket
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	it('should pass shape tests for buying 10 shares of YES at the default limitPrice', () => {
		store.dispatch(action.updateTradesInProgress('0x000000000000000000000000000000000binary1', '2', BUY, '10.0', undefined, undefined));
		tradeShapeAssertion(store.getActions()[0].data.details);
	});

	it('should pass calculation tests for buying 10 shares of YES at the default limitPrice', () => {
		store.dispatch(action.updateTradesInProgress('0x000000000000000000000000000000000binary1', '2', BUY, '10.0', undefined, undefined));
		assert.deepEqual(store.getActions()[0].data.details, {
			side: BUY,
			numShares: '10',
			limitPrice: '0.5',
			totalFee: '0.01',
			totalCost: '5.01',
			tradeActions: [
				{
					action: 'BID',
					shares: '10',
					gasEth: '0.01450404',
					feeEth: '0.01',
					feePercent: '0.2',
					costEth: '5.01',
					avgPrice: '0.501',
					noFeePrice: '0.5'
				}
			],
			tradingFeesEth: '0.01',
			gasFeesRealEth: '0.01450404',
			feePercent: '0.199203187250996016'
		}, `The tradeDetails dispatched didn't correctly calculate the trade as expected.`);
	});

	it('should pass shape tests for Selling 10 shares of YES at the default limitPrice', () => {
		store.dispatch(action.updateTradesInProgress('0x000000000000000000000000000000000binary1', '2', SELL, '10.0', undefined, undefined));
		tradeShapeAssertion(store.getActions()[0].data.details);
	});

	it('should pass calculation tests for selling 10 shares of YES at the default limitPrice', () => {
		store.dispatch(action.updateTradesInProgress('0x000000000000000000000000000000000binary1', '2', SELL, '10.0', undefined, undefined));
		assert.deepEqual(store.getActions()[0].data.details, {
			side: SELL,
			numShares: '10',
			limitPrice: '0.5',
			totalFee: '0.01',
			totalCost: '-10.01',
			tradeActions: [
				{
					action: 'SHORT_ASK',
					shares: '10',
					gasEth: '0.02791268',
					feeEth: '0.01',
					feePercent: '0.2',
					costEth: '-10.01',
					avgPrice: '-1.001',
					noFeePrice: '0.5'
				}
			],
			tradingFeesEth: '0.01',
			gasFeesRealEth: '0.02791268',
			feePercent: '0.099800399201596806'
		}, `The tradeDetails dispatched didn't correctly calculate the trade as expected.`);
	});

	it('should reset the tradeDetails object if 0 shares are passed in as a buy', () => {
		store.dispatch(action.updateTradesInProgress('0x000000000000000000000000000000000binary1', '2', BUY, '0', undefined, undefined));
		assert.deepEqual(store.getActions()[0].data.details, {
			side: BUY,
			numShares: undefined,
			limitPrice: '0.5',
			totalFee: 0,
			totalCost: 0
		}, `Didn't clear the tradeDetails object`);
	});

	it('should handle the tradeDetails object if no shares are passed in as a buy but a limitPrice is set.', () => {
		store.dispatch(action.updateTradesInProgress('0x000000000000000000000000000000000binary1', '2', BUY, undefined, '0.5', undefined));
		assert.deepEqual(store.getActions()[0].data.details, {
			side: BUY,
			numShares: undefined,
			limitPrice: '0.5',
			totalFee: 0,
			totalCost: 0
		}, `Didn't return the correct tradeDetails object based on input`);
	});

	it('should handle the tradeDetails object if no shares are passed in as a buy but a limitPrice is changed when a tradesInProgress is defined for an outcome.', () => {
		// set the current Trade in Progress for BUY to a 10 share .5 limit buy order
		store.getState().tradesInProgress = {
			'0x000000000000000000000000000000000binary1': {
				'2': {
					side: BUY,
					numShares: '10',
					limitPrice: '0.5',
					totalFee: '0.01',
					totalCost: '5.01',
					tradeActions: [{
						action: 'BID',
						shares: '10',
						gasEth: '0.01450404',
						feeEth: '0.01',
						feePercent: '0.2',
						costEth: '5.01',
						avgPrice: '0.501',
						noFeePrice: '0.5'
					}],
					tradingFeesEth: '0.01',
					gasFeesRealEth: '0.01450404',
					feePercent: '0.199203187250996016'
				}
			}
		};
		store.dispatch(action.updateTradesInProgress('0x000000000000000000000000000000000binary1', '2', BUY, undefined, '0.15', undefined));
		assert.deepEqual(store.getActions()[0].data.details, {
			side: BUY,
			numShares: '10',
			limitPrice: '0.15',
			totalFee: '0.00153',
			totalCost: '1.50153',
			tradeActions: [{
				action: 'BID',
				shares: '10',
				gasEth: '0.01450404',
				feeEth: '0.00153',
				feePercent: '0.102',
				costEth: '1.50153',
				avgPrice: '0.150153',
				noFeePrice: '0.15'
			}],
			tradingFeesEth: '0.00153',
			gasFeesRealEth: '0.01450404',
			feePercent: '0.101792343619017205'
		}, `Didn't update the tradeDetails object to the new calcs given new limit`);
	});

	it('should handle clearing out a trade in progress if limitPrice is set to 0 on a trade ready to be placed', () => {
		store.dispatch(action.updateTradesInProgress('0x000000000000000000000000000000000binary1', '2', BUY, undefined, '0', undefined));
		assert.deepEqual(store.getActions()[0].data.details, { numShares: '10' },`Didn't produce the expected tradeDetails object`);
	});

	it('should handle the tradeDetails object if limitPrice is unchanged but share number changes', () => {
		store.dispatch(action.updateTradesInProgress('0x000000000000000000000000000000000binary1', '2', BUY, '25', undefined, undefined));
		assert.deepEqual(store.getActions()[0].data.details, {
			side: 'buy',
			numShares: '25',
			limitPrice: '0.5',
			totalFee: '0.025',
			totalCost: '12.525',
			tradeActions: [ {
				action: 'BID',
				shares: '25',
				gasEth: '0.01450404',
				feeEth: '0.025',
				feePercent: '0.2',
				costEth: '12.525',
				avgPrice: '0.501',
				noFeePrice: '0.5'
			} ],
			tradingFeesEth: '0.025',
			gasFeesRealEth: '0.01450404',
			feePercent: '0.199203187250996016'
 		},`Didn't produce the expected tradeDetails object`);
	});
});
