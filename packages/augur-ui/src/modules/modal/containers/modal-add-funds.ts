import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AddFunds } from 'modules/modal/add-funds';
import { AppState } from 'appStore';
import { closeModal } from 'modules/modal/actions/close-modal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import getValue from 'utils/get-value';
import { ADD_FUNDS, track } from 'services/analytics/helpers';
import { GnosisSafeState } from '@augurproject/gnosis-relay-api';
import { createBigNumber } from 'utils/create-big-number';

const mapStateToProps = (state: AppState) => {
  // TODO placeholder rates until price feed is hooked up
  const ETH_RATE = createBigNumber(212.63);
  const REP_RATE = createBigNumber(15.87);

  return {
    modal: state.modal,
    loginAccount: state.loginAccount,
    ETH_RATE,
    REP_RATE,
    isRelayDown: state.appStatus.gnosisStatus === GnosisSafeState.ERROR,
  }
};

const addFundsPortis = async (amount) => {
  // TODO
}

const addFundsFortmatic = async (amount, crypto, address) => {
  await fm.user.deposit({
    amount,
    crypto,
    address,
  });
}

const addFundsTorus = async (amount) => {
  await window.torus.initiateTopup('wyre', {
    selectedCurrency: 'USD',
    fiatValue: amount,
    selectedCryptoCurrency: 'DAI'
  });
}

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  track: (eventName, payload) => dispatch(track(eventName, payload)),
  addFundsTorus: (amount) => addFundsTorus(amount),
  addFundsFortmatic: (amount, crypto, address) => addFundsFortmatic(amount, crypto, address),
});

const mergeProps = (sP, dP, oP) => {
  return {
    fundType: sP.modal.fundType,
    addFundsTorus: dP.addFundsTorus,
    addFundsFortmatic: dP.addFundsFortmatic,
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
