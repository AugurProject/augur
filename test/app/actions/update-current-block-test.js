// PAGE WAS REMOVED.
// import {
//   assert
// } from 'chai';
// import proxyquire from 'proxyquire';
// import sinon from 'sinon';
// import configureMockStore from 'redux-mock-store';
// import thunk from 'redux-thunk';
// import testState from '../../testState';
//
// describe(`modules/app/actions/update-current-block.js`, () => {
//   proxyquire.noPreserveCache();
//   const middlewares = [thunk];
//   const mockStore = configureMockStore(middlewares);
//   let store, action, out;
//   let state = Object.assign({}, testState);
//   store = mockStore(state);
//   let mockAugurJS = {};
//   let mockBlock = {};
//   mockAugurJS.loadCurrentBlock = sinon.stub();
//   mockBlock.updateBlockchain = sinon.stub();
//   mockAugurJS.loadCurrentBlock.yields(100);
//   mockBlock.updateBlockchain.returns({
//     type: 'UPDATE_BLOCKCHAIN',
//     number: 100
//   });
//
//   action = proxyquire('../../../src/modules/app/actions/update-current-block', {
//     '../../../services/augurjs': mockAugurJS,
//     '../../app/actions/update-blockchain': mockBlock
//   });
//
//   it(`should load the current block and dispatch a update block action`, () => {
//       out = [ { type: 'UPDATE_BLOCKCHAIN', number: 100 } ];
//       store.dispatch(action.updateCurrentBlock());
//       assert(mockAugurJS.loadCurrentBlock.calledOnce, `loadCurrentBlock wasn't called once as expected.`);
//       assert(mockBlock.updateBlockchain.calledOnce, `updateBlockchain wasn't called once as expected.`);
//       assert.equal(mockBlock.updateBlockchain.args[0], 100, `updateBlockchain wasn't called with the expected argument.`);
//       assert.deepEqual(store.getActions(), out, `Didn't dispatch the correct action object`);
//   });
// });
