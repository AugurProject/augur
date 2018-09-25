import sinon from "sinon";
import testState from "test/testState";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {
  submitInitialReport,
  __RewireAPI__ as submitInitialReportReqireAPI
} from "modules/reports/actions/submit-initial-report";
import { REPORTING_REPORT_MARKETS } from "modules/routes/constants/views";

describe(`modules/reports/actions/submit-initial-report.js`, () => {
  const state = Object.assign({}, testState);
  const mockStore = configureMockStore([thunk]);
  const store = mockStore(state);

  const callback = sinon.stub();
  const history = {
    push: sinon.stub()
  };

  beforeEach(() => {
    history.push.reset();
    callback.reset();
  });

  after(() => {
    submitInitialReportReqireAPI.__ResetDependency__("getPayoutNumerators");
  });

  const augurSuccess = {
    constants: "0x5e3918",
    api: {
      Market: {
        doInitialReport: options => {
          options.onSent();
          options.onSuccess();
        }
      }
    }
  };

  const augurFailed = {
    constants: "0x5e3918",
    api: {
      Market: {
        doInitialReport: options => {
          options.onSent();
          options.onFailed();
        }
      }
    }
  };

  const getPayoutNumerators = sinon.stub().returns([10000, 0]);
  submitInitialReportReqireAPI.__Rewire__(
    "getPayoutNumerators",
    getPayoutNumerators
  );

  it(`should call callback and history`, () => {
    submitInitialReportReqireAPI.__Rewire__("augur", augurSuccess);
    store.dispatch(
      submitInitialReport({
        estimateGas: false,
        marketId: "testMarketId",
        selectedOutcome: 0,
        invalid: false,
        history,
        returnPath: REPORTING_REPORT_MARKETS,
        callback
      })
    );
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`);
    assert(history.push.calledOnce, `Didn't call 'history' once as expected`);
  });

  it(`should call only callback`, () => {
    submitInitialReportReqireAPI.__Rewire__("augur", augurSuccess);
    store.dispatch(
      submitInitialReport({
        estimateGas: false,
        marketId: null,
        selectedOutcome: 0,
        invalid: false,
        history,
        returnPath: REPORTING_REPORT_MARKETS,
        callback
      })
    );
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`);
    assert(history.push.notCalled, `Did call 'history' not expected`);
  });

  it(`should call only callback with empty market id`, () => {
    submitInitialReportReqireAPI.__Rewire__("augur", augurSuccess);
    store.dispatch(
      submitInitialReport({
        estimateGas: false,
        marketId: "",
        selectedOutcome: 0,
        invalid: false,
        history,
        returnPath: REPORTING_REPORT_MARKETS,
        callback
      })
    );
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`);
    assert(history.push.notCalled, `Did call 'history' not expected`);
  });

  it(`should call only callback with empty market id and bad outcome`, () => {
    submitInitialReportReqireAPI.__Rewire__("augur", augurSuccess);
    store.dispatch(
      submitInitialReport({
        estimateGas: false,
        marketId: "",
        selectedOutcome: "blah",
        invalid: false,
        history,
        returnPath: REPORTING_REPORT_MARKETS,
        callback
      })
    );
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`);
    assert(history.push.notCalled, `Did call 'history' not expected`);
  });

  it(`should only call callback with empty market id, bad outcome and is invalid`, () => {
    submitInitialReportReqireAPI.__Rewire__("augur", augurSuccess);
    store.dispatch(
      submitInitialReport({
        estimateGas: false,
        marketId: "",
        selectedOutcome: "blah",
        invalid: true,
        history,
        returnPath: REPORTING_REPORT_MARKETS,
        callback
      })
    );
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`);
    assert(history.push.notCalled, `Did call 'history' not expected`);
  });

  it(`should only call callback with bad outcome`, () => {
    submitInitialReportReqireAPI.__Rewire__("augur", augurSuccess);
    store.dispatch(
      submitInitialReport({
        estimateGas: false,
        marketId: "testMarketId",
        selectedOutcome: "blah",
        invalid: false,
        history,
        returnPath: REPORTING_REPORT_MARKETS,
        callback
      })
    );
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`);
    assert(history.push.notCalled, `Did call 'history' not expected`);
  });

  it(`should call both callback and history with good data not invalid`, () => {
    submitInitialReportReqireAPI.__Rewire__("augur", augurFailed);
    store.dispatch(
      submitInitialReport({
        estimateGas: false,
        marketId: "testMarketId",
        selectedOutcome: 0,
        invalid: false,
        history,
        returnPath: REPORTING_REPORT_MARKETS,
        callback
      })
    );
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`);
    assert(history.push.calledOnce, `Did call 'history' not expected`);
  });

  it(`should call callback and history with good data and is invalid`, () => {
    submitInitialReportReqireAPI.__Rewire__("augur", augurFailed);
    store.dispatch(
      submitInitialReport({
        estimateGas: false,
        marketId: "testMarketId",
        selectedOutcome: 0,
        invalid: true,
        history,
        returnPath: REPORTING_REPORT_MARKETS,
        callback
      })
    );
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`);
    assert(history.push.calledOnce, `Did call 'history' not expected`);
  });

  it(`should call callback and not history with good data and is invalid`, () => {
    submitInitialReportReqireAPI.__Rewire__("augur", augurSuccess);
    store.dispatch(
      submitInitialReport({
        estimateGas: true,
        marketId: "testMarketId",
        selectedOutcome: 0,
        invalid: true,
        history,
        returnPath: REPORTING_REPORT_MARKETS,
        callback
      })
    );
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`);
    assert(history.push.notCalled, `Did call 'history' not expected`);
  });
});
