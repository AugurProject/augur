import { loadFundingHistory, __RewireAPI__ as ReWireModule } from 'modules/account/actions/load-funding-history';
import { describe, it } from 'mocha';
import { assert } from 'chai';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { APPROVAL, TRANSFER, DEPOSIT_ETHER, WITHDRAW_ETHER } from '../../../src/modules/transactions/constants/types';

describe('loadFundingHistory', () => {

  const middleware = [thunk];
  const mockStore = configureMockStore(middleware);
  const loginAccountAddress = '0x1824c06d9a2fd617a0fd59d0bee8641c1a787bf1';

  const augurNodeUrl = 'http://blah.blah.com';

  const mainState = {
    env: {
      augurNodeURL: augurNodeUrl
    },
    loginAccount: {
      address: loginAccountAddress
    }
  };

  const NO_HISTORY_MESSAGES = {
    NO_TRANSFER_HISTORY: `no transfer history data received from ${augurNodeUrl}`,
    NO_APPROVAL_HISTORY: `no approval history data received from ${augurNodeUrl}`,
    NO_DEPOSIT_HISTORY: `no deposit ether history data received from ${augurNodeUrl}`,
    NO_WITHDRAW_HISTORY: `no deposit ether history data received from ${augurNodeUrl}`
  };
  const LOGS_CONV_ACTIONS = {
    ACTION_TRANSFER_HISTORY: { type: 'CONVERT_TRANSFER_LOGS_TO_TRANSACTIONS' },
    ACTION_APPROVAL_HISTORY: { type: 'CONVERT_APPROVAL_LOGS_TO_TRANSACTIONS' },
    ACTION_DEPOSIT_HISTORY: { type: 'CONVERT_DEPOSIT_LOGS_TO_TRANSACTIONS' },
    ACTION_WITHDRAW_HISTORY: { type: 'CONVERT_WITHDRAW_LOGS_TO_TRANSACTIONS' }
  };
  const METHOD_LABEL_NAMES = {
    TRANSFER_HISTORY: 'getTransferHistory',
    APPROVAL_HISTORY: 'getApprovalHistory',
    DEPOSIT_HISTORY: 'getDepositEtherHistory',
    WITHDRAW_HISTORY: 'getWithdrawEtherHistory'
  };

  const allConvertLogToTransaction = (label, log) => {
    switch (label) {
      case TRANSFER:
        return LOGS_CONV_ACTIONS.ACTION_TRANSFER_HISTORY;
      case APPROVAL:
        return LOGS_CONV_ACTIONS.ACTION_APPROVAL_HISTORY;
      case DEPOSIT_ETHER:
        return LOGS_CONV_ACTIONS.ACTION_DEPOSIT_HISTORY;
      case WITHDRAW_ETHER:
        return LOGS_CONV_ACTIONS.ACTION_WITHDRAW_HISTORY;
      default:
        return null;
    }
  };

  const configLoadDataFromAugurNode = (method, inclusive, returnError, returnVal, callback) => {
    const entry = [{ log: 'item one' }];
    if (inclusive.includes(method)) {
      switch (method) {
        case METHOD_LABEL_NAMES.TRANSFER_HISTORY:
          callback(null, entry);
          break;
        case METHOD_LABEL_NAMES.APPROVAL_HISTORY:
          callback(null, entry);
          break;
        case METHOD_LABEL_NAMES.DEPOSIT_HISTORY:
          callback(null, entry);
          break;
        case METHOD_LABEL_NAMES.WITHDRAW_HISTORY:
          callback(null, entry);
          break;
        default:
          callback(null, null);
          break;
      }
    } else {
      callback(returnError, returnVal);
    }
  };


  afterEach(() => {
    ReWireModule.__ResetDependency__('loadDataFromAugurNode', 'convertLogsToTransactions');
  });


  const test = (t) => {
    it(t.description, (done) => {
      var convert = (label, log) => {
        return allConvertLogToTransaction(label, log);
      };
      var load = (augurNodeUrl, restApiEndpoint, queryObject, callback) => {
        return t.loadDataFromAugurNode(augurNodeUrl, restApiEndpoint, queryObject, callback);
      };

      ReWireModule.__Rewire__('convertLogsToTransactions', convert);

      ReWireModule.__Rewire__('loadDataFromAugurNode', load);

      const store = mockStore(t.state || {});

      store.dispatch(loadFundingHistory(t.options, (err) => {
        t.assertions(err, store);
        done();
      }));
    });
  };

  test({
    description: `should load transfer, approval and deposit history, return all 4 actions from store`,
    state: mainState,
    loadDataFromAugurNode: (url, method, query, callback) => {
      const inclusiveValues = [METHOD_LABEL_NAMES.TRANSFER_HISTORY, METHOD_LABEL_NAMES.APPROVAL_HISTORY, METHOD_LABEL_NAMES.DEPOSIT_HISTORY, METHOD_LABEL_NAMES.WITHDRAW_HISTORY];
      configLoadDataFromAugurNode(method, inclusiveValues, null, null, callback);
    },
    assertions: (err, store) => {
      assert.deepEqual(err, null, 'no error is suppose to be');
      assert.deepEqual(store.getActions(), [LOGS_CONV_ACTIONS.ACTION_TRANSFER_HISTORY, LOGS_CONV_ACTIONS.ACTION_APPROVAL_HISTORY, LOGS_CONV_ACTIONS.ACTION_DEPOSIT_HISTORY, LOGS_CONV_ACTIONS.ACTION_WITHDRAW_HISTORY], 'all four actions fired');
    }
  });

  test({
    description: `should load transfer, approval and deposit history, return 3 actions from store`,
    state: mainState,
    loadDataFromAugurNode: (url, method, query, callback) => {
      const inclusiveValues = [METHOD_LABEL_NAMES.TRANSFER_HISTORY, METHOD_LABEL_NAMES.APPROVAL_HISTORY, METHOD_LABEL_NAMES.DEPOSIT_HISTORY];
      configLoadDataFromAugurNode(method, inclusiveValues, null, null, callback);
    },
    assertions: (err, store) => {
      assert.deepEqual(err, NO_HISTORY_MESSAGES.NO_WITHDRAW_HISTORY, 'error is suppose to be no deposit history');
      assert.deepEqual(store.getActions(), [LOGS_CONV_ACTIONS.ACTION_TRANSFER_HISTORY, LOGS_CONV_ACTIONS.ACTION_APPROVAL_HISTORY, LOGS_CONV_ACTIONS.ACTION_DEPOSIT_HISTORY], 'only three action fired');
    }
  });

  test({
    description: `should load transfer and approval history, return 2 actions from store`,
    state: mainState,
    loadDataFromAugurNode: (url, method, query, callback) => {
      const inclusiveValues = [METHOD_LABEL_NAMES.TRANSFER_HISTORY, METHOD_LABEL_NAMES.APPROVAL_HISTORY];
      configLoadDataFromAugurNode(method, inclusiveValues, null, null, callback);
    },
    assertions: (err, store) => {
      assert.deepEqual(err, NO_HISTORY_MESSAGES.NO_DEPOSIT_HISTORY, 'error is suppose to be no deposit history');
      assert.deepEqual(store.getActions(), [LOGS_CONV_ACTIONS.ACTION_TRANSFER_HISTORY, LOGS_CONV_ACTIONS.ACTION_APPROVAL_HISTORY], 'only two action fired');
    }
  });

  test({
    description: `should load transfer, approval and deposit history error in withdraw, return 3 actions from store`,
    state: mainState,
    loadDataFromAugurNode: (url, method, query, callback) => {
      const inclusiveValues = [METHOD_LABEL_NAMES.TRANSFER_HISTORY, METHOD_LABEL_NAMES.APPROVAL_HISTORY, METHOD_LABEL_NAMES.DEPOSIT_HISTORY];
      configLoadDataFromAugurNode(method, inclusiveValues, 'ERROR', null, callback);
    },
    assertions: (err, store) => {
      assert.deepEqual(err, 'ERROR', 'error is suppose to happen');
      assert.deepEqual(store.getActions(), [LOGS_CONV_ACTIONS.ACTION_TRANSFER_HISTORY, LOGS_CONV_ACTIONS.ACTION_APPROVAL_HISTORY, LOGS_CONV_ACTIONS.ACTION_DEPOSIT_HISTORY], 'all four actions fired');
    }
  });

  test({
    description: `should load transfer, approval and deposit history, error with Deposit, return 2 actions from store`,
    state: mainState,
    loadDataFromAugurNode: (url, method, query, callback) => {
      const inclusiveValues = [METHOD_LABEL_NAMES.TRANSFER_HISTORY, METHOD_LABEL_NAMES.APPROVAL_HISTORY];
      configLoadDataFromAugurNode(method, inclusiveValues, 'ERROR', null, callback);
    },
    assertions: (err, store) => {
      assert.deepEqual(err, 'ERROR', 'error is suppose to happen');
      assert.deepEqual(store.getActions(), [LOGS_CONV_ACTIONS.ACTION_TRANSFER_HISTORY, LOGS_CONV_ACTIONS.ACTION_APPROVAL_HISTORY], 'only two action fired');
    }
  });

  test({
    description: `should load approval history, error with approval history, 1 action from store`,
    state: mainState,
    loadDataFromAugurNode: (url, method, query, callback) => {
      const inclusiveValues = [METHOD_LABEL_NAMES.TRANSFER_HISTORY];
      configLoadDataFromAugurNode(method, inclusiveValues, 'ERROR', null, callback);
    },
    assertions: (err, store) => {
      assert.deepEqual(err, 'ERROR', 'error is suppose to occur');
      assert.deepEqual(store.getActions(), [LOGS_CONV_ACTIONS.ACTION_TRANSFER_HISTORY], 'only one action fired');
    }
  });

  test({
    description: `should load funding history with error from load data from augur node, no actions`,
    state: mainState,
    loadDataFromAugurNode: (url, method, query, callback) => {
      const inclusiveValues = [];
      configLoadDataFromAugurNode(method, inclusiveValues, 'ERROR', null, callback);
    },
    assertions: (err, store) => {
      assert.deepEqual(err, 'ERROR', `error was returned`);
      assert.deepEqual(store.getActions(), [], `Didn't fire the expected empty actions array`);
    }
  });

  test({
    description: `should load funding transfer history, return 1 action from store`,
    state: mainState,
    loadDataFromAugurNode: (url, method, query, callback) => {
      const inclusiveValues = [METHOD_LABEL_NAMES.TRANSFER_HISTORY];
      configLoadDataFromAugurNode(method, inclusiveValues, null, null, callback);
    },
    assertions: (err, store) => {
      assert.deepEqual(err, NO_HISTORY_MESSAGES.NO_APPROVAL_HISTORY, 'error is suppose no approaval history');
      assert.deepEqual(store.getActions(), [LOGS_CONV_ACTIONS.ACTION_TRANSFER_HISTORY], 'only one action fired');
    }
  });


  test({
    description: `should load funding transfer history empty array object, no actions`,
    state: mainState,
    loadDataFromAugurNode: (url, method, query, callback) => {
      const inclusiveValues = [];
      configLoadDataFromAugurNode(method, inclusiveValues, null, [], callback);
    },
    assertions: (err, store) => {
      assert.isNull(err, 'error is suppose to be null');
      assert.deepEqual(store.getActions(), [], 'no actions fired');
    }
  });

  test({
    description: `should load transfer, approval, deposit history and widthdraw history is empty array, return all 3 actions from store`,
    state: mainState,
    loadDataFromAugurNode: (url, method, query, callback) => {
      const inclusiveValues = [METHOD_LABEL_NAMES.TRANSFER_HISTORY, METHOD_LABEL_NAMES.APPROVAL_HISTORY, METHOD_LABEL_NAMES.DEPOSIT_HISTORY];
      configLoadDataFromAugurNode(method, inclusiveValues, null, [], callback);
    },
    assertions: (err, store) => {
      assert.deepEqual(err, null, 'no error is suppose to be');
      assert.deepEqual(store.getActions(), [LOGS_CONV_ACTIONS.ACTION_TRANSFER_HISTORY, LOGS_CONV_ACTIONS.ACTION_APPROVAL_HISTORY, LOGS_CONV_ACTIONS.ACTION_DEPOSIT_HISTORY], 'only three actions fired');
    }
  });

  test({
    description: `should load transfer, approval and deposit history is empty array, return all 3 actions from store`,
    state: mainState,
    loadDataFromAugurNode: (url, method, query, callback) => {
      const inclusiveValues = [METHOD_LABEL_NAMES.TRANSFER_HISTORY, METHOD_LABEL_NAMES.APPROVAL_HISTORY, METHOD_LABEL_NAMES.WITHDRAW_HISTORY];
      configLoadDataFromAugurNode(method, inclusiveValues, null, [], callback);
    },
    assertions: (err, store) => {
      assert.deepEqual(err, null, 'no error is suppose to be');
      assert.deepEqual(store.getActions(), [LOGS_CONV_ACTIONS.ACTION_TRANSFER_HISTORY, LOGS_CONV_ACTIONS.ACTION_APPROVAL_HISTORY, LOGS_CONV_ACTIONS.ACTION_WITHDRAW_HISTORY], 'only three actions fired');
    }
  });

  test({
    description: `should load approval, deposit and widthdraw history, transfer is not array, return all 3 actions from store`,
    state: mainState,
    loadDataFromAugurNode: (url, method, query, callback) => {
      const inclusiveValues = [METHOD_LABEL_NAMES.WITHDRAW_HISTORY, METHOD_LABEL_NAMES.APPROVAL_HISTORY, METHOD_LABEL_NAMES.DEPOSIT_HISTORY];
      configLoadDataFromAugurNode(method, inclusiveValues, null, { log: 'blah' }, callback);
    },
    assertions: (err, store) => {
      assert.deepEqual(err, null, 'no error is suppose to be');
      assert.deepEqual(store.getActions(), [LOGS_CONV_ACTIONS.ACTION_APPROVAL_HISTORY, LOGS_CONV_ACTIONS.ACTION_DEPOSIT_HISTORY, LOGS_CONV_ACTIONS.ACTION_WITHDRAW_HISTORY], 'only three actions fired');
    }
  });

  test({
    description: `should load transfer, approval, deposit history and only widthdraw history is not array, return all 3 actions from store`,
    state: mainState,
    loadDataFromAugurNode: (url, method, query, callback) => {
      const inclusiveValues = [METHOD_LABEL_NAMES.TRANSFER_HISTORY, METHOD_LABEL_NAMES.APPROVAL_HISTORY, METHOD_LABEL_NAMES.DEPOSIT_HISTORY];
      configLoadDataFromAugurNode(method, inclusiveValues, null, { log: 'blah' }, callback);
    },
    assertions: (err, store) => {
      assert.deepEqual(err, null, 'no error is suppose to be');
      assert.deepEqual(store.getActions(), [LOGS_CONV_ACTIONS.ACTION_TRANSFER_HISTORY, LOGS_CONV_ACTIONS.ACTION_APPROVAL_HISTORY, LOGS_CONV_ACTIONS.ACTION_DEPOSIT_HISTORY], 'only three actions fired');
    }
  });

  test({
    description: `should load transfer, approval, withdraw, only deposit history is not array, return all 3 actions from store`,
    state: mainState,
    loadDataFromAugurNode: (url, method, query, callback) => {
      const inclusiveValues = [METHOD_LABEL_NAMES.TRANSFER_HISTORY, METHOD_LABEL_NAMES.APPROVAL_HISTORY, METHOD_LABEL_NAMES.WITHDRAW_HISTORY];
      configLoadDataFromAugurNode(method, inclusiveValues, null, { log: 'blah' }, callback);
    },
    assertions: (err, store) => {
      assert.deepEqual(err, null, 'no error is suppose to be');
      assert.deepEqual(store.getActions(), [LOGS_CONV_ACTIONS.ACTION_TRANSFER_HISTORY, LOGS_CONV_ACTIONS.ACTION_APPROVAL_HISTORY, LOGS_CONV_ACTIONS.ACTION_WITHDRAW_HISTORY], 'only three actions fired');
    }
  });

  test({
    description: `should load transfer, approval and deposit and withdraw logs not array, return 1 actions from store`,
    state: mainState,
    loadDataFromAugurNode: (url, method, query, callback) => {
      const inclusiveValues = [METHOD_LABEL_NAMES.TRANSFER_HISTORY];
      configLoadDataFromAugurNode(method, inclusiveValues, null, { log: 'blah' }, callback);
    },
    assertions: (err, store) => {
      assert.deepEqual(err, null, 'no error is returned');
      assert.deepEqual(store.getActions(), [LOGS_CONV_ACTIONS.ACTION_TRANSFER_HISTORY], 'only one action fired');
    }
  });


  test({
    description: `should load funding transfer history is not an array, no actions`,
    state: mainState,
    loadDataFromAugurNode: (url, method, query, callback) => {
      const inclusiveValues = [];
      configLoadDataFromAugurNode(method, inclusiveValues, null, { log: 'blah' }, callback);
    },
    assertions: (err, store) => {
      assert.isNull(err, 'error is suppose to be null');
      assert.deepEqual(store.getActions(), [], 'no actions fired');
    }
  });

  test({
    description: `should load funding transfer history has null history, no actions fired`,
    state: mainState,
    loadDataFromAugurNode: (url, method, query, callback) => {
      const inclusiveValues = [];
      configLoadDataFromAugurNode(method, inclusiveValues, null, null, callback);
    },
    assertions: (err, store) => {
      assert.deepEqual(err, NO_HISTORY_MESSAGES.NO_TRANSFER_HISTORY);
      assert.deepEqual(store.getActions(), [], `Didn't fire the expected empty actions array`);
    }
  });

  test({
    description: `should load funding history loginAccount address undefined, no actions fired`,
    state: {
      env: {
        augurNodeURL: augurNodeUrl
      },
      loginAccount: {
        address: undefined
      }
    },
    loadDataFromAugurNode: (url, method, query, callback) => {
      const inclusiveValues = [];
      configLoadDataFromAugurNode(method, inclusiveValues, null, null, callback);
    },
    assertions: (err, store) => {
      assert.isNull(err, `error is null`);
      assert.deepEqual(store.getActions(), [], `Didn't fire the expected empty actions array`);
    }
  });
});
