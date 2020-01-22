import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AddFunds } from 'modules/modal/add-funds';
import { AppState } from 'store';
import { closeModal } from 'modules/modal/actions/close-modal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import getValue from 'utils/get-value';
import { ADD_FUNDS, track } from 'services/analytics/helpers';
import { GnosisSafeState } from '@augurproject/gnosis-relay-api';

const mapStateToProps = (state: AppState) => {
  // TODO placeholder rates until price feed is hooked up
  const ETH_RATE = 160.63;
  const REP_RATE = 15.87;

  return {
    modal: state.modal,
    loginAccount: state.loginAccount,
    ETH_RATE,
    REP_RATE,
    isRelayDown: state.appStatus.gnosisStatus === GnosisSafeState.ERROR,
  }
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  track: (eventName, payload) => dispatch(track(eventName, payload)),
});

const mergeProps = (sP, dP, oP) => {
  return {
    fundType: sP.modal.fundType,
    analyticsEvent: () => dP.track(ADD_FUNDS, {}),
    closeAction: () => {
      if (sP.modal.cb) {
        sP.modal.cb();
      }
      dP.closeModal();
    },
    ...oP,
    ...sP,
  };
};


export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(AddFunds)
);
