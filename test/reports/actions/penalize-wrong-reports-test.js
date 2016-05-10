import {
  assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe('modules/reports/actions/penalize-wrong-reports.js', () => {
  proxyquire.noPreserveCache().noCallThru();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let store, action, clock;
  let state = Object.assign({}, testState, {
    blockchain: {...testState.blockchain,
      isReportConfirmationPhase: false
    },
    loginAccount: {...testState.loginAccount,
      rep: 100
    }
  });
  store = mockStore(state);
  let mockAugurJS = {};
  let mockIsMarketData = {
    isMarketDataPreviousReportPeriod: () => {}
  };
  mockAugurJS.penalizeWrong = sinon.stub().yields(null, 'TEST RESPONSE!');
  // AJS.penalizeWrong
  sinon.stub(mockIsMarketData, 'isMarketDataPreviousReportPeriod', () => false);

  action = proxyquire('../../../src/modules/reports/actions/penalize-wrong-reports.js', {
    '../../../services/augurjs': mockAugurJS,
    '../../../utils/is-market-data-open': mockIsMarketData
  });

  beforeEach(() => {
    store.clearActions();
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    store.clearActions();
    clock.restore();
  });

  it('should penalize wrong reports', () => {
    let marketsData = {
      test1: {
        eventID: 'test1'
      },
      test2: {
        eventID: 'test2'
      },
      test3: {
        eventID: 'test3'
      }
    };
    store.dispatch(action.penalizeWrongReports(marketsData));
    clock.tick(4000);
    assert(mockAugurJS.penalizeWrong.calledThrice);
    assert(mockIsMarketData.isMarketDataPreviousReportPeriod.calledThrice);

  });

});
