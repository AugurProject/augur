import sinon from "sinon";
import testState from "test/testState";
import configureMockStore from "redux-mock-store";
import { REPORTING_DISPUTE_MARKETS } from "modules/routes/constants/views";
import thunk from "redux-thunk";
import {
  submitMarketContribute,
  __RewireAPI__ as submitMarketContributeReqireAPI
} from "modules/reports/actions/submit-market-contribute";

describe(`modules/reports/actions/submit-market-contribute.js`, () => {
  const state = Object.assign({}, testState);
  const mockStore = configureMockStore([thunk]);
  const store = mockStore(state);

  const callback = sinon.stub();
  const history = {
    push: sinon.stub()
  };

  afterEach(() => {
    history.push.reset();
    callback.reset();
  });

  after(() => {
    submitMarketContributeReqireAPI.__ResetDependency__("getPayoutNumerators");
    submitMarketContributeReqireAPI.__ResetDependency__("removeAccountDispute");
  });

  const augurSuccess = {
    api: {
      Market: {
        contribute: options => {
          options.onSent();
          options.onSuccess();
        }
      }
    }
  };

  const augurFailed = {
    api: {
      Market: {
        contribute: options => {
          options.onSent();
          options.onFailed();
        }
      }
    }
  };

  const getPayoutNumerators = sinon.stub().returns([10000, 0]);
  const removeAccountDispute = sinon
    .stub()
    .returns({ type: "REMOVE_ACCOUNT_DISPUTE" });
  submitMarketContributeReqireAPI.__Rewire__(
    "getPayoutNumerators",
    getPayoutNumerators
  );
  submitMarketContributeReqireAPI.__Rewire__(
    "removeAccountDispute",
    removeAccountDispute
  );

  it(`should call callback and history with good data`, () => {
    submitMarketContributeReqireAPI.__Rewire__("augur", augurSuccess);
    store.dispatch(
      submitMarketContribute({
        estimateGas: false,
        marketId: "testMarketId",
        selectedOutcome: 0,
        invalid: false,
        amount: 1000,
        history,
        returnPath: REPORTING_DISPUTE_MARKETS,
        callback
      })
    );
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`);
    assert(history.push.calledOnce, `Didn't call 'history' once as expected`);
  });

  it(`should call callback and history with good negative data`, () => {
    submitMarketContributeReqireAPI.__Rewire__("augur", augurSuccess);
    store.dispatch(
      submitMarketContribute({
        estimateGas: false,
        marketId: "testMarketId",
        selectedOutcome: -10,
        invalid: false,
        amount: 1000,
        history,
        returnPath: REPORTING_DISPUTE_MARKETS,
        callback
      })
    );
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`);
    assert(history.push.calledOnce, `Didn't call 'history' once as expected`);
  });

  it(`should only call callback with null market id`, () => {
    submitMarketContributeReqireAPI.__Rewire__("augur", augurSuccess);
    store.dispatch(
      submitMarketContribute({
        estimateGas: false,
        marketId: null,
        selectedOutcome: 0,
        invalid: false,
        amount: 1000,
        history,
        returnPath: REPORTING_DISPUTE_MARKETS,
        callback
      })
    );
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`);
    assert(history.push.notCalled, `Did call 'history' not expected`);
  });

  it(`should only callback with empty market id`, () => {
    submitMarketContributeReqireAPI.__Rewire__("augur", augurSuccess);
    store.dispatch(
      submitMarketContribute({
        estimateGas: false,
        marketId: "",
        selectedOutcome: 0,
        invalid: false,
        amount: 1000,
        history,
        returnPath: REPORTING_DISPUTE_MARKETS,
        callback
      })
    );
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`);
    assert(history.push.notCalled, `Did call 'history' not expected`);
  });

  it("should only call callback with bad outcome", () => {
    submitMarketContributeReqireAPI.__Rewire__("augur", augurSuccess);
    store.dispatch(
      submitMarketContribute({
        estimateGas: false,
        marketId: "testMarketId",
        selectedOutcome: "blah",
        invalid: false,
        amount: 1000,
        history,
        returnPath: REPORTING_DISPUTE_MARKETS,
        callback
      })
    );
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`);
    assert(history.push.notCalled, `Did call 'history' not expected`);
  });

  it(`should call both callback and history with good data`, () => {
    submitMarketContributeReqireAPI.__Rewire__("augur", augurFailed);
    store.dispatch(
      submitMarketContribute({
        estimateGas: false,
        marketId: "testMarketId",
        selectedOutcome: 0,
        invalid: false,
        amount: 1000,
        history,
        returnPath: REPORTING_DISPUTE_MARKETS,
        callback
      })
    );
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`);
    assert(history.push.calledOnce, `Did call 'history' not expected`);
  });

  it(`should call callback but not history with good data`, () => {
    submitMarketContributeReqireAPI.__Rewire__("augur", augurSuccess);
    store.dispatch(
      submitMarketContribute({
        estimateGas: true,
        marketId: "testMarketId",
        selectedOutcome: 0,
        invalid: false,
        amount: 1000,
        history,
        returnPath: REPORTING_DISPUTE_MARKETS,
        callback
      })
    );
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`);
    assert(history.push.notCalled, `Did call 'history' not expected`);
  });
});
