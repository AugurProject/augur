import { describe, it, beforeEach, afterEach } from 'mocha'
import { assert } from 'chai'
import sinon from 'sinon'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import realStore from 'src/store'

import { initAugur, connectAugur, __RewireAPI__ as ReWireModule } from 'modules/app/actions/init-augur';

describe('init-augur', () => {
  const augurNodeWS = 'wss://some.web.socket.com'
  const ethereumNodeConnectionInfo = {
    http: 'http://some.eth.node.com',
    ws: 'wss://some.eth.ws.node.com'
  }
  const middleware = [thunk]
  const mockStore = configureMockStore(middleware)
  const mockEnv = {
    'augur-node': augurNodeWS,
    'ethereum-node': ethereumNodeConnectionInfo,
    'network-id': 4
  }
  const realSetInterval = global.setInterval
  const store = mockStore({
    ...realStore.getState(),
    env: mockEnv
  })
  const ACTIONS = {
    'UPDATE_ENV': { type: 'UPDATE_ENV' },
    'UPDATE_CONNECTION_STATUS': { type: 'UPDATE_CONNECTION_STATUS' },
    'UPDATE_AUGUR_NODE_CONNECTION_STATUS': { type: 'UPDATE_AUGUR_NODE_CONNECTION_STATUS' },
    'UPDATE_CONTRACT_ADDRESSES': { type: 'UPDATE_CONTRACT_ADDRESSES' },
    'UPDATE_FUNCTIONS_API': { type: 'UPDATE_FUNCTIONS_API' },
    'UPDATE_EVENTS_API': { type: 'UPDATE_EVENTS_API' },
    'SET_LOGIN_ACCOUNT': { type: 'SET_LOGIN_ACCOUNT' },
    'LOGOUT': { type: 'LOGOUT' },
    'LOAD_UNIVERSE': { type: 'LOAD_UNIVERSE' },
    'REGISTER_TRANSACTION_RELAY': { type: 'REGISTER_TRANSACTION_RELAY' },
    'UPDATE_MODAL': { type: 'UPDATE_MODAL' },
    'CLOSE_MODAL': { type: 'CLOSE_MODAL' },
  }

  ReWireModule.__Rewire__('updateEnv', () => ACTIONS.UPDATE_ENV)
  ReWireModule.__Rewire__('updateConnectionStatus', () => ACTIONS.UPDATE_CONNECTION_STATUS)
  ReWireModule.__Rewire__('updateContractAddresses', () => ACTIONS.UPDATE_CONTRACT_ADDRESSES)
  ReWireModule.__Rewire__('updateFunctionsAPI', () => ACTIONS.UPDATE_FUNCTIONS_API)
  ReWireModule.__Rewire__('updateEventsAPI', () => ACTIONS.UPDATE_EVENTS_API)
  ReWireModule.__Rewire__('updateAugurNodeConnectionStatus', () => ACTIONS.UPDATE_AUGUR_NODE_CONNECTION_STATUS)
  ReWireModule.__Rewire__('registerTransactionRelay', () => ACTIONS.REGISTER_TRANSACTION_RELAY)
  ReWireModule.__Rewire__('setLoginAccount', () => ACTIONS.SET_LOGIN_ACCOUNT)
  ReWireModule.__Rewire__('loadUniverse', () => ACTIONS.LOAD_UNIVERSE)

  beforeEach(() => {
    global.XMLHttpRequest = sinon.useFakeXMLHttpRequest({
      readyState: 4,
      status: 200,
    })
    global.requests = []
    const requests = global.requests

    global.XMLHttpRequest.onCreate = (xhr) => {
      requests.push(xhr)
    };

    global.setInterval = (f, interval) => {
      f()
    }

    store.clearActions()
  });

  afterEach(() => {
    global.XMLHttpRequest.restore()
    global.setInterval = realSetInterval
    store.clearActions()
  })

  describe('initAugur', () => {
    const test = t => it(t.description, (done) => t.assertions(done))
    test({
      description: 'Should InitAugur',
      assertions: (done) => {
        ReWireModule.__Rewire__('AugurJS', {
          connect: (env, cb) => {
            cb(null, {
              ethereumNode: {
                ...ethereumNodeConnectionInfo,
                contracts: {},
                abi: {
                  functions: {},
                  events: {}
                }
              },
              augurNode: augurNodeWS
            })
          },
          augur: {
            contracts: { addresses: { 4: { Universe: '0xb0b' } } },
            rpc: {
              getNetworkID: () => 4,
              eth: { accounts: (cb) => cb(['0xa11ce']) },
            }
          }
        })

        store.dispatch(initAugur({}, (err, connInfo) => {
          assert.isUndefined(err, 'callback passed to initAugur had a first argument when expecting undefined.')
          assert.isUndefined(connInfo, 'callback passed to initAugur had a second argument when expecting undefined.')
          done()
        }))

        global.requests[0].respond(
          200,
          { "Content-Type": "application/json" },
          JSON.stringify(mockEnv)
        )

        const expected = [
          { type: 'UPDATE_ENV' },
          { type: 'UPDATE_CONNECTION_STATUS' },
          { type: 'UPDATE_CONTRACT_ADDRESSES' },
          { type: 'UPDATE_FUNCTIONS_API' },
          { type: 'UPDATE_EVENTS_API' },
          { type: 'UPDATE_AUGUR_NODE_CONNECTION_STATUS' },
          { type: 'REGISTER_TRANSACTION_RELAY' },
          { type: 'LOAD_UNIVERSE' },
          { type: 'CLOSE_MODAL' },
          { type: 'SET_LOGIN_ACCOUNT' }
        ]

        assert.deepEqual(store.getActions(), expected, `Didn't fire the expected actions`)
      }
    })
  })
})
  // const augurNodeWebsocket = 'http://blah.blah.com';
  // const middleware = [thunk];
  // const mockStore = configureMockStore(middleware);
  // const mainState = {
  //   env: { 'augur-node': augurNodeWebsocket },
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
  //   UPDATE_ENV: { type: 'UPDATE_ENV', env: { reporting-test: false } },
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
  //     global.requests[0].respond(200, { contentType: 'text/json' }, `{ "reporting-test": false, "augur-node":"blah.com", "auto-login": true }`);
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
  //     global.requests[0].respond(200, { contentType: 'text/json' }, `{ "reporting-test": false, "auto-login": true }`);
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
  //     global.requests[0].respond(200, { contentType: 'text/json' }, `{ "reporting-test": false, "auto-login": true }`);
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
  //     global.requests[0].respond(404, { contentType: 'text/json' }, `{ "reporting-test": false, "auto-login": true }`);
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
