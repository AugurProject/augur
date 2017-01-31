// var ClearCallCounts = require('../../tools').ClearCallCounts;
import { describe, it } from 'mocha';
import { assert } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import BigNumber from 'bignumber.js';

describe('modules/my-positions/actions/close-position.js', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  describe('closePosition', () => {
    const test = (t) => {
      it(t.decription, () => {
        const store = mockStore(t.state);
        t.assertions(store.getActions());
      });
    }

    test({
      description: 'should establish the correct `outcomeShares`',

    })
  });

  describe('getBestFillParameters', () => {

  });
});


// describe("file.method", function() {
//   // N tests total
//   var someFunctionToMock = augur.someFunctionToMock;
//   var callCounts = {
//     someFunctionToMock: 0
//   };
//   afterEach(function() {
//     ClearCallCounts(callCounts);
//     augur.someFunctionToMock = someFunctionToMock;
//   });
//   var test = function(t) {
//     // 2 its when required, one for sync test one for async
//     it(t.description + ' sync', function() {
//       augur.someFunctionToMock = t.someFunctionToMock;
//
//       t.assertions(null, augur.functionWeAreTesting(t.arg1, t.arg2));
//     });
//     it(t.description + ' async', function(done) {
//       augur.someFunctionToMock = t.someFunctionToMock;
//
//       augur.functionWeAreTesting(t.arg1, t.arg2, function(err, data) {
//         t.assertions(err, data);
//         done();
//       });
//     });
//   };
//   test({
//     description: 'some description of the test case',
//     arg1: [],
//     arg2: 'hell World',
//     someFunctionToMock: function(arg) {
//       return arg;
//     },
//     assertions: function(err, data) {
//       assert.isNull(err);
//       assert.deepEqual(data, ['some data']);
//     }
//   });
// });
