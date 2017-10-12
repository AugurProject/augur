import { describe } from 'mocha'
// import { initAugur, __RewireAPI__ as ReWireModule } from 'modules/app/actions/init-augur';
// import { describe, it, beforeEach, afterEach } from 'mocha';
// import { assert } from 'chai';
// import sinon from 'sinon';
// import thunk from 'redux-thunk';
// import configureMockStore from 'redux-mock-store';

describe('init-augur', () => {
  // const augurNodeUrl = 'http://blah.blah.com';
  // const middleware = [thunk];
  // const mockStore = configureMockStore(middleware);
  // const mainState = {
  //   env: { augurNodeUrl },
  //   connectionInfo: {
  //     ethereumNode: {
  //       contracts: {},
  //       abi: {
  //         functions: {},
  //         events: {}
  //       },
  //       coinbase: {}
  //     }
  //   }
  // };
  // const store = mockStore(mainState || {});
  // const ACTIONS = {
  //   SET_LOGIN_ACCOUNT: { type: 'SET_LOGIN_ACCOUNT' },
  //   REGISTER_TRANSACTION_RELAY: { type: 'REGISTER_TRANSACTION_RELAY' },
  //   UPDATE_ENV: { type: 'UPDATE_ENV', env: { reportingTest: false } },
  //   UPDATE_CONNECTION_STATUS: { isConnected: true, type: 'UPDATE_CONNECTION_STATUS' },
  //   UPDATE_AUGUR_NODE_CONN_STATUS: { type: 'UPDATE_AUGUR_NODE_CONN_STATUS' },
  //   UPDATE_CONTRACT_ADDRESSES: { type: 'UPDATE_CONTRACT_ADDRESSES' },
  //   UPDATE_FUNCTIONS_API: { type: 'UPDATE_FUNCTIONS_API' },
  //   UPDATE_EVENTS_API: { type: 'UPDATE_EVENTS_API' },
  //   LOAD_UNIVERSE: { type: 'LOAD_UNIVERSE' }
  // };

  // const mockLoadUniverse = sinon.stub().returns(ACTIONS.LOAD_UNIVERSE);
  // const mockSetLoginAccount = sinon.stub().returns(ACTIONS.SET_LOGIN_ACCOUNT);
  // const mockRegisterTransactionRelay = sinon.stub().returns(ACTIONS.REGISTER_TRANSACTION_RELAY);
  // const mockUpdateEnv = sinon.stub().returns(ACTIONS.UPDATE_ENV);
  // const mockUpdateConnectionStatus = sinon.stub().returns(ACTIONS.UPDATE_CONNECTION_STATUS);
  // const mockUpdateAugurNodeConnectionStatus = sinon.stub().returns(ACTIONS.UPDATE_AUGUR_NODE_CONN_STATUS);
  // const mockUpdateContractAddresses = sinon.stub().returns(ACTIONS.UPDATE_CONTRACT_ADDRESSES);
  // const mockUpdateFunctionsAPI = sinon.stub().returns(ACTIONS.UPDATE_FUNCTIONS_API);
  // const mockUpdateEventsAPI = sinon.stub().returns(ACTIONS.UPDATE_EVENTS_API);
  // const mockUniverseId = sinon.stub().returns('blah');

  // ReWireModule.__Rewire__('updateEnv', mockUpdateEnv);
  // ReWireModule.__Rewire__('updateConnectionStatus', mockUpdateConnectionStatus);
  // ReWireModule.__Rewire__('updateContractAddresses', mockUpdateContractAddresses);
  // ReWireModule.__Rewire__('updateFunctionsAPI', mockUpdateFunctionsAPI);
  // ReWireModule.__Rewire__('updateEventsAPI', mockUpdateEventsAPI);
  // ReWireModule.__Rewire__('updateAugurNodeConnectionStatus', mockUpdateAugurNodeConnectionStatus);
  // ReWireModule.__Rewire__('registerTransactionRelay', mockRegisterTransactionRelay);
  // ReWireModule.__Rewire__('setLoginAccount', mockSetLoginAccount);
  // ReWireModule.__Rewire__('loadUniverse', mockLoadUniverse);
  // ReWireModule.__Rewire__('UNIVERSE_ID', mockUniverseId);


  // beforeEach(() => {
  //   global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
  //   global.requests = [];
  //   const requests = global.requests;

  //   global.XMLHttpRequest.onCreate = (xhr) => {
  //     requests.push(xhr);
  //   };
  //   store.clearActions();
  // });

  // afterEach(() => {
  //   global.XMLHttpRequest.restore();
  //   store.clearActions();
  //   ReWireModule.__ResetDependency__('augur', 'setLoginAccount', 'registerTransactionRelay', 'loadUniverse', 'updateEnv', 'updateConnectionStatus', 'updateAugurNodeConnectionStatus', 'updateContractAddresses', 'updateFunctionsAPI', 'updateEventsAPI', 'UNIVERSE_ID');
  //   mockUpdateEnv.reset();
  //   mockUpdateConnectionStatus.reset();
  //   mockUpdateContractAddresses.reset();
  //   mockUpdateFunctionsAPI.reset();
  //   mockUpdateEventsAPI.reset();
  //   mockUpdateAugurNodeConnectionStatus.reset();
  //   mockRegisterTransactionRelay.reset();
  //   mockSetLoginAccount.reset();
  //   mockLoadUniverse.reset();
  // });

  // const test = (t) => {
  //   it(t.description, (done) => {

  //     const mockAugurJS = {
  //       connect: t.connect
  //     };
  //     ReWireModule.__Rewire__('augur', mockAugurJS);

  //     store.dispatch(initAugur((err) => {
  //       t.assertions(err, store);
  //       done();
  //     }));
  //     t.resolve();
  //   });
  // };

  // test({
  //   description: 'should initiate the augur app, successfully with all actions returned',
  //   connect: (env, callback) => {
  //     callback(null, mainState.connectionInfo);
  //   },
  //   resolve: () => {
  //     global.requests[0].respond(200, { contentType: 'text/json' }, `{ "reportingTest": false, "augurNodeUrl":"blah.com", "autoLogin":true }`);
  //   },
  //   assertions: (err, store) => {
  //     const out = [ACTIONS.UPDATE_ENV, ACTIONS.UPDATE_CONNECTION_STATUS, ACTIONS.UPDATE_CONTRACT_ADDRESSES, ACTIONS.UPDATE_FUNCTIONS_API, ACTIONS.UPDATE_EVENTS_API, ACTIONS.UPDATE_AUGUR_NODE_CONN_STATUS, ACTIONS.REGISTER_TRANSACTION_RELAY, ACTIONS.SET_LOGIN_ACCOUNT, ACTIONS.LOAD_UNIVERSE];
  //     assert.deepEqual(err, undefined, 'no error is suppose to be');
  //     assert(mockUpdateEnv.calledOnce, `Didn't call updateEnv once as expected`);
  //     assert(mockUpdateConnectionStatus.calledOnce, `Didn't call updateConnectionStatus exactly once as expected`);
  //     assert(mockUpdateContractAddresses.calledOnce, `Didn't call updateContractAddresses exactly once as expected`);
  //     assert(mockUpdateFunctionsAPI.calledOnce, `Didn't call updateFunctionsAPI exactly once as expected`);
  //     assert(mockUpdateEventsAPI.calledOnce, `Didn't call updateEventsAPI exactly once as expected`);
  //     assert(mockUpdateAugurNodeConnectionStatus.calledOnce, `Didn't call updateAugurNodeConnectionStatus exactly once as expected`);
  //     assert(mockRegisterTransactionRelay.calledOnce, `Didn't call registerTransactionRelay exactly once as expected`);
  //     assert(mockSetLoginAccount.calledOnce, `Didn't call setLoginAccount exactly once as expected`);
  //     assert(mockLoadUniverse.calledOnce, `Didn't call loadUniverse exactly once as expected`);
  //     assert.deepEqual(store.getActions(), out, `Didn't dispatch the correct action objects`);
  //   }
  // });
  // test({
  //   description: 'should initiate the augur app, augur node url is blank, all but update augur node connect status actions fired',
  //   connect: (env, callback) => {
  //     callback(null, mainState.connectionInfo);
  //   },
  //   resolve: () => {
  //     global.requests[0].respond(200, { contentType: 'text/json' }, `{ "reportingTest": false, "autoLogin":true }`);
  //   },
  //   assertions: (err, store) => {
  //     const out = [ACTIONS.UPDATE_ENV, ACTIONS.UPDATE_CONNECTION_STATUS, ACTIONS.UPDATE_CONTRACT_ADDRESSES, ACTIONS.UPDATE_FUNCTIONS_API, ACTIONS.UPDATE_EVENTS_API, ACTIONS.REGISTER_TRANSACTION_RELAY, ACTIONS.SET_LOGIN_ACCOUNT, ACTIONS.LOAD_UNIVERSE];
  //     assert.deepEqual(err, undefined, 'no error is suppose to be');
  //     assert(mockUpdateEnv.calledOnce, `Didn't call updateEnv once as expected`);
  //     assert(mockUpdateConnectionStatus.calledOnce, `Didn't call updateConnectionStatus exactly once as expected`);
  //     assert(mockUpdateContractAddresses.calledOnce, `Didn't call updateContractAddresses exactly once as expected`);
  //     assert(mockUpdateFunctionsAPI.calledOnce, `Didn't call updateFunctionsAPI exactly once as expected`);
  //     assert(mockUpdateEventsAPI.calledOnce, `Didn't call updateEventsAPI exactly once as expected`);
  //     assert(mockRegisterTransactionRelay.calledOnce, `Didn't call registerTransactionRelay exactly once as expected`);
  //     assert(mockSetLoginAccount.calledOnce, `Didn't call setLoginAccount exactly once as expected`);
  //     assert(mockLoadUniverse.calledOnce, `Didn't call loadUniverse exactly once as expected`);
  //     assert.deepEqual(store.getActions(), out, `Didn't dispatch the correct action objects`);
  //   }
  // });

  // test({
  //   description: 'should throw error durring initiate the augur app, augur node url is blank, only update env action fired',
  //   connect: (env, callback) => {
  //     callback('ERROR', mainState.connectionInfo);
  //   },
  //   resolve: () => {
  //     global.requests[0].respond(200, { contentType: 'text/json' }, `{ "reportingTest": false, "autoLogin":true }`);
  //   },
  //   assertions: (err, store) => {
  //     const out = [ACTIONS.UPDATE_ENV];
  //     assert.deepEqual(err, 'ERROR', 'error is suppose to happen');
  //     assert(mockUpdateEnv.calledOnce, `Didn't call updateEnv once as expected`);
  //     assert(mockUpdateConnectionStatus.notCalled, `Did call updateConnectionStatus not expected`);
  //     assert(mockUpdateContractAddresses.notCalled, `Did call updateContractAddresses not expected`);
  //     assert(mockUpdateFunctionsAPI.notCalled, `Did call updateFunctionsAPI not expected`);
  //     assert(mockUpdateEventsAPI.notCalled, `Did call updateEventsAPI not expected`);
  //     assert(mockRegisterTransactionRelay.notCalled, `Did call registerTransactionRelay not expected`);
  //     assert(mockSetLoginAccount.notCalled, `Did call setLoginAccount not expected`);
  //     assert(mockLoadUniverse.notCalled, `Did call loadUniverse not expected`);
  //     assert.deepEqual(store.getActions(), out, `one dispatch action object fired`);
  //   }
  // });

  // test({
  //   description: 'should not initiate the augur app, http request returns 404, no actions fired',
  //   connect: null,
  //   resolve: () => {
  //     global.requests[0].respond(404, { contentType: 'text/json' }, `{ "reportingTest": false, "autoLogin":true }`);
  //   },
  //   assertions: (err, store) => {
  //     const out = [];
  //     assert.deepEqual(err, 'Not Found', 'error is suppose to happen');
  //     assert(mockUpdateEnv.notCalled, `Did call updateEnv not expected`);
  //     assert(mockUpdateConnectionStatus.notCalled, `Did call updateConnectionStatus not expected`);
  //     assert(mockUpdateContractAddresses.notCalled, `Did call updateContractAddresses not expected`);
  //     assert(mockUpdateFunctionsAPI.notCalled, `Did call updateFunctionsAPI not expected`);
  //     assert(mockUpdateEventsAPI.notCalled, `Did call updateEventsAPI not expected`);
  //     assert(mockRegisterTransactionRelay.notCalled, `Did call registerTransactionRelay not expected`);
  //     assert(mockSetLoginAccount.notCalled, `Did call setLoginAccount not expected`);
  //     assert(mockLoadUniverse.notCalled, `Did call loadUniverse not expected`);
  //     assert.deepEqual(store.getActions(), out, `one dispatch action object fired`);
  //   }
  // });
})
