// import { describe, it } from 'mocha';
// import { assert } from 'chai';
// import proxyquire from 'proxyquire';
// import sinon from 'sinon';
// import configureMockStore from 'redux-mock-store';
// import thunk from 'redux-thunk';

// describe(`modules/trade/actions/take-order.js`, () => {
//   proxyquire.noPreserveCache();
//   const middlewares = [thunk];
//   const mockStore = configureMockStore(middlewares);
//   const test = (t) => {
//     it(t.description, () => {
//       const store = mockStore(t.state);
//       const AugurJS = {
//         augur: {
//           getParticipantSharesPurchased: () => {}
//         }
//       };
//       const UpdateTradeCommitment = {};
//       const Trade = {};
//       const ShortSell = {};
//       const LoadBidsAsks = {};
//       const MakeOrder = {};
//       const action = proxyquire('../../../src/modules/trade/actions/take-order.js', {
//         '../../../services/augurjs': AugurJS,
//         '../../trade/actions/update-trade-commitment': UpdateTradeCommitment,
//         '../../trade/actions/helpers/trade': Trade,
//         '../../trade/actions/helpers/short-sell': ShortSell,
//         '../../bids-asks/actions/load-bids-asks': LoadBidsAsks,
//         '../../trade/actions/make-order': MakeOrder
//       });
//       sinon.stub(AugurJS.augur, 'getParticipantSharesPurchased', () => {});
//       store.dispatch(action.placeBuy(t.params.market, t.params.outcomeID, t.params.numShares, t.params.limitPrice, t.params.totalCost, t.params.tradingFees, t.params.tradeGroupID));
//       t.assertions(store.getActions());
//       store.clearActions();
//     });
//   };
//   test({
//     description: 'place buy',
//     params: {
//       market: '0xa1',
//       outcomeID: '2',
//       numShares: '5',
//       limitPrice: '0.75',
//       totalCost: '10',
//       tradingFees: '0.01',
//       tradeGroupID: null
//     },
//     state: {
//       loginAccount: {
//         address: '0x0000000000000000000000000000000000000b0b'
//       }
//     },
//     assertions: (actions) => {
//       assert.deepEqual(actions, []);
//     }
//   });
// });
